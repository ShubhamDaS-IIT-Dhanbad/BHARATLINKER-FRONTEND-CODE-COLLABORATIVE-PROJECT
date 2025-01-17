import conf from '../../conf/conf.js';
import { Client, Databases, ID } from 'appwrite';

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
    userLong
) => {
    try {
        // Validate input
        if (
            typeof count !== 'number' || count <= 0 ||
            typeof price !== 'number' || price <= 0 ||
            typeof discountedPrice !== 'number' || discountedPrice < 0
        ) {
            throw new Error(
                'Invalid input: count, price, and discountedPrice must be valid positive numbers. discountedPrice can be zero.'
            );
        }

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
            }
        );
        return response;
    } catch (error) {
        console.error('Error placing order:', error.message);
        throw error;
    }
};

export { placeOrderProvider };

