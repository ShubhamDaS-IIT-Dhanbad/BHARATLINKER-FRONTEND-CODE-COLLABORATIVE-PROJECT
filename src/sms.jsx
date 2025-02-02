import React, { useEffect, useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './fireBase/firebase.js';

function Sms() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [verificationId, setVerificationId] = useState('');
    const [otp, setOtp] = useState('');
    const [recaptchaVerifier,setRecaptchaVerifier]=useState();

    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'invisible',
            },
            auth
        );
        setRecaptchaVerifier(recaptchaVerifier);
        return () => {
            recaptchaVerifier.clear();
        };
    }, []);






    const handlePhoneSubmit = async () => {
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            setVerificationId(confirmationResult);
            setOtpSent(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    const handleOtpSubmit = async () => {
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
            await auth.signInWithCredential(credential);
            console.log('Phone number verified successfully');
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    return (
        <div>
            {!otpSent ? (
                <div>
                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <button onClick={handlePhoneSubmit}>Send OTP</button>
                    <div id="recaptcha-container"></div>
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={handleOtpSubmit}>Verify OTP</button>
                </div>
            )}
        </div>
    );
}

export default Sms;
