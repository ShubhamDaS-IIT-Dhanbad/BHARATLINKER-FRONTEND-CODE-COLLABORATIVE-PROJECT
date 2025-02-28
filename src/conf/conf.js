const conf = {
    // Appwrite Base URL
    appwriteUrl: import.meta.env.VITE_APPWRITE_URL,

    // API Keys
    geoapifyapikey: import.meta.env.VITE_REACT_APP_GEOAPIFY_API_KEY,
    opencageapikey: import.meta.env.VITE_REACT_APP_OPENCAGE_API_KEY,
    opencageapiurl: import.meta.env.VITE_REACT_APP_OPENCAGE_API_URL,

    // Bharat Linker Users
    appwriteUsersProjectId: import.meta.env.VITE_APPWRITE_USERS_PROJECT_ID,
    appwriteUsersDatabaseId: import.meta.env.VITE_APPWRITE_USERS_DATABASE_ID,
    appwriteUsersUsersCollectionId: import.meta.env.VITE_APPWRITE_USERS_USERS_COLLECTION_ID,
    appwriteUsersCartCollectionId: import.meta.env.VITE_APPWRITE_USERS_CART_COLLECTION_ID,

    // Shop
    appwriteShopsProjectId: import.meta.env.VITE_APPWRITE_SHOPS_PROJECT_ID,
    appwriteShopsDatabaseId: import.meta.env.VITE_APPWRITE_SHOPS_DATABASE_ID,
    
    appwriteShopsShopsCollectionId: import.meta.env.VITE_APPWRITE_SHOPS_SHOPS_COLLECTION_ID,
    appwriteShopsProductsCollectionId: import.meta.env.VITE_APPWRITE_SHOPS_PRODUCTS_COLLECTION_ID,
    appwriteShopsOrdersCollectionId: import.meta.env.VITE_APPWRITE_SHOPS_ORDERS_COLLECTION_ID,

    // Email Configuration (Should be removed if this is client-side)
    emailSender: import.meta.env.VITE_EMAIL_SENDER,
    emailPassword: import.meta.env.VITE_EMAIL_PASSWORD,
};

export default conf;