/*COMPLETE*/
import React, { useState, useEffect } from 'react';
import { BiSearchAlt } from "react-icons/bi";
import { TbChevronDown } from "react-icons/tb";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LocationTab from '../locationTab/locationTab';
import './searchBar.css';
import { useDispatch } from 'react-redux';
import { resetProducts } from '../../redux/features/searchPage/searchProductSlice';

const SearchBar = ({ inputValue, onInputChange }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationTab, setLocationTab] = useState(false);

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
            setLoading(false);
        };

        fetchLocation();
    }, []);

  
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            dispatch(resetProducts());
        }
    };

    return (
        <>
            <div className='product-page-header-visible'>
                <div className='product-page-header-container'>
                    <div className='product-page-header-user-section'>
                        <FaArrowLeft
                            id='product-page-user-icon'
                            size={25}
                            onClick={() => navigate('/')} 
                            aria-label="Go to Home"
                            tabIndex={0}
                        />
                        <div className='product-page-user-location'>
                            <p className='product-page-location-label'>PRODUCT SECTION</p>
                            <div
                                className='product-page-location-value'
                                aria-label="Change Location"
                                tabIndex={0}
                            >
                                {loading ? 'Loading...' : (location ? location.address.slice(0, 30) : 'SET LOCATION , INDIA')}
                                <TbChevronDown size={15} onClick={() => setLocationTab(true)}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='product-page-search-section'>
                    <div className='product-page-search-input-container'>
                        <BiSearchAlt
                            className='product-page-search-icon'
                            onClick={() => dispatch(resetProducts())}
                            aria-label="Search"
                            tabIndex={0}
                        />
                        <input
                            className='product-page-search-input'
                            placeholder="Search Product"
                            value={inputValue}
                            onKeyPress={handleKeyPress}
                            onChange={onInputChange}
                            aria-label="Search input"
                        />
                    </div>
                </div>

            </div>

            {locationTab && <LocationTab setLocationTab={setLocationTab} />}</>
    );
};

export default SearchBar;
