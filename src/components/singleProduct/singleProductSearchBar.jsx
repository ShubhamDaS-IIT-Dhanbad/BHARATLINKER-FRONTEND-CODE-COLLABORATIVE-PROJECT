import React, { useState } from 'react';
import { BiSearchAlt } from "react-icons/bi";
import { TbHomeMove, TbChevronDown } from "react-icons/tb";
import { FaArrowLeft } from 'react-icons/fa'; // Import FaArrowLeft
import { useNavigate } from 'react-router-dom'; // Import navigate hook for routing
import LocationTab from '../locationTab/locationTab';
import './singleProductSearchBar.css';

const SingleProductSearchBar = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState(""); // State to hold input value
    const [locationTab, setLocationTab] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            navigate(`/search?query=${inputValue}`);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Update input value on typing
    };

    return (
        <div className='single-product-search-header-visible'>
            <div className='single-product-search-header-container'>
                <div className='single-product-search-header-user-section'>
                    <FaArrowLeft
                        id='single-product-search-back-icon' 
                        size={25} 
                        onClick={() => navigate('/search')}
                        aria-label="Go Back"
                        tabIndex={0}
                    />
                    <div className='single-product-search-header-location'>
                        <p className='single-product-search-location-label'>PRODUCT DETAIL</p>
                        <div 
                            className='single-product-search-location-value' 
                            onClick={() => setLocationTab(true)}  // Navigate to pincode page
                            aria-label="Change Location"
                            tabIndex={0}
                        >
                            Baharampur, Murshidabad, WB
                            <TbChevronDown size={15} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='single-product-search-input-section'>
                <div className='single-product-search-input-container'>
                    <BiSearchAlt 
                        className='single-product-search-icon' 
                        onClick={() => navigate(`/search?query=${inputValue}`)}
                        aria-label="Search"
                        tabIndex={0}
                    />
                    <input
                        className='single-product-search-input'
                        placeholder="Search Product"
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

export default SingleProductSearchBar;
