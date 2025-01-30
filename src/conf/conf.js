const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),

    geoapifyapikey: String(import.meta.env.VITE_REACT_APP_GEOAPIFY_API_KEY),
    opencageapikey: String(import.meta.env.VITE_REACT_APP_OPENCAGE_API_KEY),
    opencageapiurl: String(import.meta.env.VITE_REACT_APP_OPENCAGE_API_URL),

    //FIREBASE-USER 12
    firebaseApikey: String(import.meta.env.VITE_FIREBASE_API_KEY),
    firebaseAuthDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    firebaseDatabaseURL: String(import.meta.env.VITE_FIREBASE_DATA_BASE_URL),
    firebaseProjectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    firebaseStorageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    firebaseMessagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    firebaseAppId: String(import.meta.env.VITE_FIREBASE_APP_ID),
    measurementId: String(import.meta.env.VITE_FIREBASE_MEASURMENT_ID),



    // USERS 4
    appwriteUsersProjectId: String(import.meta.env.VITE_APPWRITE_USERS_PROJECT_ID),
    appwriteUsersDatabaseId: String(import.meta.env.VITE_APPWRITE_USERS_DATABASE_ID),
    appwriteUsersCollectionId: String(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
    appwriteUsersImagesBucketId: String(import.meta.env.VITE_APPWRITE_USERS_IMAGES_BUCKET_ID),

    // REFURBISHED PRODUCTS 2
    appwriteRefurbishProductProjectId: String(import.meta.env.VITE_APPWRITE_REFURBISHED_PRODUCTS_PROJECT_ID),
    appwriteRefurbishProductDatabaseId: String(import.meta.env.VITE_APPWRITE_REFURBISHED_PRODUCTS_DATABASE_ID),
    //REFURBISHED PRODUCTS COLLECTIONS 3
    appwriteRefurbishedBooksCollectionId: String(import.meta.env.VITE_APPWRITE_REFURBISHED_BOOKS_COLLECTION_ID),
    appwriteRefurbishedModulesCollectionId: String(import.meta.env.VITE_APPWRITE_REFURBISHED_MODULE_COLLECTION_ID),
    appwriteRefurbishedGadgetsCollectionId: String(import.meta.env.VITE_APPWRITE_REFURBISHED_GADGETS_COLLECTION_ID),

    //REFURBISHED PRODUCTS BUCKET 1
    appwriteRefurbishProductImagesBucketId: String(import.meta.env.VITE_APPWRITE_REFURBISHED_PRODUCTS_IMAGES_BUCKET_ID),
    // REFURBISHED PRODUCTS CLOUDINARY 5
    refurbishProductCloudinaryCloudName: String(import.meta.env.VITE_CLOUDINARY_REFURBISHED_PRODUCTS_CLOUDINARY_CLOUD_NAME),
    refurbishBooksCloudinaryPreset: String(import.meta.env.VITE_CLOUDINARY_REFURBISHED_BOOKS_CLOUDINARY_PRESET),
    refurbishProductCloudinaryApiKey: String(import.meta.env.VITE_CLOUDINARY_REFURBISHED_PRODUCTS_CLOUDINARY_API_KEY),
    refurbishProductCloudinaryApiSecret: String(import.meta.env.VITE_CLOUDINARY_REFURBISHED_PRODUCTS_CLOUDINARY_API_SECRET),
    refurbishProductCloudinaryApiUrl: String(import.meta.env.VITE_CLOUDINARY_REFURBISHED_PRODUCTS_CLOUDINARY_URL),







    // SHOP | SERVICES 4+1+4+2
    appwriteShopsProjectId: String(import.meta.env.VITE_APPWRITE_SHOPS_PROJECT_ID),
    appwriteShopsDatabaseId: String(import.meta.env.VITE_APPWRITE_SHOPS_DATABASE_ID),

    appwriteShopsProductsCollectionId: String(import.meta.env.VITE_APPWRITE_SHOPS_PRODUCTS_COLLECTION_ID),
    appwriteShopsCollectionId: String(import.meta.env.VITE_APPWRITE_SHOPS_COLLECTION_ID),
    appwriteOrdersCollectionId: String(import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID),

    // SHOP PRODUCT 4+4
    // appwriteProductsProjectId: String(import.meta.env.VITE_APPWRITE_PRODUCTS_PROJECT_ID),
    // appwriteProductsDatabaseId: String(import.meta.env.VITE_APPWRITE_PRODUCTS_DATABASE_ID),
    // appwriteProductsCollectionId: String(import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID),
    // appwriteProductsImagesBucketId: String(import.meta.env.VITE_APPWRITE_PRODUCTS_IMAGES_BUCKET_ID),

    // productCloudinaryCloudName: String(import.meta.env.VITE_CLOUDINARY_PRODUCTS_CLOUDINARY_CLOUD_NAME),
    // productCloudinaryApiKey: String(import.meta.env.VITE_CLOUDINARY_PRODUCTS_CLOUDINARY_API_KEY),
    // productCloudinaryApiSecret: String(import.meta.env.VITE_CLOUDINARY_PRODUCTS_CLOUDINARY_API_SECRET),
    // productCloudinaryApiUrl: String(import.meta.env.VITE_CLOUDINARY_PRODUCTS_CLOUDINARY_URL),

    // SHOP PRODUCT 4+4
    appwriteProductsProjectId: String(import.meta.env.VITE_APPWRITE_SHOPS_PROJECT_ID),
    appwriteProductsDatabaseId: String(import.meta.env.VITE_APPWRITE_SHOPS_DATABASE_ID),
    appwriteProductsCollectionId: String(import.meta.env.VITE_APPWRITE_SHOPS_PRODUCTS_COLLECTION_ID),



    appwriteShopsImagesBucketId: String(import.meta.env.VITE_APPWRITE_SHOPS_IMAGES_BUCKET_ID),
    shopCloudinaryCloudName: String(import.meta.env.VITE_CLOUDINARY_SHOPS_CLOUDINARY_CLOUD_NAME),
    shopCloudinaryApiKey: String(import.meta.env.VITE_CLOUDINARY_SHOPS_CLOUDINARY_API_KEY),
    shopCloudinaryApiSecret: String(import.meta.env.VITE_CLOUDINARY_SHOPS_CLOUDINARY_API_SECRET),
    shopCloudinaryApiUrl: String(import.meta.env.VITE_CLOUDINARY_SHOPS_CLOUDINARY_URL),




    emailSender: String(import.meta.env.VITE_EMAIL_SENDER),
    emailPassword: String(import.meta.env.VITE_EMAIL_PASSWORD),
}

export default conf;