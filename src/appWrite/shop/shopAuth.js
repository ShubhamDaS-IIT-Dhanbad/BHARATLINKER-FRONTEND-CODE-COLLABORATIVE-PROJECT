import { Client, Databases, Query, Account, ID } from "appwrite";
import { fetchShopData } from "./shopData.js";
import conf from '../../conf/conf.js';

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(conf.appwriteShopsProjectId);

const account = new Account(client);
const databases = new Databases(client);


export const updatePassword = async (shopId, password) => {
  try {
    let passwordStr = String(password);
    let passwordInt = parseInt(passwordStr, 10);

    if (isNaN(passwordInt) || passwordStr !== passwordInt.toString() || !/^\d{6}$/.test(passwordStr)) {
      throw new Error("Password must be exactly 6 digits");
    }

    console.log("Password as integer:", passwordInt);

    const shopData = await databases.updateDocument(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsShopsCollectionId,
      shopId,
      {
        shopPassword: passwordInt
      }
    );
    console.log("Password updated successfully for shop:", shopData.$id);
    return {
      success: true,
      shopData: shopData
    };
  } catch (error) {
    console.error("Error updating password:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

export const sendOTP = async (phone) => {
  try {
    const response = await account.createPhoneToken(ID.unique(), phone);
    return response.userId;
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return null;
  }
};

export const verifyOTP = async (shopId, otpCode, shopPhoneNumber) => {
  try {
    let shopData = await fetchShopData(shopPhoneNumber);
    if (!shopData || shopData.total === 0) {
      shopData = await databases.createDocument(
        conf.appwriteShopsDatabaseId,
      conf.appwriteShopsShopsCollectionId,
        ID.unique(),
        { shopPhoneNumber }
      );
    }
    return { session: "test1", shopData };
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    return null;
  }
};
export const verifyPassword = async (shopPhoneNumber, password) => {
  try {
    const passwordInt = parseInt(password);
    if (isNaN(passwordInt) ||
      passwordInt.toString().length !== 6 ||
      passwordInt < 0) {
      console.error("Password must be a 6-digit integer");
      return null;
    }

    const queries = [
      Query.equal("shopPhoneNumber", shopPhoneNumber),
      Query.equal("shopPassword", passwordInt)
    ];

    const result = await databases.listDocuments(
      conf.appwriteShopsDatabaseId,
      conf.appwriteShopsShopsCollectionId,
      queries
    );
    if (result.documents.length > 0) {

      console.log("successfully logged in");
      const shopData = result.documents[0];
      return { session: "test1", shopData };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error verifying password:", error.message);
    return null;
  }
};

// Function to log out user
export const logout = async () => {
  try {
    await account.deleteSession("current");
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
