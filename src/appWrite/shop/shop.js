import conf from '../../conf/conf.js';
import { Client, Account,ID, Databases, Query } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteShopsProjectId);

const account = new Account(client);
const databases = new Databases(client);




const sendOtp = async (phoneNumber) => {
    try {
        const token = await account.createPhoneToken(ID.unique(), `+91${phoneNumber}`);
        console.log(token)
        return token.userId;
    } catch (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};





const createSession = async (userId,otpCode) => {
    try {
        const session = await account.createSession(userId, otpCode);
        return session;
    } catch (error) {
        throw new Error(`Failed to create session: ${error.message}`);
    }
};
const deleteSession = async (sessionId) => {
    try {
        await account.deleteSession(sessionId);
        console.log('Session deleted successfully.');
    } catch (error) {
        console.error(`Failed to delete session: ${error.message}`);
    }
};
async function clearUserSessions() {
    try {
        await account.deleteSessions();
        console.log(`All sessions cleared`);
    } catch (error) {
        console.error('Error clearing sessions:', error);
    }
}




const registerShop = async (shopName, phone) => {
    try {
        const response = await databases.listDocuments(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            [Query.equal('phoneNumber', `+91${phone}`)]
        );

        if (response.total > 0) {
            throw new Error(`Shop with phone number ${phone} already exists.`);
        }
        const result = await databases.createDocument(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            'unique()',
            {
                shopName: shopName,
                phoneNumber: `+91${phone}`
            }
        );

        return result;
    } catch (error) {
        throw error;
    }
};

const getShopData = async (phoneNumber) => {
    try {
        const response = await databases.listDocuments(
            conf.appwriteShopsDatabaseId,
            conf.appwriteShopsCollectionId,
            [Query.equal('phoneNumber', phoneNumber)]
        );

        if (response.total > 0) {
            return response.documents[0];
        } else {
            throw new Error('Shop not found for the given phone number.');
        }
    } catch (error) {
        console.error(`Failed to fetch shop data: ${error.message}`);
        throw error;
    }
};


export { registerShop,sendOtp,createSession,deleteSession,getShopData,clearUserSessions };
