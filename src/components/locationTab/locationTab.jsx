import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IoSearch} from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";
import { MdMyLocation } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { Oval } from 'react-loader-spinner';
import useLocationFromCookie from '../../hooks/useLocationFromCookie.jsx';
import Map from '../map/map.jsx';
import './locationTab.css';

// Constants for better readability and maintainability
const PREDEFINED_RADIUS_OPTIONS = [1, 2, 3, 5, 7, 9, 11, 13, 17, 19, 23, 29, 97, 203];
const DEBOUNCE_DELAY = 300;

const LocationTab = ({documentId, header, setLocationTab, setShowAddressDetail, setDeliveryAddress }) => {
    // State management
    const [loading, setLoading] = useState(false);
    const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [mapState, setMapState] = useState({ lat: '', long: '', address: '' });
    const [showMap, setShowMap] = useState(false);
    const [radius, setRadius] = useState('');

    // Custom hook for location management
    const { location, updateLocation, fetchLocationSuggestions } = useLocationFromCookie();

    // Ref for debounce timeout
    const debounceTimeout = useRef(null);

    // Set initial radius from location cookie
    useEffect(() => {
        if (location?.radius) setRadius(location.radius);
    }, [location]);

    // Debounced search handler
    const handleSearch = useCallback(async (query) => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const newSuggestions = await fetchLocationSuggestions(query);
            setSuggestions(newSuggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchLocationSuggestions]);

    // Debounced input handler
    const handleSearchInput = useCallback((e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => handleSearch(query), DEBOUNCE_DELAY);
    }, [handleSearch]);

    // Geolocation handler
    const handleUseCurrentLocation = useCallback(async () => {
        setFetchingUserLocation(true);
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                });
            });
            setMapState({
                lat: position.coords.latitude,
                long: position.coords.longitude,
                address: '',
            });
            setShowMap(true);
        } catch (error) {
            console.error('Error fetching current location:', error);
        } finally {
            setFetchingUserLocation(false);
        }
    }, []);

    // Suggestion click handler
    const handleAddressClick = useCallback((suggestion) => {
        setSearchQuery(suggestion.label);
        setMapState({
            lat: suggestion.lat,
            long: suggestion.lon,
            address: suggestion.label,
        });
        setShowMap(true);
    }, []);

    // Memoized radius controls
    const radiusControls = useMemo(() => (
        <div className="radius-options">
            {PREDEFINED_RADIUS_OPTIONS.map((option) => (
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
    ), [radius, updateLocation]);

    // Memoized current location section
    const currentLocationSection = useMemo(() => (
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
                        <Oval height={20} width={20} color="white" ariaLabel="loading" />
                    ) : 'Enable'}
                </button>
            </div>
        </div>
    ), [fetchingUserLocation, handleUseCurrentLocation]);

    // Render
    return showMap ? (
        <Map
            documentId={documentId}
            latMap={mapState.lat}
            longMap={mapState.long}
            addressMap={mapState.address}
            setShowMap={setShowMap}
            setDeliveryAddress={setDeliveryAddress}
            setShowAddressDetail={setShowAddressDetail}
            setLocationTab={setLocationTab}
        />
    ) : (
        <div className="location-tab-overlay">
            <div className="location-header">
                <FaAngleLeft className="back-icon" size={25} onClick={() => setLocationTab(false)} />
                <h2>{header || 'Your Location'}</h2>
            </div>

            <div className="search-section">
                <div className="search-input-container">
                    <IoSearch className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Enter city, pincode, or area"
                        value={searchQuery}
                        onChange={handleSearchInput}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    />
                    {searchQuery && (
                        <IoIosCloseCircleOutline
                            className="clear-icon"
                            size={20}
                            onClick={() => setSearchQuery('')}
                        />
                    )}
                </div>

                {loading && (
                    <div className="loading-indicator">
                        <Oval height={20} width={20} color="green" ariaLabel="loading" />
                    </div>
                )}

                {suggestions.length > 0 && (
                    <div className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={`${suggestion.label}-${index}`}
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

            {suggestions.length === 0 && currentLocationSection}

            {!window.location.pathname.includes('/user/cart') && !window.location.pathname.includes('/user/profile')&&(
                <div className="radius-control-container">
                    {radiusControls}
                </div>
            )}
        </div>
    );
};

export default React.memo(LocationTab);