import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { resetProducts } from '../redux/features/searchPage/searchProductSlice.jsx';
import { resetShops } from '../redux/features/searchShopSlice.jsx';
import { resetRefurbishedProducts } from '../redux/features/refurbishedPage/refurbishedProductsSlice.jsx';

const useLocationFromCookies = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [debounceTimer, setDebounceTimer] = useState(null);

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
            setLocation(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    const updateLocation = useCallback((newLocation) => {
        try {
            const storedLocation = Cookies.get('BharatLinkerUserLocation');
            const parsedLocation = storedLocation ? JSON.parse(storedLocation) : {};

            const updatedLocation = {
                ...parsedLocation,
                ...newLocation,
            };

            if (updatedLocation.lat && updatedLocation.lon && updatedLocation.address) {
                Cookies.set('BharatLinkerUserLocation', JSON.stringify(updatedLocation), { expires: 7 });
                setLocation(updatedLocation);

                // Debounce mechanism to prevent dispatching reset actions too quickly
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                }
                const newDebounceTimer = setTimeout(() => {
                    dispatch(resetProducts());
                    dispatch(resetShops());
                    dispatch(resetRefurbishedProducts());
                }, 500); // Set delay as per your preference (500ms in this case)

                setDebounceTimer(newDebounceTimer);
            } else {
                console.warn('Invalid location data. Location update failed.');
            }
        } catch (error) {
            console.error('Error updating location in cookies:', error);
        }
    }, [debounceTimer, dispatch]);

    return { location, loading, updateLocation };
};

export default useLocationFromCookies;
