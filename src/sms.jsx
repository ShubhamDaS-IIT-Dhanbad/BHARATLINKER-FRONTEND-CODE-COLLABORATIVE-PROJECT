import React, { useState, useEffect } from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./fireBase/firebase.js";

const PhoneNumberAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Initialize Firebase and reCAPTCHA
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    auth.settings.appVerificationDisabledForTesting = true; // Disable for testing (only in development)

    // Setup reCAPTCHA
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible', // You can change this to 'normal' for visible reCAPTCHA
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        handlePhoneNumberSubmit();
      }
    }, auth);

    // Render reCAPTCHA after initialization
    window.recaptchaVerifier.render().then(() => {
      console.log('reCAPTCHA rendered successfully');
    }).catch((error) => {
      console.error('Error rendering reCAPTCHA:', error);
    });
  }, []);

  // Handle phone number submit
  const handlePhoneNumberSubmit = () => {
    const appVerifier = window.recaptchaVerifier;

    const auth = getAuth();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        alert('SMS sent!');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // Handle verification code submit
  const handleCodeSubmit = () => {
    if (confirmationResult) {
      confirmationResult.confirm(verificationCode)
        .then((result) => {
          const user = result.user;
          alert('User signed in successfully');
        })
        .catch((error) => {
          alert('Error: ' + error.message);
        });
    }
  };

  return (
    <div>
      <h2>Phone Number Authentication</h2>

      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1 123 456 7890"
        />
        <button onClick={handlePhoneNumberSubmit}>Send SMS</button>
      </div>

      <div>
        <label>Verification Code:</label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter the code"
        />
        <button onClick={handleCodeSubmit}>Verify Code</button>
      </div>

      <div id="recaptcha-container"></div> {/* Container for reCAPTCHA */}
    </div>
  );
};

export default PhoneNumberAuth;
