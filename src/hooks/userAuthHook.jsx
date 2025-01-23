import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Client, Account } from 'appwrite';
import Cookies from 'js-cookie';
import conf from '../conf/conf.js';

import { fetchUserByPhoneNumber } from '../appWrite/userData/userData.js';
import { updateUserByPhoneNumber } from '../appWrite/userData/userData.js';

const useUserAuth = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(conf.appwriteUsersProjectId);

    const account = new Account(client);

    useEffect(() => {
        if (location.pathname.startsWith('/user')) {
            const userSession = Cookies.get('BharatLinkerUserData');
            if (userSession) {
                try {
                    setUserData(JSON.parse(userSession));
                } catch (error) {
                    console.error('Error parsing user session:', error);
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        }
    }, []);

    const getUserDataFromCookie = () => {
        const storedData = Cookies.get('BharatLinkerUserData');
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch (error) {
                console.error('Error parsing user data from cookie:', error);
                return {};
            }
        }
        console.log('No user data found in cookie');
        return {};
    };

    const fetchUserData = async (phone) => {
        try {
            const userData = await fetchUserByPhoneNumber(phone);
            if (userData) {
                Cookies.set('BharatLinkerUserData', JSON.stringify(userData), { expires: 7, path: '' });
                setUserData(userData);
                return userData;
            } else {
                console.error('No user data found for the provided phone number.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            return null;
        }
    };

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
            await updateUserByPhoneNumber({
                name: updatedData.name,
                address: updatedData.address,
                lat: updatedData.lat,
                long: updatedData.long,
                phn: updatedData.phoneNumber,
            });

            Cookies.set('BharatLinkerUserData', JSON.stringify(updatedData), { expires: 7, path: '' });
            setUserData(updatedData);
        } catch (error) {
            console.error('Error updating user data:', error.message);
            alert('Failed to update user data. Please try again.');
        } finally {
            setUserData((prevData) => ({ ...prevData, isUpdating: false }));
        }
    };

    const logout = async () => {
        try {
            Cookies.remove('BharatLinkerUserData');
            await account.deleteSession('current');
            setUserData(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const PrivateRoute = ({ children }) => {
        const userSession = Cookies.get('BharatLinkerUserData');
        if (!userSession) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return { userData, getUserDataFromCookie, fetchUserData, updateUserData, logout, PrivateRoute };
};

export default useUserAuth;
