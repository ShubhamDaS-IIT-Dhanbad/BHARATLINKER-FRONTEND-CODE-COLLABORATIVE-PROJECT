import conf from '../../conf/conf.js';
import { Client, Databases, ID } from 'appwrite';
import CryptoJS from 'crypto-js';

class UserUploadGadgets {
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

    async uploadGadgetWithImages(gadgetData, files = []) {
        let uploadedImages = [];

        try {
            uploadedImages = await this.uploadImagesToCloudinary(files);
            const imageUrls = uploadedImages.map((image) => image.secure_url);

            const newGadgetData = {
                title: gadgetData.title.toLowerCase(),
                category: gadgetData.category.toLowerCase(),
                brand: gadgetData.brand.toLowerCase(),
                description: gadgetData.description.toLowerCase(),
                price: Number(gadgetData.price),
                discountedPrice: Number(gadgetData.discountedPrice),
                keywords: gadgetData.keywords.split(','),
                phn: gadgetData.phn,
                pinCodes: gadgetData.pinCodes.split(',').map((pin) => Number(pin)),
                productType: gadgetData.productType,
                images: imageUrls
            };

            const document = await this.databases.createDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedGadgetsCollectionId,
                ID.unique(),
                newGadgetData
            );

            console.log("Gadget uploaded successfully");
            return document;
        } catch (error) {
            console.error('Error uploading gadget:', error);
            await this.cleanupUploadedImages(uploadedImages);
            throw error;
        }
    }

    async updateUserRefurbishedGadget(gadgetId, toDeleteImagesUrls, updatedData, newFiles = []) {
        console.log(gadgetId,updatedData)
        let uploadedImages = [];
        let allImageUrls = updatedData.images || [];

        try {
             if (toDeleteImagesUrls.length > 0) {
                await this.cleanupUploadedImages(toDeleteImagesUrls);
            }

            // Separate URLs and files for uploading
            const validUrls = newFiles.filter(url => url !== null && typeof url === 'string');
            const filesToUpload = newFiles.filter(file => typeof file === 'object');
console.log("kooko",filesToUpload)
            // Upload new files if available and get their URLs
            if (filesToUpload.length > 0) {
                uploadedImages = await this.uploadImagesToCloudinary(filesToUpload);
                console.log(uploadedImages)
                const newImageUrls = uploadedImages.map(image => image.secure_url);

                // Concatenate URLs, adding new images at the end
                allImageUrls = [...validUrls, ...allImageUrls, ...newImageUrls];
            } else {
                // If no new files, just add valid URLs to existing ones
                allImageUrls = [...validUrls, ...allImageUrls];
            }


            const updatedGadgetData = {
                title: updatedData.title.toLowerCase(),
                description: updatedData.description.toLowerCase(),
                price: Number(updatedData.price),
                discountedPrice: Number(updatedData.discountedPrice),
                keywords: updatedData.keywords.split(','),
                model:updatedData.model,
                images: allImageUrls 
            };

            const updatedDocument = await this.databases.updateDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedGadgetsCollectionId,
                gadgetId,
                updatedGadgetData
            );

            console.log("Gadget updated successfully");
            return updatedDocument;
        } catch (error) {
            console.error('Error updating gadget:', error);
            if (uploadedImages.length > 0) {
                await this.cleanupUploadedImages(uploadedImages.map(img => img.secure_url));
            }
            throw error;
        }
    }


    async deleteGadget(gadgetId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteRefurbishProductDatabaseId,
                conf.appwriteRefurbishedGadgetsCollectionId,
                gadgetId
            );
            console.log('Gadget deleted successfully');
            return { status: "success" };
        } catch (error) {
            console.error('Error deleting gadget:', error);
            throw error;
        }
    }
}

const userUploadGadgets = new UserUploadGadgets();
export default userUploadGadgets;
