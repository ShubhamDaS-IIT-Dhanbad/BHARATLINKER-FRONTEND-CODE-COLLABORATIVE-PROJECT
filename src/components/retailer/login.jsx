import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { sendOTP, verifyOTP } from '../../appWrite/shop/shopAuth.js';
import Cookies from 'js-cookie';
import { IoCloseCircleOutline } from "react-icons/io5";
import { GoChevronLeft } from "react-icons/go";
import i1 from './asset/lll.png';
import '../user/style/userLogin.css';

function SignUpForm() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (Cookies.get('BharatLinkerShopData')) navigate('/shop');
  }, []);

  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer, otpSent]);

  const handleSendOTP = async () => {
    if (phone.length !== 10) return; 
    setLoading(true);
    setErrorMessage(''); 
    try {
      // const userId = await sendOTP(`+91${phone}`) ;
      if (userId || 1) {
        setUserId(userId);
        setOtpSent(true);
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
    if (otp.join('').length !== 6) return;
    setVerifyingOtp(true);
    setErrorMessage('');
    try {
      const { session, shopData } = await verifyOTP(userId, otp.join(''), `91${phone}`);
      const parsedAddress = Array.isArray(shopData.address)
        ? shopData.address.map(addr => {
          try {
            const [latitude, longitude, address] = addr.split('@').map(val => val.trim());
            return {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              address: address
            };
          } catch (error) {
            console.error("Error parsing address:", error);
            return null;
          }
        }).filter(Boolean)
        : [];

      Cookies.set("BharatLinkerShopData", JSON.stringify({
        shopId: shopData.$id,
        uId: session?.userId || "90",
        id: session?.$id || "90",
        phoneNumber: phone,
        address: parsedAddress,
        shopName: shopData.shopName
      }), { expires: 7, secure: true });
      navigate('/user');
    } catch {
      setErrorMessage('Invalid OTP. Please try again.');
      setOtp(new Array(6).fill(''));
    } finally {
      setVerifyingOtp(false);
    }
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
      {!otpSent ? (
        <div className='auth-form-container'>
          <div className='auth-form-container-back-container' onClick={() => navigate('/')}> <GoChevronLeft size={25} /> </div>
          <div className='auth-form-container-u1'>
            <img src={i1} alt='Illustration' />
            <div className="user-login-container-text">
              <div>SIGN UP TO KEEP</div>
              <div>DISCOVERING THE BEST YOUR</div>
              <div>COMMUNITY HAS TO OFFER!</div>
            </div>
          </div>

          <div className='phone-input-container'>
            <div className='country-code-pill'><span>+91</span></div>
            <input
              type='number'
              className='premium-input'
              placeholder='Enter mobile number'
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength='10'
            />
          </div>

          <button className='premium-button primary' onClick={handleSendOTP} disabled={loading || phone.length !== 10}>
            {loading ? <TailSpin height={24} width={24} color='#ffffff' /> : 'SEND OTP'}
          </button>
          <p className='user-login-terms'>By continuing, you agree to our terms of service & Privacy Policy</p>
          {errorMessage && <div className="premium-error-message">{errorMessage} <IoCloseCircleOutline size={20} /></div>}
        </div>
      ) : (
        <div className='otp-auth-form-container'>
          <div className='otp-header'>
            <div className='auth-form-container-back-container' onClick={() => setOtpSent(false)}> <GoChevronLeft size={30} /> </div>
            <h3 className='otp-title'>OTP Verification</h3>
          </div>

          <p className='otp-instruction'>Enter the 6-digit code sent to +91 {phone}</p>
          {errorMessage && <div className="premium-error-message">{errorMessage}</div>}

          <div className='otp-input-group'>
            {otp.map((_, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type='number'
                className='otp-digit-input'
                maxLength='1'
                value={otp[index]}
                onChange={(e) => handleOtpChange(e, index)}
                inputMode="numeric"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button className='premium-button primary' onClick={handleVerifyOTP} disabled={verifyingOtp || otp.join('').length !== 6}>
            {verifyingOtp ? <TailSpin height={24} width={24} color='#ffffff' /> : 'Verify & Continue'}
          </button>

          {isResendDisabled && (
            <div className='resend-otp'>
              <button className='otp-premium-button secondary' onClick={handleSendOTP} disabled={isResendDisabled}>
                Resend OTP {isResendDisabled && `(${timer}s)`}
              </button>
            </div>
          )}
          {errorMessage && <div className="premium-error-message">{errorMessage} <IoCloseCircleOutline size={20} /></div>}
        </div>
      )}
    </>
  );
}

export default SignUpForm;