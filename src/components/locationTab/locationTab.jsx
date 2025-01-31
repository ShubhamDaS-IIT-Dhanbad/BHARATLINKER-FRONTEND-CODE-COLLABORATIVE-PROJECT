import React, { useState, useEffect, useCallback } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { ThreeDots } from 'react-loader-spinner';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";
import useLocationFromCookie from '../../hooks/useLocationFromCookie.jsx';
import Map from '../map/map.jsx';
import './locationTab.css';

function LocationTab({ setLocationTab }) {
    const [showMap, setShowMap] = useState(false);
    const [latMap, setLat] = useState('');
    const [longMap, setLong] = useState('');
    const [addressMap, setAddress] = useState('');

    const [loading, setLoading] = useState(false);
    const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [radius, setRadius] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const { location, updateLocation, fetchLocationSuggestions, fetchCurrentLocation } = useLocationFromCookie();

    useEffect(() => {
        if (location) {
            setSearchQuery(location.address);
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
        if (e.key === 'Enter') {
            handleSearch();
        }
    };


    const handleAddressClick = (suggestion) => {
        
        setSearchQuery(suggestion.label);
        setSuggestions([]);
        setLat(suggestion.lat);
        setLong(suggestion.lon);
        setAddress(suggestion.label);
        setShowMap(true); 
    };

    const handleUseCurrentLocation = async () => {
        setFetchingUserLocation(true);
        const response=await fetchCurrentLocation();
        setFetchingUserLocation(false);
        console.log(response,location)
    };

    const predefinedRadiusOptions = [1, 2, 4, 5, 7, 9, 13, 15, 20, 30, 50, 100, 200];

    return (
        <>
            {showMap ? (
                <Map
                latMap={latMap}
                longMap={longMap}
                addressMap={addressMap}
                setLat={setLat}
                setLong={setLong}
                setAddress={setAddress}
                setShowMap={setShowMap} 
                setSearchQuery={setSearchQuery}
            />
            
            ) : (
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
                            <div className="radius-options">
                                {predefinedRadiusOptions.map((option) => (
                                    <button
                                        key={option}
                                        className={`radius-btn ${radius === option ? 'selected' : ''}`}
                                        onClick={() => {
                                            updateLocation({ radius: Number(option) });
                                            setRadius(option);
                                        }}
                                    >
                                        {option} km
                                    </button>
                                ))}
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
            )}
        </>
    );
}

export default LocationTab;