

import { createClient } from "@supabase/supabase-js";
import conf from '../conf/conf.js'

// Initialize Supabase client
const supabase = createClient(conf.supabaseuserauthurl,conf.supabaseuserauthanonkey);

// Function to send OTP
export const sendOTP = async (phone) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({ phone });

    if (error) throw error;
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    alert("Failed to send OTP. Please try again.");
  }
};
// Function to verify OTP
export const verifyOTP = async (phone, otpCode) => {
  try {
    const response = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otpCode,
      type: 'sms',
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    alert("Failed to verify OTP. Please try again.");
  }
};


export const loginUserWithPassword = async ({ phone, password }) => {
    try {
      let response;
      if (password) {
        response = await supabase.auth.signInWithPassword({
          phone: `+91${phone}`,
          password,
        });
      } else {
        response = await supabase.auth.signInWithOtp({
          phone: `+91${phone}`,
        });
      }
  
      if (response.error) throw response.error;
  
      console.log("Login successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed. Please check your details and try again.");
      return null;
    }
  };
  


export const checkUserExists = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
};
export const updateUserData = async (userData) => {
    try {
      // Extract only the allowed fields
      const allowedFields = ['name', 'lat', 'long', 'email'];
      const filteredData = Object.keys(userData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = userData[key];
          return obj;
        }, {});
  
      // Check if password is provided and is exactly 6 digits
      if (userData.password && /^\d{6}$/.test(userData.password)) {
        filteredData.password = userData.password;
      }
  
      if (Object.keys(filteredData).length === 0) {
        throw new Error("No valid fields provided for update.");
      }
  
      const { data, error } = await supabase.auth.updateUser({
        data: filteredData,
        password: filteredData.password || undefined
      });
  
      if (error) throw error;
  
      console.log("User data updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error updating user data:", error.message);
      return null;
    }
  };

  



// Function to log out user
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
