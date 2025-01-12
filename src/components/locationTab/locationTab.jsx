import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import Cookies from 'js-cookie';
import useLocationFromCookie from '../../hooks/useLocationFromCookie.jsx';
import conf from '../../conf/conf.js';
import { ThreeDots } from 'react-loader-spinner';
import './locationTab.css';

function LocationTab({ setLocationTab }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [radius, setRadius] = useState(5);
    const [loading, setLoading] = useState(false);
    const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
    const [radiusOptions] = useState([1, 2, 4, 5, 7, 10]);
    const [showRadiusOptions, setShowRadiusOptions] = useState(true);

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

    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        const apiKey = conf.geoapifyapikey;
        const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${apiKey}&lang=en`;

        setLoading(true);
        setShowRadiusOptions(false);

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
    };

    const handleSearch = () => {
        fetchSuggestions(searchQuery);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleAddressClick = (suggestion) => {
        setSearchQuery(suggestion.label);
        setSuggestions([]);
        setShowRadiusOptions(true);
        console.log(suggestion);
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

    const handleRadiusChange = (radius) => {
        setRadius(radius);
        updateLocation({
            radius: radius
        });
    };

    return (
        <div className="location-tab">
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
                            placeholder="Search your city / pincode"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
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

                {/* Show radius options only if showRadiusOptions is true */}
                {true && (
                    <div className="location-tab-radius-options">
                        {radiusOptions.map((option) => (
                            <span
                                key={option}
                                className={`location-tab-radius-option ${option === radius ? 'selected' : 'unselected'}`}
                                onClick={() => handleRadiusChange(option)}
                            >
                                {option} km
                            </span>
                        ))}
                    </div>
                )}

                {/* Show loading spinner when fetching data */}
                {(loading || fetchingUserLocation) && (
                    <div className="location-tab-loader">
                        <ThreeDots size={20} color="green" />
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
