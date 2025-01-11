import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import i1 from '../../../assets/indian-flag.png';
import i2 from './i1.png';
import { FaArrowLeft } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';

import Cookies from 'js-cookie';

import { sendOtp, createSession, getShopData, clearUserSessions } from '../../../appWrite/shop/shop.js';
import './login.css';

function LoginForm() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [userId, setUserId] = useState(null);

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
        try {
            const response = await sendOtp(phone);
            setUserId(response);
            setOtpSent(true);
            setIsResendDisabled(true);
            setTimer(30);
        } catch (err) {
            console.error(`Failed to send OTP: ${err.message}`);
            alert('Failed to send OTP. Please try again.');
        }
    };

    const verifyOTP = async (otpCode) => {
        try {
            await clearUserSessions();
            await createSession(userId, otpCode);

            const phoneNumber=`+91${phone}`;
            console.log(phoneNumber);
            const shopData = await getShopData(phoneNumber);

            Cookies.set('BharatLinkerShopData', JSON.stringify(shopData), { expires: 7 });
            navigate('/');
        } catch (err) {
            console.error(`Failed to verify OTP: ${err.message}`);
            alert('Invalid OTP. Please try again.');
            setOtp(new Array(6).fill(''));
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

    return (
        <div className="retailer-login">
            {!otpSent ? (
                <>
                    <div className="retailer-login-top-header">
                        <FaArrowLeft
                            size={25}
                            onClick={() => navigate('/')}
                            className="retailer-login-back-arrow"
                        />
                        BHARAT | LINKER
                    </div>
                    <div className="retailer-login-div-parent">
                        <div className="retailer-login-div" style={{ borderColor: 'rgb(3, 223, 193)' }}>Login</div>
                        <div
                            className="retailer-login-register-div"
                            onClick={() => navigate('/retailer/register')}
                        >
                            Register
                        </div>
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
                            type="text"
                            placeholder="Enter Mobile Number"
                            value={phone}
                            onChange={handlePhoneChange}
                        />
                    </div>

                    <button
                        className="retailer-login-send-otp-button"
                        onClick={sendOTP}
                        disabled={phone.length !== 10}
                    >
                        SEND OTP
                    </button>

                    <p className="retailer-login-terms-text">
                        By providing my phone number, I hereby agree and accept the{' '}
                        <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
                    </p>
                </>
            ) : (
                <div className="otp-verification">
                    <div className="otp-verification-top-header">
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

                    <p className="otp-verification-text">Verify your phone number</p>
                    <p className="otp-verification-text-p">Enter your OTP code here</p>

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
                            />
                        ))}
                    </div>

                    <p className="resend-text">Didn't receive the code?</p>
                    <button
                        className={`resend-btn ${isResendDisabled ? 'disabled' : ''}`}
                        onClick={!isResendDisabled ? sendOTP : null}
                        disabled={isResendDisabled}
                    >
                        Resend new code {isResendDisabled && `in (${timer}s)`}
                    </button>

                    <button
                        className="verify-otp-button"
                        onClick={() => verifyOTP(otp.join(''))}
                        disabled={otp.join('').length !== 6}
                    >
                        Verify OTP
                    </button>
                </div>
            )}
        </div>
    );
}

export default LoginForm;
