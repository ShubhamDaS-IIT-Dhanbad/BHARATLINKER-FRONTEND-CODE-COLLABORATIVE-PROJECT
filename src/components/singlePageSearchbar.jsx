import React, { useState} from 'react';
import { FaCaretDown, FaArrowLeft } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom'; 
import LocationTab from './locationTab/locationTab.jsx';
import useLocationFromCookie from '../hooks/useLocationFromCookie.jsx';
import './style/singlePageSearchbar.css';

const SinglePageSearchBar = ({ heading }) => {
    const navigate = useNavigate();
    const { getLocationFromCookie } = useLocationFromCookie();
    
    // Get user location from cookie
    const userLocation = getLocationFromCookie();
    
    const [locationTab, setLocationTab] = useState(false);
    const [location, setLocation] = useState(userLocation?.address || 'SET LOCATION, INDIA');

    // Handle the back navigation
    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <>
            <div className="single-product-search-header-visible">
                <div className="single-product-search-header-user-section">
                    <FaArrowLeft
                        id="single-product-search-back-icon"
                        size={25}
                        onClick={handleBackClick}
                    />
                    <div className="single-product-search-header-location">
                        <p className="single-product-search-location-label">{heading}</p>
                        <div
                            className="single-product-search-location-value"
                            aria-label="Change Location"
                            tabIndex={0}
                            onClick={() => setLocationTab(true)}
                        >
                            {location.slice(0, 30)}..
                        </div>
                    </div>
                </div>
            </div>

            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </>
    );
};

export default SinglePageSearchBar;
