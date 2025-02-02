import React, { useEffect, useState } from "react";
import { Client, Account, ID } from "appwrite";

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("6703b6cf0021226113b9");

const account = new Account(client);

const GoogleAuth = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("bharatlinker@gmail.com");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [tokenId, setTokenId] = useState(null);

  const loginWithGoogle = async () => {
    try {
      // Check if the user is already logged in
      const loggedInUser = await account.get();
      if (loggedInUser) {
        // If the user is already logged in, link the Google session
        await account.linkOAuth2Session("google");
      } else {
        // Otherwise, proceed with Google login
        account.createOAuth2Session(
          "google",
          "http://localhost:5173/user",
          "http://localhost:5173/login"
        );
      }
    } catch (error) {
      console.error("Google Auth error:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      console.error("User not logged in:", error);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Step 1: Send OTP to the user's email
  const sendEmailOTP = async () => {
    try {
      // Check if the email is already registered
      const existingUser = await account.getEmail(email);
      if (existingUser) {
        console.log("Email already exists:", email);
        setOtpSent(true);
      } else {
        const response = await account.createEmailToken(ID.unique(), email);
        setTokenId(response);
        setOtpSent(true);
        console.log("OTP sent to:", email);
      }
    } catch (error) {
      console.error("Error checking email or sending OTP:", error);
    }
  };

  // Step 2: Verify OTP and log in the user
  const verifyEmailOTP = async () => {
    try {
      if (!tokenId || !otp) {
        console.error("Token ID or OTP is missing.");
        return;
      }

      const sessionId = await account.createSession(tokenId.userId, otp);
      console.log(sessionId);

      const userData = await account.get();
      setUser(userData);
      setOtpSent(false);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <>
          <button onClick={loginWithGoogle}>Login with Google</button>
          <br /><br />
          
          {!otpSent ? (
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={sendEmailOTP}>Send OTP</button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={verifyEmailOTP}>Verify OTP</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GoogleAuth;
