import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { loadMoreProducts } from '../../redux/features/searchPage/searchProductSlice.jsx';

import { useExecuteSearch } from '../../hooks/searchProductHook.jsx'; // Import the hook
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import { ToastContainer } from 'react-toastify';
import SearchBar from './searchBar';
import ProductList from './productList.jsx'; // Ensure this is implemented
import { RotatingLines } from 'react-loader-spinner';


import ProductSortBySection from './sortbySection.jsx'
import ProductFilterBySection from './filterSection.jsx'

import './searchPage.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { inputValue, setInputValue, executeSearch } = useExecuteSearch();

    const [showSortBy, setShowSortBy] = useState(false);
    const [showFilterBy, setShowFilterBy] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    const {
        products = [],
        loading = false,
        currenPage = 1,
        loadingMoreProducts = false,
        hasMoreProducts = true,
        sortByAsc = false,
        sortByDesc = false
    } = useSelector((state) => state.searchproducts);

    useEffect(() => {
        if (products.length === 0) {
            executeSearch();
        }
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setSearchParams((prev) => ({
            ...Object.fromEntries(prev.entries()), // Ensure proper update of search params
            query: value,
        }));
    };

    const onLoadMore = () => {
        const params = {
            inputValue,
            page: currenPage + 1,
            productsPerPage: 24,
            pinCodes: [742136, 742137], // Ensure this is dynamic if needed
            selectedCategories: [],
            selectedBrands: [],
            sortByAsc,
            sortByDesc,
        };
        dispatch(loadMoreProducts(params));
    };

    return (
        <>
            <ToastContainer />
            <div id='productSearchPage-container-top'>
                <SearchBar
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    onSearch={executeSearch}
                    onNavigateHome={() => navigate('/')}
                />
            </div>

            {loading ? (
                <div className="refurbished-page-loading-container">
                    <RotatingLines width="60" height="60" color="#007bff" />
                </div>
            ) : (
                <ProductList
                    products={products}
                    onLoadMore={onLoadMore}
                    hasMoreProducts={hasMoreProducts}
                    loadingMoreProducts={loadingMoreProducts}
                />
            )}

            {showSortBy && (
                <ProductSortBySection
                    handleSearch={executeSearch}
                    showSortBy={showSortBy}
                    setShowSortBy={setShowSortBy}
                    sortByAsc={sortByAsc}
                    sortByDesc={sortByDesc}
                />
            )}
            {showFilterBy && (
                <ProductFilterBySection
                    handleSearch={executeSearch}
                    showFilterBy={showFilterBy}
                    setShowFilterBy={setShowFilterBy}
                />
            )}

            <div id='productSearchPage-footer'>
                <div
                    id='productSearchPage-footer-sortby'
                    onClick={() => setShowSortBy(!showSortBy)}
                >
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div
                    id='productSearchPage-footer-filterby'
                    onClick={() => setShowFilterBy(!showFilterBy)}
                >
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </>
    );
};

export default SearchPage;

