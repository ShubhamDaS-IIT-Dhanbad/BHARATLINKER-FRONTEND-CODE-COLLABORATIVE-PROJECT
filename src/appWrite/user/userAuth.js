import { Client, Account, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite endpoint
  .setProject("678f98180003def050fa"); // Your project ID

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

export const verifyOTP = async (userId, otpCode) => {
    try {
      // Verify OTP and create a session
      const session = await account.createSession(userId, otpCode);
      const userPreferences = await account.getPrefs(session.userId);
      console.log("User preferences:",session, userPreferences);
      return { session, userPreferences };
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      return null;
    }
  };
  
  // Function to fetch user preferences (replace with your actual method)
  const fetchUserPreferences = async (userId) => {
    try {
      // Replace with actual logic to fetch preferences (from Appwrite or other services)
      const preferences = await database.getUserPreferences(userId);
      return preferences;
    } catch (error) {
      console.error("Error fetching user preferences:", error.message);
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

// Function to update user metadata
export const updateUserMetaData = async (userData) => {
  try {
    const allowedFields = ["name", "lat", "long", "email"];
    const filteredData = {};
    
    Object.keys(userData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredData[key] = userData[key];
      }
    });
    
    if (userData.password && /^\d{6}$/.test(userData.password)) {
      filteredData.password = userData.password;
    } else if (userData.password) {
      throw new Error("Password must be exactly 6 digits.");
    }
    
    if (Object.keys(filteredData).length === 0) {
      throw new Error("No valid fields provided for update.");
    }
    
    const updatedUser = await account.updatePrefs(filteredData);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user data:", error.message);
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