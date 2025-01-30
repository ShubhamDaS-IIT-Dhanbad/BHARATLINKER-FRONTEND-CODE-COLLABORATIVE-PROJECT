import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaExclamationTriangle, FaLuggageCart, FaSadCry } from "react-icons/fa";
import { RiChatSmileFill } from "react-icons/ri";
import { GiPartyPopper } from "react-icons/gi";
import { Oval } from "react-loader-spinner";
import { updateOrderStateToCanceled } from "../../../appWrite/order/order.js";
import { updateOrder, deleteOrder } from "../../../redux/features/user/orderSlice.jsx";
import "./orderProductCard.css";

function OrderProductCard({ order }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [canceling, setCanceling] = useState(false);

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
        const confirmation = window.confirm("Are you sure you want to cancel this order?");
        if (confirmation) {
            setCanceling(true);
            const updatedOrderData = await updateOrderStateToCanceled(order.$id, "canceled");
            dispatch(deleteOrder({ orderId: order.$id, orderStateArrayName: order.state }));
            dispatch(updateOrder({ orderId: order.$id, updatedOrderData, orderStateArrayName: "canceled" }));
            setCanceling(false);
        }
    };

    const onClickPhn = (phoneNumber) => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            alert("Please enter a valid phone number.");
        }
    };

    return (
        <div className="order-product-card-parent">
            <div className="order-product-card">
                <div className="order-product-card-img">
                    <img src={order.image} alt="Product" />
                </div>
                <div className="order-product-card-detail">
                    <div className="order-product-card-detail-1">{order.title}</div>
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
                    </div>
                    <div className="order-product-card-detail-3-state">
                        {getStatusIcon(order?.state)}
                        {order?.state !== "canceled" && order?.state !== "delivered" && (
                            <>
                                {canceling ? (
                                    <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />
                                ) : (
                                    <div className="order-product-card-detail-3-state-cancel" onClick={handleCancel}>
                                        CANCEL
                                    </div>
                                )}
                            </>
                        )}
                        <div className="retailer-order-product-card-detail-2" onClick={() => navigate(`/user/order/${order.$id}`)}>
                            DETAIL
                        </div>
                    </div>
                </div>
            </div>
            <div className="order-product-card-address">
                <div className="order-product-card-address-div">
                    <p className="order-product-card-address-p1">ORDER ID</p>
                    <p className="order-product-card-address-p2">{order.$id}</p>
                </div>
                <div className="order-product-card-address-div">
                    <p className="order-product-card-address-p1">NAME</p>
                    <p className="order-product-card-address-p2">{order.name}</p>
                </div>
                <div className="order-product-card-address-div">
                    <p className="order-product-card-address-p1">PHONE</p>
                    <div className="order-product-card-address-p2" onClick={() => onClickPhn(order.phoneNumber)}>
                        {order.phoneNumber}
                    </div>
                </div>
                <div className="order-product-card-address-div">
                    <p className="order-product-card-address-p1">ADDRESS</p>
                    <p className="order-product-card-address-p2">{order.address}</p>
                </div>
                {order.expectedDeliveryDate && (
                    <>
                        <div className="order-product-card-address-div">
                            <p className="order-product-card-address-p1">EXP DELIVERY DATE</p>
                            <p className="order-product-card-address-p2">{new Date(order.expectedDeliveryDate).toLocaleDateString()}</p>
                        </div>
                        <div className="order-product-card-address-div">
                            <p className="order-product-card-address-p1">EXP DELIVERY TIME</p>
                            <p className="order-product-card-address-p2">{new Date(order.expectedDeliveryDate).toLocaleTimeString()}</p>
                        </div>
                    </>
                )}
                {order.deliveryBoyPhn && (
                    <div className="order-product-card-address-div">
                        <p className="order-product-card-address-p1">DELIVERY BOY</p>
                        <div className="order-product-card-address-p2" onClick={() => onClickPhn(order.deliveryBoyPhn)}>
                            {order.deliveryBoyPhn}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default OrderProductCard;
