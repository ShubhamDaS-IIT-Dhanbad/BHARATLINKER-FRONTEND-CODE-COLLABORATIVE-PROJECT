import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchShops, resetShops, loadMoreShops } from '../../redux/features/searchShopSlice.jsx'; // Ensure resetShops is imported
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from './searchBar.jsx'; // Ensure file name casing matches
import { LiaSortSolid } from 'react-icons/lia';
import { MdFilterList } from 'react-icons/md';
import ShopList from './shopList.jsx';
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
  
    const handleSearch = () => {
        const params = {
            inputValue,
            page: 1,
            shopsPerPage: productsPerPage,
            pinCodes: [742136], 
            selectedCategories,
            sortByAsc: null,
            sortByDesc: null,
        };
        dispatch(resetShops());
        dispatch(fetchShops(params));
    };

    useEffect(() => {
        if (shops.length === 0) {
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
        if (!loadingMoreShops && hasMoreShops) {
            const params = {
                inputValue,
                page: currentPage + 1,
                shopsPerPage: productsPerPage,
                pinCodes: [742136],
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
                    handleSearchChange={handleInputChange}
                    handleSearch={handleSearch}
                />
            </div>

            <div id='shopResults'>
                <ShopList
                    shops={shops}
                    loading={loading}
                    loadingMoreShops={loadingMoreShops}
                    hasMoreShops={hasMoreShops}
                    onLoadMore={onLoadMore}
                />
            </div>

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

export default Shop;

