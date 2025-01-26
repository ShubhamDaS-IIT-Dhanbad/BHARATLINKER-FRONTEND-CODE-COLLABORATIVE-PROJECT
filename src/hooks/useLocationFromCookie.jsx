import { useState } from 'react';
import Cookies from 'js-cookie';
import conf from '../conf/conf.js';

import { useDispatch } from 'react-redux';
import { resetProducts } from '../redux/features/searchPage/searchProductSlice.jsx';
import { resetShops } from '../redux/features/searchShop/searchShopSlice.jsx';
import { resetRefurbishedProducts } from '../redux/features/refurbishedPage/refurbishedProductsSlice.jsx';

const useLocationFromCookie = () => {
    const dispatch = useDispatch();
    const [debounceTimer, setDebounceTimer] = useState(null);

    const getLocationFromCookie = () => {
        const storedLocation = Cookies.get('BharatLinkerUserLocation')
            ? JSON.parse(Cookies.get('BharatLinkerUserLocation'))
            : { lat: 0, lon: 0, address: '', radius: 5 };
        return storedLocation;
    };

    const [location, setLocation] = useState(getLocationFromCookie);

    const updateLocation = (newLocation) => {
        setLocation((prevLocation) => {
            const updatedLocation = { ...prevLocation, ...newLocation };
            Cookies.set('BharatLinkerUserLocation', JSON.stringify(updatedLocation), { expires: 1 });
            return updatedLocation;
        });

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        const newDebounceTimer = setTimeout(() => {
            dispatch(resetProducts());
            dispatch(resetShops());
            dispatch(resetRefurbishedProducts());
        }, 100);

        setDebounceTimer(newDebounceTimer);
    };

    const fetchLocationSuggestions = async (query) => {
        if (!query) return [];

        const apiKey = conf.geoapifyapikey;
        const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${apiKey}&lang=en`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                return data.features
                    .filter((feature) => feature.properties.country === 'India' && feature.properties.state)
                    .map((feature) => ({
                        label: feature.properties.formatted,
                        lat: feature.geometry.coordinates[1],
                        lon: feature.geometry.coordinates[0],
                        country: feature.properties.country,
                        state: feature.properties.state,
                    }));
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            return [];
        }
    };

    const fetchCurrentLocation = async () => {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;
                const apiUrl = `${conf.opencageapiurl}?key=${conf.opencageapikey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const address = data.results[0].formatted;
                    updateLocation({
                        lat: latitude,
                        lon: longitude,
                        address: address,
                        radius: 5,
                    });
                }
            } catch (error) {
                console.error('Error fetching current location:', error);
            }
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };


    const fetchCurrentLocationHook = async () => {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
    
                const { latitude, longitude } = position.coords;
                const apiUrl = `${conf.opencageapiurl}?key=${conf.opencageapikey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;
    
                const response = await fetch(apiUrl);
                console.log(response)
                if (!response.ok) {
                    throw new Error('Failed to fetch location data');
                }
    
                const data = await response.json();
                const address = data.results[0]?.formatted;
    
                if (address) {
                    return {
                        response
                    };
                } else {
                    throw new Error('Unable to fetch address. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching address:', error);
                alert('Failed to fetch location. Please try again later.');
                return null;
            }
        } else {
            alert('Geolocation is not supported by your browser.');
            return null;
        }
    };
    
    return {
        location,
        getLocationFromCookie,
        updateLocation,
        fetchLocationSuggestions,
        fetchCurrentLocation
    };
};

export default useLocationFromCookie;
