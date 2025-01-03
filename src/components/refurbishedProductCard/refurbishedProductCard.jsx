import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./refurbishedProductCard.css";

function SearchPageProductCard({ id, image, title, price, isInStock }) {
    const navigate = useNavigate();

    const imageUrl = image || 'http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp';
    const productName = title ? (title.length > 45 ? title.substr(0, 45) + '..' : title) : 'Product Name';
    const productPrice = price || '0';

    return (
        <div className="refurbished-product-card" onClick={() => { navigate(`/refurbished/${id}`) }}>
            <div className="refurbished-product-card-top">
                <img className="refurbished-product-card-top-image" src={imageUrl} alt={productName} />
            </div>
            <div className='refurbished-product-card-bottom'>
                <div className="refurbished-product-card-shop-price">
                    <span className='refurbished-product-card-shop-name'>{productName}</span>
                    <span className='refurbished-product-card-shop'>
                        ₹{productPrice}
                    </span>
                </div>

                <div className="refurbished-product-card-bottom-stock">
                    <span>ON SALE</span>
                </div>
            </div>
        </div>
    );
}

export default SearchPageProductCard;
