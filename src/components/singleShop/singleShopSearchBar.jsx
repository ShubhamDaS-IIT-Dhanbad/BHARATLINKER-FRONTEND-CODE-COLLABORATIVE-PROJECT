import React, { useState, useEffect } from 'react';
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LocationTab from '../locationTab/locationTab';
import Cookies from 'js-cookie'; // Import Cookies
import './singleShopSearchBar.css';
import { useDispatch } from 'react-redux';
import { resetShops } from '../../redux/features/searchShopSlice.jsx'; // Ensure resetShops is imported

const SingleShopSearchBar = ({ shopName }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize dispatch
    const [inputValue, setInputValue] = useState(''); // Initialize state for input value
    const [locationTab, setLocationTab] = useState(false);
    const [location, setLocation] = useState(null); // Add state for location
    const [loading, setLoading] = useState(true); // Add state for loading

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

    // Handle key press for "Enter" key to trigger search
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            dispatch(resetShops());
            navigate(`/shop?query=${inputValue}`);
        }
    };

    // Handle input value change and update the state
    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Update input value on typing
    };

    return (
        <div className='single-shop-search-header-visible'>
            <div className='single-shop-search-header-container'>
                <div className='single-shop-search-header-user-section'>
                    <FaArrowLeft
                        id='single-shop-search-back-icon' 
                        size={25} 
                        onClick={() => navigate('/shop')}
                        aria-label="Go Back"
                        tabIndex={0}
                    />
                    <div className='single-shop-search-header-location'>
                        <p className='single-shop-search-location-label'>{shopName}</p>
                        <div 
                            className='single-shop-search-location-value' 
                            onClick={() => setLocationTab(true)}  // Navigate to pincode page
                            aria-label="Change Location"
                            tabIndex={0}
                        >
                            {loading ? 'Loading location...' : location ? location.address.slice(0,22) : 'Location not set'}
                            <TbChevronDown size={15} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='single-shop-search-input-section'>
                <div className='single-shop-search-input-container'>
                    <BiSearchAlt 
                        className='single-shop-search-icon' 
                        onClick={() => navigate(`/search?query=${inputValue}`)}
                        aria-label="Search"
                        tabIndex={0}
                    />
                    <input
                        className='single-shop-search-input'
                        placeholder="Search Shop"
                        value={inputValue}  // Controlled input value
                        onKeyDown={handleKeyDown} // Changed to onKeyDown
                        onChange={handleInputChange}  // Handle input change
                        aria-label="Search input"
                    />
                </div>
            </div>
            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </div>
    );
};

export default SingleShopSearchBar;
