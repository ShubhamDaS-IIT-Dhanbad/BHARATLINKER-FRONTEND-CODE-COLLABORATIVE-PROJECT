import React from 'react';
import { FaExclamationTriangle } from "react-icons/fa";
import { RiChatSmileFill } from "react-icons/ri";
import { FaLuggageCart } from "react-icons/fa";
import { FaSadCry } from "react-icons/fa";
import './orderProductCard.css';

function OrderProductCard({ order, onViewDetails, onCancelOrder }) {
    // Function to return a status-specific class name
    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'order-status-pending';
            case 'accepted':
                return 'order-status-accepted';
            case 'dispatched':
                return 'order-status-dispatched';
            case 'canceled':
                return 'order-status-canceled';
            default:
                return '';
        }
    };

    // Function to return the correct icon based on status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaExclamationTriangle className="status-icon pending" />;
            case 'accepted':
                return <RiChatSmileFill className="status-icon accepted" />;
            case 'dispatched':
                return <FaLuggageCart className="status-icon dispatched" />;
            case 'canceled':
                return <FaSadCry className="status-icon canceled" />;
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
                            <p className="opcdp">{order?.count}</p>
                        </div>
                        <div className="order-product-card-detail-2-1">
                            <p className="order-product-card-detail-2-1-tag">SUBTOTAL</p>
                            <p className="opcdp">₹{order?.discountedPrice * order?.count}</p>
                        </div>
                    </div>
                    {order?.state !== 'canceled' &&
                        <div
                            className="order-product-card-detail-2-rm"
                            onClick={() => onViewDetails(order)}
                        >
                            VIEW
                        </div>}
                </div>
                <div className={`order-product-card-detail-3-state`}>
                    {/* <div className={`${getStatusClass(order?.state)}`}>
                        {order?.state?.toUpperCase()}
                    </div> */}
                    {getStatusIcon(order?.state)}
                </div>
            </div>
        </div>
    );
}

export default OrderProductCard;
