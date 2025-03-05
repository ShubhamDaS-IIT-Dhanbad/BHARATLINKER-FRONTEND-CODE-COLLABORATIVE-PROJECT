import React, { useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TiInfoOutline } from "react-icons/ti";
import { FaArrowLeft } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import { useShopProductExecuteSearch } from "../../hooks/retailerProductHook.jsx";

import "./style/navbar.css";
import "../style/navbar.css";


const Navbar = ({ shopData, headerTitle, onBackNavigation, infoTitle, infoDescription }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchInputRef = useRef(null);

    const [showInfo, setShowInfo] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const { executeShopProductSearch } = useShopProductExecuteSearch(shopData?.shopId);

    const handleBackNavigation = () => {
        onBackNavigation ? onBackNavigation() : navigate(-1);
    };

    const toggleInfo = () => setShowInfo(!showInfo);
    const closeInfo = () => setShowInfo(false);

    const handleInputChange = useCallback((e) => {
        setInputValue(e.target.value);
    }, []);

    const handleSearch = useCallback(() => {
        executeShopProductSearch(inputValue);
    }, [inputValue, executeShopProductSearch]);

    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        },
        [handleSearch]
    );

    const isShopProductPage = location.pathname.includes('/shop/products');
    const isShopUploadPage = location.pathname === '/secure/shop/upload' || 
    /^\/secure\/shop\/update\/.+$/.test(location.pathname);

    return (
        <header>
            {isShopUploadPage ? (
                <div className="shop-navbar-header">
                    <div className="shop-navbar-container">
                        <button 
                            className="shop-navbar-back-btn" 
                            onClick={handleBackNavigation}
                        >
                            <FaArrowLeft />
                        </button>
                        <span>{headerTitle}</span>
                        <button 
                            className="shop-navbar-info-btn" 
                            onClick={toggleInfo}
                        >
                            <TiInfoOutline />
                        </button>
                    </div>
                </div>
            ) : (
                <div id="productSearchPage-container-top">
                    <div className="product-page-header-visible">
                        <div className="product-page-header-container">
                            <div className="product-page-header-user-section">
                                <FaArrowLeft
                                    size={25}
                                    id="product-page-user-icon"
                                    onClick={handleBackNavigation}
                                    aria-label="Go to Home"
                                    tabIndex={0}
                                />
                                <div className="product-page-user-location">
                                    <p className="product-page-location-label">{headerTitle}</p>
                                    <div className="product-page-location-value">
                                        {isShopProductPage
                                            ? 'EXPLORE PRODUCT'
                                            : `${shopData?.address ? shopData.address.slice(0, 30) : 'UPDATE YOUR PRODUCTS'}`}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="product-page-search-section">
                            <div className="product-page-search-input-container">
                                <BiSearchAlt
                                    className="product-page-search-icon"
                                    onClick={handleSearch}
                                />
                                <input
                                    className="product-page-search-input"
                                    placeholder="Search Products"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyPress}
                                    aria-label="Search products"
                                    autoComplete="off"
                                    ref={searchInputRef}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showInfo && (
                <div className="shop-navbar-info-overlay">
                    <div className="shop-navbar-info-card">
                        <div className="shop-navbar-info-pointer"></div>
                        <h2 className="shop-navbar-info-title">{infoTitle}</h2>
                        <div style={{ fontSize: "13px" }} className="shop-navbar-info-text">
                            {infoDescription}
                        </div>
                        <div className="shop-navbar-info-buttons">
                            <button
                                className="shop-navbar-info-btn-primary"
                                onClick={closeInfo}
                            >
                                OK
                            </button>
                            <button
                                className="shop-navbar-info-btn-secondary"
                                onClick={closeInfo}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;