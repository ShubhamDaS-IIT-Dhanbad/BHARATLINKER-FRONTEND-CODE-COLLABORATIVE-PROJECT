import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../productCards/searchPageProductCard.css";

function SearchPageProductCard({ id, image, title, price, isInStock }) {
    const navigate = useNavigate();

    const imageUrl = image[0] || 'http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp';
    const productName = title ? (title.length > 45 ? title.substr(0, 45) + '..' : title) : 'Product Name';
    const productPrice = price || '0';

    return (
        <div className="search-page-product-card" onClick={()=>{navigate(`/product/${id}`)}}>
            <div className="search-page-product-card-top" onClick={() => navigate(`/product/${id}`)}>
                <img className="search-page-product-card-top-image" src={imageUrl} alt={productName} />
            </div>
            <div className='search-page-product-card-bottom'>
                <div className="search-page-product-card-shop-price">
                    <span className='search-page-product-card-shop-name'>{productName}</span>
                    <span className='search-page-product-card-shop'>
                        ₹{productPrice}
                    </span>
                </div>
                
                <div className={`search-page-product-card-bottom-stock ${isInStock > 0 ? 'instock' : 'outofstock'}`}>
                    {isInStock ? (
                        <span>IN STOCK</span>
                    ) : (
                        <span>OUT OF STOCK</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchPageProductCard;
