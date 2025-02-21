import React, { useState, useEffect } from 'react';
import ShopDataForm from './shopDataForm.jsx';
import { useNavigate } from 'react-router-dom';

import { FaChevronLeft } from "react-icons/fa";
import { TiInfoOutline } from "react-icons/ti";

import './shopData.css';

const ShopData = ({ shopData }) => {
    const navigate = useNavigate();
    const [showInfo, setShowInfo] = useState(false); // Added state for controlling the info popup

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <header className="shop-data-header">
                <button
                    className="shop-data-back-btn"
                    onClick={() => navigate("/secure/shop")}
                >
                    <FaChevronLeft />
                </button>
                <span>SHOP INFORMATION</span>
                <button
                    className="shop-data-info-btn"
                    onClick={() => setShowInfo(!showInfo)}
                >
                    <TiInfoOutline />
                </button>
            </header>
            <ShopDataForm shopData={shopData} />

            {showInfo && (
                <div className="shop-address-popup-overlay">
                    <div className="shop-address-popup-card">
                        <div className="shop-address-popup-pointer"></div>
                        <h2 className="shop-address-popup-title">Shop Information Guidance</h2>
                        <p style={{ fontSize: "13px" }} className="shop-address-popup-text">
                            This information will be used to generate relevant keywords—separated by commas—that enhance your shop's visibility in search results. Please include both your shop's name and category.
                        </p>

                        <div className="shop-address-popup-buttons">
                            <button
                                className="shop-address-popup-button-primary"
                                onClick={() => {
                                    setShowInfo(false);
                                    navigate("/secure/shopdata");
                                }}
                            >
                                OK
                            </button>
                            <button
                                className="shop-address-popup-button-secondary"
                                onClick={() => {
                                    setShowInfo(false);
                                    navigate("/secure/shopdata");
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShopData;
