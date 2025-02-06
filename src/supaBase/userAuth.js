

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
export const verifyOTP = async (phone, otpCode) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otpCode,
      type: "sms",
    });
    if (error) throw error;
    await supabase.auth.signOut({ scope: "others" });

    return data;
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    alert("Failed to verify OTP. Please try again.");
    return null;
  }
};

// Function to log in with password or OTP
export const loginUserWithPassword = async ({ phone, password }) => {
  try {
    let response;

    // Ensure both phone and password are provided
    if (phone && password) {
      response = await supabase.auth.signInWithPassword({
        phone: phone,
        password: password,
      });

      if (response.error) throw response.error;
      await supabase.auth.signOut({ scope: "others" });
      return response.data;
    } else {
      throw new Error("Phone and password are required.");
    }
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
export const updateUserMetaData = async (userData) => {
  try {
    // Extract only the allowed fields
    const allowedFields = ['name', 'lat', 'long', 'email'];
    const filteredData = Object.keys(userData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = userData[key];
        return obj;
      }, {});

    // Validate and include password if it's a valid 5-digit number
    if (userData.password) {
      if (/^\d{6}$/.test(userData.password)) {
        filteredData.password = userData.password;
      } else {
        throw new Error("Password must be exactly 5 digits.");
      }
    }

    if (Object.keys(filteredData).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    const { data, error } = await supabase.auth.updateUser({
      data: filteredData,
      password: filteredData.password || undefined
    });

    if (error) throw error;
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
