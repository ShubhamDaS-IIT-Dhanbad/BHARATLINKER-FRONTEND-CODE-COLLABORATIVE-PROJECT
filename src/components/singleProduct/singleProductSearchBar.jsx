import React, { useState, useEffect } from 'react';
import { FaCaretDown } from "react-icons/fa";
import { FaArrowLeft } from 'react-icons/fa'; // Back icon
import { useNavigate } from 'react-router-dom'; // Navigate hook for routing
import LocationTab from '../locationTab/locationTab';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie'; // Import Cookies
import { resetProducts } from '../../redux/features/searchPage/searchProductSlice.jsx';
import './singleProductSearchBar.css';

const SingleProductSearchBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState(""); // State to hold input value
    const [locationTab, setLocationTab] = useState(false);
    const [location, setLocation] = useState(null); // Location state
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch location from cookies
    useEffect(() => {
        const fetchLocation = () => {
            const storedLocation = Cookies.get('BharatLinkerUserLocation');
            if (storedLocation) {
                try {
                    const parsedLocation = JSON.parse(storedLocation);
                    setLocation(parsedLocation);
                } catch (error) {
                    console.error("Error parsing location data from cookies:", error);
                    setLocation(null);
                }
            }
            setLoading(false); // Set loading to false after fetching location
        };

        fetchLocation();
    }, [locationTab]);

    return (
        <>
            {/* Header Section */}
            <div className='single-product-search-header-visible'>
                <div className='single-product-search-header-user-section'>
                    <FaArrowLeft
                        id='single-product-search-back-icon'
                        size={25}
                        onClick={() => navigate('/search')}
                        aria-label="Go Back"
                        tabIndex={0}
                    />
                    <div className='single-product-search-header-location'>
                        <p className='single-product-search-location-label'>PRODUCT INFO</p>
                        <div
                            className='single-product-search-location-value'
                            aria-label="Change Location"
                            tabIndex={0}
                        >
                            {loading ? 'Loading location...' : location ? location.address.slice(0,30): 'Location not set'}
                           <FaCaretDown size={15}/>
                        </div>
                    </div>
                </div>
            </div>

            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </>
    );
};

export default SingleProductSearchBar;
