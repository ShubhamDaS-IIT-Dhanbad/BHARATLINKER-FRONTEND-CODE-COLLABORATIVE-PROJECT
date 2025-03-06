import React, { useState, useEffect, useCallback } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { TiArrowSortedDown } from 'react-icons/ti';
import { BiSearchAlt } from 'react-icons/bi';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import LocationTab from './locationTab/locationTab.jsx';
import useLocationFromCookie from '../hooks/useLocationFromCookie.jsx';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useExecuteSearch } from '../hooks/searchProductHook.jsx';
import { useSearchShop } from '../hooks/searchShopHook.jsx';
import { useShopProductExecuteSearch } from '../hooks/searchShopProductHook.jsx';
import './style/navbar.css';

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

    // Placeholder cycling state
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [showPlaceholder, setShowPlaceholder] = useState(true);

    const isHomePage = location.pathname === '/';
    const isSearchPage = location.pathname === '/search';
    const isBlSearchPage = location.pathname === '/bharatlinker/search';
    const isShopPage = location.pathname === '/shop';
    const isShopProductPage = location.pathname.startsWith('/shop/product');

    const searchArrayNames = isShopPage ? [
        `" electronics store " `,
        `" grocery store "`,
        `" clothing store "`,
        `" hardware store "`,
        `" book store "`,
        `" furniture store "`,
        `" specialty store "`,
        `" toy store "`,
        `" jewelry store "`,
        `" pet store "`
    ] : [
        ` " iPhone 14 Pro Max " `,
        ` " Moong Dal Other Pulses " `,
        ` " Samsung Galaxy S23 Mobile " `,
        ` " Whole Wheat Flour (Atta) " `,
        ` " Air Conditioner " `,
        
        ` " iPhone 14 Pro Max " `,
        ` " Sugar , Honey , Salt , Turmeric etc... " `,
        ` " Apple AirPods Pro Ear Buds " `,
        ` " Turmeric Powder " `,
        ` " Dell/Lenovo  Laptop " `,
        ` " OnePlus Nord 3 Mobile " `,
        ` " Tea Leaves " `,
        ` " i5 intel Gaming Laptop " `,
        ` " Cooking Salt " `,
        ` " Smart TV " `,
        ` " OnePlus Nord 3 Mobile " `,
        ` " Kacchi Ghani Sarso Tel " `,
        ` " Wireless Earbuds " `


    ]

    const handleRetailerClick = useCallback(() => {
        const retailerCookie = Cookies.get('BharatLinkerShopData');
        if (retailerCookie) {
            navigate('/secure/shop');
        } else {
            navigate('/secure/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (isSearchPage) {
            setSearchInput(searchQuery);
        } else if (isShopPage) {
            setSearchInput(shopQuery);
        } else if (isShopProductPage) {
            setSearchInput(shopProductQuery);
        }
    }, []);

    useEffect(() => {
        setIsLocationHas(!!(userLocation?.address && userLocation?.lat && userLocation?.lon));
    }, [locationTabVisible]);

    useEffect(() => {
        setPlaceholderIndex(0);
        if (!searchArrayNames || searchArrayNames.length === 0) return;
        const interval = setInterval(() => {
            if (true) {
                setPlaceholderIndex((prev) => (prev + 1) % searchArrayNames.length);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

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
            <div className={isHomePage ? "home-page-header-visible" : "product-page-header-visible"}
                style={isBlSearchPage ? { color: "white", backgroundColor: "rgb(51, 23, 63)" } : undefined}

            >
                <div className={isHomePage ? "home-page-header-container" : "product-page-header-container"}>
                    <div className={isHomePage ? "home-page-header-user-section" : "product-page-header-user-section"}
                    >
                        {isHomePage ? (
                            <HiOutlineUserCircle
                                size={40}
                                id="home-page-user-icon"
                                onClick={handleHomePageUserIconClick}
                                aria-label="User Profile"
                            />
                        ) : (
                            <FaArrowLeft
                                size={25}
                                id='product-page-user-icon'
                                onClick={() => navigate('/')}
                                aria-label="Go to Home"
                                tabIndex={0}
                            />
                        )}
                        <div className={isHomePage ? "home-page-user-location" : "product-page-user-location"}>
                            <p className={isHomePage ? "home-page-location-label" : "product-page-location-label"}>
                                {headerTitle}
                            </p>
                            <div className={isHomePage ? "home-page-location-value" : "product-page-location-value"}>
                                {isShopProductPage
                                    ? 'EXPLORE PRODUCT'
                                    : `${userLocation?.address ? userLocation.address.slice(0, 30) : 'SET LOCATION, INDIA'}`}
                                {!isShopProductPage && (
                                    <TiArrowSortedDown
                                        size={15}
                                        onClick={toggleLocationTab}
                                        aria-label="Toggle Location Options"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {isHomePage && (<div className="home-page-header-retailer-section">
                        <MdOutlineAdminPanelSettings
                            onClick={handleRetailerClick}
                            size={35}
                            className='nav-retailer-icon'
                            aria-label="Admin Panel"
                        />
                    </div>
                    )}
                </div>
                <div className={isHomePage ? "home-page-search-section" : "product-page-search-section"}>
                    <div className={isHomePage ? "home-page-search-input-container" : "product-page-search-input-container"}
                        style={isBlSearchPage ? { border: "none" } : undefined}>
                        <BiSearchAlt
                            className={isHomePage ? "home-page-search-icon" : "product-page-search-icon"}
                            onClick={handleSearch}
                            aria-label="Search"
                        />
                        <input
                            className={isHomePage ? "home-page-search-input" : "product-page-search-input"}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={handleSearch}
                            aria-label="Search Input"
                        />
                        <span>{!searchInput && searchArrayNames?.length > 0 && showPlaceholder
                            ? searchArrayNames[placeholderIndex]
                            : ""}</span>
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
                        <div className="popup-buttons">
                            <button
                                className="popup-button primary"
                                onClick={() => {
                                    setLocationTabVisible(true);
                                    setIsLocationHas(true);
                                }}
                            >
                                Use my location
                            </button>
                            <button
                                className="popup-button secondary"
                                onClick={() => {
                                    setLocationTabVisible(true);
                                    setIsLocationHas(true);
                                }}
                            >
                                Select manually
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;