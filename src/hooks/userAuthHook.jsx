import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Client, Account } from 'appwrite';
import Cookies from 'js-cookie';
import conf from '../conf/conf.js';

const useUserAuth = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

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

    return { userData, logout, PrivateRoute };
};

export default useUserAuth;
