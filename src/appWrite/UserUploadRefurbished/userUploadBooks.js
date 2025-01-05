import conf from '../../conf/conf.js';
import { Client, Databases, ID } from 'appwrite';
import CryptoJS from 'crypto-js';

class UserUploadBooks {
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




    async uploadProductWithImages(productData, files = []) {
        let uploadedImages = [];
        try {
            uploadedImages = await this.uploadImagesToCloudinary(files);
            const imageUrls = uploadedImages.map(({ secure_url }) => secure_url);

            const newProductData = {
                ...productData,
                language: productData.language.toLowerCase(),
                board: productData.board.toLowerCase(),
                subject: productData.subject.toLowerCase(),
                title: productData.title.toLowerCase(),
                description: productData.description.toLowerCase(),
                price: Number(productData.price),
                discountedPrice: Number(productData.discountedPrice),
                keywords: productData.keywords.split(','),
                pinCodes: productData.pinCodes.split(',').map(pin => Number(pin)),
                images: imageUrls,
                phn: productData.phn
            };

            const document = await this.databases.createDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedBooksCollectionId,
                ID.unique(),
                newProductData
            );
            return document;
        } catch (error) {
            console.error('Error uploading product:', error);
            if (uploadedImages.length > 0) await this.cleanupUploadedImages(uploadedImages);
            throw error;
        }
    }


    async updateUserRefurbishedProduct(productId, toDeleteImagesUrls, updatedData, newFiles = []) {
        let uploadedImages = [];
        let allImageUrls = updatedData.images || [];
        try {
            // Delete specified images
            if (toDeleteImagesUrls.length > 0) {
                await this.cleanupUploadedImages(toDeleteImagesUrls);
            }

            // Separate URLs and files for uploading
            const validUrls = newFiles.filter(url => url !== null && typeof url === 'string');
            const filesToUpload = newFiles.filter(file => typeof file === 'object');

            // Upload new files if available and get their URLs
            if (filesToUpload.length > 0) {
                uploadedImages = await this.uploadImagesToCloudinary(filesToUpload);
                const newImageUrls = uploadedImages.map(image => image.secure_url);
                allImageUrls = [...validUrls, ...allImageUrls, ...newImageUrls];
            } else {
                // If no new files, just add valid URLs to existing ones
                allImageUrls = [...validUrls, ...allImageUrls];
            }

            // Prepare updated product data
            const updatedProductData = {
                ...updatedData,
                language: updatedData.language.toLowerCase(),
                subject: updatedData.subject.toLowerCase(),
                title: updatedData.title.toLowerCase(),
                description: updatedData.description.toLowerCase(),
                price: Number(updatedData.price),
                discountedPrice: Number(updatedData.discountedPrice),
                keywords: updatedData.keywords.split(','),
                pinCodes: updatedData.pinCodes.split(',').map(pin => Number(pin)),
                images: allImageUrls,
            };

            // Update the document in the database
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






    //upload module
    async uploadModuleWithImages(productData, files = []) {
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

            console.log("uploaded");
            return document;
        } catch (error) {
            console.error('Error uploading product:', error);
            await this.cleanupUploadedImages(uploadedImages);
            throw error;
        }
    }

    //update module
    async updateModuleWithImages(formData, moduleId, toDeleteImagesUrls, newFiles = []) {
        let uploadedImages = [];
        let allImageUrls = formData.images || [];
        console.log(toDeleteImagesUrls)
        try {
            // Delete specified images
            if (toDeleteImagesUrls.length > 0) {
                await this.cleanupUploadedImages(toDeleteImagesUrls);
            }
    
            // Separate URLs and files for uploading
            const validImageUrls = newFiles.filter(url => url !== null && typeof url === 'string');
            const filesToUpload = newFiles.filter(file => typeof file === 'object');
    
            // Upload new files if available and get their URLs
            if (filesToUpload.length > 0) {
                uploadedImages = await this.uploadImagesToCloudinary(filesToUpload);
                const newImageUrls = uploadedImages.map(image => image.secure_url);
    
                // Concatenate URLs, adding new images at the end
                allImageUrls = [...validImageUrls, ...allImageUrls, ...newImageUrls];
            } else {
                // If no new files, just add valid URLs to existing ones
                allImageUrls = [...validImageUrls, ...allImageUrls];
            }
    
            // Prepare updated module data
            const updatedModuleData = {
                class: formData.class,
                language: formData.language.toLowerCase(),
                subject: formData.subject.toLowerCase(),
                title: formData.title.toLowerCase(),
                description: formData.description.toLowerCase(),
                price: Number(formData.price),
                discountedPrice: Number(formData.discountedPrice),
                keywords: formData.keywords.split(','),
                pinCodes: formData.pinCodes.split(',').map(pin => Number(pin)),
                coachingInstitute: formData.coachingInstitute || '',
                exam: formData.exam || '',
                images: allImageUrls,
            };
    
            // Update the document in the Appwrite database
            const updatedDocument = await this.databases.updateDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedModulesCollectionId,
                moduleId,
                updatedModuleData
            );
    
            console.log("Module updated successfully");
            return updatedDocument;
        } catch (error) {
            console.error('Error updating module:', error);
            if (uploadedImages.length > 0) await this.cleanupUploadedImages(uploadedImages);
            throw error;
        }
    }
    

    async deleteModule(moduleId, imagesToDelete) {
        try {
            imagesToDelete = imagesToDelete.filter(url => url !== null);
            if (imagesToDelete.length > 0) {
                await this.cleanupUploadedImages(imagesToDelete);
                console.log(`Successfully deleted images: ${imagesToDelete.join(', ')}`);
            }
    
            const response = await this.databases.deleteDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedModulesCollectionId, // Updated collection ID if necessary
                moduleId // Use moduleId instead of productId.id
            );
            
            console.log('Module deleted successfully:', response);
            return { status: "success" };
        } catch (error) {
            console.error('Error deleting module:', error);
            throw error;
        }
    }
    

}

const userUploadBooks = new UserUploadBooks();
export default userUploadBooks;
