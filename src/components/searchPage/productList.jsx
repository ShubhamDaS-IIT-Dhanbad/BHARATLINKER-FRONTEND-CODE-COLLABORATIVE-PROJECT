import React from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { useSelector}from 'react-redux';
import NoProductsFound from './noProductFound.jsx';
import SearchPageProductCard from '../productCards/searchPageProductCard.jsx';

const ProductList = ({ onLoadMore }) => {
    const { products, loading,loadingMoreProducts,hasMoreProducts } = useSelector((state) => state.searchproducts);

    // Loading state while products are being fetched
    if (loading) return <>Loading...</>;

    // Handle case where no products are found
    if (!loading && products.length === 0) {
        return <NoProductsFound />;
    }

    return (
        <>
            {/* Display products in a grid layout */}
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

            {/* Display "Load More" button if there are more products to load */}
            {hasMoreProducts && !loadingMoreProducts && (
                <div className='search-page-load-more-container'>
                    <IoIosArrowDown size={30} className="search-page-load-more-icon" onClick={onLoadMore} />
                </div>
            )}

            {/* Display loading message if more products are being loaded */}
            {hasMoreProducts && loadingMoreProducts && (
                <>Loading more products...</>
            )}
        </>
    );
};

export default ProductList;
