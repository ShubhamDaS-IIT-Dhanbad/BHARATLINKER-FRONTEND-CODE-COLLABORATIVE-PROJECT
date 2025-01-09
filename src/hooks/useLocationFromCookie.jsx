import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux'; // Import useDispatch for Redux actions

import { resetProducts } from '../redux/features/searchPage/searchProductSlice.jsx';
import { resetShops } from '../redux/features/searchShopSlice.jsx';
import { resetRefurbishedProducts } from '../redux/features/refurbishedPage/refurbishedProductsSlice.jsx';

const useLocationFromCookies = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch(); // Initialize dispatch for Redux actions

    // Fetch location from cookies and set it in state
    const fetchLocation = () => {
        const storedLocation = Cookies.get('BharatLinkerUserLocation');
        if (storedLocation) {
            try {
                const parsedLocation = JSON.parse(storedLocation);
                setLocation(parsedLocation);
            } catch (error) {
                console.error("Error parsing location data from cookies:", error);
            }
        }
        setLoading(false);
    };

    // Load location when the component mounts
    useEffect(() => {
        fetchLocation();
    }, []);

    // Function to update location in cookies and state
    const updateLocation = (newLocation) => {
        const storedLocation = Cookies.get('BharatLinkerUserLocation');
        try {
            const parsedLocation = storedLocation ? JSON.parse(storedLocation) : {};
            const updatedLocation = {
                ...parsedLocation,
                ...newLocation, // Merge with new data
            };

            Cookies.set('BharatLinkerUserLocation', JSON.stringify(updatedLocation), { expires: 7 });
            setLocation(updatedLocation);
            dispatch(resetProducts());
            dispatch(resetShops());
            dispatch(resetRefurbishedProducts());
        } catch (error) {
            console.error("Error updating location data in cookies:", error);
        }
    };

    return { location, loading, updateLocation };
};

export default useLocationFromCookies;
