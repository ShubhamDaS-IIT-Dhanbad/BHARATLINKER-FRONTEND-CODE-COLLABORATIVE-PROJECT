import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BiSearchAlt } from 'react-icons/bi';
import { TbChevronDown } from 'react-icons/tb';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import Cookies for cookie handling
import './searchBar.css';
import LocationTab from '../locationTab/locationTab';
import { resetShops } from '../../redux/features/searchShopSlice';

const ShopSearchBar = ({ inputValue, handleSearchChange, handleSearch }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [locationTab, setLocationTab] = useState(false);
    const [location, setLocation] = useState(null); // Declare location state
    const [loading, setLoading] = useState(true); // Declare loading state

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
    }, [locationTab]); // Re-run when locationTab changes

    // Handle Enter key press for search
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            dispatch(resetShops()); // Reset shops before the search
            handleSearch(); // Trigger the search function
        }
    };

    return (
        <>
            <div className='shop-page-header-visible'>
                <div className='shop-page-header-container'>
                    <div className='shop-page-header-user-section'>
                        <FaArrowLeft
                            id='shop-page-user-icon'
                            size={25}
                            onClick={() => navigate('/')}  // Navigate to home when clicked
                            aria-label="Go Back"
                            tabIndex={0}
                        />
                        <div className='shop-page-user-location'>
                            <p className='shop-page-location-label'>EXPLORE SHOP</p>
                            <div
                                className='shop-page-location-value'
                                onClick={() => setLocationTab(true)}
                                aria-label="Change Location"
                                tabIndex={0}
                            >
                                {/* Show loading or the location if available */}
                                {loading ? 'Loading location...' : (location ? location.address.slice(0,22) : 'Location not set')}
                                <TbChevronDown size={15} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='shop-page-search-section'>
                    <div className='shop-page-search-input-container'>
                        <BiSearchAlt
                            className='shop-page-search-icon'
                            onClick={handleSearch}  // Trigger search on icon click
                            aria-label="Search"
                            tabIndex={0}
                        />
                        <input
                            className='shop-page-search-input'
                            placeholder="Search By Shop Name"
                            value={inputValue}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            aria-label="Search input"
                        />
                    </div>
                </div>
            </div>
            {/* Render LocationTab if locationTab state is true */}
            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </>
    );
};

export default ShopSearchBar;
