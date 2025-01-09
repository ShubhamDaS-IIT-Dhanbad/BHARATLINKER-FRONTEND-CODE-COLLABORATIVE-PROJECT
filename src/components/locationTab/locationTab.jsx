import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import Cookies from 'js-cookie'; // Import js-cookie
import useLocationFromCookie from '../../hooks/useLocationFromCookie.jsx'; // Import custom hook
import conf from '../../conf/conf.js';
import { RotatingLines } from 'react-loader-spinner'; // Import RotatingLines loader

import './locationTab.css';

function LocationTab({ setLocationTab }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false); // State for loading
    const [fetchingUserLocation, setFetchingUserLocation] = useState(false);

    // Using the custom hook to get stored location and updateLocation
    const { updateLocation } = useLocationFromCookie();

    // Function to fetch location suggestions from Geoapify
    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        const apiKey = conf.geoapifyapikey; // Geoapify API key
        const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${apiKey}&lang=en`;

        setLoading(true); // Show loader before fetching

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const formattedSuggestions = data.features.map((feature) => ({
                    label: feature.properties.formatted,
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0],
                    country: feature.properties.country,
                    state: feature.properties.state || feature.properties.city,
                }));
                setSuggestions(formattedSuggestions);
            } else {
                setSuggestions([]); // Clear suggestions if no results
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]); // Clear suggestions on error
        } finally {
            setLoading(false); // Hide loader after fetching
        }
    };

    // Handle search when user presses enter or triggers the search
    const handleSearch = () => {
        fetchSuggestions(searchQuery);
    };

    // Handle the "Enter" key press for search
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle address click to set lat, long, and address in cookies
    const handleAddressClick = (suggestion) => {
        setSearchQuery(suggestion.label);
        setSuggestions([]);

        // Update the location using the updateLocation function from the hook
        updateLocation({
            lat: suggestion.lat,
            lon: suggestion.lon,
            address: suggestion.label,
            country: suggestion.country,
            state: suggestion.state,
        });
    };

    // Handle "Use Current Location" with Geoapify Reverse Geocoding
    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            setFetchingUserLocation(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    const apiKey = conf.opencageapikey; // Using env variable for API key
                    const apiUrl = `${conf.opencageapiurl}?key=${apiKey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;  // Pass lat, lon to API

                    // Fetch address from OpenCage Geocoding API
                    try {
                        const response = await fetch(apiUrl);
                        const data = await response.json();
                        if (data.results && data.results.length > 0) {
                            const address = data.results[0].formatted;
                            // Store location in cookies with lat, lon, and address
                            updateLocation({
                                lat: latitude,
                                lon: longitude,
                                address: address,
                            });
                        } else {
                            console.error('Address not found');
                        }
                    } catch (error) {
                        console.error('Error fetching address:', error);
                    } finally {
                        setFetchingUserLocation(false); // Stop loading
                    }
                },
                (error) => {
                    console.error('Error fetching current location:', error);
                    setFetchingUserLocation(false); // Stop loading on error
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setFetchingUserLocation(false); // Stop loading if geolocation is not supported
        }
    };

    return (
        <div className="location-tab active">
            <div className="location-tab-IoIosCloseCircle" onClick={() => setLocationTab(false)}>
                <IoClose size={25} />
            </div>
            <p className="location-tab-bottom-div-p">LOCATION TAB</p>
            <div className="location-tab-bottom-div">
                <div className="location-tab-bottom-top-div">
                    <div className="location-tab-bottom-div-input-div">
                        <IoSearch onClick={handleSearch} size={20} />
                        <input
                            className="location-tab-bottom-div-input"
                            placeholder="Search your location"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown} // Listen for "Enter" key press
                        />
                    </div>
                    <div
                        className="location-tab-bottom-div-current-location"
                        onClick={handleUseCurrentLocation}
                    >
                        <MdMyLocation size={23} />
                        Use current location
                    </div>
                </div>

                {/* Show loading spinner when fetching data */}
                {(loading || fetchingUserLocation) && (
                    <div className="location-tab-loader">
                        <RotatingLines
                            width="50"
                            height="50"
                            color="#00BFFF"
                            ariaLabel="rotating-lines-loading"
                        />
                    </div>
                )}

                {/* Display location suggestions */}
                {!loading && !fetchingUserLocation && suggestions.length > 0 && (
                    <div className="location-tab-suggestions">
                        {suggestions.map((suggestion, index) => (
                            <div className="location-tab-suggestion-info-div" key={index}>
                                <SlLocationPin size={17} />
                                <div className="location-tab-location-info-inner-div">
                                    <p
                                        className="location-tab-location-info-inner-div-2"
                                        onClick={() => handleAddressClick(suggestion)}
                                    >
                                        {suggestion.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default LocationTab;
