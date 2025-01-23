import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from "react-icons/fa";
import { RiChatSmileFill } from "react-icons/ri";
import { FaLuggageCart } from "react-icons/fa";
import { FaSadCry } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import './cartCard.css';

function OrderProductCard({ order,functionToWork,productId}) {
    const navigate = useNavigate();

    // Function to return the correct icon based on status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaExclamationTriangle className="status-icon pending" />;
            case 'confirmed':
                return <RiChatSmileFill className="status-icon accepted" />;
            case 'dispatched':
                return <FaLuggageCart className="status-icon dispatched" />;
            case 'canceled':
                return <FaSadCry className="status-icon canceled" />;
            case 'delivered':
                return <GiPartyPopper className="status-icon delivered" />;
            default:
                return null;
        }
    };

    return (
        <div className="order-product-card">
            <div className="order-product-card-img">
                <img src={order.image} alt="Product" />
            </div>
            <div className="order-product-card-detail">
                <div className="order-product-card-detail-1">
                    {order.title}
                </div>
                <div className="order-product-card-detail-2">
                    <div style={{ display: "flex", gap: "7px" }}>
                        <div className="order-product-card-detail-2-1">
                            <p className="order-product-card-detail-2-1-tag">PRICE</p>
                            <p className="opcdp">₹{order?.discountedPrice}</p>
                        </div>
                        <div className="order-product-card-detail-2-1">
                            <p className="order-product-card-detail-2-1-tag">QTY</p>
                            <p className="opcdp">{order?.quantity}</p>
                        </div>
                        <div className="order-product-card-detail-2-1">
                            <p className="order-product-card-detail-2-1-tag">SUBTOTAL</p>
                            <p className="opcdp">₹{order?.discountedPrice * order?.quantity}</p>
                        </div>
                    </div>

                    {window.location.pathname === '/user/order' && (
                        <div
                            className="order-product-card-detail-2-rm"
                            onClick={() => { navigate(`/user/order/${order.$id}`); }}
                        >
                            VIEW
                        </div>
                    )}

                    {window.location.pathname === '/user/cart' && (
                        <div
                             className="order-product-cart-delete-2-rm"
                             onClick={functionToWork}
                        >
                            REMOVE
                        </div>
                    )}
                </div>
                <div className={`order-product-card-detail-3-state`}>
                    {getStatusIcon(order?.state)}
                </div>
            </div>
        </div>
    );
}

export default OrderProductCard;
