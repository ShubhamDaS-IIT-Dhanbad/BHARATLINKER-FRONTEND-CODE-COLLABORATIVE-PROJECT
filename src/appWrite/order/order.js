import conf from '../../conf/conf.js';

import { Client, Databases, ID, Query } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteShopsProjectId);

const databases = new Databases(client);

const placeOrderProvider = async (
    userId,
    shopId,
    productId,
    quantity,
    price,
    discountedPrice,
    address,
    lat,
    long,
    image,
    title,
    phoneNumber,name
) => {
    try {
        if (
            typeof quantity !== 'number' || quantity <= 0 ||
            typeof price !== 'number' || price <= 0 ||
            typeof discountedPrice !== 'number' || discountedPrice < 0
        ) {
            throw new Error(
                'Invalid input: count, price, and discountedPrice must be valid positive numbers. discountedPrice can be zero.'
            );
        }

        // Validate title
        if (typeof title !== 'string') {
            throw new Error('Invalid title: Title must be a string.');
        }
        const truncatedTitle = title.length > 50 ? title.slice(0, 50) : title;

        // Validate image
        if (typeof image !== 'string') {
            throw new Error('Invalid image: Image must be a string.');
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
                quantity,
                price,
                discountedPrice,
                address,
                lat,
                long,
                image,phoneNumber,name,
                title: truncatedTitle,
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
        const queries = [Query.equal('userId', userId)];
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
const getOrderByShopId = async (shopId, state, page , ordersPerPage = 4) => {
    try {
        if (!shopId) {
            throw new Error('Shop ID is missing');
        }

        // Construct queries
        const queries = [
            Query.equal('shopId', shopId), // Filter by shop ID
            Query.equal('state', state),   // Filter by state
        ];

        // Handle sorting based on the state
        if (state === 'pending' || state === 'confirmed' || state === 'dispatched') {
            queries.push(Query.orderAsc('$createdAt')); // Sort by creation time for these states
        } else if (state === 'canceled' || state === 'delivered') {
            queries.push(Query.orderDesc('$updatedAt')); // Sort by update time for these states
        }

        // Pagination logic
        const offset = (page - 1) * ordersPerPage;
        queries.push(Query.limit(ordersPerPage)); // Limit the number of results per page
        queries.push(Query.offset(offset));      // Set the offset for pagination

        // Fetch documents
        const response = await databases.listDocuments(
            conf.appwriteShopsDatabaseId,
            conf.appwriteOrdersCollectionId,
            queries
        );
        return {
            documents: response.documents,
            total: response.total,
            currentPage: page,
            totalPages: Math.ceil(response.total / ordersPerPage),
        };
    } catch (error) {
        console.error('Error fetching orders by shopId:', error.message);
        throw error;
    }
};

const updateOrderByShopId = async (orderId, state) => {
    try {
        if (!orderId) {
            throw new Error('User ID is missing');
        }
        const documentId = orderId;
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



const updateOrderState = async (orderId, state) => {
    try {
        if (!orderId) {
            throw new Error('User ID is missing');
        }
        const documentId = orderId;
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

export { placeOrderProvider, getOrderByUserId,getOrderByShopId,updateOrderByShopId, updateOrderState };

