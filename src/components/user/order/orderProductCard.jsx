import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { FaExclamationTriangle, FaLuggageCart, FaSadCry } from "react-icons/fa";
import { RiChatSmileFill } from "react-icons/ri";
import { GiPartyPopper } from "react-icons/gi";
import { Oval } from "react-loader-spinner";
import { updateOrderStateToCanceled } from "../../../appWrite/order/order.js";
import { updateOrder, deleteOrder } from "../../../redux/features/user/orderSlice.jsx";
import "./userOrderCard.css"; 

function OrderProductCard({ order, setOrder }) {
    const dispatch = useDispatch();
    const [canceling, setCanceling] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <FaExclamationTriangle className="status-icon pending" />;
            case "confirmed":
                return <RiChatSmileFill className="status-icon accepted" />;
            case "dispatched":
                return <FaLuggageCart className="status-icon dispatched" />;
            case "canceled":
                return <FaSadCry className="status-icon canceled" />;
            case "delivered":
                return <GiPartyPopper className="status-icon delivered" />;
            default:
                return null;
        }
    };

    const handleCancel = async () => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                setCanceling(true);
                const updatedOrderData = await updateOrderStateToCanceled(order.$id, "canceled");
                dispatch(deleteOrder({ orderId: order.$id, orderStateArrayName: order.state }));
                dispatch(updateOrder({ 
                    orderId: order.$id, 
                    updatedOrderData, 
                    orderStateArrayName: "canceled" 
                }));
            } catch (error) {
                console.error("Failed to cancel order:", error);
                alert("Failed to cancel order. Please try again.");
            } finally {
                setCanceling(false);
            }
        }
    };

    return (
        <div className="user-order-card-parent">
            <div className="user-order-card">
                <div className="user-order-card-img">
                    {!imageLoaded && (
                        <Oval 
                            height={20} 
                            width={20} 
                            color="grey" 
                            secondaryColor="white" 
                            ariaLabel="loading" 
                        />
                    )}
                    <img 
                        src={order.image} 
                        alt={order.title} 
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)} // Handle broken images
                        style={!imageLoaded ? { display: 'none' } : {}} 
                    />
                </div>
                <div className="user-order-card-detail">
                    <div className="user-order-card-detail-1">{order.title}</div>
                    <div className="user-order-card-detail-2">
                        <div style={{ display: "flex", gap: "7px" }}>
                            <div className="user-order-card-detail-2-1">
                                <p className="user-order-card-detail-2-1-tag">PRICE</p>
                                <p className="opcdp">₹{order.discountedPrice}</p>
                            </div>
                            <div className="user-order-card-detail-2-1">
                                <p className="user-order-card-detail-2-1-tag">QTY</p>
                                <p className="opcdp">{order.quantity}</p>
                            </div>
                            <div className="user-order-card-detail-2-1">
                                <p className="user-order-card-detail-2-1-tag">SUBTOTAL</p>
                                <p className="opcdp">₹{order.discountedPrice * order.quantity}</p>
                            </div>
                        </div>
                    </div>
                    <div className="user-order-card-detail-3-state">
                        {getStatusIcon(order.state)}
                        {order.state !== "canceled" && order.state !== "delivered" && (
                            canceling ? (
                                <Oval 
                                    height={20} 
                                    width={20} 
                                    color="green" 
                                    secondaryColor="white" 
                                    ariaLabel="loading" 
                                />
                            ) : (
                                <button 
                                    className="user-order-card-detail-3-state-cancel" 
                                    onClick={handleCancel}
                                    disabled={canceling}
                                >
                                    CANCEL
                                </button>
                            )
                        )}
                        <button 
                            className="retailer-user-order-card-detail-2" 
                            onClick={() => setOrder(order)}
                        >
                            DETAIL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

OrderProductCard.propTypes = {
    order: PropTypes.shape({
        $id: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        discountedPrice: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        state: PropTypes.oneOf(["pending", "confirmed", "dispatched", "canceled", "delivered"]).isRequired
    }).isRequired,
    setOrder: PropTypes.func.isRequired
};

export default OrderProductCard;