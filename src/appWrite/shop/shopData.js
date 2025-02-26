import conf from '../../conf/conf.js';
import {
  uploadImagesToCloudinary,
  cleanupUploadedImages
} from './shopClodinary.js';
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
      conf.appwriteShopsCollectionId,
      queries
    );

    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error fetching shop data:", error.message);
    return null;
  }
}
export async function fetchShopDataByAttribute(shopPhoneNumber, attribute) {
  try {
    if (!shopPhoneNumber) throw new Error("Phone number is required.");
    if (isNaN(shopPhoneNumber)) throw new Error("Invalid phone number format.");
    
    // Validate attribute is an array
    if (!Array.isArray(attribute) || attribute.length === 0) {
      throw new Error("Attribute must be a non-empty array");
    }

    const queries = [
      Query.equal('shopPhoneNumber', shopPhoneNumber),
      Query.select(attribute) // Using Query.select to specify attributes
    ];
    
    const result = await databases.listDocuments(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsCollectionId,
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

    const updatedShopData= await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsCollectionId,
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
 * @param {string} shopId - The ID of the shop.
 * @param {string[]} toDeleteImagesUrls - List of image URLs to delete.
 * @param {Object} updatedData - The updated data object.
 * @param {Array} newFiles - New images to upload (URLs or File objects).
 * @returns {Promise<Object>} - The updated shop document.
 */
export async function updateShopImagesAndData({shopId, toDeleteImagesUrls, updatedData, newFiles}) {
  let uploadedImages = [];
  let allImageUrls = updatedData.images || [];

  try {
    if (toDeleteImagesUrls.length > 0) {
      await cleanupUploadedImages(toDeleteImagesUrls);
    }
    const validUrls = newFiles.filter(url => typeof url === 'string' && url);
    const filesToUpload = newFiles.filter(file => typeof file === 'object' && file);
    if (filesToUpload.length > 0) {
      uploadedImages = await uploadImagesToCloudinary(filesToUpload);
      const newImageUrls = uploadedImages.map(image => image.secure_url);
      allImageUrls = [...validUrls, ...allImageUrls, ...newImageUrls];
    } else {
      allImageUrls = [...validUrls, ...allImageUrls];
    }
    allImageUrls = allImageUrls.filter(Boolean).sort();
    const updatedShopData = {
      ...(allImageUrls.length > 0 && { shopImages: allImageUrls }),
    };

    for (const [key, value] of Object.entries(updatedData)) {
      if (value !== undefined && value !== null) {
        updatedShopData[key] = 
          value?.toLowerCase();
      }
    }
    const shopData= await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsCollectionId,
      shopId,
      updatedShopData
    );
    return {
      shopId: shopData.$id,
      shopName: shopData?.shopName,
      shopLatitude: shopData?.shopLatitude,
      shopImages:shopData?.shopImages,
      shopLongitude: shopData?.shopLongitude,
      shopPhoneNumber: shopData.shopPhoneNumber,
      shopAddress: shopData?.shopAddress,
      isShopOpen: shopData?.isShopOpen,
      shopNo: shopData?.shopNo,
      buildingName: shopData?.buildingName,
      landmark: shopData?.landmark || "",
      shopKeywords: shopData?.shopKeywords,
      shopCustomerCare:shopData?.shopCustomerCare,
      shopEmail: shopData?.shopEmail
    };
  } catch (error) {
    console.error("Error updating shop:", error);
    if (uploadedImages.length > 0) {
      await cleanupUploadedImages(uploadedImages.map(img => img.secure_url));
    }
    throw error;
  }
}
