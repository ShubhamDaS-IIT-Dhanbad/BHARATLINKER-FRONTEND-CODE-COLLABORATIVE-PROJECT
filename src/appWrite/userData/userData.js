import conf from '../../conf/conf.js';
import { Client, Databases, Query } from 'appwrite';

const client = new Client();
client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteUsersProjectId);

const databases = new Databases(client);


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
        return updatedUser;
    } catch (error) {
        console.error('Error in updateUserByPhoneNumber:', error);
        return false;
    }
}






// Function to fetch or create user data by phone number
async function fetchUserByPhoneNumber(phn) {
    try {
        if (!phn) {
            throw new Error("Phone number (phn) is required.");
        }

        // Convert phone number to string if it's a number
        const phoneNumber = typeof phn === 'number' ? phn.toString() : phn;

        const queries = [Query.equal('phoneNumber', phoneNumber)];
        const result = await databases.listDocuments(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            queries
        );

        if (result.documents.length === 0) {
            const newUser = {
                phoneNumber: phoneNumber,  // Ensure phoneNumber is stored as a string
                address: null,
                lat: null,
                long: null,
                cart: '[]'
            };

            // Pass the correct 'data' parameter when creating the document
            const createdDocument = await databases.createDocument(
                conf.appwriteUsersDatabaseId,
                conf.appwriteUsersCollectionId,
                "unique()", // Pass a unique ID or use "unique()" to generate one
                newUser     // Ensure the user data is passed as the second parameter (data)
            );
            return createdDocument;
        }
        return result.documents[0];
    } catch (error) {
        console.error('Error in fetchUserByPhoneNumber:', error);
        return null;
    }
}












async function fetchUserCartByPhoneNumber(phn) {
    try {
        if (!phn) {
            throw new Error("Phone number (phn) is required.");
        }
        const phoneNumber = typeof phn === 'number' ? phn.toString() : phn;
        const queries = [Query.equal('phoneNumber', phoneNumber)];

        // Fetch the full document (this will still be necessary)
        const result = await databases.listDocuments(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            queries
        );

        if (result.documents.length === 0) {
            throw new Error(`No document found with phoneNumber: ${phoneNumber}`);
        }

        // Extract and return only the 'cart' field
        const userCart = result.documents[0].cart;
        return userCart;
    } catch (error) {
        console.error('Error in fetchUserCartByPhoneNumber:', error);
        return null;
    }
}


async function updateCartByPhoneNumber({phoneNumber, cart}) {
    try {
        const phoneNumberString = String(phoneNumber);
        const queries = [Query.equal('phoneNumber', phoneNumberString)];

        const result = await databases.listDocuments(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            queries
        );
        if (result.documents.length === 0) {
            throw new Error(`No document found with phoneNumber: ${phoneNumberString}`);
        }
        const documentId = result.documents[0].$id;
        const updatedUser = await databases.updateDocument(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            documentId,
            { cart: cart}
        );
        return updatedUser;
    } catch (error) {
        console.error('Error in updateCartByPhoneNumber:', error);
        throw error;
    }
}

export { fetchUserCartByPhoneNumber, updateUserByPhoneNumber, updateCartByPhoneNumber, fetchUserByPhoneNumber };
