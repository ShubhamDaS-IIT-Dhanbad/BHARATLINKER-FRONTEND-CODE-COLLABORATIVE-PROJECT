import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BiSearchAlt } from "react-icons/bi";
import { TbCategory2 } from "react-icons/tb";
import { TiArrowSortedDown } from "react-icons/ti";
import { useUserLocation } from '../../hooks/userLocationHook.jsx';
import Cookies from 'js-cookie';
import './homeNavBar.css';
import { useDispatch } from 'react-redux';
import { resetProducts } from '../../redux/features/searchProductSlice.jsx';

import LocationTab from '../locationTab/locationTab.jsx';

function HomePageNavbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { address } = useUserLocation();

    const [homePageSearchInput, setHomePageSearchInput] = useState('');
    const [locationTab, setLocationTab] = useState(false);

    const handleHomePageSearchSubmit = () => {
        const trimmedInput = homePageSearchInput.trim();
        if (trimmedInput) {
            dispatch(resetProducts());
            navigate(`/search?query=${encodeURIComponent(trimmedInput)}`);
        }
    };

    const handleHomePageUserIconClick = () => {
        const userSession = Cookies.get('BharatLinkerUser');

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
                        <div className='home-page-user-location' onClick={() => setLocationTab(true)}>
                            <p className='home-page-location-label'>Bharat | Linker</p>
                            <div className='home-page-location-value'>
                                Baharampur, Murshidabad, WB
                                <TiArrowSortedDown size={15} />
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
