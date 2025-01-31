import { useState, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';
import conf from '../conf/conf.js';
import { useDispatch } from 'react-redux';
import { batch } from 'react-redux';

import { resetProducts } from '../redux/features/searchPage/searchProductSlice.jsx';
import { resetShops } from '../redux/features/searchShop/searchShopSlice.jsx';
import { resetRefurbishedProducts } from '../redux/features/refurbishedPage/refurbishedProductsSlice.jsx';

// Constants for cookie configuration
const LOCATION_COOKIE_NAME = 'BharatLinkerUserLocation';
const COOKIE_EXPIRY_DAYS = 7;
const DEFAULT_RADIUS_KM = 5;
const DEBOUNCE_TIMEOUT_MS = 150;

// API configuration
const GEOCODING_API = {
  GEOAPIFY: {
    URL: 'https://api.geoapify.com/v1/geocode/search',
    KEY: conf.geoapifyapikey,
  },
  OPENCAGE: {
    URL: conf.opencageapiurl,
    KEY: conf.opencageapikey,
  },
};
const useLocationManager = () => {
  const dispatch = useDispatch();
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  const [location, setLocation] = useState(() => {
    try {
      const cookieData = Cookies.get(LOCATION_COOKIE_NAME);
      return cookieData
        ? JSON.parse(cookieData)
        : { lat: 0, lon: 0, address: '', radius: DEFAULT_RADIUS_KM };
    } catch (error) {
      console.error('Error parsing location cookie:', error);
      return { lat: 0, lon: 0, address: '', radius: DEFAULT_RADIUS_KM };
    }
  });

  const getLocationFromCookie = useCallback(() => {
    try {
      const cookieData = Cookies.get(LOCATION_COOKIE_NAME);
      return cookieData
        ? JSON.parse(cookieData)
        : { lat: 0, lon: 0, address: '', radius: DEFAULT_RADIUS_KM };
    } catch (error) {
      console.error('Error parsing location cookie:', error);
      return { lat: 0, lon: 0, address: '', radius: DEFAULT_RADIUS_KM };
    }
  }, []);

  const persistLocation = useCallback((newLocation) => {
    Cookies.set(LOCATION_COOKIE_NAME, JSON.stringify(newLocation), {
      expires: COOKIE_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }, []);

  const resetStores = useCallback(() => {
    batch(() => {
      dispatch(resetProducts());
      dispatch(resetShops());
      dispatch(resetRefurbishedProducts());
    });
  }, [dispatch]);

  const debouncedResetStores = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      resetStores();
      debounceTimerRef.current = null;
    }, DEBOUNCE_TIMEOUT_MS);
  }, [resetStores]);

  const updateLocation = useCallback(
    (newLocation) => {
      setLocation((prev) => {
        const updated = {
          ...prev,
          ...newLocation,
          radius: typeof newLocation.radius === "number" && !isNaN(newLocation.radius)
            ? newLocation.radius
            : 0
        };
        persistLocation(updated);
        return updated;
      });
      debouncedResetStores();
    },
    [persistLocation, debouncedResetStores]
  );


  const fetchLocationSuggestions = useCallback(async (query) => {
    if (!query?.trim()) return [];

    try {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      const url = new URL(GEOCODING_API.GEOAPIFY.URL);
      url.search = new URLSearchParams({
        text: query,
        apiKey: GEOCODING_API.GEOAPIFY.KEY,
        lang: 'en',
        filter: 'countrycode:in',
      }).toString();

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const { features } = await response.json();

      return (features || [])
        .filter(({ properties }) => properties?.country === 'India' && properties?.state)
        .map(({ properties, geometry }) => ({
          label: properties.formatted,
          lat: geometry.coordinates[1],
          lon: geometry.coordinates[0],
          country: properties.country,
          state: properties.state,
          city: properties.city,
        }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Geocoding API error:', error);
      }
      return [];
    }
  }, []);

  const fetchCurrentLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      console.error('Geolocation is not supported');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude: lat, longitude: lon } = position.coords;
      const url = new URL(GEOCODING_API.OPENCAGE.URL);
      url.search = new URLSearchParams({
        key: GEOCODING_API.OPENCAGE.KEY,
        q: `${lat},${lon}`,
        pretty: 1,
        no_annotations: 1,
        limit: 1,
      }).toString();

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const [result] = data.results || [];

      if (result) {
        updateLocation({
          lat,
          lon,
          address: result.formatted,
          radius: DEFAULT_RADIUS_KM,
        });
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      throw new Error('Unable to retrieve your location');
    }
  }, [updateLocation]);


  return {
    location,
    getLocationFromCookie,
    updateLocation,
    fetchLocationSuggestions,
    fetchCurrentLocation
  };
};

export default useLocationManager;