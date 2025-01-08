import React, { useState } from 'react';
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";
import { FaArrowLeft } from 'react-icons/fa'; // Import FaArrowLeft
import { useNavigate } from 'react-router-dom'; // Import navigate hook for routing
import LocationTab from '../locationTab/locationTab';
import './singleShopSearchBar.css';
import { useDispatch } from 'react-redux'; // Import useDispatch for dispatching actions
import { resetShops } from '../../redux/features/searchShopSlice.jsx'; // Ensure resetShops is imported

const SingleShopSearchBar = ({shopName}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize dispatch
    const [inputValue, setInputValue] = useState(''); // Initialize state for input value
    const [locationTab, setLocationTab] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            dispatch(resetShops());
            navigate(`/shop?query=${inputValue}`);
        }
    };

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
                            Baharampur, Murshidabad, WB
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
                        onKeyPress={handleKeyPress} // Detect "Enter" key press
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
