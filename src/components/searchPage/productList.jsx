import React from 'react';
import { Oval } from 'react-loader-spinner';
import { useSelector}from 'react-redux';
import NoProductsFound from './noProductFound.jsx';
import SearchPageProductCard from '../productCards/searchPageProductCard.jsx';

import './productList.css';

const ProductList = () => {
    const { products, loading,loadingMoreProducts,hasMoreProducts } = useSelector((state) => state.searchproducts); 
    if (!loading && products.length === 0 && !hasMoreProducts) {
        return <NoProductsFound />;
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

            {hasMoreProducts && loadingMoreProducts && (
                <div className='productSearchPage-loading-more-products'>
                     <Oval height={20} width={20} color="white" secondaryColor="gray" ariaLabel="loading" />
                                            
                </div>
            )}
        </>
    );
};

export default ProductList;
