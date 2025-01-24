import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchBar from '../a.navbarComponent/navbar.jsx';
import { LiaSortSolid } from 'react-icons/lia';
import { MdFilterList } from 'react-icons/md';
import ShopList from './shopList.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';


import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Oval } from "react-loader-spinner";
import { useSearchShop } from '../../hooks/searchShopHook.jsx';

import ShopFilterBySection from './filterSection.jsx';
import './searchShop.css';

const Shop = () => {
    const { shops, updated, loading, loadingMoreShops, hasMoreShops } = useSelector((state) => state.searchshops);
    const { executeSearchShop, onLoadMoreShop } = useSearchShop();

    const [showSortBy, setShowSortBy] = useState(false);
    const [showFilterBy, setShowFilterBy] = useState(false);

    useEffect(() => {
        if (shops.length === 0) {
            executeSearchShop();
        }
    }, [updated]);


    const skeletons = [1, 2, 3, 4, 5, 6];
    return (


        <>
            <div id="shopSearchPage-container-top">
                <SearchBar
                    headerTitle={"SEARCH SHOP"}
                />
            </div>
            {(loading) ? (
                <div id="skleton-page-grid">
                    {skeletons.map((_, index) => (
                        <div className="shop-card-container" key={index}>
                            <div className="shop-card-header">
                                <Skeleton height={180} width="100%" />
                            </div>

                            <div className="shop-card-details">
                                <Skeleton width="50%" height={20} className="shop-card-name" />

                                <div className="shop-card-info">
                                    <div className="shop-card-divider"></div>

                                    <div className="shop-card-address-toggle">
                                        <Skeleton width="60%" height={20} />
                                    </div>

                                    <div className="shop-card-divider"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={shops.length}
                    next={onLoadMoreShop}
                    hasMore={hasMoreShops}
                    loader={
                        loadingMoreShops && (
                            <div id="search-shop-load-more-shop-loader">
                                <Oval height={30} width={30} color="white" secondaryColor="gray" ariaLabel="loading" />
                            </div>
                        )
                    }
                >
                    <ShopList
                        shops={shops}
                        loading={loading}
                        loadingMoreShops={loadingMoreShops}
                        hasMoreShops={hasMoreShops}
                    />
                </InfiniteScroll>)}



            {showFilterBy && (
                <ShopFilterBySection
                    showFilterBy={showFilterBy}
                    setShowFilterBy={setShowFilterBy}
                />
            )}

            <div id="searchShopPage-footer">
                <div id="searchShopPage-footer-sortby" onClick={() => setShowSortBy(!showSortBy)}>
                    <LiaSortSolid size={33} />
                    SORT BY
                </div>
                <div id="searchShopPage-footer-filterby" onClick={() => setShowFilterBy(!showFilterBy)}>
                    <MdFilterList size={33} />
                    FILTER BY
                </div>
            </div>
        </>
    );
};

export default Shop;
