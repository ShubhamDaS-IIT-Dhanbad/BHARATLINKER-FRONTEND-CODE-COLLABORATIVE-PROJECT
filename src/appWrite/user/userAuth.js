import { Client, Account, ID } from "appwrite";
import { fetchUserByPhoneNumber } from "./userData.js";
import conf from '../../conf/conf.js';
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") 
  .setProject(conf.appwriteBlUsersProjectId);

const account = new Account(client);

// Function to send OTP
export const sendOTP = async (phone) => {
  try {console.log(phone);
    const response=await account.createPhoneToken(ID.unique(),phone);
    return response.userId;
  } catch (error) {
    console.error("Error sending OTP:", error.message);
  }
};
export const verifyOTP = async (userId, otpCode ,phoneNumber) => {
    try {console.log(userId, otpCode ,phoneNumber)
      const session = await account.createSession(userId, otpCode);
      console.log("User preferences:",session);
      const userData=await fetchUserByPhoneNumber(phoneNumber);
      return { session, userData };
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      return null;
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