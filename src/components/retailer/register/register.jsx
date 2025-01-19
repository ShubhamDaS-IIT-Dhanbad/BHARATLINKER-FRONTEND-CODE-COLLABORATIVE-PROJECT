import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner'; // Correct import for Oval spinner

const i1 ='https://res.cloudinary.com/demc9mecm/image/upload/v1737182575/mz1bdy2skwtmouqxfqtf.jpg';//indian flag
const i2 ='https://res.cloudinary.com/demc9mecm/image/upload/v1737182575/mz1bdy2skwtmouqxfqtf.jpg';//i1 .png

import { FaArrowLeft } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';
import { registerShop, sendOtp, createSession, deleteSession } from '../../../appWrite/shop/shop.js';

function SignUpForm() {
    const navigate = useNavigate();

    const [phone, setPhone] = useState('');
    const [shopName, setShopName] = useState('');
    const [userId, setUserId] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingVerification, setLoadingVerification] = useState(false);

    const handleShopNameChange = (e) => setShopName(e.target.value);
    const handlePhoneChange = (e) => setPhone(e.target.value);

    const handleOTPChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
        setOtp(newOtp);

        if (element.value === '' && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        } else if (element.value !== '' && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }

        const otpCode = newOtp.join('');
        if (otpCode.length === 6) {
            verifyOTP(otpCode);
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === 'Backspace') {
            event.preventDefault();
            const newOtp = [...otp];
            if (newOtp[index] === '') {
                if (index > 0) {
                    document.getElementById(`otp-input-${index - 1}`).value = '';
                    document.getElementById(`otp-input-${index - 1}`).focus();
                }
            } else {
                newOtp[index] = '';
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


    const sendOTP = async () => {
        setLoading(true); // Start loading when OTP is sent
        try {
            const response = await sendOtp(phone);
            setUserId(response);
            setOtpSent(true);
            setIsResendDisabled(true);
            setTimer(30);
        } catch (error) {
            console.error(`Failed to send OTP: ${error.message}`);
        } finally {
            setLoading(false); // Stop loading after OTP is sent
        }
    };

    const verifyOTP = async (otpCode) => {
        setLoadingVerification(true); // Start loading during OTP verification
        try {
            const session = await createSession(userId, otpCode);
            const sessionId = session.$id;
            await deleteSession(sessionId);
            try {
                const shopData = await registerShop(shopName, phone);
                document.cookie = `BharatLinkerShopData=${JSON.stringify(shopData)}; expires=${new Date(Date.now() + 7 * 86400000).toUTCString()}`;
                console.log('Shop registered successfully!');
            } catch (error) {
                console.error(`Failed to register shop: ${error.message}`);
                throw error;
            }
            navigate('/retailer');
        } catch (error) {
            console.error(`Failed to verify OTP: ${error.message}`);
            setOtp(new Array(6).fill(''));
        } finally {
            setLoadingVerification(false); // Stop loading after OTP verification
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
                        <div className='retailer-login-div' onClick={() => navigate('/retailer/login')}>Login</div>
                        <div className='retailer-login-register-div' style={{ borderColor: "rgb(162, 128, 249)" }}>Register</div>
                    </div>
                    <img className="retailer-login-img" src={i2} alt="Retailer Login" />

                    <div className="retailer-signup-container-p">
                        Add your phone number. We'll send you a verification code so we know you're real.
                    </div>

                    <div className="retailer-login-phone-input-container">
                        <input
                            type="text"
                            placeholder="ENTER SHOP NAME"
                            value={shopName}
                            onChange={handleShopNameChange}
                            maxLength="50"
                        />
                    </div>
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
                            maxLength="10"
                        />
                    </div>

                    <button style={{ backgroundColor: "rgb(162, 128, 249)" }} className="retailer-login-send-otp-button" onClick={sendOTP}>
                        {loading ? (
                            <Oval
                                height={24}
                                width={24}
                                color="white"
                                secondaryColor="gray"
                                ariaLabel="loading"
                            />
                        ) : (
                            'SEND OTP'
                        )}
                    </button>

                    <p className="retailer-login-terms-text">
                        By providing my phone number, I hereby agree and accept the{' '}
                        <a href="#terms" style={{ color: "rgb(162, 128, 249)" }}>Terms of Service</a> and <a href="#privacy" style={{ color: "rgb(162, 128, 249)" }}>Privacy Policy</a> in use of this app.
                    </p>
                </>
            ) : (
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
                                onChange={(e) => handleOTPChange(e.target, index)}
                                onFocus={(e) => e.target.select()}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

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
                </div>
            )}
        </div>
    );
}

export default SignUpForm;
