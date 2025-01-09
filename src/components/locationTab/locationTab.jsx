import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import Cookies from 'js-cookie';  // Import js-cookie

import conf from '../../conf/conf.js'; 

import './locationTab.css';

function LocationTab({ setLocationTab }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [storedLocation, setStoredLocation] = useState(null);

    // Check for stored location in cookies on component mount
    useEffect(() => {
        const location = Cookies.get('BharatLinkerUserLocation');
        if (location) {
            setStoredLocation(JSON.parse(location));  // Set the stored location if present
        }
    }, []);

    // Function to fetch location suggestions from Geoapify
    const fetchSuggestions = async (query, latitude, longitude) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
    
        const apiKey = conf.geoapifyapikey;  // Geoapify API key
        const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${apiKey}&lang=en`;
    
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log("Suggestions", data);
            if (data.features) {
                const formattedSuggestions = data.features.map((feature) => ({
                    label: feature.properties.formatted,
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0],
                }));
                setSuggestions(formattedSuggestions);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };
    

    // Handle search when user presses enter or triggers the search
    const handleSearch = () => {
        fetchSuggestions(searchQuery);
    };

    // Handle address click to set lat, long, and address in cookies
    const handleAddressClick = (suggestion) => {
        setSearchQuery(suggestion.label);
        setSuggestions([]); // Clear suggestions
        Cookies.set('BharatLinkerUserLocation', JSON.stringify({
            lat: suggestion.lat,
            lon: suggestion.lon,
            address: suggestion.label
        }), { expires: 7 }); // Expires in 7 days
        setStoredLocation({
            lat: suggestion.lat,
            lon: suggestion.lon,
            address: suggestion.label
        });
    };

    // Handle "Use Current Location" with Geoapify Reverse Geocoding
    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
    
                    const apiKey = conf.opencageapikey;  // Using env variable for API key
                    const apiUrl = `${conf.opencageapiurl}?key=${apiKey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;  // Pass lat, lon to API
                    
                    // Fetch address from OpenCage Geocoding API
                    try {
                        const response = await fetch(apiUrl);
                        const data = await response.json();
                        console.log(data);
                        if (data.results && data.results.length > 0) {
                            const address = data.results[0].formatted;
                            // Store location in cookies with lat, lon, and address
                            Cookies.set('BharatLinkerUserLocation', JSON.stringify({
                                lat: latitude,
                                lon: longitude,
                                address: address
                            }), { expires: 7 }); // Expires in 7 days
                            setStoredLocation({
                                lat: latitude,
                                lon: longitude,
                                address: address
                            });
                        } else {
                            console.error('Address not found');
                        }
                    } catch (error) {
                        console.error('Error fetching address:', error);
                    }
                },
                (error) => {
                    console.error('Error fetching current location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };
    

    return (
        <div className={`location-tab active`}>
            <div className='location-tab-IoIosCloseCircle' onClick={() => setLocationTab(false)}>
                <IoClose size={25} />
            </div>
            <div className='location-tab-bottom-div'>
                <p className='location-tab-bottom-div-p'>Select your Location</p>

                {/* Display the stored location if available */}
                {storedLocation && storedLocation.address && (
                    <p className='location-tab-stored-address'>
                        Current Location: {storedLocation.address}
                    </p>
                )}

                <div className='location-tab-bottom-div-input-div'>
                    <IoSearch size={20} />
                    <input
                        className='location-tab-bottom-div-input'
                        placeholder='Search your location'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div
                    className='location-tab-bottom-div-current-location'
                    onClick={handleUseCurrentLocation}
                >
                    <MdMyLocation size={23} />
                    Use current location
                </div>

                {/* Button to trigger the search */}
                <button onClick={handleSearch} className="location-tab-search-button">
                    Search
                </button>

                {/* Display location suggestions */}
                {suggestions.length > 0 && (
                    <div className='location-tab-suggestions'>
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className='location-tab-suggestion-item'
                                onClick={() => handleAddressClick(suggestion)}
                            >
                                <SlLocationPin size={17} />
                                <span>{suggestion.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LocationTab;
