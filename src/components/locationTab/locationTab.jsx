import React, { useState, useEffect, useCallback } from 'react';
import { IoClose } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { ThreeDots } from 'react-loader-spinner';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import useLocationFromCookie from '../../hooks/useLocationFromCookie.jsx';

import { FaAngleLeft } from "react-icons/fa6";
import './locationTab.css';

function LocationTab({ setLocationTab }) {
    const [loading, setLoading] = useState(false);
    const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [radius, setRadius] = useState(5);
    const [suggestions, setSuggestions] = useState([]);

    const { location, updateLocation, fetchLocationSuggestions, fetchCurrentLocation } = useLocationFromCookie();

    useEffect(() => {
        if (location) {
            setSearchQuery(location.address);
            setRadius(location.radius || 5);
        } else {
            handleUseCurrentLocation();
        }
    }, [location]);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        const newSuggestions = await fetchLocationSuggestions(searchQuery);
        setSuggestions(newSuggestions);
        setLoading(false);
    }, [searchQuery, fetchLocationSuggestions]);

    const handleKeyDownSearch = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
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

    const handleUseCurrentLocation = async () => {
        setFetchingUserLocation(true);
        await fetchCurrentLocation();
        setFetchingUserLocation(false);
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
            radius: newRadius,
        });
    };

    const handleManualRadiusChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1 && value <= 300) {
            setRadius(value);
            updateLocation({
                radius: value,
            });
        }
    };

    return (
        <div className="location-tab-overlay">


            <div className="map-back-bar">
                <FaAngleLeft size={23} onClick={() => setLocationTab(false)} className="map-back-bar-icon" />
                Select Your Location
            </div>
            <div className="location-tab-container">
                    <div className="search-container">
                        <div className="search-input-container">
                            <IoSearch className="search-icon" size={20} />
                            <input
                                className="search-input"
                                placeholder="Search your city / pincode"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDownSearch}
                                aria-label="Search for location"
                            />
                            {searchQuery && (
                                <IoIosCloseCircleOutline
                                    className="clear-icon"
                                    size={20}
                                    onClick={() => setSearchQuery('')}
                                />
                            )}
                        </div>
                        <button className="current-location-button" onClick={handleUseCurrentLocation} aria-label="Use current location">
                            <MdMyLocation size={20} />
                            Use Current Location
                        </button>
                    </div>

                    <div className="radius-control-container">
                        <label>Set Searching Radius (km):</label>
                        <div className="radius-control">
                            <button className="radius-button" onClick={() => handleRadiusChange('decrease')}>
                                <CiSquareMinus size={25} />
                            </button>
                            <input
                                type="number"
                                className="radius-input"
                                value={radius}
                                min="1"
                                max="300"
                                onChange={handleManualRadiusChange}
                                aria-label="Set radius manually"
                            />
                            <button className="radius-button" onClick={() => handleRadiusChange('increase')}>
                                <CiSquarePlus size={25} />
                            </button>
                        </div>
                    </div>

                    {(loading || fetchingUserLocation) && (
                        <div className="loader-container">
                            <ThreeDots size={40} color="#007BFF" />
                        </div>
                    )}

                    {!loading && !fetchingUserLocation && suggestions.length > 0 && (
                        <div className="suggestions-container">
                            {suggestions.map((suggestion, index) => (
                                <div className="suggestion-item" key={index} onClick={() => handleAddressClick(suggestion)}>
                                    <SlLocationPin size={20} />
                                    <span className="suggestion-text">{suggestion.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
             
            </div>
        </div>
    );
}

export default LocationTab;