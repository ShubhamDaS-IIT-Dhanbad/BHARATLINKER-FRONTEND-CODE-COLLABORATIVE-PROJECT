import React, { useState, useEffect } from 'react';
import RefurbishedNavbar from './refurbishedNavbar.jsx';
import RefurbishedProductList from './refurbishedProductList.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRefurbishedProducts, loadMoreRefurbishedProducts } from '../../redux/features/refurbishedProductsSlice.jsx';
import r1 from '../../assets/refur.webp';
import { LiaSortSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import InfiniteScroll from 'react-infinite-scroll-component';
import './refurbishedPage.css';

const RefurbishedPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchInput, setSearchInput] = useState('');

    const { refurbishedProducts, currentPage, hasMoreProducts, error, loading,loadingMoreProducts } = useSelector(state => state.refurbishedproducts);
    const selectedCategories = useSelector(state => state.refurbishedproductfiltersection.selectedCategories);

    // Function to handle product search
    const handleSearch = () => {
        const params = {
            inputValue: searchInput,
            page: 1,
            productsPerPage: 2,
            pinCodes: [742136],
            selectedCategories,
            selectedBrands: [],
            sortByAsc: null,
            sortByDesc: null,
        };
        dispatch(fetchRefurbishedProducts(params));
    };

    useEffect(() => {
        if (refurbishedProducts.length === 0) handleSearch();
    }, [searchInput]);

    // Load more products when user scrolls
    const handleLoadMore = () => {
        const params = {
            inputValue: searchInput.trim(),
            page: currentPage + 1,
            productsPerPage: 2,
            pinCodes: [742136],
            selectedCategories,
            selectedBrands: [],
            sortByAsc: null,
            sortByDesc: null,
        };
        dispatch(loadMoreRefurbishedProducts(params));
    };

    if (error) return <div>Error: {error}</div>;
    return (
        <div className='refurbished-main-container'>
            <RefurbishedNavbar setSearchInput={setSearchInput} />
            <div className='refurbished-image-div'>
                <img src={r1} alt="Refurbished section" />
            </div>

           
            <InfiniteScroll
                dataLength={refurbishedProducts.length}
                next={handleLoadMore}
                hasMore={hasMoreProducts}
                loader={loadingMoreProducts && <h4>Loading more products...</h4>}
            >
                <RefurbishedProductList
                    products={refurbishedProducts}
                    loading={loading}  
                />
            </InfiniteScroll>


            {/* Footer navigation */}
            <div id='refurbishedProductPage-footer'>
                <div id='refurbishedProductPage-footer-sortby' onClick={() => { navigate('/refurbished/sortby') }}>
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div id='refurbishedProductPage-footer-filterby' onClick={() => { navigate('/refurbished/filter') }}>
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </div>
    );
};

export default RefurbishedPage;
