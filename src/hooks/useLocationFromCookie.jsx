import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useLocationFromCookies = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch location from cookies and set it in state
    const fetchLocation = () => {
        const storedLocation = Cookies.get('BharatLinkerUserLocation');
        if (storedLocation) {
            try {
                const parsedLocation = JSON.parse(storedLocation);
                setLocation(parsedLocation);
            } catch (error) {
                console.error("Error parsing location data from cookies:", error);
                setLocation(null);
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
        Cookies.set('BharatLinkerUserLocation', JSON.stringify(newLocation), { expires: 7 });
    };

    return { location, loading, updateLocation };
};

export default useLocationFromCookies;
