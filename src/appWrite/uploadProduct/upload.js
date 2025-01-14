import conf from '../../conf/conf.js';
import { Client, Account, ID, Databases, Query } from 'appwrite';
import CryptoJS from 'crypto-js';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteProductsProjectId);

const account = new Account(client);
const databases = new Databases(client);








const uploadImageToCloudinary = async (file) => {
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

const uploadImagesToCloudinary = async (files) => {
    const validFiles = files.filter(file => file && typeof file === 'object');
    const uploadPromises = validFiles.map(file => uploadImageToCloudinary(file));
    return await Promise.all(uploadPromises);
}





const isValidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
};
const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl || !isValidUrl(imageUrl)) {
        console.error('Invalid URL:', imageUrl);
        return; // Skip invalid URLs
    }

    try {
        // Extract public_id from the URL
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0]; // Remove file extension
        const timestamp = Math.floor(Date.now() / 1000); // Current timestamp

        const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${conf.refurbishProductCloudinaryApiSecret}`;
        const signature = CryptoJS.SHA1(stringToSign).toString(); // Signature generation

        // Prepare form data for the API request
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('signature', signature);
        formData.append('api_key', conf.refurbishProductCloudinaryApiKey);
        formData.append('timestamp', timestamp);

        // Make the API request to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${conf.refurbishProductCloudinaryCloudName}/image/destroy`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.result !== 'ok') {
            throw new Error('Image deletion failed');
        }
        console.log('Image deleted successfully:', imageUrl);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

const cleanupUploadedImages = async (uploadedImages) => {
    if (!Array.isArray(uploadedImages)) {
        console.error('Invalid images array:', uploadedImages);
        return;
    }

    try {
        const deletionPromises = uploadedImages
            .filter(isValidUrl) // Filter valid URLs only
            .map(url => deleteImageFromCloudinary(String(url))); // Convert URL to string and delete valid images

        await Promise.all(deletionPromises);
        console.log('Successfully cleaned up uploaded images');
    } catch (error) {
        console.error('Error during cleanup:', error);
        throw error;
    }
};



//upload module imp
const uploadProductWithImages = async (productData, files = []) => {
    let uploadedImages = [];

    try {
        uploadedImages = await uploadImagesToCloudinary(files);
        const imageUrls = uploadedImages.map((image) => image.secure_url);
        const newProductData = {
            title: productData.title.toLowerCase(),
            description: productData.description.toLowerCase(),
            price: Number(productData.price),
            discountedPrice: Number(productData.discountedPrice),
            category: productData.category.toLowerCase(),
            brand: productData.brand.toLowerCase(),
            lat: productData.lat,
            isInStock: productData.isInStock ?? true,
            long: productData.long,
            shop: productData.shop
        };
        
        const document = await databases.createDocument(
            conf.appwriteProductsDatabaseId,
            conf.appwriteProductsCollectionId,
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







export {uploadProductWithImages};
