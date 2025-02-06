import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { sendOTP, verifyOTP, loginUserWithPassword } from '../../supaBase/userAuth.js';
import Cookies from 'js-cookie';import { IoCloseCircleOutline } from "react-icons/io5";
import './style/userLogin.css';
import { AiOutlineLogin } from "react-icons/ai";
import { GoChevronLeft } from "react-icons/go";
import i1 from './asset/lll.png';

function SignUpForm() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [passwordDigits, setPasswordDigits] = useState(new Array(5).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loginWithPassword, setLoginWithPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userData = Cookies.get('BharatLinkerUserData');
    if (userData) {navigate('/user');}
  }, [navigate]);
  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [timer, otpSent]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendOTP = async () => {
    if (phone.length !== 10) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await sendOTP(`+91${phone}`);
      setOtpSent(true);
      setIsResendDisabled(true);
      setTimer(30);
      setOtp(new Array(6).fill(""));
    } catch (error) {
      setErrorMessage('Failed to send OTP. Try again.');
      console.error(`Failed to send OTP: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.join('').length !== 6) return;
    setVerifyingOtp(true);
    setErrorMessage('');
    try {
      const response = await verifyOTP(phone, otp.join(''));
      if (response  && response.data.user.aud == "authenticated") {
        Cookies.set('BharatLinkerUserData', JSON.stringify(response.data.user.user_metadata), {
          expires: 60, // Store for 60 days
          secure: true,
          sameSite: 'Strict'
      });
      

        console.log('OTP verified successfully:', response.session);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      setErrorMessage('Invalid OTP. Please try again.');
      setOtp(new Array(6).fill(''));
      console.error('OTP verification failed:', error);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleLoginWithPassword = async () => {
    if (phone.length !== 10 || passwordDigits.some(d => d === "")) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await loginUserWithPassword({ phone: `+91${phone}`, password: passwordDigits.join('') });
      if (response  && response.data.user.aud == "authenticated") {
        // Store session details in cookies for 60 days
        Cookies.set('BharatLinkerUserData', JSON.stringify(response.data.user.user_metadata), {
          expires: 60, // Store for 60 days
          secure: true,
          sameSite: 'Strict'
      });
      

        console.log('OTP verified successfully:', response.session);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      setErrorMessage('Invalid phone number or password');
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = useCallback((e, index) => {
    const value = e.target.value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
    else if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  }, [otp]);

  const handleDigitChange = useCallback((e, index) => {
    const value = e.target.value.slice(-1);
    const newDigits = [...passwordDigits];
    newDigits[index] = value;
    setPasswordDigits(newDigits);
    if (value && index < 4) {
      document.getElementById(`pw-input-${index + 1}`).focus();
    }
    else if (!value && index > 0) {
      document.getElementById(`pw-input-${index - 1}`).focus();
    }
  }, [passwordDigits]);

  return (
    <>
      {!otpSent ? (
        <div className='auth-form-container'>
          <div className='auth-form-container-back-container' onClick={() => { navigate('/') }}>
            <GoChevronLeft size={25} />
          </div>
          <div className='auth-form-container-u1'>
            <img src={i1} />
            <div className="user-login-container-text">
              <div style={{ marginTop: "-1px" }}>SIGN UP TO KEEP</div>
              <div style={{ marginTop: "-7px" }}>DISCOVERING THE BEST YOUR</div>
              <div style={{ marginTop: "-7px" }}>COMMUNITY HAS TO OFFER!</div>
            </div>
          </div>

          <div className='phone-input-container'>
            <div className='country-code-pill'>
              <span>+91</span>
            </div>
            <input
              type='number'
              className='premium-input'
              placeholder='Enter mobile number'
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength='10'
            />
          </div>

          {!loginWithPassword ? (
            <>
              <button
                className='premium-button primary'
                onClick={handleSendOTP}
                disabled={loading || phone.length !== 10}
              >
                {loading ? <TailSpin height={24} width={24} color='#ffffff' /> : 'SEND OTP'}
              </button>
              <p className='user-login-terms'>By continuing, you agree to our terms of service & Privcy Policy</p>
              <p className='auth-alternate-action' onClick={() => setLoginWithPassword(true)}>
                  Login with Password instead <AiOutlineLogin size={22} />
              </p>
            </>
          ) : (
            <>
              <div className='password-inputs'>
                {passwordDigits.map((_, index) => (
                  <input
                    key={index}
                    id={`pw-input-${index}`}
                    type='number'
                    className='digit-input'
                    maxLength='1'
                    value={passwordDigits[index]}
                    onChange={(e) => handleDigitChange(e, index)}
                  />
                ))}
              </div>
              
               <button
                className='premium-button primary'
                onClick={handleLoginWithPassword}
                disabled={loading || phone.length !== 10 || passwordDigits.some(d => d === "")}
              >
                {loading ? <TailSpin height={24} width={24} color='#ffffff' /> : 'LOG IN'}
              </button>
              <p className='user-login-terms'>By continuing, you agree to our terms of service & Privcy Policy</p>
              <p className='auth-alternate-action' onClick={() => setLoginWithPassword(false)}>
                Login via OTP instead <AiOutlineLogin size={22} />
              </p>
            </>
          )}
          {errorMessage && <div className="premium-error-message" onClick={()=>{setErrorMessage(false)}}>{errorMessage} < IoCloseCircleOutline size={20} /></div>}
        </div>
      ) : (
        <div className='otp-auth-form-container'>

          <div className='otp-header'>
            <div className='auth-form-container-back-container' onClick={() => setOtpSent(false)}>
              <GoChevronLeft size={30} />
            </div>
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
              />
            ))}
          </div>

          <button
            className='premium-button primary'
            onClick={handleVerifyOTP}
            disabled={verifyingOtp || otp.join('').length !== 6}
          >
            {verifyingOtp ? <TailSpin height={24} width={24} color='#ffffff' /> : 'Verify & Continue'}
          </button>

          {isResendDisabled && <div className='resend-otp'>
            <button
              className={`otp-premium-button secondary ${isResendDisabled ? 'disabled' : ''}`}
              onClick={handleSendOTP}
              disabled={isResendDisabled}
            >
              Resend OTP {isResendDisabled && `(${timer}s)`}
            </button>
          </div>
          }
          {errorMessage && <div className="premium-error-message" onClick={()=>{setErrorMessage(false)}}>{errorMessage} < IoCloseCircleOutline size={20} /></div>}
        </div>
        
      )}
    </>
  );
}

export default SignUpForm;