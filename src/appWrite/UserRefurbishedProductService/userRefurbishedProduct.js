import conf from '../../conf/conf.js';
import { Client, Databases, ID ,Query} from 'appwrite';
import CryptoJS from 'crypto-js';

class UserRefurbishedProduct {
    client = new Client();
    databases;
    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteBlUsersProjectId);
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
        if( !productData.coordinates.latitude || !productData.coordinates.longitude) throw error;
        let uploadedImages = [];
        try {
            uploadedImages = await this.uploadImagesToCloudinary(files);
            const imageUrls = uploadedImages.map((image) => image.secure_url);

            const newProductData = {
                image: imageUrls,
                title: productData.title.toLowerCase(),
                description: productData.description.toLowerCase(),
                price: Number(productData.price),
                discountedPrice: Number(productData.discountedPrice),
                keyword: productData.keyword.toLowerCase(),
                phoneNumber: productData.phoneNumber,
                latitude: productData.coordinates?.latitude || 0,
                longitude: productData.coordinates?.longitude || 0
            };
            const document = await this.databases.createDocument(
                conf.appwriteBlUsersDatabaseId,
                conf.appwriteBlProductsCollectionId,
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
    /*imp*/
    async updateUserProduct(productId, toDeleteImagesUrls, updatedData, newFiles = []) {
        let uploadedImages = [];
        let allImageUrls = updatedData.images ? [...updatedData.images] : [];
    
        try {
            // Remove specified images
            if (toDeleteImagesUrls.length > 0) {
                await this.cleanupUploadedImages(toDeleteImagesUrls);
                allImageUrls = allImageUrls.filter(url => !toDeleteImagesUrls.includes(url));
            }
    
            // Separate URLs and files
            const validUrls = newFiles.filter(url => typeof url === 'string' && url !== null);
            const filesToUpload = newFiles.filter(file => typeof file === 'object');
    
            // Upload new images if any
            if (filesToUpload.length > 0) {
                uploadedImages = await this.uploadImagesToCloudinary(filesToUpload);
                const newImageUrls = uploadedImages.map(image => image.secure_url);
                allImageUrls = [...allImageUrls, ...validUrls, ...newImageUrls];
            } else {
                allImageUrls = [...allImageUrls, ...validUrls];}
            updatedData.image = allImageUrls;
    
            const productIdValue = typeof productId === 'object' && productId.id ? productId.id : productId;
            const updatedDocument = await this.databases.updateDocument(
                conf.appwriteBlUsersDatabaseId,
                conf.appwriteBlProductsCollectionId,
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
        inputValue = '',
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
            queries.push(Query.equal('phoneNumber', phn));
           
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
                    conf.appwriteBlUsersDatabaseId,
                    collectionId,
                    categoryQueries
                );
                return response.documents || [];
            };
    
            const allProducts = await fetchProducts(conf.appwriteBlProductsCollectionId);
            if (!Array.isArray(allProducts)) {
                throw new TypeError("Expected 'allProducts' to be an array.");
            }
    
            // Skip scoring when inputValue is empty
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

const userRefurbishedProduct = new UserRefurbishedProduct();
export default userRefurbishedProduct;
