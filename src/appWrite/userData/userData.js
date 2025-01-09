import conf from '../conf/conf.js';
import { Client, Databases, Storage, Query } from 'appwrite';

class SearchProductService {
    client = new Client();
    databases;
    bucket;
    
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteUsersProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async getUserDataByPhoneNumber(phoneNumber) {
        try {
            const users = await this.databases.listDocuments(
                conf.appwriteUsersDatabaseId,
                conf.appwriteUsersCollectionId,
                [Query.equal('phoneNumber', phoneNumber)]
            );

            if (users.documents.length > 0) {
                return users.documents[0];
            } else {
                console.log('No user found with the provided phone number.');
                return null;
            }
        } catch (error) {
            console.log('Appwrite service :: getUserDataByPhoneNumber', error);
            return false;
        }
    }

    async updateUserData(documentId, updatedData) {
        try {
            let dataToUpdate = {};
            
            if (updatedData instanceof FormData) {
                updatedData.forEach((value, key) => {
                    dataToUpdate[key] = value;
                });
            } else {
                dataToUpdate = updatedData;
            }
            
            const updatedUser = await this.databases.updateDocument(
                conf.appwriteUsersDatabaseId,
                conf.appwriteUsersCollectionId,
                documentId,
                dataToUpdate
            );
            
            return updatedUser;
        } catch (error) {
            console.log('Appwrite service :: updateUserData', error);
            return false;
        }
    }
}

const getUserDataService = new SearchProductService();
export default getUserDataService;








