import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadMoreProducts } from '../../redux/features/searchProductSlice.jsx';
import { useExecuteSearch } from '../../hooks/searchProductHook.jsx'; // Import the hook
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import { ToastContainer } from 'react-toastify';
import SearchBar from './searchBar';
import ProductList from './productList.jsx';
import { RotatingLines } from 'react-loader-spinner';
import './searchPage.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { inputValue, setInputValue, executeSearch } = useExecuteSearch();

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const { products, loading, currenPage, loadingMoreProducts, hasMoreProducts } = useSelector((state) => state.searchproducts);

    useEffect(() => {
        if (products.length === 0) {
            executeSearch();
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
            productsPerPage: 24,
            pinCodes: [742136, 742137],
            selectedCategories: [],
            selectedBrands: [],
            sortByAsc: false,
            sortByDesc: true,
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
                   
                    onLoadMore={onLoadMore}
                />
            )}

            <div id='productSearchPage-footer'>
                <div id='productSearchPage-footer-sortby' onClick={() => { navigate('/search/sortby') }}>
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div id='productSearchPage-footer-filterby' onClick={() => { navigate('/search/filterby') }}>
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </>
    );
};

export default SearchPage;
