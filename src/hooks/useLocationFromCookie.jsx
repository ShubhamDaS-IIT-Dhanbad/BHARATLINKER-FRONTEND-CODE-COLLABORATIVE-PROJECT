import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useExecuteSearch } from './searchProductHook.jsx';
const useLocationFromCookies = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const { executeSearch } = useExecuteSearch();

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
        const storedLocation = Cookies.get('BharatLinkerUserLocation');
        if (!storedLocation) {
            // If no location data exists, store the new location
            Cookies.set('BharatLinkerUserLocation', JSON.stringify(newLocation), { expires: 7 });
        } else {
            try {
                const parsedLocation = JSON.parse(storedLocation);

                // Destructure the existing location and merge with new data (only updated fields)
                const updatedLocation = {
                    ...parsedLocation,
                    ...newLocation // This will update only the fields that are provided in `newLocation`
                };

                // Store the updated location in cookies
                Cookies.set('BharatLinkerUserLocation', JSON.stringify(updatedLocation), { expires: 7 });
                executeSearch();
            } catch (error) {
                console.error("Error parsing location data from cookies:", error);
            }
        }
    };

    return { location, loading, updateLocation };
};

export default useLocationFromCookies;
