import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // useDispatch hook only
import { FaExclamationTriangle, FaLuggageCart, FaSadCry } from "react-icons/fa";
import { RiChatSmileFill } from "react-icons/ri";
import { GiPartyPopper } from "react-icons/gi";

import {
    updateOrderStateToConfirmed,
    updateOrderStateToDispatched,
    updateOrderStateToCanceled,
    updateOrderStateToDelivered,
} from "../../../appWrite/order/order.js";

import { updateOrder, deleteOrder } from "../../../redux/features/retailer/orderSlice.jsx";
import "./orderProductCard.css";

function OrderProductCard({ order, functionToWork }) {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize useDispatch hook
    const [showDatetimeInput, setShowDatetimeInput] = useState(false);
    const [expectedDatetime, setExpectedDatetime] = useState("");
    const [showPhoneInput, setShowPhoneInput] = useState(false);
    const [deliveryBoyPhone, setDeliveryBoyPhone] = useState("");

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

    const handleConfirm = async () => {
        if (!expectedDatetime) {
            alert("Please select an expected delivery datetime.");
            return;
        }
        const expectedDeliveryDate = expectedDatetime;
        const updatedOrderData = await updateOrderStateToConfirmed(order.$id, "confirmed", expectedDeliveryDate);

        dispatch(deleteOrder({ orderId: order.$id, orderStateArrayName: "pending" }));
        dispatch(updateOrder({ orderId: order.$id, updatedOrderData, orderStateArrayName: "confirmed" }));

        setExpectedDatetime("");
        setShowDatetimeInput(false);
    };

    const handleDispatch = async () => {
        if (!deliveryBoyPhone) {
            alert("Please enter the delivery boy's phone number.");
            return;
        }
        const deliveryBoyPhn = deliveryBoyPhone;
        const updatedOrderData = await updateOrderStateToDispatched(order.$id, "dispatched", deliveryBoyPhn);
        dispatch(updateOrder({ orderId: order.$id, updatedOrderData, orderStateArrayName: "confirmed" }));
        setDeliveryBoyPhone("");
        setShowPhoneInput(false);
    };

    const handleCancel = async () => {
        const confirmation = window.confirm("Are you sure you want to cancel this order?");
        if (confirmation) {
            await updateOrderStateToCanceled(order.$id, "canceled");
            dispatch(deleteOrder({ orderId: order.$id, status: "canceled" })); // Dispatch deleteOrder
        }
    };

    const handleDeliver = async () => {
        const confirmation = window.confirm("Mark this order as delivered?");
        if (confirmation) {
            await updateOrderStateToDelivered(order.$id, "delivered");
            dispatch(updateOrder({ orderId: order.$id, status: "delivered" })); // Dispatch updateOrder
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
                                <p className="opcdp">
                                    ₹{order?.discountedPrice * order?.quantity}
                                </p>
                            </div>
                        </div>

                        {window.location.pathname === "/user/order" && (
                            <div
                                className="order-product-card-detail-2-rm"
                                onClick={() => navigate(`/user/order/${order.$id}`)}
                            >
                                VIEW
                            </div>
                        )}

                        {window.location.pathname === "/user/cart" && (
                            <div
                                className="order-product-cart-delete-2-rm"
                                onClick={() => functionToWork()}
                            >
                                REMOVE
                            </div>
                        )}
                    </div>

                    <div className={`order-product-card-detail-3-state`}>
                        {getStatusIcon(order?.state)}
                        {order?.state === "pending" && !showDatetimeInput &&(
                            <>
                                <div
                                    className={`order-product-card-detail-3-state-confirmed`}
                                    onClick={() => setShowDatetimeInput(true)}
                                >
                                    CONFIRM
                                </div>
                                <div
                                    className={`order-product-card-detail-3-state-cancel`}
                                    onClick={handleCancel}
                                >
                                    CANCEL
                                </div>
                            </>
                        )}
                        {order?.state === "confirmed" && (
                            <>
                                <div
                                    className={`order-product-card-detail-3-state-dispatch`}
                                    onClick={() => setShowPhoneInput(true)}
                                >
                                    DISPATCH
                                </div>
                                <div
                                    className={`order-product-card-detail-3-state-cancel`}
                                    onClick={handleCancel}
                                >
                                    CANCEL
                                </div>
                            </>
                        )}
                        {order?.state === "dispatched" && (
                            <>
                                <div
                                    className={`order-product-card-detail-3-state-dispatch`}
                                    onClick={handleDeliver}
                                >
                                    COMPLETED
                                </div>
                                <div
                                    className={`order-product-card-detail-3-state-cancel`}
                                    onClick={handleDeliver}
                                >
                                    CANCEL
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="order-product-card-address">
                <div className="order-product-card-address-div">
                    <p className="order-product-card-address-p1">ORDER ID
                    </p>
                    <p className="order-product-card-address-p2">{order.$id}
                    </p>
                </div>

                <div className="order-product-card-address-div">
                    <p className="order-product-card-address-p1">ADDRESS
                    </p>
                    <p className="order-product-card-address-p2">{order.address}
                    </p>
                </div>
                <div className="order-product-card-address-div">
                    <p className="order-product-card-address-p1">NAME
                    </p>
                    <p className="order-product-card-address-p2">{order.name}
                    </p>
                </div>
                <div className="order-product-card-address-div">
                    <p className="order-product-card-address-p1">PHONE
                    </p>
                    <p className="order-product-card-address-p2">{order.phoneNumber}
                    </p>
                </div>
            </div>

            {showDatetimeInput && (
                <div className="retailer-datetime-modal">
                    <>EXPECTED DELIVERY DATE | TIME</>
                    <div className="retailer-datetime-modal-content">
                        <input
                            type="datetime-local"
                            placeholder="pick"
                            
                            id="retailer-order-input-date"
                            style={{border:"2px solid black"}}
                            value={expectedDatetime}
                            onChange={(e) => setExpectedDatetime(e.target.value)}
                        />
                        <div className="retailer-datetime-modal-content-b1" onClick={handleConfirm}>CONFIRM</div>
                        <div className="retailer-datetime-modal-content-b2" onClick={() => setShowDatetimeInput(false)}>CANCEL</div>
                    </div>
                </div>
            )}

            {showPhoneInput && (
                <div className="phone-modal">
                    <div className="phone-modal-content">
                        <h3>Enter Delivery Boy's Phone Number</h3>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            id="retailer-order-input-date"
                            style={{border:"2px solid black"}}
                            value={deliveryBoyPhone}
                            onChange={(e) => setDeliveryBoyPhone(e.target.value)}
                        />
                        <div>Pick date time</div>
                        <button onClick={handleDispatch}>Dispatch</button>
                        <button onClick={() => setShowPhoneInput(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderProductCard;
