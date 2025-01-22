import React from 'react';
import './orderProductCard.css';

function OrderProductCard({ order, onViewDetails, onCancelOrder }) {
    return (
        <div className="order-product-card">
            <div className="order-product-card-img">
                <img src={order.image} />
            </div>
            <div className="order-product-card-detail">
                <div className="order-product-card-detail-1">
                    {order.title}
                </div>
                <div className="order-product-card-detail-2">
                    <div style={{ display: "flex", gap: "7px" }}>
                        <div className="order-product-card-detail-2-1">
                            <p className="order-product-card-detail-2-1-tag">PRICE</p>
                            <p className='opcdp'> ₹{order?.discountedPrice}</p>
                        </div>
                        <div className="order-product-card-detail-2-1">
                            <p className="order-product-card-detail-2-1-tag">QTY</p>
                            <p className='opcdp'>{order?.count}</p>
                        </div>
                        <div className="order-product-card-detail-2-1">
                            <p className="order-product-card-detail-2-1-tag">SUBTOTAL</p>
                            <p className='opcdp'> ₹{order?.discountedPrice * order?.count}</p>
                        </div>
                    </div>
                    <div className="order-product-card-detail-2-rm">
                        VIEW
                    </div>
                </div>
                <div className="order-product-card-detail-3">
                    <div className="order-product-card-detail-3-state">
                        VIEW
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderProductCard;
