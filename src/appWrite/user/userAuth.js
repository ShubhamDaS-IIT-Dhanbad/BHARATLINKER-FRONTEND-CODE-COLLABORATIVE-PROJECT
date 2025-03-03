import { Client, Databases, Account, ID } from "appwrite";
import { fetchUserByPhoneNumber } from "./userData.js";
import conf from '../../conf/conf.js';
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(conf.appwriteUsersProjectId);

const account = new Account(client);
const databases = new Databases(client);

export const sendOTP = async (phone) => {
  try {
    const response = await account.createPhoneToken(ID.unique(), phone);
    return response.userId;
  } catch (error) {
    console.error("Error sending OTP:", error.message);
  }
};
export const verifyOTP = async (userId, otpCode, phoneNumber) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a non-empty string');
  }
  if (!otpCode || typeof otpCode !== 'string') {
    throw new Error('Invalid OTP code: must be a non-empty string');
  }
  if (!phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
    throw new Error('Invalid phone number format');
  }

  try {
    const session = await account.createSession(userId, otpCode);
    
    const{total,userData} = await fetchUserByPhoneNumber(phoneNumber);
    let userDocument;

    if (total === 0) {
      userDocument = await databases.createDocument(
        conf.appwriteUsersDatabaseId,
        conf.appwriteUsersUsersCollectionId,
        ID.unique(),
        { 
          phoneNumber,
          lastLogin: new Date().toISOString()
        }
      );
    } else {
      userDocument = userData;
      await databases.updateDocument(
        conf.appwriteUsersDatabaseId,
        conf.appwriteUsersUsersCollectionId,
        userDocument.$id,
        { lastLogin: new Date().toISOString() }
      );
    }

    return {
      session:session,
      userData: {
        id: userDocument.$id,
        address:userDocument.address,
        phoneNumber: userDocument.phoneNumber,
        createdAt: userDocument.createdAt,
        lastLogin: userDocument.lastLogin
      }
    };
  } catch (error) {
    console.error('Error verifying OTP:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};


// Function to check if user exists
export const checkUserExists = async () => {
  try {
    const user = await account.get();
    return user || null;
  } catch (error) {
    console.error("Error fetching user:", error.message);
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