import React, { useState, useEffect } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { TbCategory2 } from 'react-icons/tb';
import { BiSearchAlt } from 'react-icons/bi';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import LocationTab from '../locationTab/locationTab.jsx';


import { FaArrowLeft } from 'react-icons/fa';
import '../style/navbar.css';

import { useSelector } from 'react-redux';
//hooks

import useLocationFromCookie from '../../hooks/useLocationFromCookie.jsx';
import { useExecuteSearch } from '../../hooks/searchProductHook.jsx';
import { useSearchShop } from '../../hooks/searchShopHook.jsx';
import { useSearchRefurbishedProductsHook } from '../../hooks/searchRefurbishedHook.jsx'


const Navbar = ({ headerTitle }) => {

    const { location: userLocation } = useLocationFromCookie();

    const navigate = useNavigate();
    const location = useLocation();

    const [isLocationHas, setIsLocationHas] = useState(true);

    const { executeSearch } = useExecuteSearch();
    const { query: searchQuery } = useSelector((state) => state.searchproducts);
    const { executeSearchShop } = useSearchShop();
    const { query: shopQuery } = useSelector((state) => state.searchshops);
    const { executeSearchRefurbished } = useSearchRefurbishedProductsHook();
    const { query: refurbishedQuery } = useSelector((state) => state.refurbishedproducts);

    const [searchInput, setSearchInput] = useState('');
    const [locationTabVisible, setLocationTabVisible] = useState(false);

    useEffect(() => {
        if (!userLocation || !userLocation.address || !userLocation.lat || !userLocation.lon) {
            setIsLocationHas(false);
        } else { setIsLocationHas(true); }
    }, []);

    useEffect(() => {
        if (isSearchPage) {
            setSearchInput(searchQuery);
        } else if (isShopPage) {
            setSearchInput(shopQuery);
        } else if (isRefurbishedPage) {
            setSearchInput(refurbishedQuery);
        }
    }, []);

    const handleHomePageUserIconClick = () => {
        const userSession = Cookies.get('BharatLinkerUserData');
        navigate(userSession ? '/user' : '/login');
    };
    const toggleLocationTab = () => {
        setLocationTabVisible((prev) => !prev);
    };

    const isHomePage = location.pathname === '/';
    const isSearchPage = location.pathname === '/search';
    const isShopPage = location.pathname === '/shop';
    const isRefurbishedPage = location.pathname === '/refurbished';

    const handleSearch = (e) => {
        const inputValue = searchInput;
        if (e.key === 'Enter') {
            if (isHomePage) {
                executeSearch(inputValue);
                navigate(`/search?query=${encodeURIComponent(inputValue)}`);
            } else if (isSearchPage) {
                executeSearch(inputValue);
            } else if (isShopPage) {
                executeSearchShop(inputValue);
            } else if (isRefurbishedPage) {
                executeSearchRefurbished(inputValue);
            }
        }
    };

    const handleSearchIconClick = () => {
        const inputValue = searchInput;
        if (isHomePage) {
            executeSearch(inputValue);
            navigate(`/search?query=${encodeURIComponent(inputValue)}`);
        } else if (isSearchPage) {
            executeSearch(inputValue);
        } else if (isShopPage) {
            executeSearchShop(inputValue);
        } else if (isRefurbishedPage) {
            executeSearchRefurbished(inputValue);
        }
    };


    return (
        <>
            <div className={isHomePage ? "home-page-header-visible" : "product-page-header-visible"}>
                <div className={isHomePage ? "home-page-header-container" : "product-page-header-container"}>
                    <div className={isHomePage ? "home-page-header-user-section" : "product-page-header-user-section"}>
                        {isHomePage ? (
                            <HiOutlineUserCircle
                                id="home-page-user-icon"
                                size={40}
                                onClick={handleHomePageUserIconClick}
                            />
                        ) : (
                            <FaArrowLeft
                                id='product-page-user-icon'
                                size={25}
                                onClick={() => navigate('/')}
                                aria-label="Go to Home"
                                tabIndex={0}
                            />)
                        }
                        <div className={isHomePage ? "home-page-user-location" : "product-page-user-location"}>
                            <p className={isHomePage ? "home-page-location-label" : "product-page-location-label"}>
                                {headerTitle}
                            </p>
                            <div
                                className={isHomePage ? "home-page-location-value" : "product-page-location-value"}
                                
                            >
                                {userLocation?.address
                                    ? userLocation?.address.slice(0, 30)
                                    : 'SET LOCATION, INDIA'}
                                <TiArrowSortedDown size={15} onClick={toggleLocationTab}/>
                            </div>
                        </div>
                    </div>

                    {isHomePage && (
                        <TbCategory2
                            size={30}
                            className="home-page-category-icon"
                            onClick={() => navigate('/refurbished')}
                        />
                    )}
                </div>

                <div className={isHomePage ? "home-page-search-section" : "product-page-search-section"}>
                    <div className={isHomePage ? "home-page-search-input-container" : "product-page-search-input-container"}>
                        <BiSearchAlt
                            className={isHomePage ? "home-page-search-icon" : "product-page-search-icon"}
                            onClick={handleSearchIconClick}
                        />
                        <input
                            className={isHomePage ? "home-page-search-input" : "product-page-search-input"}
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {locationTabVisible && (
                <LocationTab setLocationTab={setLocationTabVisible} />
            )}
            {!isLocationHas &&
                <div className="home-location-not-present">
                    <div className="home-location-not-present-d1">
                        <div className="home-location-not-present-message">User Your Location is not set</div>
                        <div className="home-location-not-present-options" onClick={()=>{setLocationTabVisible(true); setIsLocationHas(true)}}>
                            <div className="home-location-not-present-use-loc-btn">USE CURRENT LOCATION</div>
                            <div className="home-location-not-present-use-manual-btn">SEARCH MANUALLY</div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Navbar;
