import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import SearchBar from '../navbar.jsx';
import ShopList from './shopList.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'react-loading-skeleton/dist/skeleton.css';
import { Oval } from "react-loader-spinner";
import { useSearchShop } from '../../hooks/searchShopHook.jsx';
import './searchShop.css';


const s1="https://res.cloudinary.com/demc9mecm/image/upload/v1741102460/s1_i7wbfi.png";
const Shop = () => {
    const { shops, updated, loading, loadingMoreShops, hasMoreShops } = useSelector((state) => state.searchshops);
    const { executeSearchShop, onLoadMoreShop } = useSearchShop();

    useEffect(() => {
        if (shops.length === 0) {
            executeSearchShop();
        }
    }, [updated]);

    return (


        <>
            <div id="shopSearchPage-container-top">
                <SearchBar
                    headerTitle={"SEARCH SHOP"}
                    searchArrayNames = {[
                        "electronics store",
                        "grocery store",
                        "clothing store",
                        "hardware store",
                        "book store",
                        "furniture store",
                        "specialty store",
                        "toy store",
                        "jewelry store",
                        "pet store"
                      ]}
                />
            </div>
            {(loading) ? (
                <div className="fallback-loading-img">
                    <img src={s1} />
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
                    />
                </InfiniteScroll>)}


        </>
    );
};

export default Shop;
