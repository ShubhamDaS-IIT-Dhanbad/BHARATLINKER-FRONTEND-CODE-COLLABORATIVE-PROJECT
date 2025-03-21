import conf from '../../conf/conf.js';

import { Client, Databases, ID, Query } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(conf.appwriteShopsProjectId);

const databases = new Databases(client);

const placeOrderProvider = async (

  { 
    userId,
    phoneNumber,
    shopId,
    productId,
    quantity,
    price,
    discountedPrice,
    address,
    latitude,
    longitude,
    image,
    title,
    name,
    shopEmail,
    houseNo,
    building,
    landMark 
  }) => {
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
      conf.appwriteShopsOrdersCollectionId,
      ID.unique(),
      {
        userId,
        phoneNumber,
        shopId,
        productId,
        quantity,
        price,
        discountedPrice,
        address,
        latitude,
        longitude,
        image,name,
        title: truncatedTitle,
        shopEmail,
        houseNo,
        building,
        landMark
      }
    );
    return response;
  } catch (error) {
    console.error('Error placing order:', error.message);
    throw error;
  }
};


const getOrderByUserId = async (phoneNumber, page = 1, ordersPerPage = 10) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is missing');
    }
    
    const queries = [
      Query.equal('phoneNumber', phoneNumber),
      Query.orderDesc('$updatedAt'), 
      Query.limit(ordersPerPage),
    ];

    const offset = (page - 1) * ordersPerPage;
    queries.push(Query.offset(offset));

    const response = await databases.listDocuments(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsOrdersCollectionId,
      queries
    );

    return {
      documents: response.documents,
      total: response.total,
      currentPage: page,
      totalPages: Math.ceil(response.total / ordersPerPage),
    };
  } catch (error) {
    console.error('Error fetching orders by phoneNumber:', error.message);
    throw error;
  }
};

const getOrderByShopId = async (shopId, state, page, ordersPerPage = 10) => {
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
      conf.appwriteShopsOrdersCollectionId,
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
    console.log(orderId,state,"ji")
    if (!orderId) {
      throw new Error('User ID is missing');
    }
    const documentId = orderId;
    const response = await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsOrdersCollectionId,
      documentId,
      {
        state
      }
    );
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
      conf.appwriteShopsOrdersCollectionId,
      documentId,
      {
        state
      }
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching orders by orderId:', error.message);
    throw error;
  }
};

const updateOrderStateToConfirmed = async (orderId, state, expectedDeliveryDate) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is missing');
    }
    if (!expectedDeliveryDate) {
      throw new Error('Expected delivery date is missing');
    }
    const documentId = orderId;
    const response = await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsOrdersCollectionId,
      documentId,
      {
        state,
        expectedDeliveryDate,
      }
    );
    return response;
  } catch (error) {
    console.error('Error confirming order:', error.message);
    throw error;
  }
};

const updateOrderStateToDispatched = async (orderId, state, deliveryBoyPhn) => {
  console.log("shubham das",orderId, state, deliveryBoyPhn)
  try {
    if (!orderId || !deliveryBoyPhn) {
      throw new Error('Order ID or delivery boy phone is missing');
    }

    // Ensure deliveryBoyPhn is a number
    const deliveryBoyPhoneNumber = Number(deliveryBoyPhn);

    if (isNaN(deliveryBoyPhoneNumber)) {
      throw new Error('Delivery boy phone number must be a valid number');
    }

    const documentId = orderId;
    const response = await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsOrdersCollectionId,
      documentId,
      {
        state,
        deliveryBoyPhn: deliveryBoyPhoneNumber, // Now it's a number
      }
    );
    return response;
  } catch (error) {
    console.error('Error dispatching order:', error.message);
    throw error;
  }
};


const updateOrderStateToDelivered = async (orderId, state) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is missing');
    }
    const documentId = orderId;
    const response = await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsOrdersCollectionId,
      documentId,
      {
        state,
      }
    );
    return response;
  } catch (error) {
    console.error('Error delivering order:', error.message);
    throw error;
  }
};
const updateOrderStateToCanceled = async (orderId, state) => {
  try {
    if (!orderId) {
      throw new Error('Order ID is missing');
    }
    const documentId = orderId;
    const response = await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsOrdersCollectionId,
      documentId,
      {
        state,
      }
    );
    return response;
  } catch (error) {
    console.error('Error delivering order:', error.message);
    throw error;
  }
};


export {
  updateOrderStateToConfirmed, updateOrderStateToDispatched, updateOrderStateToCanceled
  , updateOrderStateToDelivered, placeOrderProvider,

  getOrderByUserId,
  getOrderByShopId, updateOrderByShopId, updateOrderState
};

