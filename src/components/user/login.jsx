import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/userLogin.css';
import { Client, Account, ID } from 'appwrite';
import { FaArrowLeft} from "react-icons/fa";

import { FaCircleExclamation } from "react-icons/fa6";
import Cookies from 'js-cookie';
import { fetchUserByPhoneNumber } from '../../appWrite/userData/userData.js';
import { TailSpin } from 'react-loader-spinner';

const i1 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737378112/vokh5op2d88jerrkksan.png';
const i2 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737378115/d7xgicjpub5ag6udeisd.png';

function SignUpForm() {
  const navigate = useNavigate();
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Initialize Appwrite client and account service
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('670211c2003bf4774272');

  const account = new Account(client);

  const handlePhoneChange = (e) => setPhone(e.target.value);

  const handleOTPChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = otp.map((d, idx) => (idx === index ? element.value : d));
    setOtp(newOtp);

    if (element.value === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    } else if (element.value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    const otpCode = newOtp.join('');
    if (otpCode.length === 6) verifyOTP(otpCode);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index] === "" && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sendOTP = async () => {
    setLoading(true);
    try {
      const token = await account.createPhoneToken(ID.unique(), `+91${phone}`);
      setUserId(token.userId);
      setOtpSent(true);
      setIsResendDisabled(true);
      setTimer(30);
    } catch (error) {
      console.error(`Failed to send SMS: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otpCode) => {
    if (otpCode.length !== 6 || !/^[0-9]+$/.test(otpCode)) return;
    setVerifyingOtp(true);

    try {
      const session = await account.createSession(userId, otpCode);
      console.log('OTP verified, session created:', session);

      try {
        const userData = await fetchUserByPhoneNumber(phone);
        if (userData) {
          userData.cart = userData.cart ? JSON.parse(userData.cart) : [];
          userData.userId=session.userId;
          Cookies.set('BharatLinkerUserData', JSON.stringify(userData), { expires: 7, path: '' });
          console.log('User data fetched and stored:', userData);
        } else {
          console.warn('No user data found for the provided phone number');
        }
      } catch (fetchError) {
        console.error('Error fetching user data:', fetchError);
      }

      navigate('/user');
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setOtp(new Array(6).fill(''));
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className='user-login-container'>
      {!otpSent ? (
        <div className="signup-phn-container">
          <div className="login-verification-top-header">
            <FaArrowLeft size={25} onClick={() => navigate('/')} style={{ position: "fixed", left: "10px" }} />
            Bharat | Linker
          </div>

          <img className='retailer-login-img' src={i2} alt="Signup" />
          <div className="signup-container-text">
            <div>Sign up to keep</div>
            <div style={{ marginTop: "-7px" }}>discovering the best your</div>
            <div style={{ marginTop: "-7px" }}>locality has to offer!</div>
          </div>
          <div className="signup-container-p">
            Add your phone number. We'll send you a verification code so we know you're real.
          </div>

          <div className="phone-input-container">
            <div className="country-code">
              <img src={i1} alt="India Flag" className="flag-icon" />
              <span style={{ color: "black" }}>+91</span>
            </div>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={handlePhoneChange}
              maxLength="10"
            />
          </div>

          <button className="send-otp-button" onClick={sendOTP} disabled={loading || !phone}>
            {loading ? <TailSpin height={20} width={20} color="#ffffff" /> : "SEND OTP"}
          </button>

          <p className="terms-text">
            By providing my phone number, I hereby agree and accept the{' '}
            <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a> in use of this app.
          </p>
        </div>
      ) : (
        <div className="otp-verification">
          <div className="otp-verification-top-header">
            <FaArrowLeft size={25} onClick={() => { setOtpSent(false); setOtp(new Array(6).fill("")); }} />
            OTP Verification
            <FaCircleExclamation size={25} />
          </div>

          <div className="otp-verification-text-verify">Verify your</div>
          <div className="otp-verification-text-phn">Phone number</div>
          <p className="otp-verification-text-p">Enter your OTP code here</p>

          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                className="otp-input"
                type="text"
                maxLength="1"
                key={index}
                value={data}
                id={`otp-input-${index}`}
                onChange={(e) => handleOTPChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          {verifyingOtp && <div style={{ marginTop: "30px" }}><TailSpin height={20} width={20} color="#ffffff" /></div>}
          <p className="resend-text">Didn't receive the code?</p>
          <button
            className={`resend-btn ${isResendDisabled ? 'disabled' : ''}`}
            onClick={!isResendDisabled ? sendOTP : null}
            disabled={isResendDisabled}
          >
            Resend new code {isResendDisabled && `in (${timer}s)`}
          </button>
        </div>
      )}
    </div>
  );
}

export default SignUpForm;
