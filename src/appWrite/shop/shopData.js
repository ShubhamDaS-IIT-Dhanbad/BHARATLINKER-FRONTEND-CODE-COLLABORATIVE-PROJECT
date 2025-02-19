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
export async function updateShopData(updatedData, shopId) {
  try {
    if (!shopId) {
      throw new Error("Shop ID is required.");
    }

    const updateFields = {};

    for (const key in updatedData) {
      if (updatedData[key] !== undefined && updatedData[key] !== null) {
        updateFields[key] = updatedData[key];
      }
    }

    if (Object.keys(updateFields).length === 0) {
      throw new Error("No valid fields to update.");
    }

    return await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsCollectionId,
      shopId,
      updateFields
    );
  } catch (error) {
    console.error("Error in updateShopData:", error.message);
    return false;
  }
}


