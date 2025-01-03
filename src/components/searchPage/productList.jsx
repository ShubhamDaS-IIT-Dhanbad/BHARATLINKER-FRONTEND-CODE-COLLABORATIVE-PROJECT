import React from 'react';
import { IoIosArrowDown } from "react-icons/io";

import NoProductsFound from './noProductFound.jsx';
import SearchPageProductCard from '../productCards/searchPageProductCard.jsx';

const ProductList = ({ products, loading, hasMoreProducts, loadingMoreProducts, onLoadMore }) => {
    if (loading) return <>Loading...</>;
    if (!loading && products.length === 0) {
        return (
           <NoProductsFound/>
        );
    }

    return (
        <>
            <div id="product-page-grid">
                {products.map((product) => (
                    <SearchPageProductCard
                        key={product.$id}
                        id={product.$id}
                        image={product.images}
                        title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                        price={product.price}
                        isInStock={product.isInStock}
                    />
                ))}
            </div>
            {hasMoreProducts && !loadingMoreProducts && (
                <div className='search-page-load-more-container'>
                    <IoIosArrowDown size={30} className="search-page-load-more-icon" onClick={onLoadMore} />
                </div>
            )}
            {hasMoreProducts && loadingMoreProducts && (
                <>Loading more products...</>
            )}
        </>
    );
};

export default ProductList;
