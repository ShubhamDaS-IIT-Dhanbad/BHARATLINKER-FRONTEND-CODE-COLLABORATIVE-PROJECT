
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { BiSearchAlt } from "react-icons/bi";
import { Helmet } from 'react-helmet';
import UserScrollLoadComponent from './userRefurbishedProductScrollComponent.jsx';
import ProductList from './productList.jsx';
import './userProductPageMain.css';

import { resetProducts } from '../../../redux/features/user/userAllRefurbishedProductsSlice.jsx';
import { resetBooks, loadMoreRefurbishedBooks, fetchRefurbishedBooks } from '../../../redux/features/user/userRefurbishedBooksSlice.jsx';
import { resetModules, loadMoreRefurbishedModules, fetchRefurbishedModules } from '../../../redux/features/user/userRefurbishedModulesSlice.jsx';
import { resetGadgets, loadMoreRefurbishedGadgets, fetchRefurbishedGadgets } from '../../../redux/features/user/userRefurbishedGadgetsSlice.jsx';

function YourRefurbished() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState('');
    const [inputValue, setInputValue] = useState('');

    const products = useSelector((state) => state.userAllRefurbishedProducts.allRefurbishedProducts);
    const loading = useSelector((state) => state.userRefurbishedBooks.loading);
    const hasMoreProducts = useSelector((state) => state.userRefurbishedBooks.hasRefurbishedBooks);

    const refurbishedBooks = useSelector((state) => state.userRefurbishedBooks.refurbishedBooks);
    const booksLoading = useSelector((state) => state.userRefurbishedBooks.loading);
    const hasMoreBooks = useSelector((state) => state.userRefurbishedBooks.hasMoreRefurbishedBooks);
    const bookCurrentPage = useSelector((state) => state.userRefurbishedBooks.currentPage);

    const refurbishedModules = useSelector((state) => state.userRefurbishedModules.refurbishedModules);
    const modulesLoading = useSelector((state) => state.userRefurbishedModules.loading);
    const hasMoreModules = useSelector((state) => state.userRefurbishedModules.hasMoreModules);
    const moduleCurrentPage = useSelector((state) => state.userRefurbishedModules.currentPage);

    const refurbishedGadgets = useSelector((state) => state.userRefurbishedGadgets.refurbishedProducts);
    const gadgetsLoading = useSelector((state) => state.userRefurbishedGadgets.loading);
    const hasMoreGadgets = useSelector((state) => state.userRefurbishedGadgets.hasMoreProducts);
    const gadgetCurrentPage = useSelector((state) => state.userRefurbishedGadgets.currentPage);

    const loadMoreGadgets = () => {
        if (hasMoreGadgets) {
            const params = {
                inputValue,
                phn: '+91' + `${userData.phn}`,
                productsPerPage: 4,
                currentPage: gadgetCurrentPage + 1,
            };
            dispatch(loadMoreRefurbishedGadgets(params));
        }
    };
    const loadMoreBooks = () => {
        if (hasMoreBooks) {
            const params = {
                inputValue,
                phn: '+91' + `${userData.phn}`,
                productsPerPage: 4,
                page: bookCurrentPage + 1,
            };
            dispatch(loadMoreRefurbishedBooks(params));
        }
    };

    const loadMoreModules = () => {
        if (hasMoreModules) {
            const params = {
                inputValue,
                phn: '+91' + `${userData.phn}`,
                productsPerPage: 4,
                currentPage: moduleCurrentPage + 1,
            };
            dispatch(loadMoreRefurbishedModules(params));
        }
    };

    const fetchInitialGadgets = () => {
        const params = {
            inputValue,
            phn: '+91' + `${userData.phn}`,
            productsPerPage: 4,
            currentPage: 1,
        };
        dispatch(resetGadgets());
        dispatch(fetchRefurbishedGadgets(params));
    };

    const fetchInitialBooks = () => {
        const params = {
            inputValue,
            phn: '+91' + `${userData.phn}`,
            productsPerPage: 4,
            currentPage: 1,
        };
        dispatch(resetBooks());
        dispatch(fetchRefurbishedBooks(params));
    };

    const fetchInitialModules = () => {
        const params = {
            inputValue,
            phn: '+91' + `${userData.phn}`,
            productsPerPage: 4,
            currentPage: 1,
        };
        dispatch(resetModules());
        dispatch(fetchRefurbishedModules(params));
    };

    useEffect(() => {
        if (refurbishedBooks.length === 0 && userData?.phn && products.length==0) {
            fetchInitialBooks();
        }
        if (refurbishedModules.length === 0 && userData?.phn && products.length==0) {
            fetchInitialModules();
        }
        if (refurbishedGadgets.length === 0 && userData?.phn && products.length==0) {
            fetchInitialGadgets();
        }
    }, [userData,products.length]);

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUser');
        if (userSession) {
            const parsedUser = JSON.parse(userSession);
            setUserData(parsedUser);
        }
    }, []);

    const handleSearch = () => {
        dispatch(resetBooks());
        dispatch(resetModules());
        dispatch(resetGadgets());
        dispatch(resetProducts());
    };

    const onInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="user-product-page-body">
            <Helmet>
                <title>Your Refurbished Books | Bharat Linker</title>
                <meta name="description" content="Browse and search for refurbished books offered by Bharat Linker." />
                <meta name="keywords" content="refurbished books, buy refurbished, Bharat Linker" />
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
                                aria-label="Search Books"
                                tabIndex={0}
                            />
                            <input
                                className='user-refurbished-product-page-search-input'
                                placeholder="Search Books"
                                value={inputValue}
                                onKeyPress={handleKeyPress}
                                onChange={onInputChange}
                                aria-label="Search input"
                            />
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <UserScrollLoadComponent userData={userData} searchTerm={inputValue} loadMoreBooks={loadMoreBooks} loadMoreModules={loadMoreModules} loadMoreGadgets={loadMoreGadgets} />
                <ProductList products={products} loading={loading} hasMoreProducts={hasMoreProducts} />
            </main>
        </div>
    );
}

export default YourRefurbished;
