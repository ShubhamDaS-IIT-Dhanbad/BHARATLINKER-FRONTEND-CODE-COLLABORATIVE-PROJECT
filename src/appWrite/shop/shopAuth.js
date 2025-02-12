import { Client, Databases, Account, ID } from "appwrite";
import { fetchShopData } from "./shopData.js";
import conf from '../../conf/conf.js';

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(conf.appwriteShopsProjectId);

const account = new Account(client);
const databases = new Databases(client);

export const sendOTP = async (phone) => {
  try {
    const response = await account.createPhoneToken(ID.unique(), phone);
    return response.userId;
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return null;
  }
};

export const verifyOTP = async (shopId, otpCode, phoneNumber) => {
  try {
    // const session = await account.createSession(shopId, otpCode);
    let shopData = await fetchShopData(phoneNumber);
    if (!shopData || shopData.total === 0) {
      shopData = await databases.createDocument(
        conf.appwriteShopsDatabaseId,
        conf.appwriteShopsCollectionId,
        ID.unique(),
        { phoneNumber, total: 0, address: [] }
      );
    }

    return { session: "ko", shopData };
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
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
