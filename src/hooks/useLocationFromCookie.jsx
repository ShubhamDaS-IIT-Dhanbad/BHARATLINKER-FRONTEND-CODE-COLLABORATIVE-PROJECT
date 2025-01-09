import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useLocationFromCookies = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, []);

    return { location, loading }; // Return location and loading state
};

export default useLocationFromCookies;
