import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaExclamationTriangle, FaLuggageCart, FaSadCry } from "react-icons/fa";
import { RiChatSmileFill } from "react-icons/ri";
import { GiPartyPopper } from "react-icons/gi";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { Oval } from "react-loader-spinner";
import {
    updateOrderStateToConfirmed,
    updateOrderStateToDispatched,
    updateOrderStateToCanceled,
    updateOrderStateToDelivered,
} from "../../../appWrite/order/order.js";

import { updateOrder, deleteOrder } from "../../../redux/features/retailer/orderSlice.jsx";
import "./orderProductCard.css";

function OrderProductCard({ order}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showDatetimeInput, setShowDatetimeInput] = useState(false);
    const [expectedDatetime, setExpectedDatetime] = useState("");
    const [showPhoneInput, setShowPhoneInput] = useState(false);
    const [deliveryBoyPhone, setDeliveryBoyPhone] = useState("");

    const [conforming, setConforming] = useState(false);
    const [dispatching, setDispatching] = useState(false);
    const [delivering, setDelivering] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const [error, setError] = useState("");

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
            setError("Please select an expected delivery datetime.");
            return;
        }
        setConforming(true);
        setShowDatetimeInput(false);
        try {
            const updatedOrderData = await updateOrderStateToConfirmed(order.$id, "confirmed", expectedDatetime);

            dispatch(deleteOrder({ orderId: order.$id, orderStateArrayName: "pending" }));
            dispatch(updateOrder({ orderId: order.$id, updatedOrderData, orderStateArrayName: "confirmed" }));

            setExpectedDatetime("");

            setError("");
        } catch (err) {
            setError("Failed to confirm the order. Please try again.");
        }
        setConforming(false);
    };

    const handleDispatch = async () => {
        if (!deliveryBoyPhone) {
            setError("Please enter the delivery boy's phone number.");
            return;
        }
        setDispatching(true);
        setShowPhoneInput(false);
        try {
            const updatedOrderData = await updateOrderStateToDispatched(order.$id, "dispatched", deliveryBoyPhone);

            dispatch(updateOrder({ orderId: order.$id, updatedOrderData, orderStateArrayName: "confirmed" }));

            setDeliveryBoyPhone("");
            setError(""); // Clear the error after success
        } catch (err) {
            setError("Failed to dispatch the order. Please try again.");
        }
        setDispatching(false);
    };











    const handleCancel = async () => {
        const confirmation = window.confirm("Are you sure you want to cancel this order?");
        if (confirmation) {
            setCanceling(true);
            const updatedOrderData = await updateOrderStateToCanceled(order.$id, "canceled");
            dispatch(deleteOrder({ orderId: order.$id, orderStateArrayName: order.state }));
            dispatch(updateOrder({ orderId: order.$id, updatedOrderData, orderStateArrayName: "canceled" }));

        } setCanceling(false);
    };

    const handleDeliver = async () => {
        const confirmation = window.confirm("Mark this order as delivered?");
        if (confirmation) {
            setDelivering(true);
            const updatedOrderData = await updateOrderStateToDelivered(order.$id, "delivered");

            dispatch(deleteOrder({ orderId: order.$id, orderStateArrayName: "confirmed" }));
            dispatch(updateOrder({ orderId: order.$id, updatedOrderData, orderStateArrayName: "delivered" }));

        }
        setDelivering(false);
    };




    const onClickPhn = (phoneNumber) => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            alert("Please enter a valid phone number.");
        }
    };
    return (
        <>
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
                        </div>

                        <div className={`order-product-card-detail-3-state`}>
                            {getStatusIcon(order?.state)}
                            {order?.state === "pending" && !showDatetimeInput && (
                                <>

                                    {conforming ? <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />
                                        : <div
                                            className={`order-product-card-detail-3-state-confirmed`}
                                            onClick={() => setShowDatetimeInput(true)}
                                        >CONFIRM</div>}

                                    {canceling ? <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />

                                        :
                                        <div
                                            className={`order-product-card-detail-3-state-cancel`}
                                            onClick={handleCancel}
                                        >
                                            CANCEL
                                        </div>}

                                        {window.location.pathname === "/retailer/orders" && (
                                <div
                                    className="order-product-card-detail-2-rm"
                                    onClick={() => navigate(`/user/order/${order.$id}`)}
                                >
                                    DETAIL
                                </div>
                            )}
                                </>
                            )}
                            {order?.state === "confirmed" && !showPhoneInput && (
                                <>

                                    {dispatching ? <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />
                                        : <div
                                            className={`order-product-card-detail-3-state-confirmed`}
                                            onClick={() => setShowPhoneInput(true)}
                                        >DISPATCH</div>
                                    }
                                    {canceling ? <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />

                                        :
                                        <div
                                            className={`order-product-card-detail-3-state-cancel`}
                                            onClick={handleCancel}
                                        >
                                            CANCEL
                                        </div>}
                                        {window.location.pathname === "/retailer/orders" && (
                                <div
                                    className="order-product-card-detail-2-rm"
                                    onClick={() => navigate(`/user/order/${order.$id}`)}
                                >
                                    DETAIL
                                </div>
                            )}
                                </>
                            )}
                            {order?.state === "dispatched" && (
                                <>{delivering ? <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />

                                    : <div
                                        className={`order-product-card-detail-3-state-delivered`}
                                        onClick={handleDeliver}
                                    >
                                        DELIVERED ?
                                    </div>}
                                    {canceling ? <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />

                                        :
                                        <div
                                            className={`order-product-card-detail-3-state-cancel`}
                                            onClick={handleCancel}
                                        >
                                            CANCEL
                                        </div>}
                                        {window.location.pathname === "/retailer/orders" && (
                                <div
                                    className="order-product-card-detail-2-rm"
                                    onClick={() => navigate(`/user/order/${order.$id}`)}
                                >
                                    DETAIL
                                </div>
                            )}
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
                        <p className="order-product-card-address-p1">NAME
                        </p>
                        <p className="order-product-card-address-p2">{order.name}
                        </p>
                    </div>
                    <div className="order-product-card-address-div">
                        <p className="order-product-card-address-p1">PHONE
                        </p>
                        <div className="order-product-card-address-p2" onClick={() => { onClickPhn(order.phoneNumber) }}>
                            {order.phoneNumber}
                        </div>

                    </div>


                    <div className="order-product-card-address-div">
                        <p className="order-product-card-address-p1">ADDRESS
                        </p>
                        <p className="order-product-card-address-p2">{order.address}
                        </p>
                    </div>


                    {order.expectedDeliveryDate &&
                        <div className="order-product-card-address-div">
                            <p className="order-product-card-address-p1" style={{ fontSize: "12px" }}>EXP DELIVERY DATE
                            </p>
                            <p className="order-product-card-address-p2">
                                {new Date(order.expectedDeliveryDate).toLocaleDateString()}{" "}
                            </p>
                        </div>
                    }
                    {order.expectedDeliveryDate &&
                        <div className="order-product-card-address-div">
                            <p className="order-product-card-address-p1" style={{ fontSize: "12px" }}>EXP DELIVERY TIME
                            </p>
                            <p className="order-product-card-address-p2">
                                {new Date(order.expectedDeliveryDate).toLocaleTimeString()}
                            </p>
                        </div>
                    }
                    {order.deliveryBoyPhn &&
                        <div className="order-product-card-address-div">
                            <p className="order-product-card-address-p1" style={{ fontSize: "12px" }}> DELIVERY BOY
                            </p>
                            <div className="order-product-card-address-p2" onClick={() => { onClickPhn(order.deliveryBoyPhn) }} >
                                {order.deliveryBoyPhn}
                            </div>
                        </div>
                    }

                </div>









                {showDatetimeInput && (
                    <div className="retailer-datetime-modal">
                        <>EXPECTED DELIVERY DATE | TIME</>
                        <div className="retailer-datetime-modal-content">
                            <input
                                type="datetime-local"
                                placeholder="pick"
                                id="retailer-order-input-date"
                                style={{ border: "2px solid black" }}
                                value={expectedDatetime}
                                onChange={(e) => setExpectedDatetime(e.target.value)}
                            />
                            <div className="retailer-datetime-modal-content-b1" onClick={handleConfirm}>CONFIRM</div>
                            <div className="retailer-datetime-modal-content-b2" onClick={() => setShowDatetimeInput(false)}>CANCEL</div>
                        </div>
                    </div>
                )}

                {showPhoneInput && (
                    <div className="retailer-datetime-modal">
                        <>DELIVERY BOY PHN</>
                        <div className="retailer-datetime-modal-content">
                            <input
                                type="text"
                                placeholder="Phone Number"

                                id="retailer-order-phn"
                                value={deliveryBoyPhone}
                                onChange={(e) => setDeliveryBoyPhone(e.target.value)}
                            />
                            <div className="retailer-datetime-modal-content-b1" onClick={handleDispatch}>DISPATCH</div>
                            <div className="retailer-datetime-modal-content-b2" onClick={() => setShowPhoneInput(false)}>CANCEL</div>
                        </div>
                    </div>
                )}
            </div>


        </>
    );
}

export default OrderProductCard;
