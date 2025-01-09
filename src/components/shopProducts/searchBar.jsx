import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BiSearchAlt } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import Cookies
import './searchBar.css';
import { resetShopProducts } from '../../redux/features/shopProducts/searchProductSlice';

const ProductSearchBar = ({ shopId, setInputValue, inputValue, handleSearchProduct }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [locationTab, setLocationTab] = useState(false);
    const [shopName, setShopName] = useState("SHOP PRODUCTS");
    const [locationData, setLocationData] = useState(null); // Add state for location data
    const [loading, setLoading] = useState(true); // Add state for loading

    // Fetch location from cookies
    useEffect(() => {
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
            setLoading(false); // Set loading to false after fetching location
        };

        fetchLocation();
    }, [locationTab]); // Re-run when locationTab changes

    // Update shop name and query from URL search params
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setShopName(queryParams.get('shopName') || "SHOP PRODUCTS");
        const query = queryParams.get('query') || '';
        setInputValue(query);
    }, [location, setInputValue]);

    // Trigger product search
    const handleSearch = () => {
        if (inputValue.trim()) {
            dispatch(resetShopProducts(shopId));
            handleSearchProduct(inputValue); // Make sure handleSearchProduct is called
        }
    };

    // Handle keydown event for "Enter" key
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            dispatch(resetShopProducts(shopId));
            handleSearchProduct(inputValue); // Make sure handleSearchProduct is called
        }
    };

    // Handle input change
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
    };

    return (
        <>
            <div className='shop-products-header-visible'>
                <div className='shop-products-header-container'>
                    <div className='shop-products-header-user-section'>
                        <FaArrowLeft
                            id='shop-products-user-icon'
                            size={25}
                            onClick={() => navigate(`/shop/${shopId}`)}
                            aria-label="Go Back"
                            tabIndex={0}
                        />
                        <div className='shop-products-user-location'>
                            <p className='shop-products-location-label'>{shopName.toUpperCase()} PAGE</p>
                            <div
                                className='shop-products-location-value'
                                onClick={() => setLocationTab(true)}
                                aria-label="Change Location"
                                tabIndex={0}
                            >
                                {loading ? 'Loading location...' : locationData ? locationData.address.slice(0,30) : 'Location not set'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='shop-products-search-section'>
                    <div className='shop-products-search-input-container'>
                        <BiSearchAlt
                            className='shop-products-search-icon'
                            onClick={handleSearch}
                            aria-label="Search"
                            tabIndex={0}
                        />
                        <input
                            className='shop-products-search-input'
                            placeholder="Search By Product Name"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            aria-label="Search input"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductSearchBar;
