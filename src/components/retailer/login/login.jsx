import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import i1 from '../../../assets/indian-flag.png';
import i2 from './i1.png';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';

import Cookies from 'js-cookie';

import { sendOtp, createSession, getShopData,clearUserSessions } from '../../../appWrite/shop/shop.js';
import './login.css';

function LoginForm() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [userId, setUserId] = useState(null);

    const handlePhoneChange = (e) => setPhone(e.target.value);

    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else {
            setIsResendDisabled(false);
        }
        return () => clearInterval(countdown);
    }, [timer]);

    // Send OTP
    const sendOTP = async () => {
        try {
            const response = await sendOtp(phone);
            setUserId(response);
            setOtpSent(true);
            setIsResendDisabled(true);
            setTimer(30);
        } catch (error) {
            toast.error(`Failed to send OTP: ${error.message}`);
        }
    };

    // Verify OTP
    const verifyOTP = async (otpCode) => {
        const loadingToast = toast.loading('Verifying OTP...');
        try {
            await clearUserSessions()
            await createSession(userId, otpCode);
            await getShopData(phone);
            navigate('/');
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(`Failed to verify OTP: ${error.message}`);
            setOtp(new Array(6).fill(''));
        }
    };

    // Handle OTP input change
    const handleOTPChange = (e, index) => {
        let otpCopy = [...otp];
        otpCopy[index] = e.value;
        setOtp(otpCopy);

        // Move to the next input after entering a value
        if (e.value !== '' && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    // Handle backspace in OTP inputs
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '') {
            if (index > 0) {
                document.getElementById(`otp-input-${index - 1}`).focus();
            }
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
                        <div className='retailer-login-div' style={{borderColor:"rgb(3, 223, 193)"}}>Login</div>
                        <div className='retailer-login-register-div' onClick={() => navigate('/retailer/register')}>Register</div>
                    </div>

                    <img className='retailer-login-img' src={i2}/>
                    
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
                            maxLength="10"
                        />
                    </div>

                    <button className="retailer-login-send-otp-button" onClick={sendOTP} disabled={!phone}>
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

            <ToastContainer />
        </div>
    );
}

export default LoginForm;
