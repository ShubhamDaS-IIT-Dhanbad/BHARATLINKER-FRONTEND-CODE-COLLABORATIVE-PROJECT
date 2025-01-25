import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Client, Account } from 'appwrite';
import Cookies from 'js-cookie';
import conf from '../conf/conf.js';

const useRetailerAuthHook = () => {
  const dispatch = useDispatch();
  const [retailerData, setRetailerData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteUsersProjectId);
  const account = new Account(client);

  const getRetailerDataFromCookie = useCallback(() => {
    const storedData = Cookies.get('BharatLinkerShopData');
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing retailer data from cookie:', error);
        return null;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/retailer")) {
      const retailerSession = getRetailerDataFromCookie();

      if (retailerSession) {
        setRetailerData(retailerSession);
        const { registrationStatus } = retailerSession || {};

        if (registrationStatus === 'pending') {
          navigate('/retailer/pending');
        } else if (registrationStatus === 'rejected') {
          navigate('/retailer/rejected');
        }
      } else {
        navigate('/');
      }
    }
  }, []);

  const logout = async () => {
    try {
      console.log('Logging out...');
      document.cookie = 'BharatLinkerShopData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const PrivateRoute = ({ children }) => {
    if (!location.pathname.startsWith("/retailer")) {
      return null; // or return a fallback component if necessary
    }
    
    const retailerSession = getRetailerDataFromCookie();
    if (!retailerSession) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return { retailerData, getRetailerDataFromCookie, logout, PrivateRoute };
};

export default useRetailerAuthHook;


