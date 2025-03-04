import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { isShopExist, sendOTP, verifyOTP } from '../../../appWrite/shop/shopAuth.js';
import { registerShop } from '../../../appWrite/shop/shopData.js';
import Cookies from 'js-cookie';
import { IoCloseCircleOutline } from "react-icons/io5";
import { GoChevronLeft } from "react-icons/go";
import sd from '../asset/sd.png';
import './login.css';

const SignUpForm = React.memo(({ setPage }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopPassword, setShopPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState({
    userId: null,
    otp: Array(6).fill(""),
    otpSent: false,
    loading: false,
    verifyingOtp: false,
    timer: 30,
    isResendDisabled: true,
    errorMessage: ''
  });

  useEffect(() => {
    let countdown;
    if (state.otpSent && state.timer > 0) {
      countdown = setInterval(() => setState(s => ({ ...s, timer: s.timer - 1 })), 1000);
    } else if (state.otpSent && state.timer === 0) {
      setState(s => ({ ...s, isResendDisabled: false }));
    }
    return () => clearInterval(countdown);
  }, [state.otpSent, state.timer]);

  const handleSendOTP = useCallback(async () => {
    if (phoneNumber.length !== 10) {
      return setState(s => ({ ...s, errorMessage: 'Phone number must be 10 digits' }));
    }
    if (!shopName) {
      return setState(s => ({ ...s, errorMessage: 'Shop name is required' }));
    }
    if (shopPassword.length !== 6) {
      return setState(s => ({ ...s, errorMessage: 'Password must be 6 digits' }));
    }
    if (shopPassword !== confirmPassword) {
      return setState(s => ({ ...s, errorMessage: 'Passwords do not match' }));
    }

    setState(s => ({ ...s, loading: true, errorMessage: '' }));
    try {
      const shopExists = await isShopExist(`91${phoneNumber}`);
      if (shopExists) {
        setState(s => ({ ...s, errorMessage: 'Shop already exists with this phone number' }));
        return;
      }

      const userId = await sendOTP(`+91${phoneNumber}`);
      if (userId) {
        setState(s => ({
          ...s,
          userId,
          otpSent: true,
          isResendDisabled: true,
          timer: 30,
          otp: Array(6).fill("")
        }));
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      setState(s => ({ ...s, errorMessage: 'Failed to send OTP. Try again.' }));
    } finally {
      setState(s => ({ ...s, loading: false }));
    }
  }, [phoneNumber, shopName, shopPassword, confirmPassword]);

  const handleVerifyOTP = useCallback(async () => {
    if (state.otp.join('').length !== 6) {
      return setState(s => ({ ...s, errorMessage: 'OTP must be 6 digits' }));
    }
    setState(s => ({ ...s, verifyingOtp: true, errorMessage: '' }));
    try {
      const { session } = await verifyOTP(state.userId, state.otp.join(''), `91${phoneNumber}`);
      
      const shopData = await registerShop(phoneNumber, shopPassword, shopName);
      
      if (shopData) {
        setCookiesAndNavigate(session, shopData);
      } else {
        throw new Error('Shop registration failed');
      }
    } catch (error) {
      setState(s => ({ 
        ...s, 
        errorMessage: error.message || 'Invalid OTP or registration failed. Please try again.',
        otp: Array(6).fill('')
      }));
    } finally {
      setState(s => ({ ...s, verifyingOtp: false }));
    }
  }, [state.userId, state.otp, phoneNumber, shopPassword, shopName]);

  const setCookiesAndNavigate = useCallback((session, shopData) => {
    Cookies.set("BharatLinkerShopData", JSON.stringify({
      shopId: shopData.$id,
      uId: session?.userId,
      id: session?.$id,
      shopName: shopData?.shopName,
      shopPhoneNumber: shopData.phoneNumber,
      shopRegistrationStatus: 'pending'
    }), { expires: 7, secure: true });
    navigate('/secure/shop');
  }, [navigate]);

  const handleOtpChange = useCallback((e, index) => {
    const value = e.target.value.slice(-1);
    setState(s => {
      const newOtp = [...s.otp];
      newOtp[index] = value;
      return { ...s, otp: newOtp };
    });
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    } else if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  }, []);

  const handlePhoneChange = useCallback((e) => {
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(inputValue);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    setShopPassword(inputValue);
  }, []);

  const handleConfirmPasswordChange = useCallback((e) => {
    const inputValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    setConfirmPassword(inputValue);
  }, []);

  const renderInputForm = useCallback(() => {
    if (!state.otpSent) {
      return (
        <>
          <h1 className="shop-login-main-title">Open online shop, Shopkeeper!</h1>
          <p className="shop-login-main-subtitle" style={{ marginTop: "-10px" }}>
            Register your shop in Bharat Linker, show that all your area customers can
            see your shop online!
          </p>
          <div className='shop-login-phone-input-container' style={{ marginTop: "40px" }}>
            <input
              type='text'
              className='shop-login-premium-input'
              placeholder='Enter shop name'
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className='shop-login-phone-input-container' style={{ marginTop: "0px" }}>
            <div className='shop-login-country-code-pill'><span>+91</span></div>
            <input
              type='text'
              className='shop-login-premium-input'
              placeholder='Enter mobile number'
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
            />
          </div>
          <div className='shop-login-phone-input-container' style={{ marginTop: "0px" }}>
            <input
              type='password'
              className='shop-login-premium-input'
              placeholder='Enter 6-digit password'
              value={shopPassword}
              onChange={handlePasswordChange}
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
            />
          </div>
          <div className='shop-login-phone-input-container' style={{ marginTop: "0px" }}>
            <input
              type='password'
              className='shop-login-premium-input'
              placeholder='Confirm 6-digit password'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
            />
          </div>
          <ActionButton 
            onClick={handleSendOTP} 
            disabled={
              state.loading || 
              phoneNumber.length !== 10 || 
              shopPassword.length !== 6 || 
              !shopName || 
              shopPassword !== confirmPassword
            } 
            text="SEND OTP" 
          />
        </>
      );
    }

    return (
      <div className='shop-login-otp-auth-form-container'>
        <div className='shop-login-otp-header'>
          <div 
            className='shop-login-auth-form-container-back-container'
            onClick={() => setState(s => ({ ...s, otpSent: false }))}
          >
            <GoChevronLeft size={30} />
          </div>
          <h3 className='shop-login-otp-title'>OTP Verification</h3>
        </div>
        <p className='shop-login-otp-instruction'>
          Enter the 6-digit code sent to +91 {phoneNumber}
        </p>
        <div className='shop-login-otp-input-group'>
          {state.otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-input-${i}`}
              type='number'
              className='shop-login-otp-digit-input'
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(e, i)}
              inputMode="numeric"
              autoFocus={i === 0 && state.otpSent}
            />
          ))}
        </div>
        <ActionButton
          onClick={handleVerifyOTP}
          disabled={state.verifyingOtp || state.otp.join('').length !== 6}
          text="Verify & Continue"
        />
        {state.isResendDisabled ? (
          <div className='shop-login-resend-otp'>
            <button 
              className='shop-login-otp-premium-button shop-login-secondary' 
              disabled
            >
              Resend OTP ({state.timer}s)
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
      </div>
    );
  }, [
    state, 
    phoneNumber, 
    shopName, 
    shopPassword, 
    confirmPassword, 
    handleSendOTP, 
    handleVerifyOTP, 
    handleOtpChange
  ]);

  const ActionButton = React.memo(({ onClick, disabled, text }) => (
    <button
      className='shop-login-premium-button shop-login-primary'
      onClick={onClick}
      disabled={disabled}
    >
      {(state.loading || state.verifyingOtp) && text !== "Resend OTP" ? (
        <TailSpin height={24} width={24} color='#ffffff' />
      ) : (
        text
      )}
    </button>
  ));

  return (
    <div className="shop-login-main-default-content">
      <div className='shop-login-auth-form-container-back-container' 
          onClick={() => setPage('default')}  >
        <GoChevronLeft 
          size={25} 
        />
      </div>
      <div className="shop-login-jmain-rocket-image-c">
        <img src={sd} alt="Rocket" className="shop-login-main-rocket-image" />
      </div>
      {renderInputForm()}
      {state.errorMessage && (
        <div className="shop-login-premium-error-message">
          {state.errorMessage}
          <IoCloseCircleOutline
            size={20}
            onClick={() => setState(s => ({ ...s, errorMessage: '' }))}
          />
        </div>
      )}
    </div>
  );
});

export default SignUpForm;