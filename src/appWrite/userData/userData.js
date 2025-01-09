import conf from '../../conf/conf.js';
import { Client, Databases,Query } from 'appwrite';

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
        const queries = [];
        queries.push(Query.contains('phoneNumber', phn));
        // Query the database for the document with the phoneNumber equal to phn
        const searchQuery = [`phoneNumber=${phn}`]; // Query format may depend on your Appwrite version
        const result = await databases.listDocuments(
            conf.appwriteUsersDatabaseId,
            conf.appwriteUsersCollectionId,
            queries
        );
    console.log("lplpp",result)
        if (result.documents.length === 0) {
            throw new Error(`No document found with phoneNumber: ${phn}`);
        }
    
        // Assuming the first result is the correct one (if there are multiple results, you might want to handle that)
        const documentId = result.documents[0].$id;
    
        // Now, update the document using the document ID
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
        return false; // Return false for errors
    }
    
}

export default updateUserByPhoneNumber;

