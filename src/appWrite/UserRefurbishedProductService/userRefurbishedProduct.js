import conf from '../../conf/conf.js';
import { Client, Databases, ID ,Query} from 'appwrite';
import CryptoJS from 'crypto-js';

class UserRefurbishedProduct {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteRefurbishProductProjectId);
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
        if (!imageUrl) return;
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
            const response = await fetch(`https://api.cloudinary.com/v1_1/${conf.refurbishProductCloudinaryCloudName}/image/destroy`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.result !== 'ok') throw new Error('Image deletion failed');
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
            throw error;
        }
    }

    async cleanupUploadedImages(uploadedImages) {
        const deletionPromises = uploadedImages.map(url => this.deleteImageFromCloudinary(url));
        await Promise.all(deletionPromises);
        console.log('Successfully cleaned up uploaded images');
    }


    //upload module imp
    async uploadProductWithImages(productData, files = []) {
        let uploadedImages = [];

        try {
            uploadedImages = await this.uploadImagesToCloudinary(files);
            const imageUrls = uploadedImages.map((image) => image.secure_url);
            const newProductData = {
                class: productData.class,
                language: productData.language.toLowerCase(),
                subject: productData.subject.toLowerCase(),
                title: productData.title.toLowerCase(),
                description: productData.description.toLowerCase(),
                price: Number(productData.price),
                discountedPrice: Number(productData.discountedPrice),
                keywords: productData.keywords.split(','),
                phn: productData.phn,
                category: productData.category.toLowerCase(),
                brand: productData.brand.toLowerCase(),
                pinCodes: productData.pinCodes.split(',').map((pin) => Number(pin)),
                productType: productData.productType
            };
            // Create a document in the Appwrite database with the uploaded images
            const document = await this.databases.createDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedModulesCollectionId,
                ID.unique(),
                {
                    ...newProductData,
                    images: imageUrls
                }
            );
            return document;
        } catch (error) {
            console.error('Error uploading product:', error);
            await this.cleanupUploadedImages(uploadedImages);
            throw error;
        }
    }
    /*imp*/
    async updateUserRefurbishedProduct(productId, toDeleteImagesUrls, updatedData, newFiles = []) {
        let uploadedImages = [];
        let allImageUrls = updatedData.images || [];
        try {
            if (toDeleteImagesUrls.length > 0) {
                await this.cleanupUploadedImages(toDeleteImagesUrls);
            }
            const validUrls = newFiles.filter(url => url !== null && typeof url === 'string');
            const filesToUpload = newFiles.filter(file => typeof file === 'object');

            if (filesToUpload.length > 0) {
                uploadedImages = await this.uploadImagesToCloudinary(filesToUpload);
                const newImageUrls = uploadedImages.map(image => image.secure_url);
                allImageUrls = [...validUrls, ...allImageUrls, ...newImageUrls];
            } else {
                allImageUrls = [...validUrls, ...allImageUrls];
            }
            const updatedProductData = {
                ...updatedData,
                language: updatedData.language.toLowerCase(),
                subject: updatedData.subject.toLowerCase(),
                title: updatedData.title.toLowerCase(),
                description: updatedData.description.toLowerCase(),
                price: Number(updatedData.price),
                discountedPrice: Number(updatedData.discountedPrice),
                category: updatedData?.category?.toLowerCase() || '',
                brand: updatedData?.brand?.toLowerCase() || '',
                keywords: updatedData.keywords.split(','),
                pinCodes: updatedData.pinCodes.split(',').map(pin => Number(pin)),
                images: allImageUrls,
            };

            const updatedDocument = await this.databases.updateDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedModulesCollectionId,
                productId.id,
                updatedProductData
            );

            return updatedDocument;
        } catch (error) {
            console.error('Error updating product:', error);
            if (uploadedImages.length > 0) await this.cleanupUploadedImages(uploadedImages);
            throw error;
        }
    }

    /*imp*/
    async deleteProduct(productId, imagesToDelete) {
        try {
            imagesToDelete = imagesToDelete.filter(url => url !== null);
            if (imagesToDelete.length > 0) {
                await this.cleanupUploadedImages(imagesToDelete);
                console.log(`Successfully deleted images: ${imagesToDelete.join(', ')}`);
            }
            const response = await this.databases.deleteDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedModulesCollectionId,
                productId.id
            );
            console.log('Product deleted successfully:', response);
            return { status: "success" };
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }








    async getUserRefurbishedProducts({
        inputValue,
        pinCodes = [],
        selectedCategories,
        selectedBrands,
        minPrice,
        maxPrice,
        isInStock,
        page,
        productsPerPage,
        sortByAsc = false,
        sortByDesc = false,
        phn
    }) {
        if (!phn) {
            return { success: false, error: 'Phone number is required to fetch products.' };
        }
    
        try {
            const queries = [];
            queries.push(Query.equal('phn', phn));
    
            if (pinCodes.length > 0) {
                queries.push(Query.equal('pinCodes', pinCodes));
            }
    
            if (inputValue) {
                queries.push(Query.or([
                    Query.search('title', inputValue),
                    Query.search('description', inputValue)
                ]));
            }
    
            if (selectedCategories.length > 0) {
                queries.push(Query.or([
                    Query.contains('productType', selectedCategories),
                    Query.contains('keywords', selectedCategories)
                ]));
            }
    
            if (sortByAsc) {
                queries.push(Query.orderAsc('price'));
            }
            if (sortByDesc) {
                queries.push(Query.orderDesc('price'));
            }
    
            const offset = (page - 1) * productsPerPage;
            queries.push(Query.limit(productsPerPage), Query.offset(offset));
    
            const fetchCategoryProducts = async (collectionId, applyPriceFilter = false) => {
                const categoryQueries = [...queries];
                if (applyPriceFilter) {
                    if (minPrice !== undefined) {
                        categoryQueries.push(Query.greaterThanEqual('price', minPrice));
                    }
                    if (maxPrice !== undefined) {
                        categoryQueries.push(Query.lessThanEqual('price', maxPrice));
                    }
                }
                if (isInStock !== undefined) {
                    categoryQueries.push(Query.equal('isInStock', isInStock));
                }
                const response = await this.databases.listDocuments(
                    conf.appwriteRefurbishProductDatabaseId,
                    collectionId,
                    categoryQueries
                );
                return response.documents || []; // Ensure an array is returned
            };
    
            const allProducts = await fetchCategoryProducts(conf.appwriteRefurbishedModulesCollectionId);
            if (!Array.isArray(allProducts)) {
                throw new TypeError("Expected 'allProducts' to be an array.");
            }
    
            const lowercaseInput = inputValue?.toLowerCase() || '';
            const filteredProducts = allProducts.filter(product => {
                const matchesQuery = inputValue
                    ? product.title.toLowerCase().includes(lowercaseInput) ||
                      product.description.toLowerCase().includes(lowercaseInput) ||
                      product.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseInput))
                    : true;
    
                const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(category =>
                    product.productType.includes(category) || product.keywords.some(keyword => keyword.includes(category))
                );
    
                return matchesQuery && matchesCategory;
            });
    
            if (sortByAsc) {
                filteredProducts.sort((a, b) => a.price - b.price);
            }
            if (sortByDesc) {
                filteredProducts.sort((a, b) => b.price - a.price);
            }
    
            return {
                success: true,
                products: filteredProducts
            };
    
        } catch (error) {
            console.error('Error fetching user refurbished products:', error);
            return { success: false, error: error.message || 'Unknown error' };
        }
    }
    

}

const userRefurbishedProduct = new UserRefurbishedProduct();
export default userRefurbishedProduct;
