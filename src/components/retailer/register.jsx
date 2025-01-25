import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import OTPInput from 'react-otp-input';
import { FaArrowLeft } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';
import { registerShop, sendOtp, createSession, deleteSession } from '../../appWrite/shop/shop.js';
import { ErrorPopup } from './popups/popUp.jsx';

import '../style/shopLogin.css';
import '../style/userLogin.css';

const i2 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737378115/d7xgicjpub5ag6udeisd.png';

function SignUpForm() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [contact, setContact] = useState('');
    const [shopName, setShopName] = useState('');
    const [userId, setUserId] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingVerification, setLoadingVerification] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleShopNameChange = (e) => setShopName(e.target.value);
    const handleContactChange = (e) => setContact(e.target.value);

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
        setError('');
        try {
            const isPhone = /^\d{10}$/.test(contact);
            const response = isPhone ? await sendOtp(contact) : await sendOtp(contact, true);
            setUserId(response);
            setOtpSent(true);
            setIsResendDisabled(true);
            setTimer(30);
            setSuccess('OTP sent successfully!');
        } catch (error) {
            console.error(`Failed to send OTP: ${error.message}`);
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (otpCode) => {
        setLoadingVerification(true);
        setError('');
        try {
            const session = await createSession(userId, otpCode);
            const sessionId = session.$id;
            await deleteSession(sessionId);

            const shopData = await registerShop(shopName, contact);
            document.cookie = `BharatLinkerShopData=${JSON.stringify(shopData)}; expires=${new Date(
                Date.now() + 7 * 86400000
            ).toUTCString()}`;
            setSuccess('Shop registered successfully!');
            navigate('/retailer');
        } catch (error) {
            console.error(`Failed to verify OTP or register shop: ${error.message}`);
            setError(error);
        } finally {
            setLoadingVerification(false);
        }
    };

    return (
        <div className="retailer-login">
            {!otpSent ? (
                <>
                    <div className="retailer-login-top-header">
                        <FaArrowLeft size={25} onClick={() => navigate('/')} style={{ position: 'fixed', left: '10px' }} />
                        BHARAT | LINKER
                    </div>
                    <div className="retailer-login-div-parent">
                        <div className="retailer-login-div" onClick={() => navigate('/secure/login')}>Login</div>
                        <div className="retailer-login-register-div" style={{ borderColor: "rgb(162, 128, 249)" }}>Register</div>
                    </div>
                    <img className='retailer-login-img' src={i2} />
                    <div className="signup-container-text">
                        <div>OPEN SHOP HERE</div>
                        <div style={{ marginTop: "-7px" }}></div>
                        <div style={{ marginTop: "-7px" }}>OFFER THE BEST TO YOUR COMMUNITY!</div>
                    </div>

                    <p className="retailer-signup-container-p">
                        Add your phone number or email. We'll send you a verification code so we know you're real.
                    </p>

                    <div className="retailer-login-phone-input-container">
                        <input
                            type="text"
                            placeholder="Enter Shop Name"
                            value={shopName}
                            onChange={handleShopNameChange}
                            maxLength="50"
                        />
                    </div>
                    <div className="retailer-login-phone-input-container">
                        <input
                            type="text"
                            placeholder="Your Email or Phone"
                            value={contact}
                            onChange={handleContactChange}
                        />
                    </div>
                    <button
                        style={{ backgroundColor: "rgb(162, 128, 249)" }}
                        className="retailer-login-send-otp-button"
                        onClick={sendOTP}
                        disabled={loading}
                    >
                        {loading ? (
                            <Oval height={24} width={24} color="white" secondaryColor="gray" ariaLabel="loading" />
                        ) : (
                            'SEND OTP'
                        )}
                    </button>
                    <p className="retailer-login-terms-text">
                        By providing my contact info, I hereby agree and accept the{' '}
                        <a href="#terms" style={{ color: "rgb(162, 128, 249)" }}>Terms of Service</a> and{' '}
                        <a href="#privacy" style={{ color: "rgb(162, 128, 249)" }}>Privacy Policy</a> in use of this app.
                    </p>
                </>
            ) : (
                <div className="retailer-login-otp-verification">
                    <div className="retailer-login-otp-verification-top-header">
                        <FaArrowLeft
                            size={25}
                            onClick={() => {
                                setOtpSent(false);
                                setOtp('');
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
                            <Oval height={24} width={24} color="rgb(162, 128, 249)" secondaryColor="gray" ariaLabel="loading" />
                        </div>
                    ) : (
                        <>
                            <p className="resend-text">Didn't receive the code?</p>
                            <button
                                className={`retailer-login-resend-btn ${isResendDisabled ? 'disabled' : ''}`}
                                onClick={!isResendDisabled ? sendOTP : null}
                                disabled={isResendDisabled}
                                style={{ color: "rgb(162, 128, 249)" }}
                            >
                                Resend new code {isResendDisabled && `in (${timer}s)`}
                            </button>
                        </>
                    )}

                    {error && <ErrorPopup error={"shop with this phone/email already exist"} />}
                </div>
            )}
        </div>
    );
}

export default SignUpForm;
