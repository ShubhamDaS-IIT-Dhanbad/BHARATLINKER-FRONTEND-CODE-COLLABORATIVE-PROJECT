import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; import { FaArrowLeft } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';
import Cookies from 'js-cookie';

import { sendOtp, createSession, getShopData } from '../../../appWrite/shop/shop.js';
import { Oval } from 'react-loader-spinner';
import { ThreeDots } from 'react-loader-spinner';

const i1='https://res.cloudinary.com/demc9mecm/image/upload/v1737378112/vokh5op2d88jerrkksan.png';
const i2='https://res.cloudinary.com/demc9mecm/image/upload/v1737378115/d7xgicjpub5ag6udeisd.png';

import '../../style/shopLogin.css';
import '../../style/userLogin.css';


function LoginForm() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingVerification, setLoadingVerification] = useState(false);

    const [loadingPage, setLoadingPage] = useState(true);
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPhone(value.slice(0, 10));
    };

    useEffect(() => {
        let countdown;
        let pageLoadTimeout;
    
        if (timer > 0) {
          countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else {
          setIsResendDisabled(false);
        }
    
        // Simulate page load completion after 1 second
        pageLoadTimeout = setTimeout(() => {
          setLoadingPage(false);
    
          // Check shopData after setting loadingPage
          const shopData = Cookies.get('BharatLinkerShopData');
          if (shopData) {
            navigate('/retailer');
          }
        }, 1000);
    
        // Cleanup intervals and timeouts
        return () => {
          clearInterval(countdown);
          clearTimeout(pageLoadTimeout);
        };
      }, [timer, navigate]);

    const sendOTP = async () => {
        setLoading(true);
        try {
            const response = await sendOtp(phone);
            setUserId(response);
            setOtpSent(true);
            setIsResendDisabled(true);
            setTimer(30);
        } catch (err) {
            console.error(`Failed to send OTP: ${err.message}`);
            alert('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const verifyOTP = async (otpCode) => {
        setLoadingVerification(true);
        try {
            const sessionId = await createSession(userId, otpCode);
    
            const phoneNumber = `+91${phone}`;
            const shopData = await getShopData(phoneNumber);
    
            shopData.sessionId = sessionId;
            Cookies.set('BharatLinkerShopData', JSON.stringify(shopData), { expires: 7 });
    
            // Redirect based on registrationStatus
            if (shopData.registrationStatus === 'pending') {
                navigate('/retailer/pending');
            } else if (shopData.registrationStatus === 'rejected') {
                navigate('/retailer/rejected');
            } else {
                navigate('/retailer');
            }
        } catch (err) {
            console.error(`Failed to verify OTP: ${err.message}`);
            alert('Invalid OTP. Please try again.');
            setOtp(new Array(6).fill(''));
        } finally {
            setLoadingVerification(false);
        }
    };
    


    const handleOTPChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        let otpCopy = [...otp];
        otpCopy[index] = value;
        setOtp(otpCopy);

        if (value !== '' && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    // Trigger OTP verification when all fields are filled
    useEffect(() => {
        if (otp.every((digit) => digit !== '')) {
            verifyOTP(otp.join(''));
        }
    }, [otp]);




    const renderLoginForm = () => (
        <>
            <div className="retailer-login-top-header">
                <FaArrowLeft size={25} onClick={() => navigate('/')} className="retailer-login-back-arrow" />
                BHARAT | LINKER
            </div>
            <div className="retailer-login-div-parent">
                <div className="retailer-login-div" style={{ borderColor: 'rgb(3, 223, 193)' }}>Login</div>
                <div className="retailer-login-register-div" onClick={() => navigate('/retailer/register')}>Register</div>
            </div>
            <img className="retailer-login-img" src={i2} alt="Retailer Login" />
            <p className="retailer-signup-container-p">
                Add your phone number. We'll send you a verification code so we know you're real.
            </p>
            <div className="retailer-login-phone-input-container">
                <div className="country-code">
                    <img src={i1} alt="India Flag" className="flag-icon" />
                    <span style={{ color: 'black' }}>+91</span>
                </div>
                <input
                    type="number"
                    placeholder="Enter Mobile Number"
                    value={phone}
                    onChange={handlePhoneChange}
                />
            </div>
            <button
                className="retailer-login-send-otp-button"
                onClick={sendOTP}
                disabled={phone.length !== 10 || loading}
                style={{ backgroundColor: "rgb(3, 223, 193)" }}
            >
                {loading ? (
                    <Oval height={24} width={24} color="white" secondaryColor="gray" ariaLabel="loading" />
                ) : (
                    'SEND OTP'
                )}
            </button>
            <p className="retailer-login-terms-text">
                By providing my phone number, I hereby agree and accept the{' '}
                <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
            </p>
        </>
    );

    const renderOtpVerificationForm = () => (
        <div className="retailer-login-otp-verification">
            <div className="retailer-login-otp-verification-top-header">
                <FaArrowLeft
                    size={25}
                    onClick={() => {
                        setOtpSent(false);
                        setOtp(new Array(6).fill(''));
                    }}
                />
                OTP Verification
                <FaCircleExclamation size={25} />
            </div>
            <p className="retailer-login-otp-verification-text-p">Enter your OTP code here</p>
            <div className="otp-inputs">
                {otp.map((data, index) => (
                    <input
                        className="otp-input"
                        type="number"
                        maxLength="1"
                        key={index}
                        value={data}
                        id={`otp-input-${index}`}
                        onChange={(e) => handleOTPChange(e, index)}
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        aria-label={`OTP digit ${index + 1}`}
                    />
                ))}
            </div>
            {loadingVerification ? (
                <div className="loader-container" style={{ margin: "20px" }}>
                    <Oval height={24} width={24} color="rgb(3, 223, 193)" secondaryColor="gray" ariaLabel="loading" />
                </div>
            ) : (
                <>
                    <p className="resend-text">Didn't receive the code?</p>
                    <button
                        className={`retailer-login-resend-btn ${isResendDisabled ? 'disabled' : ''}`}
                        onClick={!isResendDisabled ? sendOTP : null}
                        disabled={isResendDisabled}
                    >
                        Resend new code {isResendDisabled && `in (${timer}s)`}
                    </button>
                </>
            )}
        </div>
    );


    const Loader = () => (
        <div className="retailer-routes-loading">
            <ThreeDots size={20} color="#EB3678" />
        </div>
    );
  
    return (
        <div className="retailer-login">
            {otpSent ? renderOtpVerificationForm() : renderLoginForm()}
        </div>
    );
}

export default LoginForm;
