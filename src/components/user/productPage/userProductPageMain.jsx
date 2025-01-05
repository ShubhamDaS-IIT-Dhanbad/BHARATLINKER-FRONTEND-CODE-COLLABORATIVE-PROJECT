import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { BiSearchAlt } from "react-icons/bi";
import { Helmet } from 'react-helmet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RotatingLines } from 'react-loader-spinner';
import { fetchUserRefurbishedProducts, loadMoreUserRefurbishedProducts, resetUserRefurbishedProducts, setCurrentUserPage } from '../../../redux/features/user/userAllRefurbishedProductsSlice.jsx';
import ProductList from './productList.jsx';
import './userProductPageMain.css';
import Cookies from 'js-cookie';

function YourRefurbished() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { refurbishedProducts, loading, error, currentPage, totalPages, hasMoreProducts, loadingMoreProducts } = useSelector(state => state.userRefurbishedProducts);

    const [inputValue, setInputValue] = useState('');
    const [userData, setUserData] = useState('');

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUser');
        setUserData(JSON.parse(userSession));
    }, []);

    // Handle search functionality
    const handleSearch = () => {
        const params = {
            inputValue,
            page: 1,
            productsPerPage: 8,
            pinCodes: [742136],  // Example pin code
            selectedCategories: [],  // Example, replace with actual category data
            selectedClasses: [],
            selectedExams: [],
            selectedLanguages: [],
            selectedBoards: [],
            selectedBrands: [],
            sortByAsc: false,  // Example, replace with actual sorting condition
            sortByDesc: false,
            phn: '+91'+userData.phn  // Pass phone number here
        };
        dispatch(fetchUserRefurbishedProducts(params));
    };

    // Input change handler for search
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // Handle "Enter" key press for search
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            dispatch(resetUserRefurbishedProducts());
            handleSearch();
        }
    };

    // Fetch products on initial render if no products exist
    useEffect(() => {
        if (refurbishedProducts.length === 0 && userData) handleSearch();
    }, [userData]);

    // Handle loading more products
    const handleLoadMore = () => {
        if (!hasMoreProducts || loadingMoreProducts || !userData?.phn) return; // Do not fetch if phone number is missing

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
            phn: '+91'+userData.phn // Pass phone number here as wel
        };
        dispatch(loadMoreUserRefurbishedProducts(params));
    };

    // Error handling display
    if (error) {
        return (
            <div>
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
                <div className='user-refurbished-product-page-header'>
                    <div className='user-refurbished-product-page-header-upper'>
                        <FaArrowLeft
                            id='user-refurbished-product-page-left-icon'
                            size={25}
                            onClick={() => navigate('/user')}
                            aria-label="Go back to User Account"
                            tabIndex={0}
                        />
                        <div className='user-refurbished-product-page-header-inner'>
                            <h1 className='user-refurbished-product-page-header-text'>YOUR REFURBISHED</h1>
                            <div
                                className='user-refurbished-product-page-header-phn-div'
                                onClick={() => navigate('/pincode')}
                                aria-label="Change Location"
                                tabIndex={0}
                            >
                                {userData.phn}
                            </div>
                        </div>
                    </div>
                    <div className='user-refurbished-product-page-search-section'>
                        <div className='user-refurbished-product-page-search-input-container'>
                            <BiSearchAlt
                                className='user-refurbished-product-page-search-icon'
                                onClick={handleSearch}
                                aria-label="Search Products"
                                tabIndex={0}
                            />
                            <input
                                className='user-refurbished-product-page-search-input'
                                placeholder="Search Products"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}  // Trigger search on "Enter"
                                aria-label="Search input"
                            />
                        </div>
                    </div>
                </div>
            </header>
            <main>
                {/* Handle loading state */}
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
                        <ProductList
                            products={refurbishedProducts}
                            loading={loading}
                        />
                    </InfiniteScroll>
                )}

                {/* Handle loading more products */}
                {loadingMoreProducts && <p></p>}
            </main>
        </div>
    );
}

export default YourRefurbished;
