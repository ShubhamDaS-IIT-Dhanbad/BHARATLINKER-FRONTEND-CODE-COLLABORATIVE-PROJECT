import conf from '../../conf/conf.js';

import { Client, Databases,ID, Query } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteShopsProjectId);

const databases = new Databases(client);
const placeOrderProvider = async (
    userId,
    shopId,
    productId,
    count,
    price,
    discountedPrice,
    address,
    userLat,
    userLong,
    img,
    name
) => {
    try {
        if (
            typeof count !== 'number' || count <= 0 ||
            typeof price !== 'number' || price <= 0 ||
            typeof discountedPrice !== 'number' || discountedPrice < 0
        ) {
            throw new Error(
                'Invalid input: count, price, and discountedPrice must be valid positive numbers. discountedPrice can be zero.'
            );
        }

        // Ensure title is a string and slice it to 50 characters
        if (typeof img !== 'string') {
            throw new Error('Invalid title: Title must be a string.');
        }
        const title = img.length > 50 ? img.slice(0, 50) : img;

        // Create a document in the Appwrite database
        const response = await databases.createDocument(
            conf.appwriteShopsDatabaseId,
            conf.appwriteOrdersCollectionId,
            ID.unique(),
            {
                userId,
                shopId,
                productId,
                count,
                price,
                discountedPrice,
                address,
                lat: userLat,
                long: userLong,
                image:name,
                title:img  
            }
        );
        return response;
    } catch (error) {
        console.error('Error placing order:', error.message);
        throw error;
    }
};



const getOrderByUserId = async (userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is missing');
        }

        // Construct query to filter by userId
        
        const queries = [Query.equal('userId', userId)];// Appwrite expects query strings in this format

        // Fetch documents from the Appwrite database
        const response = await databases.listDocuments(
            conf.appwriteShopsDatabaseId,
            conf.appwriteOrdersCollectionId,
            queries
        );

        return response.documents;
    } catch (error) {
        console.error('Error fetching orders by userId:', error.message);
        throw error;
    }
};




const updateOrderState = async (orderId,state) => {
    try {
        if (!orderId) {
            throw new Error('User ID is missing');
        }
        const documentId=orderId;
        const response = await databases.updateDocument(
            conf.appwriteShopsDatabaseId,
            conf.appwriteOrdersCollectionId,
            documentId,
            {
            state
            }
        );
console.log(response)
        return response.documents;
    } catch (error) {
        console.error('Error fetching orders by orderId:', error.message);
        throw error;
    }
};

export { placeOrderProvider,getOrderByUserId,updateOrderState };

