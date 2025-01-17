import conf from '../../conf/conf.js';
import { Client, Account, ID, Databases } from 'appwrite';
import CryptoJS from 'crypto-js';

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Set your Appwrite endpoint
    .setProject(conf.appwriteShopsProjectId);    // Set your Appwrite project ID

// Initialize the database instance
const databases = new Databases(client);

// Define function to place an order
const placeOrderProvider = async (
    userId,
    shopId,
    productId,
    count,
    price,
    discountedPrice,address,userLat,userLong
) => {console.log(userId,
    shopId,
    productId,
    count,
    price,
    discountedPrice,address,userLat,userLong)
    try {
        // Validate that price, discountedPrice, and count are valid numbers
        if (
            typeof count !== 'number' ||
            count <= 0 ||
            typeof price !== 'number' ||
            price <= 0 ||
            typeof discountedPrice !== 'number' ||
            discountedPrice < 0
        ) {
            throw new Error(
                'Invalid input: count, price, and discountedPrice must be valid positive numbers. discountedPrice can be zero.'
            );
        }

        // Create document in Appwrite
        const response = await databases.createDocument(
            conf.appwriteShopsDatabaseId, // Database ID
            conf.appwriteOrdersCollectionId, // Collection ID
            ID.unique(), // Unique document ID
            {
                userId: userId,
                shopId: shopId,
                productId: productId,
                count,
                price,
                discountedPrice: discountedPrice, 
                address,
                lat:userLat,
                long:userLong
            }
        );

        console.log('Order placed successfully:', response);
        return response;
    } catch (error) {
        console.error('Error placing order:', error.message);
        throw error;
    }
};

export {placeOrderProvider};
