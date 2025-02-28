import conf from '../../conf/conf.js';
import {
  uploadImagesToPublitio,
  cleanupUploadedImages,
} from './publitio.js';
import { Client, Databases, Query } from 'appwrite';

// Initialize Appwrite client and database instance
const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteShopsProjectId);

const databases = new Databases(client);

/**
 * Fetch shop data by phone number.
 * @param {string} shopPhoneNumber - The phone number to search for.
 * @returns {Promise<Object|null>} - The shop document or null if not found.
 */
export async function fetchShopData(shopPhoneNumber) {
  try {
    if (!shopPhoneNumber) throw new Error("Phone number is required.");
    if (isNaN(shopPhoneNumber)) throw new Error("Invalid phone number format.");

    const queries = [Query.equal('shopPhoneNumber', shopPhoneNumber)];
    const result = await databases.listDocuments(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsShopsCollectionId,
      queries
    );

    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error fetching shop data:", error.message);
    return null;
  }
}

/**
 * Fetch shop data by phone number with specific attributes.
 * @param {string} shopPhoneNumber - The phone number to search for.
 * @param {string[]} attribute - Array of attributes to select.
 * @returns {Promise<Object|null>} - The shop document with selected attributes or null.
 */
export async function fetchShopDataByAttribute(shopPhoneNumber, attribute) {
  try {
    if (!shopPhoneNumber) throw new Error("Phone number is required.");
    if (isNaN(shopPhoneNumber)) throw new Error("Invalid phone number format.");
    if (!Array.isArray(attribute) || attribute.length === 0) {
      throw new Error("Attribute must be a non-empty array");
    }

    const queries = [
      Query.equal('shopPhoneNumber', shopPhoneNumber),
      Query.select(attribute),
    ];
    
    const result = await databases.listDocuments(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsShopsCollectionId,
      queries
    );

    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error fetching shop data:", error.message);
    return null;
  }
}

/**
 * Update shop data with new details.
 * @param {string} shopId - The ID of the shop to update.
 * @param {Object} updatedData - The new data to update.
 * @returns {Promise<Object|boolean>} - The updated document or false on failure.
 */
export async function updateShopData(shopId, updatedData) {
  try {
    if (!shopId) throw new Error("Shop ID is required.");

    const updateFields = Object.fromEntries(
      Object.entries(updatedData).filter(([_, value]) => value !== undefined && value !== null)
    );

    if (Object.keys(updateFields).length === 0) throw new Error("No valid fields to update.");

    const updatedShopData = await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsShopsCollectionId,
      shopId,
      updateFields
    );
    return updatedShopData;
  } catch (error) {
    console.error("Error updating shop data:", error.message);
    return false;
  }
}

/**
 * Update shop images and details.
 * @param {Object} params - Parameters for the update.
 * @param {string} params.shopId - The ID of the shop.
 * @param {string[]} params.toDeleteImagesUrls - List of image URLs to delete.
 * @param {Object} params.updatedData - The updated data object.
 * @param {Array} params.newFiles - New images to upload (URLs or File objects).
 * @returns {Promise<Object>} - The updated shop document.
 */
export async function updateShopImagesAndData({ shopId, toDeleteImagesUrls, updatedData, newFiles }) {
  let uploadedImages = [];
  let allImageUrls = updatedData.shopImages || []; // Use shopImages consistently

  try {
    // Validate inputs
    if (!shopId) throw new Error("Shop ID is required.");
    if (!Array.isArray(toDeleteImagesUrls)) throw new Error("toDeleteImagesUrls must be an array.");
    if (!Array.isArray(newFiles)) throw new Error("newFiles must be an array.");

    // Delete old images if any
    if (toDeleteImagesUrls.length > 0) {
      // Fixed: Removed unnecessary mapping as URLs are already strings
      await cleanupUploadedImages(toDeleteImagesUrls);
      allImageUrls = allImageUrls.filter(url => !toDeleteImagesUrls.includes(url));
    }

    // Handle new files (URLs or uploads)
    const validUrls = newFiles.filter(url => typeof url === 'string' && url.trim());
    const filesToUpload = newFiles.filter(file => file && typeof file === 'object');

    let formattedImageUrls = [];
    
    if (filesToUpload.length > 0) {
      uploadedImages = await uploadImagesToPublitio(filesToUpload);
      // Fixed: Added proper object destructuring and removed incorrect syntax
      formattedImageUrls = uploadedImages.map(image => image.secure_url);
      allImageUrls = [...allImageUrls, ...validUrls, ...formattedImageUrls].filter(Boolean);
    } else if (validUrls.length > 0) {
      allImageUrls = [...allImageUrls, ...validUrls].filter(Boolean);
    }

    // Prepare updated data, applying toLowerCase only to string fields
    const updatedShopData = {
      ...(allImageUrls.length > 0 && { shopImages: allImageUrls }), // Store formatted URLs
    };

    for (const [key, value] of Object.entries(updatedData)) {
      if (value !== undefined && value !== null) {
        updatedShopData[key] = typeof value === 'string' ? value.toLowerCase() : value;
      }
    }

    // Update in Appwrite
    const shopData = await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsShopsCollectionId,
      shopId,
      updatedShopData
    );

    // Return full shop data
    return shopData;
  } catch (error) {
    console.error("Error updating shop:", error.message);
    if (uploadedImages.length > 0) {
      // Fixed: Updated cleanup to use proper image IDs if available
      const idsToCleanup = uploadedImages.map(img => img.id || img.secure_url);
      await cleanupUploadedImages(idsToCleanup);
    }
    throw error;
  }
}