import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BiSearchAlt } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { TbChevronDown } from 'react-icons/tb'; // Import missing icon
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import Cookies library
import './searchBar.css';
import { resetShopProducts } from '../../redux/features/shopProducts/searchProductSlice';

const ProductSearchBar = ({ shopData, shopId, setInputValue, inputValue, handleSearchProduct }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [locationTab, setLocationTab] = useState(false);
    const [shopName, setShopName] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch location from cookies
        const fetchLocation = () => {
            const storedLocation = Cookies.get('BharatLinkerUserLocation');
            if (storedLocation) {
                try {
                    const parsedLocation = JSON.parse(storedLocation);
                    setLocationData(parsedLocation);
                } catch (error) {
                    console.error("Error parsing location data from cookies:", error);
                    setLocationData(null);
                }
            }
            setLoading(false);
        };
        fetchLocation();
    }, [locationTab]);

    useEffect(() => {
        // Update shop name based on shopData or query params
        if (shopData?.shopName) {
            setShopName(shopData.shopName);
        } else {
            const queryParams = new URLSearchParams(location.search);
            const queryShopName = queryParams.get('shopName') || 'SHOP PRODUCTS';
            setShopName(queryShopName);
        }
    }, [shopData, location]);

    const handleSearch = () => {
        if (inputValue.trim()) {
            dispatch(resetShopProducts(shopId));
            handleSearchProduct(inputValue);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
    };

    return (
        <div className="product-page-header-visible">
            <div className="product-page-header-container">
                <div className="product-page-header-user-section">
                    <FaArrowLeft
                        id="product-page-user-icon"
                        size={25}
                        onClick={() => navigate(-1)}
                        aria-label="Go to Home"
                        tabIndex={0}
                    />
                    <div className="product-page-user-location">
                        <p className="product-page-location-label">{shopName}</p>
                        <div
                            className="product-page-location-value"
                            aria-label="Change Location"
                            tabIndex={0}
                            onClick={() => setLocationTab(true)}
                        >
                            {loading
                                ? 'Loading...'
                                : locationData?.address.slice(0, 30) || 'SET LOCATION, INDIA'}
                            <TbChevronDown size={15} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-page-search-section">
                <div className="product-page-search-input-container">
                    <BiSearchAlt
                        className="product-page-search-icon"
                        onClick={handleSearch}
                        aria-label="Search"
                        tabIndex={0}
                    />
                    <input
                        className="product-page-search-input"
                        placeholder="Search Product"
                        value={inputValue}
                        onKeyDown={handleKeyDown}
                        onChange={handleInputChange}
                        aria-label="Search input"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductSearchBar;
