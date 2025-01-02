import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, loadMoreProducts, resetProducts } from '../../redux/features/searchProductSlice.jsx';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import { ToastContainer } from 'react-toastify';
import SearchBar from './searchBar';
import ProductList from './productList.jsx';
import { useUserPincode } from '../../hooks/userPincodeHook.jsx';
import './searchPage.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const productsPerPage = 24;

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [inputValue, setInputValue] = useState(query);

    const { products, loading, currenPage, loadingMoreProducts, hasMoreProducts } = useSelector((state) => state.searchproducts);
    const selectedCategories = useSelector(state => state.searchproductfiltersection.selectedCategories);
    const selectedBrands = useSelector(state => state.searchproductfiltersection.selectedBrands);

    const { sortByAsc, sortByDesc } = useSelector((state) => state.searchproductsortbysection);

    const { userPincodes } = useUserPincode();

    const handleSearch = () => {
        const params = {
            inputValue,
            page: 1,
            productsPerPage,
            pinCodes: [742136, 742137],
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc 

        };
        dispatch(resetProducts());
        dispatch(fetchProducts(params));
    };

    useEffect(() => {
        if (products.length === 0) {
            handleSearch();
        }
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setSearchParams((prev) => ({
            ...prev,
            query: value,
        }));
    };

    const onLoadMore = () => {
        const params = {
            inputValue,
            page: currenPage + 1,
            productsPerPage,
            pinCodes: [742136, 742137],
            selectedCategories,
            selectedBrands,
            sortByAsc: sortByAsc,
            sortByDesc :sortByDesc 
        };
        dispatch(loadMoreProducts(params));
    };

    return (
        <>
            <ToastContainer />
            <>
                <div id='productSearchPage-container-top'>
                    <SearchBar
                        inputValue={inputValue}
                        onInputChange={handleInputChange}
                        onSearch={handleSearch}
                        onNavigateHome={() => navigate('/')}
                    />
                </div>
                <ProductList
                    products={products}
                    loading={loading}
                    hasMoreProducts={hasMoreProducts}
                    loadingMoreProducts={loadingMoreProducts}
                    onLoadMore={onLoadMore}
                />
            </>

            <div id='productSearchPage-footer'>
                <div id='productSearchPage-footer-sortby' onClick={() => { navigate('/search/sortby')}}>
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div id='productSearchPage-footer-filterby' onClick={() => { navigate('/search/filterby')}}>
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </>
    );
};

export default SearchPage;
