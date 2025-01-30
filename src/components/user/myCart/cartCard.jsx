import React from 'react';
import { useNavigate } from 'react-router-dom';
import './cartCard.css';

function OrderProductCard({ order, functionToWork, productId }) {
    const navigate = useNavigate();
    return (
        <div className="user-cart-cart-order-product-card">
            <div className="user-cart-cart-order-product-card-img">
                <img 
                    src={order.image} 
                    onClick={() => { navigate(`/product/${productId}`); }} 
                    alt="Product" 
                />
            </div>
            <div className="user-cart-cart-order-product-card-detail">
                <div className="user-cart-cart-order-product-card-detail-1">
                    {order.title}
                </div>
                <div className="user-cart-cart-order-product-card-detail-2">
                    <div className="user-cart-cart-order-product-card-detail-2-1">
                        <p className="user-cart-cart-order-product-card-detail-2-1-tag">PRICE</p>
                        <p className="user-cart-cart-opcdp">₹{order?.discountedPrice}</p>
                    </div>
                    <div className="user-cart-cart-order-product-card-detail-2-1">
                        <p className="user-cart-cart-order-product-card-detail-2-1-tag">QTY</p>
                        <p className="user-cart-cart-opcdp">{order?.quantity}</p>
                    </div>
                    <div className="user-cart-cart-order-product-card-detail-2-1">
                        <p className="user-cart-cart-order-product-card-detail-2-1-tag">SUBTOTAL</p>
                        <p className="user-cart-cart-opcdp">₹{order?.discountedPrice * order?.quantity}</p>
                    </div>
                </div>
                {window.location.pathname === '/user/cart' && (
                    <div
                        className="user-cart-cart-order-product-cart-delete-2-rm"
                        onClick={functionToWork}
                    >
                        REMOVE
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderProductCard;
