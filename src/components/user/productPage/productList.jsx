import React from 'react';
import SearchPageProductCard from '../productCards/searchPageProductCard.jsx';

const ProductList = ({ products, loading}) => {
    if (loading) return <>Loading...</>;
    if (!loading && products?.length === 0) {
        return (
          <div>no product found</div>
        );
    }
    return (
        <>
            <div id="user-refurbished-product-page-grid" style={{marginTop:"110px"}}>
                {products?.map((product) => (
                    <SearchPageProductCard
                        key={product.$id}
                        id={product.$id}
                        image={product.images}
                        title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                        price={product.price}
                        productType={product.productType}
                        isInStock={true}
                    />
                ))}
            </div>
        </>
    );
};

export default ProductList;
