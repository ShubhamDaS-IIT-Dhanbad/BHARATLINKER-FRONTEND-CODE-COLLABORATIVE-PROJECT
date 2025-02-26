import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { sendOTP, verifyOTP, verifyPassword } from '../../appWrite/shop/shopAuth.js';
import Cookies from 'js-cookie';
import { IoCloseCircleOutline } from "react-icons/io5";
import { GoChevronLeft } from "react-icons/go";
import i1 from './asset/r1.png';
import './style/login.css';

function SignUpForm() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [usePassword, setUsePassword] = useState(true); // Password default
  const [loading, setLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else if (otpSent && timer === 0) {
      setIsResendDisabled(false);
    }
  }, [timer, otpSent]);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setErrorMessage('Phone number must be 10 digits');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const userId = await sendOTP();
      if (userId) {
        setUserId(userId);
        setOtpSent(true); // Only set after success
        setIsResendDisabled(true);
        setTimer(30);
        setOtp(new Array(6).fill(""));
      } else {
        setErrorMessage('Failed to send OTP. Try again.');
      }
    } catch (error) {
      setErrorMessage('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.join('').length !== 6) {
      setErrorMessage('OTP must be 6 digits');
      return;
    }
    setVerifyingOtp(true);
    setErrorMessage('');
    try {
      const { session, shopData } = await verifyOTP(userId, otp.join(''), `91${phone}`);
      setCookiesAndNavigate(session, shopData);
    } catch {
      setErrorMessage('Invalid OTP. Please try again.');
      setOtp(new Array(6).fill(''));
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (phone.length !== 10) {
      setErrorMessage('Phone number must be 10 digits');
      return;
    }
    if (password.length !== 6) {
      setErrorMessage('Password must be 6 digits');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const shopPhoneNumber = `91${phone}`;
      const { session, shopData } = await verifyPassword(shopPhoneNumber, password);
      setCookiesAndNavigate(session, shopData);
    } catch {
      setErrorMessage('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setCookiesAndNavigate = (session, shopData) => {
    Cookies.set("BharatLinkerShopData", JSON.stringify({
      shopId: shopData.$id,
      uId: session?.userId || null,
      id: session?.$id || null,
      shopName: shopData?.shopName || null,
      shopDescription: shopData?.shopDescription || null,
      shopLatitude: shopData?.shopLatitude || null,
      shopLongitude: shopData?.shopLongitude || null,
      shopPhoneNumber: shopData.shopPhoneNumber,
      shopAddress: shopData?.shopAddress,
      isShopOpen: shopData?.isShopOpen,
      shopNumber: shopData?.shopNumber,
      buildingName: shopData?.buildingName,
      landMark: shopData?.landMark || null,
      shopImages: shopData?.shopImages,
      shopKeywords: shopData?.shopKeywords,
      shopCustomerCare: shopData?.shopCustomerCare,
      shopEmail: shopData?.shopEmail,
      shopRegistrationStatus:shopData?.shopRegistrationStatus
    }), { expires: 7, secure: true });
    navigate('/secure/shop');
  };

  const handleOtpChange = useCallback((e, index) => {
    const value = e.target.value.slice(-1);
    setOtp(prevOtp => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    } else if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  }, []);

  return (
    <>
      {!usePassword && !otpSent ? (
        <div className='shop-login-auth-form-container'>
          <div className='shop-login-auth-form-container-back-container' onClick={() => navigate('/')}> 
            <GoChevronLeft size={25} /> 
          </div>

          <div className='shop-login-auth-form-container-u1'>
            <img src={i1} alt='Illustration' />
            <div className="shop-login-user-login-container-text">
              <div>SIGN UP TO KEEP</div>
              <div>DISCOVERING THE BEST YOUR</div>
              <div>COMMUNITY HAS TO OFFER!</div>
            </div>
          </div>

          <div className='shop-login-phone-input-container'>
            <div className='shop-login-country-code-pill'><span>+91</span></div>
            <input
              type='number'
              className='shop-login-premium-input'
              placeholder='Enter mobile number'
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
              maxLength='10'
            />
          </div>

          <button 
            className='shop-login-premium-button shop-login-primary' 
            onClick={handleSendOTP} 
            disabled={loading || phone.length !== 10}
          >
            {loading ? <TailSpin height={24} width={24} color='#ffffff' /> : 'SEND OTP'}
          </button>

          <div
            className='shop-login-sendotppassword' 
            onClick={() => setUsePassword(true)}
          >
            USE PASSWORD INSTEAD
          </div>

          {errorMessage && (
            <div className="shop-login-premium-error-message">
              {errorMessage} <IoCloseCircleOutline size={20} onClick={() => setErrorMessage('')} />
            </div>
          )}
        </div>
      ) : usePassword ? (
        <div className='shop-login-auth-form-container'>
          <div className='shop-login-auth-form-container-back-container' onClick={() => navigate('/')}> 
            <GoChevronLeft size={25} /> 
          </div>

          <div className='shop-login-auth-form-container-u1'>
            <div className='shop-login-auth-form-container-u1-img'>
              <img src={i1} alt='Illustration' />
            </div>
            <div className="shop-login-user-login-container-text">
              <div>SIGN UP TO EXPLORING</div>
              <div>BOOMS IN THE WORLD OF</div>
              <div>E-COMMERCE!</div>
            </div>
          </div>

          <div className='shop-login-phone-input-container'>
            <div className='shop-login-country-code-pill'><span>+91</span></div>
            <input
              type='number'
              className='shop-login-premium-input'
              placeholder='Enter mobile number'
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
              maxLength='10'
            />
          </div>

          <div className='shop-login-phone-input-container'>
            <input
              type='number'
              className='shop-login-premium-input'
              placeholder='Enter 6-digit password'
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              maxLength='6'
            />
          </div>

          <button 
            className='shop-login-premium-button shop-login-primary' 
            onClick={handlePasswordLogin}
            disabled={loading || password.length !== 6 || phone.length !== 10}
          >
            {loading ? <TailSpin height={24} width={24} color='#ffffff' /> : 'LOGIN'}
          </button>

          <div
            className='shop-login-sendotppassword' 
            onClick={() => {
              setUsePassword(false); // Switch to OTP flow
              // Don't set otpSent here; let handleSendOTP handle it
            }}
          >
            FORGOT PASSWORD? USE OTP
          </div>

          {errorMessage && (
            <div className="shop-login-premium-error-message">
              {errorMessage} <IoCloseCircleOutline size={20} onClick={() => setErrorMessage('')} />
            </div>
          )}
        </div>
      ) : (
        <div className='shop-login-otp-auth-form-container'>
          <div className='shop-login-otp-header'>
            <div className='shop-login-auth-form-container-back-container' onClick={() => {
              setOtpSent(false);
              setUsePassword(true);
            }}> 
              <GoChevronLeft size={30} /> 
            </div>
            <h3 className='shop-login-otp-title'>OTP Verification</h3>
          </div>

          <p className='shop-login-otp-instruction'>Enter the 6-digit code sent to +91 {phone}</p>
          
          <div className='shop-login-otp-input-group'>
            {otp.map((_, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type='number'
                className='shop-login-otp-digit-input'
                maxLength='1'
                value={otp[index]}
                onChange={(e) => handleOtpChange(e, index)}
                inputMode="numeric"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button 
            className='shop-login-premium-button shop-login-primary' 
            onClick={handleVerifyOTP} 
            disabled={verifyingOtp || otp.join('').length !== 6}
          >
            {verifyingOtp ? <TailSpin height={24} width={24} color='#ffffff' /> : 'Verify & Continue'}
          </button>

          {isResendDisabled ? (
            <div className='shop-login-resend-otp'>
              <button 
                className='shop-login-otp-premium-button shop-login-secondary' 
                disabled={isResendDisabled}
              >
                Resend OTP ({timer}s)
              </button>
            </div>
          ) : (
            <button 
              className='shop-login-otp-premium-button shop-login-secondary' 
              onClick={handleSendOTP}
            >
              Resend OTP
            </button>
          )}

          {errorMessage && (
            <div className="shop-login-premium-error-message">
              {errorMessage} <IoCloseCircleOutline size={20} onClick={() => setErrorMessage('')} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SignUpForm;