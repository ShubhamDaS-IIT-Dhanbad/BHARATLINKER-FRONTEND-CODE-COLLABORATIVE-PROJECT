import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BiSearchAlt } from "react-icons/bi";
import { TbCategory2 } from "react-icons/tb";
import { TiArrowSortedDown } from "react-icons/ti";
import Cookies from 'js-cookie';
import './homeNavBar.css';
import { useDispatch } from 'react-redux';
import { resetProducts } from '../../redux/features/searchPage/searchProductSlice.jsx';

import LocationTab from '../locationTab/locationTab.jsx';

function HomePageNavbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [homePageSearchInput, setHomePageSearchInput] = useState('');
    const [locationTab, setLocationTab] = useState(false);

    // Fetch location from cookies on component mount
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

    const handleHomePageSearchSubmit = () => {
        const trimmedInput = homePageSearchInput.trim();
        if (trimmedInput) {
            dispatch(resetProducts());
            navigate(`/search?query=${encodeURIComponent(trimmedInput)}`);
        }
    };

    const handleHomePageUserIconClick = () => {
        const userSession = Cookies.get('BharatLinkerUserData');

        if (userSession) {
            navigate('/user');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <div className='home-page-header-visible'>
                <div className='home-page-header-container'>
                    <div className='home-page-header-user-section'>
                        <HiOutlineUserCircle
                            id='home-page-user-icon'
                            size={40}
                            onClick={handleHomePageUserIconClick}
                        />
                        <div className='home-page-user-location'>
                            <p className='home-page-location-label'>Bharat | Linker</p>
                            <div className='home-page-location-value'>
                                {loading ? 'Loading...' : (location ? location?.address.slice(0, 30) : 'SET LOCATION , INDIA')}
                                <TiArrowSortedDown size={15} onClick={() => setLocationTab(true)}/>
                            </div>
                        </div>
                    </div>
                    <TbCategory2 size={30} className='home-page-category-icon' onClick={() => navigate('/refurbished')} />
                </div>

                <div className='home-page-search-section'>
                    <div className='home-page-search-input-container'>
                        <BiSearchAlt className='home-page-search-icon' onClick={handleHomePageSearchSubmit} />
                        <input
                            className='home-page-search-input'
                            placeholder="Search "
                            value={homePageSearchInput}
                            onChange={(e) => setHomePageSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleHomePageSearchSubmit()}
                        />
                    </div>
                </div>
            </div>

            {locationTab && <LocationTab setLocationTab={setLocationTab} />}
        </>
    );
}

export default HomePageNavbar;
