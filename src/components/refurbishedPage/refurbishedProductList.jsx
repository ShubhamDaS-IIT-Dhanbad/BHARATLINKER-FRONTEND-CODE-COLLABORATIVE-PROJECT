import React from 'react';
import { IoIosArrowDown } from "react-icons/io";
import SearchPageProductCard from '../productCards/searchPageProductCard.jsx';
import NoProductsFound from './noProductFound.jsx';

const ProductList = ({ products, loading}) => {
    if (loading) return <>Loading...</>;
    if (!loading && products.length === 0) {
        return (
            <NoProductsFound/>
        );
    }

    return (
        <>
            <div id="refurbished-product-page-grid">
                {products?.map((product) => (
                    <SearchPageProductCard
                        key={product.$id}
                        id={product.$id}
                        image={product.images[0]}  
                        title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                        price={product.price}
                        isInStock={product.isInStock}
                    />
                ))}
            </div>

        </>
    );
};

export default ProductList;
