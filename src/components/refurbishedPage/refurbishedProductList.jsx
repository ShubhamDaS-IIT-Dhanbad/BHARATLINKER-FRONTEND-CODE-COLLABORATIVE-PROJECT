import React, { useMemo } from 'react';
import RefurbishedProductCard from '../refurbishedProductCard/refurbishedProductCard.jsx';
import NoProductsFound from './noProductFound.jsx';

const ProductList = ({ products, loading, sortByAsc, sortByDesc }) => {
    const sortedProducts = useMemo(() => {
        if (sortByAsc) {
            return [...products].sort((a, b) => a.price - b.price);
        } else if (sortByDesc) {
            return [...products].sort((a, b) => b.price - a.price);
        }
        return products; // Default order
    }, [products, sortByAsc, sortByDesc]);

    if (loading) return <>Loading...</>;
    if (!loading && sortedProducts.length === 0) {
        return <NoProductsFound />;
    }

    return (
        <div id="refurbished-product-page-grid">
            {sortedProducts.map((product) => (
                <RefurbishedProductCard
                    key={product.$id}
                    id={product.$id}
                    image={product.images[0]}  
                    title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                    price={product.price}
                    isInStock={product.isInStock}
                />
            ))}
        </div>
    );
};

export default ProductList;
