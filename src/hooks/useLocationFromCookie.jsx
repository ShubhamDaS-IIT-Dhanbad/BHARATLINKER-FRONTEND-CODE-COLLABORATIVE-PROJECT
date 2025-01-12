/*COMPLETE*/

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';

import { resetProducts } from '../redux/features/searchPage/searchProductSlice.jsx';
import { resetShops } from '../redux/features/searchShopSlice.jsx';
import { resetRefurbishedProducts } from '../redux/features/refurbishedPage/refurbishedProductsSlice.jsx';

const useLocationFromCookies = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    // Improved fetchLocation to handle potential errors and optimize state updates
    const fetchLocation = () => {
        try {
            setLoading(true);
            const storedLocation = Cookies.get('BharatLinkerUserLocation');
            if (storedLocation) {
                const parsedLocation = JSON.parse(storedLocation);
                setLocation(parsedLocation);
            }
        } catch (error) {
            console.error('Error fetching location from cookies:', error);
            setLocation(null); // Ensure location is reset in case of an error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    // Optimized updateLocation with improved error handling
    const updateLocation = (newLocation) => {
        try {
            const storedLocation = Cookies.get('BharatLinkerUserLocation');
            const parsedLocation = storedLocation ? JSON.parse(storedLocation) : {};

            const updatedLocation = {
                ...parsedLocation,
                ...newLocation,
            };

            // Ensure valid data before updating
            if (updatedLocation.lat && updatedLocation.lon && updatedLocation.address) {
                Cookies.set('BharatLinkerUserLocation', JSON.stringify(updatedLocation), { expires: 7 });
                setLocation(updatedLocation);

                dispatch(resetProducts());
                dispatch(resetShops());
                dispatch(resetRefurbishedProducts());
            } else {
                console.warn('Invalid location data. Location update failed.');
            }
        } catch (error) {
            console.error('Error updating location in cookies:', error);
        }
    };

    return { location, loading, updateLocation };
};

export default useLocationFromCookies;

