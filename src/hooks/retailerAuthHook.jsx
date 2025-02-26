import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { updateShopData } from '../appWrite/shop/shopData.js';
import Cookies from 'js-cookie';

const useRetailerAuthHook = () => {
  const navigate = useNavigate();
  const [retailerData, setRetailerData] = useState(null);
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
      const { shopRegistrationStatus } = retailerSession;
      if (shopRegistrationStatus !== 'approved' && location.pathname !== '/secure/shop') {
        navigate('/secure/shop');
      }
    }
  }, [location.pathname, navigate]);

  const logout = async () => {
    try {
      console.log('Logging out...');
      document.cookie = 'BharatLinkerShopData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const PrivateRoute = ({ children }) => {
    const shopData = Cookies.get("BharatLinkerShopData");
    if (!shopData) { return <Navigate to="/shop/login" replace />; }
    const parsedShopData = JSON.parse(shopData);
    return React.Children.map(children, (child) =>
      React.isValidElement(child) ? React.cloneElement(child, { shopData: parsedShopData }) : child
    );
  };
  const updateShopCookie = async (updatedData, shopId) => {
    try {
      const updatedShopData = await updateShopData(shopId, updatedData);
      let existingData = {};
      try {
        const cookieData = Cookies.get("BharatLinkerShopData");
        if (cookieData) {
          existingData = JSON.parse(cookieData);
        }
      } catch (error) {
        console.error("Error parsing BharatLinkerShopData cookie:", error);
      }
      const updatedCookieData = {
        ...existingData,
        ...updatedShopData,
      };
      Cookies.set("BharatLinkerShopData", JSON.stringify(updatedCookieData), { expires: 7 });
    } catch (error) {
      console.error("Failed to update shop cookie:", error);
    }
  };
  const updateShopCookieOnly = async (updatedShopData, shopId) => {
    try {
      // Get existing cookie data
      let existingData = {};
      try {
        const cookieData = Cookies.get("BharatLinkerShopData");
        if (cookieData) {
          existingData = JSON.parse(cookieData);
        }
      } catch (error) {
        console.error("Error parsing BharatLinkerShopData cookie:", error);
      }

      // Merge existing data with new updates
      const updatedCookieData = {
        ...existingData,
        ...updatedShopData,
        shopId: shopId || existingData.shopId, // Ensure shopId is preserved
      };

      // Set the updated cookie (7-day expiration)
      Cookies.set("BharatLinkerShopData", JSON.stringify(updatedCookieData), { 
        expires: 7,
        secure: true,    // Recommended for production
        sameSite: 'strict' // Security feature
      });

      return updatedCookieData; // Return the updated data if needed
    } catch (error) {
      console.error("Error updating shop cookie:", error);
      throw error; // Re-throw to allow calling code to handle errors
    }
  };
  return { retailerData, getRetailerDataFromCookie, logout, PrivateRoute, updateShopCookie, updateShopCookieOnly };
};

export default useRetailerAuthHook;
