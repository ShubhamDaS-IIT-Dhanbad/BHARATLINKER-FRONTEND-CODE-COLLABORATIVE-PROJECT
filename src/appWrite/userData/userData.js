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

async function updateCartByPhoneNumber(phoneNumber, updatedCart) {
    try {
        // Ensure phoneNumber is a string
        const phoneNumberString = String(phoneNumber);
        console.log(phoneNumberString, updatedCart);

        // Query to find the document with the given phone number
        const queries = [Query.equal('phoneNumber', phoneNumberString)];

        const result = await databases.listDocuments(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            queries
        );

        // Check if a document was found
        if (result.documents.length === 0) {
            throw new Error(`No document found with phoneNumber: ${phoneNumberString}`);
        }

        // Get the document ID of the first result
        const documentId = result.documents[0].$id;

        // Convert updatedCart (array of objects) to a string
        const cartAsString = JSON.stringify(updatedCart); // Convert the entire array of objects into a string

        // Update the cart with the stringified array
        const updatedUser = await databases.updateDocument(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            documentId,
            { cart: cartAsString }
        );
        const updatedUserWithCart = { ...updatedUser, cart: JSON.parse(updatedUser.cart) };
        return updatedUserWithCart;
    } catch (error) {
        console.error('Error in updateCartByPhoneNumber:', error);
        throw error;
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
