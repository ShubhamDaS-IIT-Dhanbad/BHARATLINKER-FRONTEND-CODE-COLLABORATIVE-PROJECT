import React, { useState } from 'react';
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";
import { FaArrowLeft } from 'react-icons/fa'; // Back icon
import { useNavigate } from 'react-router-dom'; // Navigate hook for routing
import LocationTab from '../locationTab/locationTab';
import { useExecuteSearch } from '../../hooks/searchProductHook.jsx'; // Custom hook for search
import { resetProducts, fetchProducts } from '../../redux/features/searchPage/searchProductSlice.jsx';
import './singleProductSearchBar.css';
import { useSelector, useDispatch } from 'react-redux';

const SingleProductSearchBar = () => {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState(""); // State to hold input value
    const [locationTab, setLocationTab] = useState(false);
    const { setInputValue: setInputValueFromHook, executeSearch } = useExecuteSearch();

    // Handle key press for "Enter" key to trigger search
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            dispatch(resetProducts());
            navigate(`/search?query=${inputValue.trim()}`);
        }
    };

    // Handle input value change and update the state
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div className='single-product-search-header-visible'>
            {/* Header Section */}
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
                            onClick={() => setLocationTab(true)}
                            aria-label="Change Location"
                            tabIndex={0}
                        >
                            Baharampur, Murshidabad, WB
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className='single-product-search-input-section'>
                <div className='single-product-search-input-container'>
                    <BiSearchAlt
                        className='single-product-search-icon'
                        onClick={() => {
                            if (inputValue.trim()) {
                                navigate(`/search?query=${inputValue.trim()}`);
                            }
                        }}
                        aria-label="Search"
                        tabIndex={0}
                    />
                    <input
                        className='single-product-search-input'
                        placeholder="Search Product"
                        value={inputValue}
                        onKeyPress={handleKeyPress}
                        onChange={handleInputChange}
                        aria-label="Search input"
                    />
                </div>
            </div>

            {/* Location Tab */}
            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </div>
    );
};

export default SingleProductSearchBar;
