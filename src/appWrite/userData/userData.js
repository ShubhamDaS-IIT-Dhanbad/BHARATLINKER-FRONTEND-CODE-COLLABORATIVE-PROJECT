import conf from '../../conf/conf.js';
import { Client, Databases, Query } from 'appwrite';

const client = new Client();
client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteUsersProjectId);

const databases = new Databases(client);

// Function to update user data by phone number
async function updateUserByPhoneNumber(updatedData) {
    try {
        const { phn, ...restData } = updatedData;

        if (!phn) {
            throw new Error("Phone number (phn) is required as the document ID.");
        }

        const queries = [Query.equal('phoneNumber', phn)];
        const result = await databases.listDocuments(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            queries
        );

        if (result.documents.length === 0) {
            throw new Error(`No document found with phoneNumber: ${phn}`);
        }

        const documentId = result.documents[0].$id;

        const updatedUser = await databases.updateDocument(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            documentId,
            restData
        );

        console.log('User successfully updated:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Error in updateUserByPhoneNumber:', error);
        return false;
    }
}
async function updateCartByPhoneNumber(updatedData) {
    try {
        const { phn, cart } = updatedData;

        // Use the phone number as the query to update the cart directly
        const updatedUser = await databases.updateDocument(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            phn,
            { cart }
        );

        console.log('User successfully updated:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Error in updateCartByPhoneNumber:', error);
        throw error; // Throwing error for better handling
    }
}


// Function to fetch user data by phone number
async function fetchUserByPhoneNumber(phn) {
    try {
        if (!phn) {
            throw new Error("Phone number (phn) is required.");
        }

        const queries = [Query.equal('phoneNumber', phn)];
        const result = await databases.listDocuments(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            queries
        );

        if (result.documents.length === 0) {
            throw new Error(`No document found with phoneNumber: ${phn}`);
        }

        console.log('User data retrieved:', result.documents[0]);
        return result.documents[0];
    } catch (error) {
        console.error('Error in fetchUserByPhoneNumber:', error);
        return null;
    }
}

export { updateUserByPhoneNumber,updateCartByPhoneNumber, fetchUserByPhoneNumber };
