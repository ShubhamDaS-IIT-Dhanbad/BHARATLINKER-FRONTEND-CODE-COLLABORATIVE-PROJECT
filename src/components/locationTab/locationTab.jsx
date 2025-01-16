import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { IoClose } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import Cookies from 'js-cookie';
import useLocationFromCookie from '../../hooks/useLocationFromCookie.jsx';
import conf from '../../conf/conf.js';
import { ThreeDots } from 'react-loader-spinner';
import { IoIosCloseCircleOutline } from "react-icons/io";
import './locationTab.css';

import { CiSquareMinus } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";

function LocationTab({ setLocationTab }) {
    const [loading, setLoading] = useState(false);
    const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [radius, setRadius] = useState(5);
    const [suggestions, setSuggestions] = useState([]);
    const [radiusOptions] = useState([2, 3, 5, 7, 10]);

    const { updateLocation } = useLocationFromCookie();

    useEffect(() => {
        const storedLocation = Cookies.get('BharatLinkerUserLocation')
            ? JSON.parse(Cookies.get('BharatLinkerUserLocation'))
            : null;
        if (storedLocation) {
            setSearchQuery(storedLocation.address);
            setRadius(storedLocation.radius || 5);
        } else {
            handleUseCurrentLocation();
        }
    }, []);

    const fetchSuggestions = useCallback(async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        const apiKey = conf.geoapifyapikey;
        const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${apiKey}&lang=en`;

        setLoading(true);

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const formattedSuggestions = data.features
                    .filter((feature) => feature.properties.country === 'India' && feature.properties.state)
                    .map((feature) => ({
                        label: feature.properties.formatted,
                        lat: feature.geometry.coordinates[1],
                        lon: feature.geometry.coordinates[0],
                        country: feature.properties.country,
                        state: feature.properties.state,
                    }));
                setSuggestions(formattedSuggestions);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = () => {
        fetchSuggestions(searchQuery);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default behavior
            handleSearch(); // Call your search handler
        }
    };
    

    const handleAddressClick = (suggestion) => {
        setSearchQuery(suggestion.label);
        setSuggestions([]);
        updateLocation({
            lat: suggestion.lat,
            lon: suggestion.lon,
            address: suggestion.label,
            country: suggestion.country,
            state: suggestion.state,
        });
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            setFetchingUserLocation(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const apiKey = conf.opencageapikey;
                    const apiUrl = `${conf.opencageapiurl}?key=${apiKey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;

                    try {
                        const response = await fetch(apiUrl);
                        const data = await response.json();
                        if (data.results && data.results.length > 0) {
                            const address = data.results[0].formatted;
                            setSearchQuery(address);
                            updateLocation({
                                lat: latitude,
                                lon: longitude,
                                address: address,
                                radius: 5,
                            });
                            setRadius(5);
                        } else {
                            console.error('Address not found');
                        }
                    } catch (error) {
                        console.error('Error fetching address:', error);
                    } finally {
                        setFetchingUserLocation(false);
                    }
                },
                (error) => {
                    console.error('Error fetching current location:', error);
                    setFetchingUserLocation(false);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setFetchingUserLocation(false);
        }
    };

    const handleRadiusChange = (operation) => {
        let newRadius = radius;
        if (operation === 'increase' && radius < 200) {
            newRadius = radius + 1;
        } else if (operation === 'decrease' && radius > 1) {
            newRadius = radius - 1;
        }
        setRadius(newRadius);
        updateLocation({
            radius: newRadius
        });
    };

    const handleManualRadiusChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1 && value <= 300) {
            setRadius(value);
            updateLocation({
                radius: value
            });
        }
    };

    return (
        <div className="location-tab">
            <div className="location-tab-IoIosCloseCircle" onClick={() => setLocationTab(false)} aria-label="Close location tab">
                <IoClose size={25} />
            </div>
            <p className="location-tab-bottom-div-p">LOCATION TAB</p>
            <div className="location-tab-bottom-div">
                <div className="location-tab-bottom-top-div">
                    <div className="location-tab-bottom-div-input-div">
                        <IoSearch onClick={handleSearch} size={20} />
                        <input
                            className="location-tab-bottom-div-input"
                            placeholder="Search your city / pincode"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            aria-label="Search for location"
                        />
                        <IoIosCloseCircleOutline size={30} onClick={() => setSearchQuery('')} />
                    </div>
                    <div
                        className="location-tab-bottom-div-current-location"
                        onClick={handleUseCurrentLocation}
                        aria-label="Use current location"
                    >
                        <MdMyLocation size={23} />
                        Use current location
                    </div>
                </div>

                <div className="location-tab-radius-options-container">
                    <div className="location-tab-radius-options">
                        <CiSquareMinus size={40} onClick={() => handleRadiusChange('decrease')}/>
                            <div 
                            className='location-tab-radius-input'>
                        <input
                            type="number"
                            placeholder={radius}
                            min="1"
                            max="300"
                            onChange={handleManualRadiusChange}
                            aria-label="Set radius manually"
                        />km
                        </div>
                       <CiSquarePlus size={40} onClick={() => handleRadiusChange('increase')}/>
                    </div>
                </div>

                {(loading || fetchingUserLocation) && (
                    <div className="location-tab-loader">
                        <ThreeDots size={20} color="green" />
                    </div>
                )}

                {!loading && !fetchingUserLocation && suggestions.length > 0 && (
                    <div className="location-tab-suggestions">
                        {suggestions.map((suggestion, index) => (
                            <div className="location-tab-suggestion-info-div" key={index}>
                                <SlLocationPin size={17} />
                                <div className="location-tab-location-info-inner-div">
                                    <p
                                        className="location-tab-location-info-inner-div-2"
                                        onClick={() => handleAddressClick(suggestion)}
                                        aria-label={`Select ${suggestion.label}`}
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
