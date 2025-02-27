import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosRemove } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import './cartCard.css';

function OrderProductCard({ order, onRemove, productId, isRemove = false }) {
    const navigate = useNavigate();
    return (
        <div className="user-cart-cart-order-product-card">
            <div className="user-cart-cart-order-product-card-img">
                <img
                    src={order.productImage}
                    alt="Product"
                />
                 {isRemove && (
                <div
                    className="user-cart-cart-order-product-cart-delete-2-rm"
                    onClick={onRemove}
                >
                    < IoIosRemove size={30} />

                </div>
            )}
            </div>

            <div className="user-cart-cart-order-product-card-detail" 
                    onClick={() => { navigate(`/product/${productId}`); }}>
                <div className="user-cart-cart-order-product-card-detail-1">
                    {order.title}
                </div>
                <div className="user-cart-cart-order-product-card-detail-2">
                    <div className="user-cart-cart-order-product-card-detail-2-1">
                        <p className="user-cart-cart-order-product-card-detail-2-1-tag">Price</p>
                        <p className="user-cart-cart-opcdp">₹{order?.discountedPrice}</p>
                    </div>
                    <div className="user-cart-cart-order-product-card-detail-2-1">
                        <p className="user-cart-cart-order-product-card-detail-2-1-tag">Qty</p>
                        <p className="user-cart-cart-opcdp">{order?.quantity}</p>
                    </div>
                    <div className="user-cart-cart-order-product-card-detail-2-1">
                        <p className="user-cart-cart-order-product-card-detail-2-1-tag">Subtotal</p>
                        <p className="user-cart-cart-opcdp">₹{order?.discountedPrice * order?.quantity}</p>
                    </div>

                </div>

            </div>
           
        </div>
    );
}

export default OrderProductCard;