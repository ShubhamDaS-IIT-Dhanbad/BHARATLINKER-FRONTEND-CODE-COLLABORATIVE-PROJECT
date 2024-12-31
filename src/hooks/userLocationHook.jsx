import { useEffect, useState } from 'react';

export const useUserLocation = () => {
  const [address, setAddress] = useState({ city: "Enter", postcode: "Pincode" });
  const [userPincodes, setUserPincodes] = useState([]);

  useEffect(() => {
    try {
      // Load saved address and user pincodes from cookies
      const savedAddress = getCookie('address');
      const savedPincodes = getCookie('userpincodes');

      if (savedAddress) {
        const parsedAddress = JSON.parse(savedAddress);
        const locationCity = extractCity(parsedAddress);
        const locationPincode = parsedAddress.postcode || 'Add Pincode';
        setAddress({ city: locationCity, postcode: locationPincode });
      }

      if (savedPincodes) {
        const parsedPincodes = JSON.parse(savedPincodes);
        setUserPincodes(parsedPincodes);
      } else {
        fetchLocation();  // Fetch new location if no saved data
      }
    } catch (error) {
      console.error("Error loading user location from cookies", error);
    }
  }, []);

  const fetchLocation = async () => {
    try {
      const position = await getUserGeolocation();
      const { latitude, longitude } = position.coords;

      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
      if (!response.ok) throw new Error('Failed to fetch location');

      const data = await response.json();
      const locationCity = extractCity(data.address);
      const locationPincode = data.address.postcode || 'Add Pincode';

      if (!isNaN(locationPincode)) {
        const userPincodes = [{ pincode: locationPincode, selected: true }];
        setAddress({ city: locationCity, postcode: locationPincode });
        setUserPincodes(userPincodes);

        // Save address and pincodes to cookies
        setCookie('address', JSON.stringify(data.address), 1);  // 1 hour expiry
        setCookie('userpincodes', JSON.stringify(userPincodes), 1);
      }
    } catch (error) {
      console.error("Error fetching user location", error);
    }
  };

  // Helper function to get user's geolocation
  const getUserGeolocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  // Extract city or fallback values from address object
  const extractCity = (address) => {
    return (
      address.city ||
      address.town ||
      address.village ||
      address.state_district ||
      address.state ||
      'Unknown City'
    );
  };

  // Helper to set cookies with expiration
  const setCookie = (name, value, hours) => {
    const expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + (hours * 60 * 60 * 1000));
    const expires = `expires=${expirationTime.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
  };

  // Helper to get cookies by name
  const getCookie = (name) => {
    const cookieString = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
    return cookieString ? decodeURIComponent(cookieString.split('=')[1]) : null;
  };

  return { address, userPincodes, setUserPincodes, fetchLocation };
};
