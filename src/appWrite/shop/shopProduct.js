import conf from '../../conf/conf.js';
import { Client, Databases, ID ,Query} from 'appwrite';
import CryptoJS from 'crypto-js';

class ShopProduct {
    client = new Client();
    databases;
    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProductsProjectId);
        this.databases = new Databases(this.client);
    }
    async uploadImageToCloudinary(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', conf.refurbishBooksCloudinaryPreset);
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${conf.refurbishProductCloudinaryCloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!data.secure_url) throw new Error('Image upload failed');
            return { secure_url: data.secure_url, public_id: data.public_id };
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw error;
        }
    }
    async uploadImagesToCloudinary(files) {
        const validFiles = files.filter(file => file && typeof file === 'object');
        const uploadPromises = validFiles.map(file => this.uploadImageToCloudinary(file));
        return await Promise.all(uploadPromises);
    }
    async deleteImageFromCloudinary(imageUrl) {
        if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.includes('/')) {
            return;
        }
    
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const timestamp = Math.floor(Date.now() / 1000);
        const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${conf.refurbishProductCloudinaryApiSecret}`;
        const signature = CryptoJS.SHA1(stringToSign).toString();
    
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('signature', signature);
        formData.append('api_key', conf.refurbishProductCloudinaryApiKey);
        formData.append('timestamp', timestamp);
    
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${conf.refurbishProductCloudinaryCloudName}/image/destroy`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();
            if (data.result !== 'ok' && data.result !== 'not found') {
                throw new Error('Image deletion failed');
            }
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
            throw error; // Still throw error for other failures (e.g., network issues)
        }
    }
    async cleanupUploadedImages(uploadedImages) {
        const deletionPromises = uploadedImages.map(url => this.deleteImageFromCloudinary(url));
        await Promise.all(deletionPromises);
        console.log('Successfully cleaned up uploaded images');
    }

















    //upload module imp
    async uploadShopProduct(productData, files = [], maxShopProduct) {
        // Configuration validation
        if (!conf.appwriteProductsDatabaseId || !conf.appwriteProductsCollectionId) {
            throw new Error('Database configuration is missing');
        }

        // Input validation
        if (!productData?.coordinates?.latitude || !productData?.coordinates?.longitude) {
            throw new Error('Coordinates (latitude and longitude) are required');
        }

        if (!productData.shopId) {
            throw new Error('Shop ID is required');
        }

        // File validation
        const MAX_IMAGES = 10;
        if (!Array.isArray(files)) {
            throw new Error('Files must be an array');
        }
        if (files.some(file => !(file instanceof File))) {
            throw new Error('Invalid file objects provided');
        }
        if (files.length > MAX_IMAGES) {
            throw new Error(`Maximum ${MAX_IMAGES} images allowed`);
        }

        let uploadedImages = [];

        try {
            // Validate maxShopProduct parameter
            if (typeof maxShopProduct !== 'number' || maxShopProduct < 0) {
                throw new Error('Invalid maxShopProduct limit');
            }

            // Get only the count of existing products
            const { total } = await this.databases.listDocuments(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                [
                    Query.equal('shopId', productData.shopId),
                    Query.limit(1)
                ]
            );
            if (total >= maxShopProduct) {
                throw new Error('You have reached the maximum product limit for your plan');
            }

            // Upload images if provided
            if (files.length > 0) {
                uploadedImages = await this.uploadImagesToCloudinary(files);
            }

            // Validate and extract image URLs
            const imageUrls = uploadedImages.map(image => {
                if (!image?.secure_url) {
                    throw new Error('Invalid image upload response');
                }
                return image.secure_url;
            });

            // Prepare product data
            const newProductData = {
                shopId: productData.shopId,
                shop: productData.shopId, // Note: duplication might be intentional
                images: imageUrls,
                title: String(productData.title || '').toLowerCase().trim(),
                description: String(productData.description || '').toLowerCase().trim(),
                price: Number(productData.price),
                discountedPrice: Number(productData.discountedPrice),
                keywords: String(productData.keyword || '').toLowerCase().trim(),
                latitude: Number(productData.coordinates.latitude),
                longitude: Number(productData.coordinates.longitude)
            };

            // Validate numeric fields
            if (isNaN(newProductData.price) || newProductData.price < 0) {
                throw new Error('Invalid price value');
            }
            if (isNaN(newProductData.discountedPrice) || newProductData.discountedPrice < 0) {
                throw new Error('Invalid discounted price value');
            }
            if (newProductData.discountedPrice >= newProductData.price) {
                throw new Error('Discounted price must be less than original price');
            }

            // Create document
            const document = await this.databases.createDocument(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                ID.unique(),
                newProductData
            );

            return document;
        } catch (error) {
            // Detailed error logging
            console.error('Error uploading product:', {
                message: error.message,
                stack: error.stack,
                productData: { ...productData, coordinates: undefined },
                fileCount: files.length
            });

            // Cleanup uploaded images if upload failed
            if (uploadedImages.length > 0) {
                try {
                    await this.cleanupUploadedImages(uploadedImages);
                } catch (cleanupError) {
                    console.error('Failed to cleanup images:', cleanupError);
                }
            }

            throw error instanceof Error ? error : new Error('An unexpected error occurred');
        }
    }
    async updateShopProduct(productId, toDeleteImagesUrls = [], updatedData = {}, newFiles = []) {
        let uploadedImages = [];
        let allImageUrls = Array.isArray(updatedData.images) ? [...updatedData.images] : [];
    
        try {
            // Validate input parameters
            if (!productId) {
                throw new Error('Product ID is required');
            }
    
            // Handle image deletions
            if (Array.isArray(toDeleteImagesUrls) && toDeleteImagesUrls.length > 0) {
                await this.cleanupUploadedImages(toDeleteImagesUrls);
                allImageUrls = allImageUrls.filter(url => 
                    url && !toDeleteImagesUrls.includes(url)
                );
            }
    
            // Process new files
            if (Array.isArray(newFiles) && newFiles.length > 0) {
                // Separate valid URLs and files to upload
                const validUrls = newFiles.filter(url => 
                    typeof url === 'string' && url?.trim() && url !== null
                );
                const filesToUpload = newFiles.filter(file => 
                    file && typeof file === 'object' && file instanceof File
                );
    
                // Upload new files if any
                if (filesToUpload.length > 0) {
                    uploadedImages = await this.uploadImagesToCloudinary(filesToUpload);
                    const newImageUrls = uploadedImages.map(image => 
                        image?.secure_url).filter(url => url);
                    allImageUrls = [...allImageUrls, ...validUrls, ...newImageUrls];
                } else if (validUrls.length > 0) {
                    allImageUrls = [...allImageUrls, ...validUrls];
                }
            }
    
            // Update the images in updatedData
            updatedData.images = allImageUrls.filter(Boolean); // Remove any falsy values
    
            // Update the document
            const product= await this.databases.updateDocument(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                productId,
                updatedData
              );
            
            return product || {};
        } catch (error) {
            console.error('Error updating product:', error);
            if (uploadedImages.length > 0) {
                const uploadedUrls = uploadedImages
                    .map(image => image?.secure_url)
                    .filter(url => url);
                try {
                    await this.cleanupUploadedImages(uploadedUrls);
                } catch (cleanupError) {
                    console.error('Error during cleanup:', cleanupError);
                }
            }
    
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }
    async deleteShopProduct(productId, imagesToDelete) {
        try {
            imagesToDelete = imagesToDelete.filter(url => url !== null);
            if (imagesToDelete.length > 0) {
                await this.cleanupUploadedImages(imagesToDelete);
                console.log(`Successfully deleted images: ${imagesToDelete.join(', ')}`);
            }
            const response = await this.databases.deleteDocument(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                productId
            );
            console.log('Product deleted successfully:', response);
            return { status: "success" };
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }







    


    async getShopProducts({
        inputValue = '',
        minPrice,
        maxPrice,
        isInStock,
        page,
        productsPerPage,
        sortByAsc = false,
        sortByDesc = false,
        shopId
    }) {
        if (!shopId) {
            return { success: false, error: 'Phone number is required to fetch products.' };
        }
        try {
            const queries = [];
            queries.push(Query.equal('shopId', shopId));
           
            if (inputValue.length > 0) {
                queries.push(Query.contains('keywords', inputValue)); 
            }
            
    
            if (sortByAsc) {queries.push(Query.orderAsc('price'));}
            if (sortByDesc) {queries.push(Query.orderDesc('price'));}
    
            const offset = (page - 1) * productsPerPage;
            queries.push(Query.limit(productsPerPage), Query.offset(offset));
            queries.push(Query.select(["$id","shopId","title", "description", "price", "discountedPrice",
                "isInStock","images","keywords","isActive"]));
            const fetchProducts = async (collectionId, applyPriceFilter = false) => {
                const categoryQueries = [...queries];
                if (applyPriceFilter) {
                    if (minPrice !== undefined) {
                        categoryQueries.push(Query.greaterThanEqual('price', minPrice));
                    }
                    if (maxPrice !== undefined) {
                        categoryQueries.push(Query.lessThanEqual('price', maxPrice));
                    }
                }
                const response = await this.databases.listDocuments(
                    conf.appwriteProductsDatabaseId,
                    collectionId,
                    categoryQueries
                );
                return {allProducts:response.documents,total:response.total} || [];
            };
    
            const {allProducts,total} = await fetchProducts(conf.appwriteProductsCollectionId);
            if (!Array.isArray(allProducts)) {
                throw new TypeError("Expected 'allProducts' to be an array.");
            }
            if (inputValue.length === 0) {
                return {
                    success: true,
                    products: allProducts
                };
            }
            return {
                success: true,
                    products: allProducts
                };
    
        } catch (error) {
            console.error('Error fetching user refurbished products:', error);
            return { success: false, error: error.message || 'Unknown error' };
        }
    }
    
    
    

}

const shopProduct = new ShopProduct();
export default shopProduct;
