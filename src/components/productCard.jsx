import React from 'react';
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
    const productPrice = discountedPrice?.toLocaleString() || '0';
    const mrpPrice = price?.toLocaleString() || '0';

    // Consolidated path checks
    const currentPath = location.pathname;
    const isRefurbishedPage = currentPath === '/user/refurbished';
    const isSearchPage = currentPath === '/search';
    const isSearchRefurbished = currentPath === '/refurbished';

    const handleCardClick = () => {
        if (isSearchPage) navigate(`/product/${id}`);
        if (isSearchRefurbished) navigate(`/refurbished/${id}`);
    };

    return (
        <div className="search-page-product-card" onClick={handleCardClick}>
            <div className="search-page-product-card-top">
                <LazyLoadImage
                    className="search-page-product-card-top-image"
                    src={imageUrl}  // Image URL
                    alt={productName}  // Alt text for accessibility
                    effect="zoomIn"  // Optional blur effect while loading
                    loading="lazy"  // Native lazy loading
                />
            </div>

            <div className='search-page-product-card-bottom'>
                <span className='search-page-product-card-shop-name'>{productName}</span>
                <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
                    <span className='search-page-product-card-shop'>
                        ₹{productPrice}
                    </span>
                    {isRefurbishedPage && (
                        <div
                            className="user-product-edit-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/user/refurbished/update/${id}`)
                            }}
                        >
                            Edit
                        </div>
                    )}

                    {isSearchPage && (
                        <div className={`search-page-product-card-bottom-stock ${isInStock ? 'instock' : 'outofstock'}`}>
                            {isInStock ? 'ADD TO CART' : 'NOT DELIVERABLE'}
                        </div>
                    )}

                    {isSearchRefurbished && (
                        <div className="search-page-product-card-bottom-stock instock">
                            ON SALE
                        </div>
                    )}
                </div>
            </div>
            <div className="search-page-discount-container">
                    {price && discountedPrice ? (
                        <span>
                            {Math.round(
                                ((price - discountedPrice) / price) * 100
                            )}
                            % off
                        </span>
                    ) : (
                        "Price not available"
                    )}
                </div>
        </div>
    );
}

export default SearchPageProductCard;