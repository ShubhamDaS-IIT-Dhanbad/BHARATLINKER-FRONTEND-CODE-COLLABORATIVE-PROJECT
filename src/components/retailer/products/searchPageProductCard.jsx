import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./searchPageProductCard.css";

function UserRefurbishedAllProductPage({ id, image, title, price, productType}) {
    const navigate = useNavigate();
    const imageUrl = image[0] || 'http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp';
    const productName = title ? (title.length > 45 ? title.substr(0, 45) + '..' : title) : 'Product Name';
    const productPrice = price || '0';
    
    return (
        <div className="retailer-product-card">
            <div className="retailer-product-card-top">
                <img className="retailer-product-card-top-image" src={imageUrl} alt={productName} />
            </div>
            <div className="retailer-product-card-bottom">
                <div className="retailer-product-card-info">
                    <span className="retailer-product-card-title">{productName}</span>
                    <span className="retailer-product-card-price">
                        ₹{productPrice}
                    </span>
                </div>
                
                <div className="retailer-product-card-edit" onClick={() => navigate(`/retailer/product/update/${id}`)}>
                    <span>Edit</span>
                </div>
            </div>
        </div>
    );
}

export default UserRefurbishedAllProductPage;
