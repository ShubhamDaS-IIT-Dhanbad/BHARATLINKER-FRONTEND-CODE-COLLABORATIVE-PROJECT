// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Client, Account, ID } from 'appwrite';

// const EmailOtpAuth = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [otp, setOtp] = useState('');
//     const [userId, setUserId] = useState('');
//     const [securityPhrase, setSecurityPhrase] = useState('');

//     const client = new Client()
//         .setEndpoint('https://cloud.appwrite.io/v1')
//         .setProject('6703b6cf0021226113b9');             

//     const account = new Account(client);

//     // Step 1: Send OTP to email
//     const sendEmailOtp = async (e) => {
//         e.preventDefault();
//         const loadingToast = toast.loading('Sending OTP...');

//         try {
//             const sessionToken = await account.createEmailToken(
//                 ID.unique(),
//                 email,
//                 true
//             );
//             setUserId(sessionToken.userId);
//             setSecurityPhrase(sessionToken.secret); 
//             toast.dismiss(loadingToast);
//             toast.success('OTP sent! Please check your email.');
//         } catch (error) {
//             toast.dismiss(loadingToast);
//             toast.error(`Failed to send OTP: ${error.message}`);
//         }
//     };


//     const loginWithOtp = async (e) => {
//         e.preventDefault();
//         const loadingToast = toast.loading('Verifying OTP...');

//         try {
//             const session = await account.createSession(userId, otp);
//             toast.dismiss(loadingToast);
//             toast.success('Login successful!');
//             navigate('/home');
//         } catch (error) {
//             toast.dismiss(loadingToast);
//             toast.error(`Login failed: ${error.message}`);
//         }
//     };

//     return (
//         <div className="email-otp-auth-container">
//             <h2>Email OTP Authentication</h2>

//             <form onSubmit={sendEmailOtp}>
//                 <input
//                     type="email"
//                     placeholder="Enter Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Send OTP</button>
//             </form>

//             {userId && (
//                 <form onSubmit={loginWithOtp}>
//                     <p>Check your email for the 6-digit OTP.</p>
//                     <input
//                         type="text"
//                         placeholder="Enter OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         required
//                     />
//                     <p>Security Phrase: {securityPhrase}</p>
//                     <button type="submit">Login with OTP</button>
//                 </form>
//             )}

//             <ToastContainer />
//         </div>
//     );
// };

// export default EmailOtpAuth;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Client, Account, ID } from 'appwrite';

const PhoneAuth = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [secret, setSecret] = useState('');
    const [userId, setUserId] = useState('');

    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject('6703b6cf0021226113b9');                 // Your project ID

    const account = new Account(client);

    // Step 1: Send SMS to phone number
    const sendSms = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Sending SMS...');

        try {
            const token = await account.createPhoneToken(ID.unique(), phone);
            setUserId(token.userId); // Store the returned user ID
            toast.dismiss(loadingToast);
            toast.success('SMS sent! Please check your phone.');
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(`Failed to send SMS: ${error.message}`);
        }
    };

    // Step 2: Log in with the secret code
    const loginWithSecret = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Verifying code...');

        try {
            const session = await account.createSession(userId, secret);
            toast.dismiss(loadingToast);
            toast.success('Login successful!');
            navigate('/home'); // Redirect to home page after successful login
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(`Login failed: ${error.message}`);
        }
    };

    return (
        <div className="phone-auth-container">
            <h2>Phone Authentication</h2>

            <form onSubmit={sendSms}>
                <input
                    type="tel"
                    placeholder="Enter Phone Number (e.g. +14255550123)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <button type="submit">Send SMS</button>
            </form>

            {userId && (
                <form onSubmit={loginWithSecret}>
                    <p>Check your phone for the secret code.</p>
                    <input
                        type="text"
                        placeholder="Enter Secret Code"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        required
                    />
                    <button type="submit">Login with Secret Code</button>
                </form>
            )}

            <ToastContainer />
        </div>
    );
};

export default PhoneAuth;
