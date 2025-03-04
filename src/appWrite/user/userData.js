import conf from '../../conf/conf.js';
import { Client, Databases, Query } from 'appwrite';

const client = new Client();
client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteUsersProjectId);
const databases = new Databases(client);





// Function to fetch or create user data by phone number
async function fetchUserByPhoneNumber(phoneNumber) {
    try {
        if (!phoneNumber) {
            throw new Error("Phone number is required.");
        }
        const cleanedPhone = phoneNumber.toString().replace(/[^+\d]/g, '');
        if (!/^\+?\d+$/.test(cleanedPhone)) {
            throw new Error("Invalid phone number format. Must contain only digits and optional + prefix.");
        }
        const queries = [
            Query.equal('phoneNumber', cleanedPhone),
            Query.select(['$id','name', 'phoneNumber', 'lastLogin', 'address'])
        ];

        const result = await databases.listDocuments(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersUsersCollectionId,
            queries
        );
        if (result.documents.length === 0) {
            return {
                total: 0,
                phoneNumber: cleanedPhone,
                address: [],
                name: null,
                lastLogin: null
            };
        }

        return {total:result.total,userData:result.documents[0]};
    } catch (error) {
        console.error('Error in fetchUserByPhoneNumber:', {
            message: error.message,
            stack: error.stack
        });
        throw error; // Changed to throw instead of return null
    }
}
async function updateUserById(updatedData) {
    try {
        const { documentId, address } = updatedData;

        if (!documentId) {
            throw new Error("Document ID is required.");
        }

        const updatedUser = await databases.updateDocument(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersUsersCollectionId,
            documentId,
            { address }
        );
        return updatedUser;
    } catch (error) {
        console.error("Error in updateUserById:", error);
        return false;
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
            conf.appwriteUsersUsersCollectionId,
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


async function updateCartByPhoneNumber({ phoneNumber, cart }) {
    try {
        const phoneNumberString = String(phoneNumber);
        const queries = [Query.equal('phoneNumber', phoneNumberString)];

        const result = await databases.listDocuments(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersUsersCollectionId,
            queries
        );
        if (result.documents.length === 0) {
            throw new Error(`No document found with phoneNumber: ${phoneNumberString}`);
        }
        const documentId = result.documents[0].$id;
        const updatedUser = await databases.updateDocument(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersUsersCollectionId,
            documentId,
            { cart: cart }
        );
        return updatedUser;
    } catch (error) {
        console.error('Error in updateCartByPhoneNumber:', error);
        throw error;
    }
}

export { fetchUserCartByPhoneNumber, updateUserById, updateCartByPhoneNumber, fetchUserByPhoneNumber };
