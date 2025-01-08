import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BiSearchAlt } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './searchBar.css';

import { resetShopProducts } from '../../redux/features/shopProducts/searchProductSlice'; // Corrected import path

const ProductSearchBar = ({shopId, inputValue, handleSearchChange, handleSearch }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [locationTab, setLocationTab] = useState(false); // You can remove locationTab state if unused

    // Access the location object to get query parameters
    const location = useLocation();
    const [shopName, setShopName] = useState("");

    // Use useEffect to extract shopName from the query params
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setShopName(queryParams.get('shopName') || "SHOP PRODUCTS"); // Default to "SHOP PRODUCTS" if shopName is not available
    }, [location]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            dispatch(resetShopProducts()); // Reset products on Enter key
            handleSearch();
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
                            onClick={() => navigate(`/shop/${shopId}`)}  // Navigate to home when clicked
                            aria-label="Go Back"
                            tabIndex={0}
                        />
                        <div className='shop-page-user-location'>
                            <p className='shop-page-location-label'>{shopName.toUpperCase()}</p> {/* Corrected to call toUpperCase() */}
                            <div
                                className='shop-page-location-value'
                                onClick={() => setLocationTab(true)} // Location handling if needed
                                aria-label="Change Location"
                                tabIndex={0}
                            >
                                Baharampur, Murshidabad, WB
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
                            placeholder="Search By Product Name" 
                            value={inputValue}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            aria-label="Search input"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductSearchBar;
