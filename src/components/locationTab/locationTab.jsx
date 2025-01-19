import React, { useState, useEffect, useCallback } from 'react';
import { IoClose } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { ThreeDots } from 'react-loader-spinner';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";
import useLocationFromCookie from '../../hooks/useLocationFromCookie.jsx';
import './locationTab.css';

function LocationTab({ setLocationTab }) {
    const [loading, setLoading] = useState(false);

    const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [radius, setRadius] = useState(5);
    const [suggestions, setSuggestions] = useState([]);

    const {location, updateLocation, fetchLocationSuggestions, fetchCurrentLocation } = useLocationFromCookie();

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
        <div className="location-tab">
            <div className="location-tab-IoIosCloseCircle" onClick={() => setLocationTab(false)} aria-label="Close location tab">
                <IoClose size={25} />
            </div>
            <p className="location-tab-bottom-div-p">LOCATION TAB</p>
            <div className="location-tab-bottom-div">
                <div className="location-tab-bottom-top-div">
                    <div className="location-tab-bottom-div-input-div">
                        <IoSearch onClick={handleSearch} size={20} />
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                        >
                            <input
                                className="location-tab-bottom-div-input"
                                placeholder="Search your city / pincode"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDownSearch}
                                aria-label="Search for location"
                            />
                        </form>

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
                        <CiSquareMinus size={40} onClick={() => handleRadiusChange('decrease')} />
                        <div className="location-tab-radius-input">
                            <input
                                type="number"
                                placeholder={radius}
                                min="1"
                                max="300"
                                onChange={handleManualRadiusChange}
                                aria-label="Set radius manually"
                            />km
                        </div>
                        <CiSquarePlus size={40} onClick={() => handleRadiusChange('increase')} />
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
