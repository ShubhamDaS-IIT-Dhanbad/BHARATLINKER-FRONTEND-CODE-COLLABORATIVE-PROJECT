import conf from '../../conf/conf.js';
import { Client, Databases, Query, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteShopsProjectId);

const databases = new Databases(client);

// Function to fetch shop data by phone number
export async function fetchShopData(phoneNumber) {
  try {
    if (!phoneNumber) {
      throw new Error("Phone number is required.");
    }
    if (isNaN(phoneNumber)) {
      throw new Error("Invalid phone number format.");
    }

    const queries = [Query.equal('phoneNumber', phoneNumber)];
    const result = await databases.listDocuments(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsCollectionId,
      queries
    );

    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error in fetchShopData:", error.message);
    return null;
  }
}

// Function to update shop data
export async function updateShopData(updatedData) {
  try {
    const { documentId, address } = updatedData;

    if (!documentId) {
      throw new Error("Document ID is required.");
    }
    if (!Array.isArray(address)) {
      throw new Error("Address must be an array.");
    }

    return await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsCollectionId,
      documentId,
      { address }
    );
  } catch (error) {
    console.error("Error in updateShopData:", error.message);
    return false;
  }
}