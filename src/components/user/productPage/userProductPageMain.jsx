import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { BiSearchAlt } from "react-icons/bi";
import { Helmet } from 'react-helmet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RotatingLines } from 'react-loader-spinner';
import {
    fetchUserRefurbishedProducts,
    loadMoreUserRefurbishedProducts,
    resetUserRefurbishedProducts,
} from '../../../redux/features/user/userAllRefurbishedProductsSlice.jsx';
import ProductList from './productList.jsx';
import './userProductPageMain.css';
import Cookies from 'js-cookie';

function userRefurbishedProduct() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        refurbishedProducts,
        loading,
        error,
        currentPage,
        hasMoreProducts,
        loadingMoreProducts,
    } = useSelector((state) => state.userRefurbishedProducts);

    const [inputValue, setInputValue] = useState('');
    const [userData, setUserData] = useState(null);

    // Fetch user data from cookies on component mount
    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUserData');
        if (userSession) {
            setUserData(JSON.parse(userSession));
        }
    }, []);

    // Handle search functionality
    const handleSearch = () => {
        if (!userData?.phoneNumber) return;
        const params = {
            inputValue,
            page: 1,
            productsPerPage: 8,
            pinCodes: [742136],
            selectedCategories: [],
            selectedClasses: [],
            selectedExams: [],
            selectedLanguages: [],
            selectedBoards: [],
            selectedBrands: [],
            sortByAsc: false,
            sortByDesc: false,
            phn: `+91${userData?.phoneNumber}`,
        };
        dispatch(resetUserRefurbishedProducts());
        dispatch(fetchUserRefurbishedProducts(params));
    };

    // Input change handler for search
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // Handle "Enter" key press for search
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // Fetch products on initial render if no products exist
    useEffect(() => {
        if (refurbishedProducts.length === 0 && userData) {
            handleSearch();
        }
    }, [userData]);

    // Handle loading more products
    const handleLoadMore = () => {
        if (!hasMoreProducts || loadingMoreProducts || !userData?.phoneNumber) return;

        const params = {
            inputValue,
            page: currentPage + 1,
            productsPerPage: 8,
            pinCodes: [742136],
            selectedCategories: [],
            selectedClasses: [],
            selectedExams: [],
            selectedLanguages: [],
            selectedBoards: [],
            selectedBrands: [],
            sortByAsc: false,
            sortByDesc: false,
            phn: `+91${userData?.phoneNumber}`,
        };
        dispatch(loadMoreUserRefurbishedProducts(params));
    };

    // Error handling
    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                <button onClick={handleSearch}>Retry</button>
            </div>
        );
    }

    return (
        <div className="user-product-page-body">
            <Helmet>
                <title>Your Refurbished Products | Bharat Linker</title>
                <meta name="description" content="Browse and search for refurbished products offered by Bharat Linker." />
                <meta name="keywords" content="refurbished products, buy refurbished, Bharat Linker" />
            </Helmet>
            <header>
                <div className="user-refurbished-product-page-header">
                    <div className="user-refurbished-product-page-header-upper">
                        <FaArrowLeft
                            id="user-refurbished-product-page-left-icon"
                            size={25}
                            onClick={() => navigate('/user')}
                            aria-label="Go back to User Account"
                            tabIndex={0}
                        />
                        <div className="user-refurbished-product-page-header-inner">
                            <h1 className="user-refurbished-product-page-header-text">YOUR REFURBISHED</h1>
                            {userData?.phoneNumber && (
                                <div
                                    className="user-refurbished-product-page-header-phn-div"
                                    onClick={() => navigate('/pincode')}
                                    aria-label="Change Location"
                                    tabIndex={0}
                                >
                                    {userData?.phoneNumber}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="user-refurbished-product-page-search-section">
                        <div className="user-refurbished-product-page-search-input-container">
                            <BiSearchAlt
                                className="user-refurbished-product-page-search-icon"
                                onClick={handleSearch}
                                aria-label="Search Products"
                                tabIndex={0}
                            />
                            <input
                                className="user-refurbished-product-page-search-input"
                                placeholder="Search Products"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                aria-label="Search input"
                            />
                        </div>
                    </div>
                </div>
            </header>
            <main>
                {loading ? (
                    <div className="refurbished-page-loading-container">
                        <RotatingLines width="60" height="60" color="#007bff" />
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={refurbishedProducts.length}
                        next={handleLoadMore}
                        hasMore={hasMoreProducts}
                    >
                        <ProductList products={refurbishedProducts} loading={loading} />
                    </InfiniteScroll>
                )}
                {loadingMoreProducts && (
                    <div className="user-refurbished-product-page-loading-more">
                        <RotatingLines width="40" height="40" color="#007bff" />
                    </div>
                )}

            </main>
        </div>
    );
}

export default userRefurbishedProduct;
