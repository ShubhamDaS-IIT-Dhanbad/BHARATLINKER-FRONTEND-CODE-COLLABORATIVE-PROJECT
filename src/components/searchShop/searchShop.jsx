import React, { useEffect} from 'react';
import { useSelector} from 'react-redux';
import SearchBar from '../a.navbarComponent/navbar.jsx';
import { LiaSortSolid } from 'react-icons/lia';
import { MdFilterList } from 'react-icons/md';
import ShopList from './shopList.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Oval } from 'react-loader-spinner';


import { useSearchShop } from '../../hooks/searchShopHook.jsx';

import './searchShop.css';
const Shop = () => {
    const { shops,updated, loading,loadingMoreShops, hasMoreShops } = useSelector((state) => state.searchshops);
    const { executeSearchShop, onLoadMoreShop } = useSearchShop();


    useEffect(() => {
        if (shops.length === 0) {
            executeSearchShop();
        }
    }, [shops.length,updated]);


    return (
        <>
            <div id='shopSearchPage-container-top'>
                <SearchBar
                    headerTitle={"SEARCH SHOP"}
                />
            </div>
            {loading ? (
                <div className="productSearchPage-loading-container">
                    <Oval height={40} width={45} color="white" secondaryColor="gray" ariaLabel="loading" />
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={shops.length}
                    next={onLoadMoreShop}
                    hasMore={hasMoreShops}
                    loader={loadingMoreShops && <div id='search-shop-load-more-shop-loader'>
                        <div className="productSearchPage-loading-container">
                            <Oval height={40} width={45} color="white" secondaryColor="gray" ariaLabel="loading" />
                        </div>
                    </div>}
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


