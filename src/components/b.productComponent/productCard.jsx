import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../style/productCard.css";

function SearchPageProductCard({ id, image, title, discountedPrice,  isInStock }) {
    const navigate = useNavigate();
    const location = useLocation(); 

    const imageUrl = image[0] || 'http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp';
    const productName = title ? (title.length > 45 ? title.substr(0, 45) + '..' : title) : 'Product Name';
    const productPrice = discountedPrice || '0';

    // Check if the current path is /user/refurbished or /search
    const isRefurbishedPage = location.pathname === '/user/refurbished';
    const isSearchPage = location.pathname === '/search';

    const handleEditClick = () => {
        navigate(`/user/refurbished/update/${id}`);
    };

    const handleCardClick = () => {
        navigate(`/product/${id}`);
    };

    return (
        <div 
            className="search-page-product-card" 
            onClick={isSearchPage ? handleCardClick : null} // Only add onClick when on /search page
        >
            <div className="search-page-product-card-top">
                <img className="search-page-product-card-top-image" src={imageUrl} alt={productName} />
            </div>
            <div className='search-page-product-card-bottom'>
                <div className="search-page-product-card-shop-price">
                    <span className='search-page-product-card-shop-name'>{productName}</span>
                    <span className='search-page-product-card-shop'>
                        ₹{productPrice}
                    </span>
                </div>

                {isRefurbishedPage ? (
                    <div onClick={handleEditClick} className="user-product-edit-button">
                        Edit
                    </div>
                ) : (
                    <div className={`search-page-product-card-bottom-stock ${isInStock > 0 ? 'instock' : 'outofstock'}`}>
                        {isInStock > 0 ? (
                            <span>IN STOCK</span>
                        ) : (
                            <span>OUT OF STOCK</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPageProductCard;
