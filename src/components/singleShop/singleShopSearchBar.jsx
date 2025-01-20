import React, { useState, useEffect } from 'react';
import { FaCaretDown } from "react-icons/fa";
import { FaArrowLeft } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 
import LocationTab from '../locationTab/locationTab';
import Cookies from 'js-cookie';
import './singleShopSearchBar.css';

const SingleProductSearchBar = () => {
    const navigate = useNavigate();
    const [locationTab, setLocationTab] = useState(false);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true); 

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
    }, [locationTab]);

    return (
        <>
            <div className='single-product-search-header-visible'>
                <div className='single-product-search-header-user-section'>
                    <FaArrowLeft
                        id='single-product-search-back-icon'
                        size={25}
                        onClick={() => navigate('/shop')}  // This will navigate to the previous page
                        aria-label="Go Back"
                        tabIndex={0}
                    />
                    <div className='single-product-search-header-location'>
                        <p className='single-product-search-location-label'>SHOP INFO</p>
                        <div
                            className='single-product-search-location-value'
                            aria-label="Change Location"
                            tabIndex={0}
                        >
                            {loading ? 'Loading location...' : location ? location.address.slice(0,30) : 'Location not set'}
                           {/* <FaCaretDown size={15}/> */}
                        </div>
                    </div>
                </div>
            </div>

            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </>
    );
};

export default SingleProductSearchBar;
