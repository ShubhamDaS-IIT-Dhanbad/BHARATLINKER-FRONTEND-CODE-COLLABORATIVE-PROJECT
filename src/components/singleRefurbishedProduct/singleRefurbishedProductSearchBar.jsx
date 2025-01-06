import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LocationTab from '../locationTab/locationTab';
import './singleRefurbishedProductSearchBar.css';

import { resetRefurbishedProducts } from "../../redux/features/refurbishedPage/refurbishedProductsSlice.jsx";
const SingleRefurbishedProductSearchBar = () => {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [locationTab, setLocationTab] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            dispatch(resetRefurbishedProducts());
            navigate(`/refurbished?query=${inputValue}`);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div className='single-refurbished-product-search-header-visible'>
            <div className='single-refurbished-product-search-header-container'>
                <div className='single-refurbished-product-search-header-user-section'>
                    <FaArrowLeft
                        id='single-refurbished-product-search-back-icon' 
                        size={25} 
                        onClick={() => navigate('/refurbished')}
                        aria-label="Go Back"
                        tabIndex={0}
                    />
                    <div className='single-refurbished-product-search-header-location'>
                        <p className='single-refurbished-product-search-location-label'>REFURBISHED PRODUCT</p>
                        <div 
                            className='single-refurbished-product-search-location-value' 
                            onClick={() => setLocationTab(true)}
                            aria-label="Change Location"
                            tabIndex={0}
                        >
                            Baharampur, Murshidabad, WB
                            <TbChevronDown size={15} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='single-refurbished-product-search-input-section'>
                <div className='single-refurbished-product-search-input-container'>
                    <BiSearchAlt 
                        className='single-refurbished-product-search-icon' 
                        onClick={() => navigate(`/refurbished?query=${inputValue}`)}
                        aria-label="Search"
                        tabIndex={0}
                    />
                    <input
                        className='single-refurbished-product-search-input'
                        placeholder="Search Product"
                        value={inputValue}
                        onKeyPress={handleKeyPress}
                        onChange={handleInputChange}
                        aria-label="Search input"
                    />
                </div>
            </div>
            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </div>
    );
};

export default SingleRefurbishedProductSearchBar;
