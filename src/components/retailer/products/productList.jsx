import React from 'react';
import SearchPageProductCard from '../../productCard.jsx';

const ProductList = ({ products, loading}) => {
    if (loading) return <>Loading...</>;
    if (!loading && products?.length === 0) {
        return (
          <div>no product found</div>
        );
    }
    return (
        <>
            <div id="retailer-product-page-grid" >
                {products?.map((product) => (
                    <SearchPageProductCard
                        key={product.$id}
                        id={product.$id}
                        image={product.images}
                        title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                        discountedPrice={product.discountedPrice}
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
