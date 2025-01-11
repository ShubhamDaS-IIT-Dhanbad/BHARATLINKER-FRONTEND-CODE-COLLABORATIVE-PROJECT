import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import i1 from '../../../assets/indian-flag.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft } from "react-icons/fa";

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

    const verifyOTP = async (otpCode) => {
        const loadingToast = toast.loading('Verifying OTP...');
        try {
            const session = await createSession(userId, otpCode);
            const sessionId=session.$id;
            await deleteSession(sessionId);
            try {
                await registerShop(shopName, phone);
                toast.success('Shop registered successfully!');
            } catch (error) {
                toast.error(`Failed to register shop: ${error.message}`);
                throw error;
            }
            

            navigate('/');
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(`Failed to verify OTP: ${error.message}`);
            setOtp(new Array(6).fill(''));
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
                    <div>
                        <div>login</div>
                        <div>register</div>
                    </div>
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

                    <button className="retailer-login-send-otp-button" onClick={sendOTP}>
                        SEND OTP
                    </button>

                    <p className="retailer-login-terms-text">
                        By providing my phone number, I hereby agree and accept the{' '}
                        <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a> in use of this app.
                    </p>
                </>
            ) : (
                <div className="otp-verification">
                    <div className="otp-verification-top-header">
                        <FaArrowLeft size={25} onClick={() => { setOtpSent(false); setOtp(new Array(6).fill('')); }} />
                        OTP Verification
                    </div>

                    <div className="otp-verification-text-verify">Verify your</div>
                    <div className="otp-verification-text-phn">Phone number</div>
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
                    <div
                        className={`resend-btn ${isResendDisabled ? 'disabled' : ''}`}
                        onClick={!isResendDisabled ? sendOTP : null}
                    >
                        Resend new code {isResendDisabled && `in (${timer}s)`}
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default SignUpForm;
