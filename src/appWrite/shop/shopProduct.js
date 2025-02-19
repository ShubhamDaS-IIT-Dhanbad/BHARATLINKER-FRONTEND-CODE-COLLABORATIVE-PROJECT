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
        console.log(uploadedImages,"jetetet")
        const deletionPromises = uploadedImages.map(url => this.deleteImageFromCloudinary(url));
        await Promise.all(deletionPromises);
        console.log('Successfully cleaned up uploaded images');
    }

















    //upload module imp
    async uploadShopProduct(productData, files = []) {
        if( !productData.coordinates.latitude || !productData.coordinates.longitude) throw error;
        let uploadedImages = [];
        try {
            uploadedImages = await this.uploadImagesToCloudinary(files);
            console.log(uploadedImages)
            const imageUrls = uploadedImages.map((image) => image.secure_url);

            const newProductData = {
                shopId:productData.shopId,
                shop:productData.shopId,
                images: imageUrls,
                title: productData.title.toLowerCase(),
                description: productData.description.toLowerCase(),
                price: Number(productData.price),
                discountedPrice: Number(productData.discountedPrice),
                keywords: productData.keyword.toLowerCase(),
                latitude: productData.coordinates?.latitude,
                longitude: productData.coordinates?.longitude
            };
            const document = await this.databases.createDocument(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                ID.unique(),
                newProductData
            );
            return document;
        } catch (error) {
            console.error("Error uploading product:", error);
            await this.cleanupUploadedImages(uploadedImages);
            throw error;
        }
    }
    async updateShopProduct(productId, toDeleteImagesUrls, updatedData, newFiles = []) {
        let uploadedImages = [];
        let allImageUrls = updatedData.images ? [...updatedData.images] : [];
        try {
            if (toDeleteImagesUrls.length > 0) {
                await this.cleanupUploadedImages(toDeleteImagesUrls);
                allImageUrls = allImageUrls.filter(url => !toDeleteImagesUrls.includes(url));
            }
            const validUrls = newFiles.filter(url => typeof url === 'string' && url !== null);
            const filesToUpload = newFiles.filter(file => typeof file === 'object');
            if (filesToUpload.length > 0) {
                uploadedImages = await this.uploadImagesToCloudinary(filesToUpload);
                const newImageUrls = uploadedImages.map(image => image.secure_url);
                allImageUrls = [...allImageUrls, ...validUrls, ...newImageUrls];
            } else {
                allImageUrls = [...allImageUrls, ...validUrls];}
            updatedData.images = allImageUrls;
    
            const productIdValue = typeof productId === 'object' && productId.id ? productId.id : productId;
            const updatedDocument = await this.databases.updateDocument(
                conf.appwriteProductsDatabaseId,
                conf.appwriteProductsCollectionId,
                productIdValue,
                updatedData
            );
            return updatedDocument;
        } catch (error) {
            console.error('Error updating product:', error);
            if (uploadedImages.length > 0) {
                const uploadedUrls = uploadedImages.map(image => image.secure_url);
                await this.cleanupUploadedImages(uploadedUrls);
            }
            throw error;
        }
    }
    async deleteShopProduct(productId, imagesToDelete) {
        try {console.log(imagesToDelete)
            imagesToDelete = imagesToDelete.filter(url => url !== null);
            if (imagesToDelete.length > 0) {console.log(imagesToDelete)
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
                queries.push(Query.contains('keyword',inputValue));
            }
    
            if (sortByAsc) {queries.push(Query.orderAsc('price'));}
            if (sortByDesc) {queries.push(Query.orderDesc('price'));}
    
            const offset = (page - 1) * productsPerPage;
            queries.push(Query.limit(productsPerPage), Query.offset(offset));
    
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
                if (isInStock !== undefined) {
                    categoryQueries.push(Query.equal('isInStock', isInStock));
                }
                const response = await this.databases.listDocuments(
                    conf.appwriteProductsDatabaseId,
                    collectionId,
                    categoryQueries
                );
                return response.documents || [];
            };
    
            const allProducts = await fetchProducts(conf.appwriteProductsCollectionId);
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
