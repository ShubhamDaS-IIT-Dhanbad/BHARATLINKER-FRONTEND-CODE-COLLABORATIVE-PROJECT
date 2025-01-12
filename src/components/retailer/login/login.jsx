import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; // Import the skeleton loader component
import { FaArrowLeft } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';
import Cookies from 'js-cookie';

import { sendOtp, createSession, getShopData, clearUserSessions } from '../../../appWrite/shop/shop.js';
import { Oval } from 'react-loader-spinner'; // Import the loader
import './login.css';
import i1 from '../../../assets/indian-flag.png';
import i2 from './i1.png';

function LoginForm() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false); // State to track loading status
    const [loadingVerification, setLoadingVerification] = useState(false); // Loading state for OTP verification
    const [isContentLoading, setIsContentLoading] = useState(true); // To track if the content is loading

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numeric values
        setPhone(value.slice(0, 10)); // Limit to 10 digits
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

    const sendOTP = async () => {
        setLoading(true); // Start loading
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
        setLoadingVerification(true); // Start verification loading
        try {
            await clearUserSessions();
            await createSession(userId, otpCode);

            const phoneNumber = `+91${phone}`;
            const shopData = await getShopData(phoneNumber);

            Cookies.set('BharatLinkerShopData', JSON.stringify(shopData), { expires: 7 });
            navigate('/');
        } catch (err) {
            console.error(`Failed to verify OTP: ${err.message}`);
            alert('Invalid OTP. Please try again.');
            setOtp(new Array(6).fill(''));
        } finally {
            setLoadingVerification(false); // Stop verification loading
        }
    };

    const handleOTPChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Ensure only numeric input
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
            verifyOTP(otp.join('')); // Join the OTP array into a string and verify
        }
    }, [otp]);

    useEffect(() => {
        // Simulate content loading (e.g., fetch shop data, etc.)
        const timer = setTimeout(() => {
            setIsContentLoading(false); // Content has finished loading
        }, 1000); // Simulating a 2-second delay for demo
        return () => clearTimeout(timer);
    }, []);

    const renderSkeletonLoader = () => (
        <div className='retailer-login-img-skleton-container'>
            <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <Skeleton className='retailer-login-img-react-skeleton' height={50} count={1} />
            </SkeletonTheme>
        </div>
    );

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
            {isContentLoading ? renderSkeletonLoader() : <img className="retailer-login-img" src={i2} alt="Retailer Login" />}
            <p className="retailer-signup-container-p">
                Add your phone number. We'll send you a verification code so we know you're real.
            </p>
            <div className="retailer-login-phone-input-container">
                <div className="country-code">
                    <img src={i1} alt="India Flag" className="flag-icon" />
                    <span style={{ color: 'black' }}>+91</span>
                </div>
                <input
                    type="text"
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
                        type="text"
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

    return (
        <div className="retailer-login">
            {otpSent ? renderOtpVerificationForm() : renderLoginForm()}
        </div>
    );
}

export default LoginForm;
