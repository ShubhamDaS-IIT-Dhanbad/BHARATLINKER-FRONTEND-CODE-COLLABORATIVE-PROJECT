import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/features/shopProducts/searchProductSlice.jsx'; 
import { useNavigate, useParams } from 'react-router-dom';

import { LiaSortSolid } from 'react-icons/lia';
import { MdFilterList } from 'react-icons/md';
import SearchBar from './searchBar.jsx';
import { RotatingLines } from 'react-loader-spinner'; 
import ProductList from './productList.jsx';
import InfiniteScroll from 'react-infinite-scroll-component'; // Add infinite scroll component

const ProductSearch = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const productsPerPage = 20;

    const { shopId, query,shopName } = useParams();
    const [inputValue, setInputValue] = useState(query);
    const [currentPage, setCurrentPage] = useState(1); // Track current page for pagination
    const [loadingMoreProducts, setLoadingMoreProducts] = useState(false); // Track loading state for more products

    const shops = useSelector((state) => state.shopproducts.shops); 
    const loading = useSelector((state) => state.shopproducts.loading); 

    const shopData = shops[shopId] || false;
    const { products = [], loading: shopLoading, hasMoreProducts = false } = shopData; 

    const selectedCategories = [];

    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update input value state with user input
    };

    const handleSearch = () => {
        if (inputValue?.trim() === '') {
            return;
        }

        const params = {
            inputValue,
            page: 1,
            productsPerPage,
            pinCodes: [742136],
            selectedCategories,
            sortByAsc: null,
            sortByDesc: null,
            shopId
        };
        dispatch(fetchProducts(params));
        setCurrentPage(1); 
    };
    useEffect(() => {
        if (shopId && shopId.length > 0 && !loading && !shopData) {
            handleSearch();
        }
    }, [shopId,shopData]);
    

    const onLoadMore = () => {
        if (!hasMoreProducts || loadingMoreProducts) return;

        setLoadingMoreProducts(true);

        const params = {
            inputValue,
            page: currentPage + 1, // Increment the current page
            productsPerPage,
            pinCodes: [742136, 742137], // Example pinCodes
            selectedCategories: [],
            sortByAsc: null,
            sortByDesc: null,
            shopId
        };

        dispatch(fetchProducts(params)); // Fetch more products
        setCurrentPage(currentPage + 1); // Update the page state
    };


    return (
        <>
            <div id='shopSearchPage-container-top'>
                <SearchBar
                    shopId={shopId}
                    shopName={shopName}
                    inputValue={inputValue}
                    handleSearchChange={handleInputChange}
                    handleSearch={handleSearch}
                />
            </div>

            {loading || shopLoading || loadingMoreProducts ? (
                <div className="refurbished-page-loading-container">
                    <RotatingLines width="60" height="60" color="#007bff" />
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={products.length}
                    next={onLoadMore}
                    hasMore={hasMoreProducts}
                    loader={loadingMoreProducts && <h4>Loading more products...</h4>}
                    scrollThreshold={0.9} // Trigger loading when 90% of the page is scrolled
                >
                    <ProductList 
                    products={products}
                    hasMoreProducts={hasMoreProducts}
                    loadingMoreProducts={loadingMoreProducts}
                    loading={loading}
                     />
                </InfiniteScroll>
            )}

            <div id='searchShopPage-footer'>
                <div id='searchShopPage-footer-sortby' onClick={() => { navigate('/shop/sortby') }}>
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div id='searchShopPage-footer-filterby' onClick={() => { navigate('/shop/filterby') }}>
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </>
    );
};

export default ProductSearch;
