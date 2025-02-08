import React, { useMemo } from 'react';
import RefurbishedProductCard from '../productCard.jsx';

const ProductList = ({ products, loading, sortByAsc, sortByDesc }) => {
    const sortedProducts = useMemo(() => {
        if (sortByAsc) {
            return [...products].sort((a, b) => a.price - b.price);
        } else if (sortByDesc) {
            return [...products].sort((a, b) => b.price - a.price);
        }
        return products;
    }, [products, sortByAsc, sortByDesc]);

   
  if (!loading && products?.length === 0) {
    const notfound='https://res.cloudinary.com/demc9mecm/image/upload/v1736953901/ir4hy5fcwevhr8ibeaqq.png';
    return (
      <div className='search-shop-no-shop-found'>
        <img src={notfound} />
      </div>
    );
  }

    return (
        <div id="refurbished-product-page-grid">
            {sortedProducts.map((product) => (
                <RefurbishedProductCard
                    key={product.$id}
                    id={product.$id}
                    image={product.images || product.image}  
                    title={product.title.length > 45 ? `${product.title.substr(0, 45)}...` : product.title}
                    discountedPrice={product.discountedPrice}
                    isInStock={product.isInStock}
                />
            ))}
        </div>
    );
};

export default ProductList;
