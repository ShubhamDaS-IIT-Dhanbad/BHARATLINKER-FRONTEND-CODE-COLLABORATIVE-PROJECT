import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import i1 from './indian-flag.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Client, Account, ID } from 'appwrite';
import { FaArrowLeft } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import Cookies from 'js-cookie'
import {fetchUserByPhoneNumber} from '../../appWrite/userData/userData.js';
function SignUpForm() {
  const navigate = useNavigate();

  const [mob, setMob] = useState(true);
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

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleOTPChange =async (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);
   account.deleteSession('current');

    if (element.value === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    } else if (element.value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    const otpCode = newOtp.join('');
    if (otpCode.length === 6) {
      verifyOTP(otpCode); // Pass the complete OTP code to verifyOTP
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      event.preventDefault(); // Prevent the default backspace behavior
      const newOtp = [...otp];
      if (newOtp[index] === "") {
        // If the current input is empty, focus on the previous input
        if (index > 0) {
          document.getElementById(`otp-input-${index - 1}`).value=''
          document.getElementById(`otp-input-${index - 1}`).focus();
        }
      } else {
        // Clear the current input
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => clearInterval(countdown);
  }, [timer]);
  
  const sendOTP = async () => {
    try {
      const token = await account.createPhoneToken(ID.unique(), `+91${phone}`);
      setUserId(token.userId);
      setOtpSent(true);
      setIsResendDisabled(true);
      setTimer(30);
    } catch (error) {
      toast.error(`Failed to send SMS: ${error.message}`);
    }
  };

  const verifyOTP = async (otpCode) => {
    const loadingToast = toast.loading('Verifying OTP...');
    try {
      // Verify OTP and create a session
      const session = await account.createSession(userId, otpCode);
      toast.dismiss(loadingToast);
      toast.success('Phone verified successfully!');
      
      console.log('OTP verified, session created:', session);
  
      // Extract $id and userId and store them in a cookie
      const sessionData = {
        $id: session.$id,
        userId: session.userId,
        phn: phone,
      };
  
      Cookies.set('BharatLinkerUser', JSON.stringify(sessionData), { expires: 7, path: '' });
  
      // Fetch user data by phone number
      const userData = await fetchUserByPhoneNumber(phone);
  
      if (userData) {
        Cookies.set('BharatLinkerUserData', JSON.stringify(userData), { expires: 7, path: '' });
        console.log('User data fetched and stored:', userData);
      } else {
        console.warn('No user data found for the provided phone number');
      }
  
      navigate('/');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to verify OTP: ${error.message}`);
      setOtp(new Array(6).fill(""));
    }
  };
  
  

  return (
    <>
      {mob ? (
        <div className="signup-container">
          {!otpSent ? (
            <>
              <div className="login-verification-top-header">
                <FaArrowLeft size={25} onClick={() => navigate('/')} style={{ position: "fixed", left: "10px" }} />
                Bharat | Linker
              </div>

              <div className="signup-container-text">
                <div>Sign up to keep</div>
                <div style={{ marginTop: "-7px" }}>discovering the best your locality</div>
                <div style={{ marginTop: "-7px" }}>has to offer!</div>
              </div>

              <div className="signup-container-p">
                Add your phone number. We'll send you a verification code so we know you're real.
              </div>

              <div className="phone-input-container">
                <div className="country-code">
                  <img src={i1} alt="India Flag" className="flag-icon" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength="10"
                />
              </div>

              <button className="send-otp-button" onClick={sendOTP}>
                SEND OTP
              </button>

              <p className="terms-text">
                By providing my phone number, I hereby agree and accept the{' '}
                <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a> in use of this app.
              </p>
            </>
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
                    type="number"
                    maxLength="1"
                    key={index}
                    value={data}
                    id={`otp-input-${index}`}
                    onChange={(e) => handleOTPChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e, index)} // Add keydown handler
                  />
                ))}
              </div>
              <p className="resend-text">Didn't receive the code?</p>
              <div
                className={`resend-btn ${isResendDisabled ? 'disabled' : ''}`}
                onClick={!isResendDisabled ? sendOTP : null}
                disabled={isResendDisabled}
              >
                Resend new code {isResendDisabled && `in (${timer}s)`}
              </div>
            </div>
          )}

          <ToastContainer />
        </div>
      ) : (
        <div className="alternative-container">
          <h2>Please use a mobile device to sign up.</h2>
        </div>
      )}
    </>
  );
}

export default SignUpForm;
