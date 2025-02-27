import React from 'react';
import SearchPageProductCard from '../productCard.jsx';
import e1 from '../../assets/e1.png';
const ProductList = ({products,loading,hasMoreProducts,loadingMoreProducts }) => {
    // Loading state while products are being fetched
    if (loading) return <>Loading...</>;

    // Handle case where no products are found
    if (!loading && products.length === 0) {
        return <div className='search-not-found'>
                <img src={e1} alt="No products available" className="no-products-image" />
                <p>Oops! We couldn't find any product.</p>
              </div>
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
                        discountedPrice={product.discountedPrice}
                        isInStock={product.isInStock}
                    />
                ))}
            </div>

            {/* Display loading message if more products are being loaded */}
            {hasMoreProducts && loadingMoreProducts && (
                <>Loading more products...</>
            )}

            {/* Load more button */}
            {hasMoreProducts && !loadingMoreProducts && (
                <button onClick={onLoadMore}>Load More</button>
            )}
        </>
    );
};

export default ProductList;
