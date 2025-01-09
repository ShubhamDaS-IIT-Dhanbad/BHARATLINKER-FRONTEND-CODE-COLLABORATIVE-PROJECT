import React, { useState } from 'react';
import { BiSearchAlt } from "react-icons/bi";
import { TbHomeMove, TbChevronDown } from "react-icons/tb";
import { FaArrowLeft } from 'react-icons/fa'; // Import FaArrowLeft
import { useNavigate } from 'react-router-dom'; // Import navigate hook for routing
import LocationTab from '../locationTab/locationTab';
import useLocationFromCookies from '../../hooks/useLocationFromCookie.jsx'; // Import the custom hook
import './searchBar.css';

const SearchBar = ({ inputValue, onInputChange, onSearch, onNavigateHome }) => {
    const navigate = useNavigate(); // Initialize navigate hook
    const [locationTab, setLocationTab] = useState(false);

    // Using the custom hook to get user location from cookies
    const { location, loading } = useLocationFromCookies();

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className='product-page-header-visible'>
            <div className='product-page-header-container'>
                <div className='product-page-header-user-section'>
                    <FaArrowLeft
                        id='product-page-user-icon' 
                        size={25} 
                        onClick={() => navigate('/')}  // Navigate to home when clicked
                        aria-label="Go to Home" 
                        tabIndex={0}
                    />
                    <div className='product-page-user-location'>
                        <p className='product-page-location-label'>PRODUCT SECTION</p>
                        <div 
                            className='product-page-location-value' 
                            onClick={() => setLocationTab(true)}  // Navigate to location tab
                            aria-label="Change Location"
                            tabIndex={0}
                        >
                            {/* Display loading text or address if available */}
                            {loading ? 'Loading...' : (location ? location.address : 'Location not set')}
                            <TbChevronDown size={15} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='product-page-search-section'>
                <div className='product-page-search-input-container'>
                    <BiSearchAlt 
                        className='product-page-search-icon' 
                        onClick={onSearch}  // Trigger search on icon click
                        aria-label="Search"
                        tabIndex={0}
                    />
                    <input
                        className='product-page-search-input'
                        placeholder="Search Product"
                        value={inputValue}  // Controlled input value
                        onKeyPress={handleKeyPress} // Detect "Enter" key press
                        onChange={onInputChange}  // Handle input change
                        aria-label="Search input"
                    />
                </div>
            </div>
            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </div>
    );
};

export default SearchBar;
