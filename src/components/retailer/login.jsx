import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';
import Cookies from 'js-cookie';

import { sendOtp, createSession, getShopData } from '../../appWrite/shop/shop.js';
import { Oval } from 'react-loader-spinner';

import OTPInput from 'react-otp-input';
import { ErrorPopup } from './popups/popUp.jsx';

import '../style/shopLogin.css';
import '../style/userLogin.css';
import './style/auth.css'

const i2 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737378115/d7xgicjpub5ag6udeisd.png';

function LoginForm() {
    const navigate = useNavigate();
    const [phoneOrEmail, setPhoneOrEmail] = useState('');
    const [isEmail, setIsEmail] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState();
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingVerification, setLoadingVerification] = useState(false);
    const [error, setError] = useState(null); // Error handling state

    const handlePhoneOrEmailChange = (e) => {
        const value = e.target.value;
        setPhoneOrEmail(value);
        if (value.includes('@')) {
            setIsEmail(true);
        } else {
            setIsEmail(false);
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

    const sendOTP = async () => {
        setLoading(true);
        try {
            const isPhone = /^\d{10}$/.test(phoneOrEmail);
            const isEmail = /\S+@\S+\.\S+/.test(phoneOrEmail);

            if (!isPhone && !isEmail) {
                alert("Please enter a valid phone number or email.");
                setLoading(false);
                return;
            }

            const response = isPhone
                ? await sendOtp(phoneOrEmail)
                : await sendOtp(phoneOrEmail, true);

            setUserId(response);
            setOtpSent(true);
            setIsResendDisabled(true);
            setTimer(30);
            setError(null); // Reset any error when OTP is sent
        } catch (error) {
            console.error(`Failed to send OTP: ${error.message}`);
            alert('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (otpCode) => {
        setLoadingVerification(true);
        try {
            const isPhone = /^\d{10}$/.test(phoneOrEmail);
            const sessionId = await createSession(userId, otpCode);
            const contact = isPhone ? `+91${phoneOrEmail}` : phoneOrEmail;
            const shopData = await getShopData(contact);

            shopData.sessionId = sessionId;
            Cookies.set('BharatLinkerShopData', JSON.stringify(shopData), { expires: 7 });

            if (shopData.registrationStatus === 'pending') {
                navigate('/retailer/pending');
            } else if (shopData.registrationStatus === 'rejected') {
                navigate('/retailer/rejected');
            } else if (shopData.registrationStatus === 'approved') {
                navigate('/retailer');
            }
        } catch (err) {
            console.error(`Failed to verify OTP: ${err.message}`);
            setError("Shop with this phone/email already exists.");
            setOtp(new Array(6).fill('')); // Reset OTP input on error
        } finally {
            setLoadingVerification(false);
        }
    };

    const renderLoginForm = () => (
        <div className="retailer-login">
            <div className="retailer-login-top-header">
                <FaArrowLeft size={25} onClick={() => navigate('/')} className="retailer-login-back-arrow" />
                BHARAT | LINKER
            </div>
            <div className="retailer-login-div-parent">
                <div className="retailer-login-div" style={{ borderColor: 'rgb(3, 223, 193)' }}>Login</div>
                <div className="retailer-login-register-div" onClick={() => navigate('/secure/register')}>Register</div>
            </div>

            <img className='auth-login-img' src={i2} alt="Retailer Login" />
            <div className="signup-container-text">
                <div>WELCOME</div>
                <div style={{ marginTop: "-7px" }}></div>
                <div style={{ marginTop: "-7px" }}>OFFER THE BEST TO YOUR COMMUNITY!</div>
            </div>

            <p className="retailer-signup-container-p">
                Add your phone number or email. We'll send you a verification code so we know you're real.
            </p>
            <div className="retailer-login-phone-input-container">
                <input
                    type="text"
                    placeholder="Your Email or Phone"
                    value={phoneOrEmail}
                    onChange={handlePhoneOrEmailChange}
                />
            </div>
            <button
                className="retailer-login-send-otp-button"
                onClick={sendOTP}
                disabled={(isEmail ? !phoneOrEmail.includes('@') : phoneOrEmail.length !== 10) || loading}
                style={{ backgroundColor: "rgb(3, 223, 193)" }}
            >
                {loading ? (
                    <Oval height={24} width={24} color="white" secondaryColor="gray" ariaLabel="loading" />
                ) : (
                    'SEND OTP'
                )}
            </button>
            <p className="retailer-login-terms-text">
                By providing my phone number or email, I hereby agree and accept the{' '}
                <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
            </p>
        </div>
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
            <OTPInput
                value={otp}
                onChange={(value) => {
                    setOtp(value);
                    if (value.length === 6) verifyOTP(value);
                }}
                numInputs={6}
                renderSeparator={<span className='otp-input-span'> </span>}
                renderInput={(props) => (
                    <input
                        type='text'  // Use text to allow numeric input, type 'number' can cause issues with some browsers
                        inputMode='numeric'  // This ensures the numeric keypad appears on mobile
                        pattern='\d*'  // Ensures only numbers can be entered
                        {...props}
                        className="otp-input"
                    />
                )}
                shouldAutoFocus={true}
            />

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
            {error && <ErrorPopup error={error} />}
        </div>
    );

    return (
        <div className="retailer-login">
            {otpSent ? renderOtpVerificationForm() : renderLoginForm()}
        </div>
    );
}

export default LoginForm;
