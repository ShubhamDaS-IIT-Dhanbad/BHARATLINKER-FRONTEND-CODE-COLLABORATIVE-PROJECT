import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { LiaSortSolid } from 'react-icons/lia';
import { MdFilterList } from 'react-icons/md';
import SearchBar from './searchBar.jsx';
import { RotatingLines } from 'react-loader-spinner';
import ProductList from './productList.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';

import ProductSortBySection from './sortbySection.jsx';
import ProductFilterBySection from './filterSection.jsx';

import { fetchProducts, loadMoreProducts } from '../../redux/features/shopProducts/searchProductSlice.jsx';
import './shopProducts.css';

const ProductSearch = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { shopId, shopName } = useParams();

    const productsPerPage = 20;
    const [inputValue, setInputValue] = useState('');
    const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);

    const shops = useSelector((state) => state.shopproducts.shops);
    const loading = useSelector((state) => state.shopproducts.loading);

    const shopData = shops[shopId] || {};
    const {
        products = [],
        loading: shopLoading = false,
        hasMoreProducts = false,
        currentPage = 1,
        sortByAsc = true,
        sortByDesc,
        selectedBrands,
        selectedCategories,
    } = shopData;

    const [showSortBy, setShowSortBy] = useState(false);
    const [showFilterBy, setShowFilterBy] = useState(false);

    // Memoize handleSearch using useCallback
    const handleSearch = useCallback(() => {
        const params = {
            inputValue,
            page: 1,
            productsPerPage,
            pinCodes: [742136],
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc,
            shopId,
        };
        dispatch(fetchProducts(params));
    }, [dispatch, inputValue, selectedCategories, selectedBrands, sortByAsc, sortByDesc, shopId]);

    // Memoize onLoadMore using useCallback
    const onLoadMore = useCallback(() => {
        if (!hasMoreProducts || loadingMoreProducts) return;
        setLoadingMoreProducts(true);
        const params = {
            inputValue,
            page: currentPage + 1,
            productsPerPage,
            pinCodes: [742136, 742137],
            selectedCategories,
            selectedBrands,
            sortByAsc,
            sortByDesc,
            shopId,
        };
        dispatch(loadMoreProducts(params)).finally(() => setLoadingMoreProducts(false));
    }, [dispatch, inputValue, currentPage, loadingMoreProducts, hasMoreProducts, selectedCategories, selectedBrands, sortByAsc, sortByDesc, shopId]);

    // Trigger search when selectedCategories or selectedBrands change
    useEffect(() => {
        if (shopId && !loading && products.length === 0) {
            handleSearch();
        }
    }, [products.length]);

    return (
        <>
            <div id="shopSearchPage-container-top">
                <SearchBar
                    shopId={shopId}
                    setInputValue={setInputValue}
                    shopName={shopName}
                    inputValue={inputValue}
                    handleSearchProduct={handleSearch}
                />
            </div>

            {(loading || shopLoading) && !loadingMoreProducts ? (
                <div className="refurbished-page-loading-container">
                    <RotatingLines width="60" height="60" color="#007bff" />
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={products.length}
                    next={onLoadMore}
                    hasMore={hasMoreProducts}
                    loader={<h4>Loading more products...</h4>}
                    scrollThreshold={0.9}
                >
                    <ProductList products={products} />
                </InfiniteScroll>
            )}

            {showSortBy && (
                <ProductSortBySection
                    shopId={shopId}
                    handleSearch={handleSearch}
                    showSortBy={showSortBy}
                    setShowSortBy={setShowSortBy}
                    sortByAsc={sortByAsc}
                    sortByDesc={sortByDesc}
                />
            )}
            {showFilterBy && (
                <ProductFilterBySection
                    shopId={shopId}
                    selectedBrands={selectedBrands}
                    selectedCategories={selectedCategories}
                    handleSearch={handleSearch}
                    setShowFilterBy={setShowFilterBy}
                />
            )}

            <div id="shop-products-footer">
                <div
                    id="shop-products-footer-sortby"
                    onClick={() => setShowSortBy(!showSortBy)}
                >
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div
                    id="shop-products-footer-filterby"
                    onClick={() => setShowFilterBy(!showFilterBy)}
                >
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </>
    );
};

export default ProductSearch;
