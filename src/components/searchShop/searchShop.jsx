import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchShops, loadMoreShops } from '../../redux/features/searchShopSlice.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from './searchBar.jsx';
import { LiaSortSolid } from 'react-icons/lia';
import { MdFilterList } from 'react-icons/md';
import ShopList from './shopList.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'js-cookie';

import { Oval } from 'react-loader-spinner';
import './searchShop.css';
const Shop = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const productsPerPage = 20;

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [inputValue, setInputValue] = useState(query);

    const { shops, loading, currentPage, loadingMoreShops, hasMoreShops } = useSelector((state) => state.searchshops);
    const selectedCategories = useSelector(state => state.searchshopfiltersection.selectedCategories);


    const storedLocation = Cookies.get('BharatLinkerUserLocation') ? JSON.parse(Cookies.get('BharatLinkerUserLocation')) : null;
    const userLat = storedLocation ? storedLocation.lat : null;
    const userLong = storedLocation ? storedLocation.lon : null;
    const radius = storedLocation ? storedLocation.radius : 5;

    const handleSearch = () => {
        const params = {
            userLat, userLong, radius,
            inputValue,
            page: 1,
            shopsPerPage: productsPerPage,
            selectedCategories,
            sortByAsc: null,
            sortByDesc: null,
        };
        dispatch(fetchShops(params));
    };

    useEffect(() => {
        if (shops.length === 0) {
            handleSearch();
        }
    }, [shops.length]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setSearchParams((prev) => ({
            ...prev,
            query: value,
        }));
    };

    const onLoadMore = () => {
        if (!loadingMoreShops && hasMoreShops) {
            const params = {
                userLat, userLong, radius,
                inputValue,
                page: currentPage + 1,
                shopsPerPage: productsPerPage,
                selectedCategories,
                sortByAsc: null,
                sortByDesc: null,
            };
            dispatch(loadMoreShops(params));
        }
    };

    return (
        <>
            <div id='shopSearchPage-container-top'>
                <SearchBar
                    inputValue={inputValue}
                    handleSearchChange={handleInputChange}
                    handleSearch={handleSearch}
                />
            </div>
            {loading ? (
                <div className="productSearchPage-loading-container">
                    <Oval height={40} width={45} color="white" secondaryColor="gray" ariaLabel="loading" />
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={shops.length}
                    next={onLoadMore}
                    hasMore={hasMoreShops}
                    loader={loadingMoreShops && <div id='search-shop-load-more-shop-loader'>
                        <div className="productSearchPage-loading-container">
                            <Oval height={40} width={45} color="white" secondaryColor="gray" ariaLabel="loading" />
                        </div>
                    </div>}
                    endMessage={<p>No more shops to display.</p>}
                >
                    <ShopList
                        shops={shops}
                        loading={loading}
                        loadingMoreShops={loadingMoreShops}
                        hasMoreShops={hasMoreShops}
                    />
                </InfiniteScroll>
            )}

            <div id='searchShopPage-footer'>
                <div id='searchShopPage-footer-sortby' >
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div id='searchShopPage-footer-filterby' >
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </>
    );
};

export default Shop;


