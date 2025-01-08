import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BiSearchAlt } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

import './searchBar.css';
import { resetShopProducts } from '../../redux/features/shopProducts/searchProductSlice';

const ProductSearchBar = ({ shopId, setInputValue, inputValue,handleSearchProduct}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [locationTab, setLocationTab] = useState(false);
    const [shopName, setShopName] = useState("SHOP PRODUCTS");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setShopName(queryParams.get('shopName') || "SHOP PRODUCTS");
        const query = queryParams.get('query') || '';
        setInputValue(query);
    }, [location, setInputValue]);


    const handleSearch = () => {
        if (inputValue.trim()) {
            dispatch(resetShopProducts(shopId));
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            dispatch(resetShopProducts(shopId));
        }
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
    };

    return (
        <>
            <div className='shop-products-header-visible'>
                <div className='shop-products-header-container'>
                    <div className='shop-products-header-user-section'>
                        <FaArrowLeft
                            id='shop-products-user-icon'
                            size={25}
                            onClick={() => navigate(`/shop/${shopId}`)}
                            aria-label="Go Back"
                            tabIndex={0}
                        />
                        <div className='shop-products-user-location'>
                            <p className='shop-products-location-label'>{shopName.toUpperCase()} PAGE</p>
                            <div
                                className='shop-products-location-value'
                                onClick={() => setLocationTab(true)}
                                aria-label="Change Location"
                                tabIndex={0}
                            >
                                Baharampur, Murshidabad, WB
                            </div>
                        </div>
                    </div>
                </div>

                <div className='shop-products-search-section'>
                    <div className='shop-products-search-input-container'>
                        <BiSearchAlt
                            className='shop-products-search-icon'
                            onClick={handleSearch}
                            aria-label="Search"
                            tabIndex={0}
                        />
                        <input
                            className='shop-products-search-input'
                            placeholder="Search By Product Name"
                            value={inputValue}
                            onChange={handleInputChange}
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
