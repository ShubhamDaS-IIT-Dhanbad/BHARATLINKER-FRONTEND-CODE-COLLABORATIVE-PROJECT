import React, { useState, useEffect } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { BiSearchAlt } from 'react-icons/bi';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import LocationTab from './locationTab/locationTab.jsx';
import useLocationFromCookie from '../hooks/useLocationFromCookie.jsx';
import { useExecuteSearch } from '../hooks/searchProductHook.jsx';
import { useSearchShop } from '../hooks/searchShopHook.jsx';
import { useShopProductExecuteSearch } from '../hooks/searchShopProductHook.jsx';
import './style/navbar.css';
// this is
const Navbar = ({ headerTitle, shopId }) => {
    const { getLocationFromCookie } = useLocationFromCookie();
    const navigate = useNavigate();
    const location = useLocation();
    const userLocation = getLocationFromCookie();
    const [isLocationHas, setIsLocationHas] = useState(!!(userLocation?.address && userLocation?.lat && userLocation?.lon));
    const [searchInput, setSearchInput] = useState('');
    const [locationTabVisible, setLocationTabVisible] = useState(false);
    const { executeSearch } = useExecuteSearch();
    const { query: searchQuery } = useSelector((state) => state.searchproducts);
    const { executeSearchShop } = useSearchShop();
    const { query: shopQuery } = useSelector((state) => state.searchshops);
    const { executeShopProductSearch } = useShopProductExecuteSearch(shopId);
    const { query: shopProductQuery } = useSelector((state) => state.shopproducts);
    const isHomePage = location.pathname === '/';
    const isSearchPage = location.pathname === '/search';
    const isShopPage = location.pathname === '/shop';
    const isShopProductPage = location.pathname.startsWith('/shop/product');

    useEffect(() => {
        if (isSearchPage) {
            setSearchInput(searchQuery);
        } else if (isShopPage) {
            setSearchInput(shopQuery);
        }
    }, [isSearchPage, isShopPage, searchQuery, shopQuery]);

    const handleHomePageUserIconClick = () => {
        const userSession = Cookies.get('BharatLinkerUserData');
        navigate(userSession ? '/user' : '/login');
    };

    const toggleLocationTab = () => setLocationTabVisible((prev) => !prev);

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (isHomePage) {
                executeSearch(searchInput);
                navigate(`/search?query=${encodeURIComponent(searchInput)}`);
            } else if (isSearchPage) {
                executeSearch(searchInput);
            } else if (isShopPage) {
                executeSearchShop(searchInput);
            } else if (isShopProductPage) {
                executeShopProductSearch(searchInput);
            }
        }
    };

    return (
        <>
            <div className={isHomePage ? "home-page-header-visible" : "product-page-header-visible"}>
                <div className={isHomePage ? "home-page-header-container" : "product-page-header-container"}>
                    <div className={isHomePage ? "home-page-header-user-section" : "product-page-header-user-section"}>
                        {isHomePage ? (
                            <HiOutlineUserCircle size={40} id="home-page-user-icon" onClick={handleHomePageUserIconClick} />
                        ) : (
                            <FaArrowLeft size={25} id='product-page-user-icon' onClick={() => navigate('/')} aria-label="Go to Home" tabIndex={0} />
                        )}
                        <div className={isHomePage ? "home-page-user-location" : "product-page-user-location"}>
                            <p className={isHomePage ? "home-page-location-label" : "product-page-location-label"}>{headerTitle}</p>
                            <div className={isHomePage ? "home-page-location-value" : "product-page-location-value"}>
                                {isShopProductPage ? `EXPLORE PRODUCT` : `${userLocation?.address ? userLocation.address.slice(0, 30) : 'SET LOCATION, INDIA'}`}
                                {!isShopProductPage && <TiArrowSortedDown size={15} onClick={toggleLocationTab} />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={isHomePage ? "home-page-search-section" : "product-page-search-section"}>
                    <div className={isHomePage ? "home-page-search-input-container" : "product-page-search-input-container"}>
                        <BiSearchAlt className={isHomePage ? "home-page-search-icon" : "product-page-search-icon"} onClick={handleSearch} />
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
            {locationTabVisible && <LocationTab setLocationTab={setLocationTabVisible} />}
            {!isLocationHas && (
                <div className="popup-overlay">
                    <div className="popup-card">
                        <div className="popup-pointer"></div>
                        <h2 className="popup-title">Select your location</h2>
                        <p className="popup-text">
                            We need your location to show you curated assortment from your nearest store
                        </p>
                        <div className="popup-buttons" onClick={() => { setLocationTabVisible(true); setIsLocationHas(true); }}>
                            <button className="popup-button primary">Use my location</button>
                            <button className="popup-button secondary">Select manually</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;