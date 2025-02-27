import conf from '../../conf/conf.js';
import { ID,Client,Permission,Role, Databases, Query } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(conf.appwriteBlUsersProjectId);

const databases = new Databases(client);

// Function to fetch paginated cart items
async function getCartItems(userId, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    const response = await databases.listDocuments(
      conf.appwriteBlUsersDatabaseId,
      conf.appwriteBlCartCollectionId,
      [
        Query.equal("userId", userId),
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt"),
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
}

// Function to add a product to the cart
async function addToCart(cartItem) {
  try {
    const response = await databases.createDocument(
      conf.appwriteBlUsersDatabaseId,
      conf.appwriteBlCartCollectionId,
      ID.unique(),
      {
        productId: cartItem.productId,
        shopId: cartItem.shopId,
        userId: cartItem.userId,
        title: cartItem.title,
        price: Number(cartItem.price),
        discountedPrice: Number(cartItem.discountedPrice),
        quantity: Number(cartItem.quantity),
        productImage: cartItem.productImage,
        shopEmail:cartItem.shopEmail,
        customerName: cartItem.customerName,
        shopName:cartItem.shopName,
        customerPhoneNumber: Number(cartItem.phoneNumber),
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
}
async function updateCartQuantity(cartId, updatedCart) {
  try {
    const response = await databases.updateDocument(
      conf.appwriteBlUsersDatabaseId,
      conf.appwriteBlCartCollectionId,
      cartId,
      {
        quantity: Number(updatedCart.quantity),
        customerName: updatedCart.customerName,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return null;
  }
}
async function removeFromCart(cartId) {
  try {
    await databases.deleteDocument(
      conf.appwriteBlUsersDatabaseId,
      conf.appwriteBlCartCollectionId,
      cartId
    );
    return true;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return false;
  }
}
export { addToCart, getCartItems, removeFromCart, updateCartQuantity };

