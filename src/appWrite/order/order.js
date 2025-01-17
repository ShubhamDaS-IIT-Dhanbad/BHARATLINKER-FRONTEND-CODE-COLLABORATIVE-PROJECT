import conf from '../../conf/conf.js';
import { Client, Databases, ID } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteShopsProjectId);

const databases = new Databases(client);















const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.error("This browser does not support desktop notifications.");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    return false;
};

const sendBrowserNotification = (title, body) => {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body,
        });
    }
};

if ('Notification' in window && 'serviceWorker' in navigator) {
    requestNotificationPermission().then(permissionGranted => {
        if (permissionGranted) {
            console.log('Notification permission granted');
            sendBrowserNotification("Hi brothers", "You have a new message!");
        } else {
            console.error('Notification permission denied');
        }
    });
}
































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

        console.log('Order placed successfully:', response);
        return response;
    } catch (error) {
        console.error('Error placing order:', error.message);
        throw error;
    }
};


const subscribeToNewOrders = async () => {
    const isPermissionGranted = await requestNotificationPermission();
    if (!isPermissionGranted) {
        console.warn("Notification permission not granted.");
    }

    const subscription = client.subscribe(
        `databases.${conf.appwriteShopsDatabaseId}.collections.${conf.appwriteOrdersCollectionId}.documents`,
        (response) => {
            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                const order = response.payload;

                // Alert message
                alert('New order received!');

                // Browser notification
                sendBrowserNotification(
                    "New Order Received",
                    `Order ID: ${order.$id} from User: ${order.userId}`
                );
                console.log('Realtime New Order:', order);
            }
        }
    );
    console.log('Subscribed to new order events.');
    return subscription;
};

subscribeToNewOrders();
export { placeOrderProvider, subscribeToNewOrders };
