import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa6";
import { useUserLocation } from '../../hooks/userLocationHook.jsx';
import './refurbishedNavbar.css';

import { useDispatch } from 'react-redux';
import { resetRefurbishedProducts } from '../../redux/features/refurbishedProductsSlice.jsx';
import LocationTab from '../locationTab/locationTab.jsx';

function RefurbishedNavbar({ handleSearchChange, handleSearch }) {
    const navigate = useNavigate();
    const [locationTab, setLocationTab] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <div className={'refurbished-page-header-visible'}>
                <div className='refurbished-page-header-container'>
                    <div className='refurbished-page-header-user-section'>
                        <FaArrowLeft
                            id='refurbished-page-user-icon'
                            size={25}
                            onClick={() => navigate('/')}
                            aria-label="User Account"
                            tabIndex={0}
                        />
                        <div className='refurbished-page-user-location'>
                            <p className='refurbished-page-location-label'>REFURBISHED SECTION</p>
                            <div
                                className='refurbished-page-location-value'
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

                <div className='refurbished-page-search-section'>
                    <div className='refurbished-page-search-input-container'>
                        <BiSearchAlt
                            className='refurbished-page-search-icon'
                            onClick={handleSearch}
                            aria-label="Search"
                            tabIndex={0}
                        />
                        <input
                            className='refurbished-page-search-input'
                            placeholder="Search"
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
}

export default RefurbishedNavbar;
