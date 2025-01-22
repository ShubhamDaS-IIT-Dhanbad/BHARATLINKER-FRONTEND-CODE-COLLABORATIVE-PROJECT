import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Client, Account } from 'appwrite';
import Cookies from 'js-cookie';
import conf from '../conf/conf.js';

import { updateUserByPhoneNumber } from '../appWrite/userData/userData.js';

const useUserAuth = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize Appwrite client and account
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(conf.appwriteUsersProjectId);

    const account = new Account(client);

    // Check user session on component mount
    useEffect(() => {
        if (location.pathname.startsWith('/user')) {
            const userSession = Cookies.get('BharatLinkerUserData');
            if (userSession) {
                try {
                    setUserData(JSON.parse(userSession));
                } catch (error) {
                    console.error("Error parsing user session:", error);
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        }
    }, [navigate, location.pathname]);

    // Get user data from cookies
    const getUserDataFromCookie = () => {
        const storedData = Cookies.get('BharatLinkerUserData');
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch (error) {
                console.error("Error parsing user data from cookie:", error);
                return {};
            }
        }
        console.log("No user data found in cookie");
        return {};
    };

    // Function to update user data
    const updateUserData = async (newData) => {
        if (!userData) {
            console.error('No user data found to update.');
            return;
        }
    
        const updatedData = {
            ...userData,
            ...newData,
        };
    
        try {
            // Make the API call to update user data by phone number
            await updateUserByPhoneNumber({
                name: updatedData.name,
                address: updatedData.address,
                lat: updatedData.lat,
                long: updatedData.long,
                phn: updatedData.phoneNumber,
            });
    
            // Update state and cookies after a successful API call
            setUserData(updatedData);
            Cookies.set('BharatLinkerUserData', JSON.stringify(updatedData), { expires: 1 });
    
            console.log('User data updated successfully:', updatedData);
        } catch (error) {
            console.error('Error updating user data:', error.message);
            alert('Failed to update user data. Please try again.');
        } finally {
            // Ensure the updating state is reset
            setUserData((prevData) => ({ ...prevData, isUpdating: false }));
        }
    };
    

    // Logout function
    const logout = async () => {
        try {
            Cookies.remove('BharatLinkerUserData'); // Remove session cookie
            await account.deleteSession('current'); // Delete current session from Appwrite
            setUserData(null);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // PrivateRoute component for protecting routes
    const PrivateRoute = ({ children }) => {
        const userSession = Cookies.get('BharatLinkerUserData');
        if (!userSession) {
            return <Navigate to="/login" replace />; // Redirect if no session exists
        }
        return children; // Render children if session exists
    };

    return { userData, getUserDataFromCookie, updateUserData, logout, PrivateRoute };
};

export default useUserAuth;
