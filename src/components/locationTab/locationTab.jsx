

import React, { useState, useEffect, useCallback } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { Oval } from 'react-loader-spinner';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";
import useLocationFromCookie from '../../hooks/useLocationFromCookie.jsx';
import Map from '../map/map.jsx';
import './locationTab.css';


function LocationTab({ setLocationTab }) {

    const [loading, setLoading] = useState(false);
    const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [latMap, setLat] = useState('');
    const [longMap, setLong] = useState('');
    const [radius, setRadius] = useState('');
    const [addressMap, setAddress] = useState('');

    const [showMap, setShowMap] = useState(false);
    const { location, updateLocation, fetchLocationSuggestions } = useLocationFromCookie();
    useEffect(() => {
        if (location) {
            setRadius(location.radius || '');
        }
    }, [location]);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        const newSuggestions = await fetchLocationSuggestions(searchQuery);
        setSuggestions(newSuggestions);
        setLoading(false);
    }, [searchQuery, fetchLocationSuggestions]);

    const handleKeyDownSearch = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleAddressClick = (suggestion) => {
        setSearchQuery(suggestion.label);
        setLat(suggestion.lat);
        setLong(suggestion.lon);
        setAddress(suggestion.label);
        setShowMap(true);
    };

    const handleUseCurrentLocation = async () => {
        setFetchingUserLocation(true);
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                });
            });
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
            setAddress('');
            setShowMap(true);
        } catch (error) {
            console.error("Error getting location:", error);
        }
        setFetchingUserLocation(false);
    };


    const predefinedRadiusOptions = [1, 2, 3, 5, 7, 9,11, 13, 17, 19, 23, 29, 97, 203];

    return (
        <>
            {showMap ? (
                <Map
                    latMap={latMap}
                    longMap={longMap}
                    addressMap={addressMap}
                    setShowMap={setShowMap}
                    setLocationTab={setLocationTab}
                />

            ) : (
                <div className="location-tab-overlay">
                    <div className="location-header">
                        <FaAngleLeft style={{ position: "fixed", left: "20px" }} size={25} onClick={() => setLocationTab(false)} className="back-icon" />
                        <h2>Your Location</h2>
                    </div>


                    <div className="search-section">
                        <div className="search-input-container">
                            <IoSearch className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Enter city, pincode, or area"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDownSearch}
                            />
                            {searchQuery && (
                                <IoIosCloseCircleOutline
                                    className="clear-icon"
                                    size={20}
                                    onClick={() => setSearchQuery('')}
                                />
                            )}
                        </div>

                        {loading &&
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                                <Oval height={20} width={20} color="green" ariaLabel="loading" />
                            </div>}

                        {suggestions.length > 0 && (
                            <div className="suggestions-list">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="suggestion-item"
                                        onClick={() => handleAddressClick(suggestion)}
                                    >
                                        <SlLocationPin size={18} />
                                        <span>{suggestion.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>



                    {suggestions.length == 0 &&
                        <div className="location-content">
                            <div className="current-location-section">
                                <div className="location-prominent-button" onClick={handleUseCurrentLocation}>
                                    <MdMyLocation size={19} className="location-icon" />
                                    <div className="location-text">
                                        <h3>Current Location</h3>
                                        <p>Enable your current location for better services</p>
                                    </div>
                                </div>
                                <button
                                    className="enable-button"
                                    onClick={handleUseCurrentLocation}
                                    disabled={fetchingUserLocation}
                                >
                                    {fetchingUserLocation ? (
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Oval height={20} width={20} color="white" ariaLabel="loading" />
                                        </div>
                                    ) : (
                                        "Enable"
                                    )}
                                </button>
                            </div>
                        </div>
                    }


                    <div className="radius-control-container">
                        <div className="radius-options">
                            {predefinedRadiusOptions.map((option) => (
                                <div
                                    key={option}
                                    className={`radius-btn ${radius === option ? 'selected' : ''}`}
                                    onClick={() => {
                                        updateLocation({ radius: Number(option) });
                                        setRadius(option);
                                    }}
                                >
                                    {option} km
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default LocationTab;