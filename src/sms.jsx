import React, { useState, useEffect } from 'react';
import { auth } from './fireBase/firebase.js';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const SendOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');

  // Initialize reCAPTCHA verifier on component mount
  useEffect(() => {
    const initializeRecaptcha = () => {
      try {
        // Ensure auth is properly initialized
        if (!auth) {
          throw new Error('Firebase auth is not initialized');
        }

        // Initialize reCAPTCHA verifier
        window.recaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible', // Use 'normal' for visible reCAPTCHA
            callback: () => {
              // reCAPTCHA solved, allow OTP sending
              console.log('reCAPTCHA solved');
            },
          },
          auth
        );
      } catch (err) {
        console.error('Error initializing reCAPTCHA:', err);
        setError('Failed to initialize reCAPTCHA. Please refresh the page.');
      }
    };

    initializeRecaptcha();

    // Cleanup reCAPTCHA on component unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  // Function to send OTP
  const handleSendOTP = async () => {
    try {
      if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA verifier not initialized');
      }

      // Format phone number (ensure it includes a country code)
      const formattedPhoneNumber = `+${phoneNumber.replace(/\D/g, '')}`;

      // Send OTP
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        window.recaptchaVerifier
      );

      // Save confirmation result for OTP verification
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setError('');
      alert('OTP sent successfully!');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Send OTP</h2>
      {!otpSent ? (
        <>
          <input
            type="text"
            placeholder="Enter phone number (e.g., +1234567890)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSendOTP} style={styles.button}>
            Send OTP
          </button>
        </>
      ) : (
        <p>OTP has been sent to {phoneNumber}. Proceed to verify.</p>
      )}

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      {/* Display error message */}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

// Basic styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default SendOTP;