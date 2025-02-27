import React from 'react';
import PropTypes from 'prop-types'; // Added this import
import { useNavigate, useLocation } from 'react-router-dom';
import "./style/productCard.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const DEFAULT_IMAGE_URL = 'http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp';

function SearchPageProductCard({ id, image, title, price, discountedPrice, isInStock }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Improved image handling with optional chaining
    const imageUrl = image?.[0] || DEFAULT_IMAGE_URL;
    const productName = title ? (title.length > 45 ? `${title.substring(0, 45)}..` : title) : 'Product Name';
    const productPrice = discountedPrice?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '₹0';

    // Consolidated and corrected path checks
    const currentPath = location.pathname;
    const isShopProductPage = currentPath === '/secure/retailer/products';
    const isSearchPage = currentPath === '/search';
    const isSearchShopProductPage = currentPath.startsWith('/shop/product/');

    const handleCardClick = () => {
        if (isShopProductPage) {
            navigate(`/secure/shop/update/${id}`);
        } else if (isSearchShopProductPage || isSearchPage) {
            navigate(`/product/${id}`);
        }
    };

    return (
        <div className="search-page-product-card" onClick={handleCardClick}>
            <div className="search-page-product-card-top">
                <LazyLoadImage
                    className="search-page-product-card-top-image"
                    src={imageUrl}
                    alt={productName}
                    effect="blur"
                    loading="lazy"
                />
            </div>

            <div className='search-page-product-card-bottom'>
                <span className='search-page-product-card-shop-name'>{productName}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                    <span className='search-page-product-card-shop'>
                        {productPrice}
                    </span>

                    {isShopProductPage && (
                        <div className="user-product-edit-button">Edit Product</div>
                    )}

                    {!isShopProductPage && (
                        <div className={`search-page-product-card-bottom-stock ${isInStock ? 'instock' : 'outofstock'}`}>
                            {isInStock ? 'ADD TO CART' : 'NOT DELIVERABLE'}
                        </div>
                    )}
                </div>
            </div>

            <div className="search-page-discount-container">
                {price && discountedPrice && price > discountedPrice ? (
                    <span>
                        {Math.round(((price - discountedPrice) / price) * 100)}% off
                    </span>
                ) : (
                    <span>No discount</span>
                )}
            </div>
        </div>
    );
}

SearchPageProductCard.propTypes = {
    id: PropTypes.string.isRequired,
    image: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    price: PropTypes.number,
    discountedPrice: PropTypes.number,
    isInStock: PropTypes.bool
};

export default SearchPageProductCard;