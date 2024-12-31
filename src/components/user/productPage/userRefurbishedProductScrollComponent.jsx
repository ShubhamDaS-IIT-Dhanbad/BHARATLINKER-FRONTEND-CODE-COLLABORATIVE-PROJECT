import React from 'react';
import {useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import './userProductPageMain.css';

function UserAllProducts({loadMoreBooks, loadMoreModules, loadMoreGadgets }) {
    // Fetch from Redux store
    const refurbishedBooks = useSelector((state) => state.userRefurbishedBooks.refurbishedBooks);
    const booksLoading = useSelector((state) => state.userRefurbishedBooks.loading);
    const hasMoreBooks = useSelector((state) => state.userRefurbishedBooks.hasMoreRefurbishedBooks);

    const refurbishedModules = useSelector((state) => state.userRefurbishedModules.refurbishedModules);
    const modulesLoading = useSelector((state) => state.userRefurbishedModules.loading);
    const hasMoreModules = useSelector((state) => state.userRefurbishedModules.hasMoreModules);

    const refurbishedGadgets = useSelector((state) => state.userRefurbishedGadgets.refurbishedProducts);
    const gadgetsLoading = useSelector((state) => state.userRefurbishedGadgets.loading);
    const hasMoreGadgets = useSelector((state) => state.userRefurbishedGadgets.hasMoreProducts);

    return (
        <div style={{ visibility: "hidden" }}>
            <InfiniteScroll
                dataLength={refurbishedBooks.length}
                next={loadMoreBooks}
                hasMore={hasMoreBooks}
                loader={booksLoading && <h4>Loading more refurbished books...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}>No more refurbished books to load</p>}
            >
            </InfiniteScroll>

            <InfiniteScroll
                dataLength={refurbishedModules.length}
                next={loadMoreModules}
                hasMore={hasMoreModules}
                loader={modulesLoading && <h4>Loading more refurbished modules...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}>No more refurbished modules to load</p>}
            >
                
            </InfiniteScroll>

            <InfiniteScroll
                dataLength={refurbishedGadgets.length}
                next={loadMoreGadgets}
                hasMore={hasMoreGadgets}
                loader={gadgetsLoading && <h4>Loading more refurbished gadgets...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}>No more refurbished gadgets to load</p>}
            >
                {/* Render gadgets */}
            </InfiniteScroll>
        </div>
    );
}

export default UserAllProducts;
