import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

const useRetailerAuthHook = () => {
  const dispatch = useDispatch();
  const [retailerData, setRetailerData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    if (!location.pathname.startsWith('/secure/shop')) return;
    const retailerSession = getRetailerDataFromCookie();

    if (retailerSession) {
      setRetailerData(retailerSession);
      const { registrationStatus } = retailerSession || {};

      if (registrationStatus === 'pending') {
        navigate('/shop/pending');
      } else if (registrationStatus === 'rejected') {
        navigate('/shop/rejected');
      }
    } else {
      navigate('/');
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
          const shopData = Cookies.get("BharatLinkerShopData");
          if (!shopData) {
              return <Navigate to="/shop/login" replace />;
          }
          const parsedShopData = JSON.parse(shopData);
          return React.Children.map(children, (child) =>
              React.isValidElement(child) ? React.cloneElement(child, { shopData: parsedShopData }) : child
          );
      };

  return { retailerData, getRetailerDataFromCookie, logout, PrivateRoute };
};

export default useRetailerAuthHook;
