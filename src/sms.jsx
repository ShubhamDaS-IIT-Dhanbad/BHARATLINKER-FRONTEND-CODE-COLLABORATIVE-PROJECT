import React, { useEffect, useRef, useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/compat/auth';
import { auth } from './fireBase/firebase.js';

function Sms() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const recaptchaVerifier = useRef(null);

  console.log(auth,"p")
  useEffect(() => {
    if (!auth) {
      setError('Firebase auth not initialized');
      return;
    }

    try {
      recaptchaVerifier.current = new RecaptchaVerifier(
        'recaptcha-container',
        { size: 'invisible' },
        auth 
      );
    } catch (err) {
      console.error('reCAPTCHA Error:', err);
      setError('Failed to initialize reCAPTCHA. Refresh the page.');
    }

    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    };
  }, []);

  const handleSendOTP = async () => {
    try {
      setError('');

      // Validate phone number format
      if (!phoneNumber.startsWith('+')) {
        throw new Error('Phone number must include country code (e.g., +1...)');
      }

      // Verify reCAPTCHA is ready
      if (!recaptchaVerifier.current) {
        throw new Error('reCAPTCHA not initialized');
      }

      // Send OTP
      const confirmation = await signInWithPhoneNumber(
        auth, // <-- Use initialized auth
        phoneNumber,
        recaptchaVerifier.current
      );

      setVerificationId(confirmation);
      setOtpSent(true);
    } catch (err) {
      console.error('OTP Send Error:', err);
      setError(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setError('');

      if (!verificationId || !otp) {
        throw new Error('Missing verification ID or OTP');
      }

      await verificationId.confirm(otp);
      alert('Phone number verified!');
    } catch (err) {
      console.error('OTP Verify Error:', err);
      setError(err.message || 'Failed to verify OTP');
    }
  };

  return (
    <div>
      <h2>Phone Login</h2>
      {!otpSent ? (
        <div>
          <input
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={handleSendOTP}>Send OTP</button>
          <div id="recaptcha-container"></div>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Sms;