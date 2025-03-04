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

export const isShopExist = async (phone) => {
  const queries = [Query.equal('shopPhoneNumber',phone)];
  const { total, documents } = await databases.listDocuments(
    conf.appwriteShopsDatabaseId,
    conf.appwriteShopsShopsCollectionId,
    queries
  );
  if (total === 0) {
    return false;
  }
  return true;
}
export const sendOTP = async (phone) => {
  // Input validation
  if (!phone || typeof phone !== 'string' || phone.length < 10) {
    throw new Error("Invalid phone number provided");
  }
  try {
    const response = await account.createPhoneToken(ID.unique(), phone);
    if (!response || !response.userId) {
      throw new Error("Failed to create OTP token");
    }

    return response.userId;
  } catch (error) {
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};
export const verifyOTP = async (shopId, otpCode, shopPhoneNumber) => {
  if (!shopId || !otpCode || !shopPhoneNumber) {
    throw new Error("Missing required parameters: shopId, otpCode, or shopPhoneNumber");
  }
  try {
    const session = await account.createSession(shopId, otpCode);
    const shopData = await fetchShopData(shopPhoneNumber);
    if (!session || !shopData) {
      throw new Error("Failed to create session or fetch shop data");
    }
    return { session, shopData };
  } catch (error) {
    throw new Error(`OTP verification failed: ${error.message}`);
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
    );console.log(result,shopPhoneNumber, password)
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
