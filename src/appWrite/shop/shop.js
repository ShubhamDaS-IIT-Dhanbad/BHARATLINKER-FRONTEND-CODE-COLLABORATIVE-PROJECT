import conf from '../../conf/conf.js';
import { Client, Account, ID, Databases, Query } from 'appwrite';
import CryptoJS from 'crypto-js';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteShopsProjectId);

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
            .filter(isValidUrl)
            .map(url => deleteImageFromCloudinary(String(url)));

        await Promise.all(deletionPromises);
        console.log('Successfully cleaned up uploaded images');
    } catch (error) {
        console.error('Error during cleanup:', error);
        throw error;
    }
};







const sendOtp = async (contactInfo) => {
    try {
        let token;
        if (/^[0-9]{10}$/.test(contactInfo)) {
            token = await account.createPhoneToken(ID.unique(), `+91${contactInfo}`);
        } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contactInfo)) {
            token = await account.createEmailToken(ID.unique(), contactInfo);
        } else {
            throw new Error("Invalid phone number or email format.");
        }
        return token.userId;
    } catch (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};


const createSession = async (userId, otpCode) => {
    try {
        const session = await account.createSession(userId, otpCode);
        return session;
    } catch (error) {
        throw new Error(`Failed to create session: ${error.message}`);
    }
};

const deleteSession = async (userId) => {
    try {
        await account.deleteSessions(userId);
        console.log('All sessions deleted successfully.');
    } catch (error) {
        console.error(`Failed to delete sessions: ${error.message}`);
    }
};

const logout = async (sessionId) => {
    try {
        await deleteSession(sessionId);
        console.log('Logged out successfully.');
    } catch (error) {
        console.error(`Failed to log out: ${error.message}`);
    }
};

const registerShop = async (shopName, contactInfo) => {
    try {
        let response;

        if (/^[0-9]{10}$/.test(contactInfo)) {
            // If it's a phone number
            response = await databases.listDocuments(
                conf.appwriteShopsDatabaseId,
                conf.appwriteShopsCollectionId,
                [Query.equal('phoneNumber', `${contactInfo}`)]
            );
        } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contactInfo)) {
            // If it's an email address
            response = await databases.listDocuments(
                conf.appwriteShopsDatabaseId,
                conf.appwriteShopsCollectionId,
                [Query.equal('email', contactInfo)]
            );
        } else {
            throw new Error("Invalid phone number or email format.");
        }

        if (response.total > 0) {
            throw new Error(`Shop with ${contactInfo} already exists.`);
        }

        const result = await databases.createDocument(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            'unique()',
            {
                shopName: shopName,
                phoneNumber: /^[0-9]{10}$/.test(contactInfo) ? `${contactInfo}` : undefined,
                email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contactInfo) ? contactInfo : undefined
            }
        );

        return result;
    } catch (error) {
        throw error;
    }
};




const getShopData = async (contact) => {
    try {
        const isPhone = /^\d{10}$/.test(contact);
        let response;
        
        if (isPhone) {
            // If it's a phone number
            response = await databases.listDocuments(
                conf.appwriteShopsDatabaseId,
                conf.appwriteShopsCollectionId,
                [Query.equal('phoneNumber', `${contact}`)]
            );
        } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contact)) {
            // If it's an email address
            response = await databases.listDocuments(
                conf.appwriteShopsDatabaseId,
                conf.appwriteShopsCollectionId,
                [Query.equal('email', contact)]
            );
        } else {
            throw new Error("Invalid phone number or email format.");
        }

        if (response.total > 0) {
            return response.documents[0];
        } else {
            throw new Error('Shop not found for the given contact.');
        }
    } catch (error) {
        console.error(`Failed to fetch shop data: ${error.message}`);
        throw error;
    }
};


const updateShopData = async (shopId, toDeleteImagesUrls, updatedData, newFiles) => {
    let uploadedImages = [];
    let allImageUrls = updatedData.images || [];
    try {
        // Step 1: Delete specified images if provided
        if (toDeleteImagesUrls.length > 0) {
            await cleanupUploadedImages(toDeleteImagesUrls);
        }

        // Step 2: Separate valid URLs and new file objects
        const validUrls = newFiles.filter((url) => url !== null && typeof url === 'string');
        const filesToUpload = newFiles.filter((file) => file !== null && typeof file === 'object');

        // Step 3: Upload new files to Cloudinary
        if (filesToUpload.length > 0) {
            uploadedImages = await uploadImagesToCloudinary(filesToUpload);
            const newImageUrls = uploadedImages.map((image) => image.secure_url);
            allImageUrls = [...validUrls, ...allImageUrls, ...newImageUrls];
        } else {
            allImageUrls = [...validUrls, ...allImageUrls];
        }
        // Step 4: Sort image URLs (optional, based on original code)
        allImageUrls.sort((a, b) => {
            if (!a) return 1;
            if (!b) return -1;
            return 0;
        });
        console.log(allImageUrls);

        // Step 5: Dynamically build the updatedShopData object
        const updatedShopData = {};
        if (allImageUrls.length > 0) {
            updatedShopData.shopImages = allImageUrls;
        }

        for (const [key, value] of Object.entries(updatedData)) {
            if (value !== undefined && value !== null) {
                if (key === 'customerCare') {
                    updatedShopData.customerCare = Number(value);
                } else if (key === 'lat' || key === 'long') {
                    updatedShopData[key] = parseFloat(value);
                } else {
                    updatedShopData[key] = value.toLowerCase();
                }
            }
        }

        // Step 6: Update the shop document in the database
        const updatedDocument = await databases.updateDocument(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            shopId,
            updatedShopData
        );

        return updatedDocument;
    } catch (error) {
        console.error('Error updating shop:', error);

        // Cleanup any uploaded images if an error occurs
        if (uploadedImages.length > 0) {
            await cleanupUploadedImages(uploadedImages.map((img) => img.secure_url));
        }

        throw error;
    }
};


















































const updateShopOpenedStatus = async (shopId, isOpened) => {
    try {
        if (!shopId) {
            throw new Error('Shop ID is missing');
        }

        const documentId = shopId; // Using shopId directly for documentId
        const response = await databases.updateDocument(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            documentId,
            {
                isOpened: isOpened, // Ensure the correct key-value pair
            }
        );
        
        return response; // Return the updated document or response as needed
    } catch (error) {
        console.error('Error updating shop status:', error.message);
        throw error; // Re-throw the error to propagate it
    }
};

const fetchShopStatus = async (shopId) => {
    try {
        if (!shopId) {
            throw new Error('Shop ID is missing');
        }
        const documentId = shopId;
        const {isOpened} = await databases.getDocument(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            documentId
        );
        return isOpened;
    } catch (error) {
        console.error('Error fetching shop status:', error.message);
        throw error;
    }
};





export {
    registerShop, sendOtp, createSession, deleteSession, getShopData, logout,
     updateShopData,updateShopOpenedStatus,fetchShopStatus
    
};
