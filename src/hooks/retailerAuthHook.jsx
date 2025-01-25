import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Client, Account } from 'appwrite';
import Cookies from 'js-cookie';
import conf from '../conf/conf.js';

import { fetchUserByPhoneNumber } from '../appWrite/userData/userData.js';
import { updateUserByPhoneNumber } from '../appWrite/userData/userData.js';

import { resetCart } from '../redux/features/user/cartSlice.jsx';

const useRetailerAuthHook = () => {
    const dispatch = useDispatch();
    const [retailerData, setRetailerData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(conf.appwriteUsersProjectId);
    const account = new Account(client);

    useEffect(() => {
        const checkRetailerSession = () => {
          if (location.pathname.startsWith("/retailer")) {
            const retailerSession = Cookies.get("BharatLinkerShopData");
            
            if (retailerSession) {
              try {
                const retailerData = JSON.parse(retailerSession);
                console.log(retailerData)
                setRetailerData(retailerData);
                const { registrationStatus } = retailerData || {};
                if (registrationStatus === "pending") {
                  navigate("/retailer/pending");
                } else if (registrationStatus === "rejected") {
                  navigate("/retailer/rejected");
                } else {
                  navigate("/retailer");
                }
              } catch (error) {
                console.error("Error parsing retailer session:", error);
                navigate("/");
              }
            } else {
              navigate("/");
            }
          }
        };
        checkRetailerSession();
      }, []);
    

    const getRetailerDataFromCookie = () => {
        const storedData = Cookies.get('BharatLinkerShopData');
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch (error) {
                console.error('Error parsing retailer data from cookie:', error);
                return {};
            }
        }
        return {};
    };

    const fetchRetailerData = async (phone) => {
        try {
            const retailerData = await fetchUserByPhoneNumber(phone);
            if (retailerData) {
                Cookies.set('BharatLinkerShopData', JSON.stringify(retailerData), { expires: 7, path: '' });
                setRetailerData(retailerData);
                return retailerData;
            } else {
                console.error('No retailer data found for the provided phone number.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching retailer data:', error.message);
            return null;
        }
    };

    const updateRetailerData = async (newData) => {
        if (!retailerData) {
            console.error('No retailer data found to update.');
            return;
        }

        const updatedData = {
            ...retailerData,
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

            Cookies.set('BharatLinkerShopData', JSON.stringify(updatedData), { expires: 7, path: '' });
            setRetailerData(updatedData);
        } catch (error) {
            console.error('Error updating retailer data:', error.message);
            alert('Failed to update retailer data. Please try again.');
        } finally {
            setRetailerData((prevData) => ({ ...prevData, isUpdating: false }));
        }
    };

    const logout = async () => {
        try {
            console.log("Logging out...");
            document.cookie = "BharatLinkerShopData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            dispatch(resetCart());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const PrivateRoute = ({ children }) => {
        const retailerSession = Cookies.get('BharatLinkerShopData');
        if (!retailerSession) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return { retailerData, getRetailerDataFromCookie, fetchRetailerData, updateRetailerData, logout, PrivateRoute };
};

export default useRetailerAuthHook;
