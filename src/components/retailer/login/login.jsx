import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { sendOTP, verifyOTP, verifyPassword } from '../../../appWrite/shop/shopAuth.js';
import Cookies from 'js-cookie';
import { IoCloseCircleOutline } from "react-icons/io5";
import { GoChevronLeft } from "react-icons/go";
import sd from '../asset/sd.png';
import '../style/login.css';

const SignUpForm = React.memo(() => {
    const navigate = useNavigate();
    const phoneRef = useRef('');
    const [state, setState] = useState({
        userId: null,
        otp: Array(6).fill(""),
        password: '',
        otpSent: false,
        usePassword: true,
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
        if (phoneRef.current.length !== 10) return setState(s => ({ ...s, errorMessage: 'Phone number must be 10 digits' }));
        setState(s => ({ ...s, loading: true, errorMessage: '' }));
        try {
            const userId = await sendOTP();
            if (userId) setState(s => ({ ...s, userId, otpSent: true, isResendDisabled: true, timer: 30, otp: Array(6).fill("") }));
            else throw new Error();
        } catch {
            setState(s => ({ ...s, errorMessage: 'Failed to send OTP. Try again.' }));
        } finally {
            setState(s => ({ ...s, loading: false }));
        }
    }, []);

    const handleVerifyOTP = useCallback(async () => {
        if (state.otp.join('').length !== 6) return setState(s => ({ ...s, errorMessage: 'OTP must be 6 digits' }));
        setState(s => ({ ...s, verifyingOtp: true, errorMessage: '' }));
        try {
            const { session, shopData } = await verifyOTP(state.userId, state.otp.join(''), `91${phoneRef.current}`);
            setCookiesAndNavigate(session, shopData);
        } catch {
            setState(s => ({ ...s, errorMessage: 'Invalid OTP. Please try again.', otp: Array(6).fill('') }));
        } finally {
            setState(s => ({ ...s, verifyingOtp: false }));
        }
    }, [state.userId, state.otp]);

    const handlePasswordLogin = useCallback(async () => {
        if (phoneRef.current.length !== 10 || state.password.length !== 6) {
            return setState(s => ({ ...s, errorMessage: `Please enter valid ${phoneRef.current.length !== 10 ? 'phone number' : 'password'}` }));
        }
        setState(s => ({ ...s, loading: true, errorMessage: '' }));
        try {
            const { session, shopData } = await verifyPassword(`91${phoneRef.current}`, state.password);
            setCookiesAndNavigate(session, shopData);
        } catch {
            setState(s => ({ ...s, errorMessage: 'Invalid password. Please try again.' }));
        } finally {
            setState(s => ({ ...s, loading: false }));
        }
    }, [state.password]);

    const setCookiesAndNavigate = useCallback((session, shopData) => {
        Cookies.set("BharatLinkerShopData", JSON.stringify({
            shopId: shopData.$id,
            uId: session?.userId,
            id: session?.$id,
            shopName: shopData?.shopName,
            shopDescription: shopData?.shopDescription,
            shopLatitude: shopData?.shopLatitude,
            shopLongitude: shopData?.shopLongitude,
            shopPhoneNumber: shopData.shopPhoneNumber,
            shopAddress: shopData?.shopAddress,
            isShopOpen: shopData?.isShopOpen,
            shopNumber: shopData?.shopNumber,
            buildingName: shopData?.buildingName,
            landMark: shopData?.landMark,
            shopImages: shopData?.shopImages,
            shopKeywords: shopData?.shopKeywords,
            shopCustomerCare: shopData?.shopCustomerCare,
            shopEmail: shopData?.shopEmail,
            shopRegistrationStatus: shopData?.shopRegistrationStatus
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
        if (value && index < 5) document.getElementById(`otp-input-${index + 1}`).focus();
        else if (!value && index > 0) document.getElementById(`otp-input-${index - 1}`).focus();
    }, []);

    const handlePhoneChange = useCallback((e) => {
        phoneRef.current = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        if (state.errorMessage) setState(s => ({ ...s }));
    }, [state.errorMessage]);

    const renderInputForm = () => {
        if (!state.usePassword && !state.otpSent) {
            return (
                <>
                    <h1 className="shop-login-main-title">Welcome Back, Shopkeeper!</h1>
                    <p className="shop-login-main-subtitle" style={{ marginTop: "-10px" }}>Need help? Our support team is just a click away!</p><PhoneInput />
                    <ActionButton onClick={handleSendOTP} disabled={state.loading || phoneRef.current.length !== 10} text="SEND OTP" />
                    <div className='shop-login-sendotppassword' onClick={() => setState(s => ({ ...s, usePassword: true }))}>
                        use key?
                    </div>
                </>
            );
        }
        if (state.usePassword) {
            return (
                <>
                    <h1 className="shop-login-main-title">Great to See You Again!</h1>
                    <p className="shop-login-main-subtitle" style={{marginTop:"-10px"}}>Stay secure by keeping your password strong and updated.</p> <PhoneInput />
                    <div className='shop-login-phone-input-container'>
                        <input
                            type='number'
                            className='shop-login-premium-input'
                            placeholder='Enter 6-digit password'
                            value={state.password}
                            onChange={e => setState(s => ({ ...s, password: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) }))}
                            maxLength='6'
                        />
                    </div>
                    <ActionButton 
                        onClick={handlePasswordLogin} 
                        disabled={state.loading || state.password.length !== 6 || phoneRef.current.length !== 10} 
                        text="LOGIN" 
                    />
                    <div className='shop-login-sendotppassword' onClick={() => setState(s => ({ ...s, usePassword: false }))}>
                        forgot password ?
                    </div>
                </>
            );
        }
        return (
            <div className='shop-login-otp-auth-form-container'>
                <div className='shop-login-otp-header'>
                    <div className='shop-login-auth-form-container-back-container' 
                         onClick={() => setState(s => ({ ...s, otpSent: false, usePassword: true }))}>
                        <GoChevronLeft size={30} />
                    </div>
                    <h3 className='shop-login-otp-title'>OTP Verification</h3>
                </div>
                <p className='shop-login-otp-instruction'>Enter the 6-digit code sent to +91 {phoneRef.current}</p>
                <div className='shop-login-otp-input-group'>
                    {state.otp.map((_, i) => (
                        <input
                            key={i}
                            id={`otp-input-${i}`}
                            type='number'
                            className='shop-login-otp-digit-input'
                            maxLength='1'
                            value={state.otp[i]}
                            onChange={e => handleOtpChange(e, i)}
                            inputMode="numeric"
                            autoFocus={i === 0}
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
                        <button className='shop-login-otp-premium-button shop-login-secondary' disabled>
                            Resend OTP ({state.timer}s)
                        </button>
                    </div>
                ) : (
                    <button className='shop-login-otp-premium-button shop-login-secondary' onClick={handleSendOTP}>
                        Resend OTP
                    </button>
                )}
            </div>
        );
    };

    const PhoneInput = React.memo(() => (
        <div className='shop-login-phone-input-container' style={{marginTop:"40px"}}>
            <div className='shop-login-country-code-pill'><span>+91</span></div>
            <input
                type='number'
                className='shop-login-premium-input'
                placeholder='Enter mobile number'
                defaultValue={phoneRef.current}
                onChange={handlePhoneChange}
                maxLength='10'
            />
        </div>
    ));

    const ActionButton = React.memo(({ onClick, disabled, text }) => (
        <button className='shop-login-premium-button shop-login-primary' onClick={onClick} disabled={disabled}>
            {(state.loading || state.verifyingOtp) && text !== 'Resend OTP' ? <TailSpin height={24} width={24} color='#ffffff' /> : text}
        </button>
    ));

    return (
        <div className="shop-login-main-default-content">
            <div className='shop-login-auth-form-container-back-container' onClick={() =>{console.log("hi");navigate('/')}}>
                <GoChevronLeft size={25} />
            </div>
            <div className="shop-login-jmain-rocket-image-c">
                <img src={sd} alt="Rocket" className="shop-login-main-rocket-image" />
            </div>
            {renderInputForm()}
            {state.errorMessage && (
                <div className="shop-login-premium-error-message">
                    {state.errorMessage}
                    <IoCloseCircleOutline size={20} onClick={() => setState(s => ({ ...s, errorMessage: '' }))} />
                </div>
            )}
        </div>
    );
});

export default SignUpForm;