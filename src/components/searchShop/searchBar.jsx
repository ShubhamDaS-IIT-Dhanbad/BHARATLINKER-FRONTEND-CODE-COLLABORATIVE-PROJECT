import React, { useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { TbChevronDown } from 'react-icons/tb';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './searchBar.css';
import LocationTab from '../locationTab/locationTab';
const ShopSearchBar = ({ shopQuery, handleSearchChange, handleSearch }) => {
    const navigate = useNavigate();
    const [locationTab, setLocationTab] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
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
                            onClick={() => navigate('/')}  // Navigate to home when clicked
                            aria-label="Go Back"
                            tabIndex={0}
                        />
                        <div className='shop-page-user-location'>
                            <p className='shop-page-location-label'>EXPLORE SHOP</p>
                            <div
                                className='shop-page-location-value'
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
                            value={shopQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            aria-label="Search input"
                        />
                    </div>
                </div>
            </div>
            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </>
    );
};

export default ShopSearchBar;
