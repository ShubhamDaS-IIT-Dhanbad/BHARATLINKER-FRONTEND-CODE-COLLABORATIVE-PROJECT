import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateOrderStateToCanceled } from "../../../appWrite/order/order.js";
import { deleteOrder, updateOrder } from "../../../redux/features/user/orderSlice.jsx";
import "./orderDetail.css";

import { TiInfoOutline } from "react-icons/ti";
import Navbar from "../navbar.jsx";
import useUserAuth from "../../../hooks/userAuthHook.jsx";
import { Oval } from "react-loader-spinner";

const OrderDetails = () => {
    const { id } = useParams();
    const { userData } = useUserAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showi, setShowi] = useState(true);
    const [order, setOrder] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const {
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        canceledOrders,
    } = useSelector((state) => state.userorders);

    const orders = [
        ...pendingOrders.data,
        ...confirmedOrders.data,
        ...deliveredOrders.data,
        ...canceledOrders.data,
    ];

    // Fetch order details
    useEffect(() => {

        if (orders?.length > 0) {
            const foundOrder = orders?.find((order) => order.$id === id);
            if (!foundOrder) {
                navigate("/user/order");
            } else {
                setOrder(foundOrder);
            }
        } else {
            navigate("/user/order");
        }
    }, [orders, id, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getOrderTitle = (state) => {
        switch (state) {
            case "pending":
                return "Your Order Is Pending!";
            case "confirmed":
                return "Your Order Confirmed!";
            case "shipped":
                return "Your Order is on the Way!";
            case "delivered":
                return "Your Order Has Been Delivered!";
            default:
                return "Order Details";
        }
    };

    const handleCancel = async () => {
        const confirmation = window.confirm("Are you sure you want to cancel this order?");
        if (confirmation) {
            setIsCancelling(true);
            const updatedOrderData = await updateOrderStateToCanceled(order.$id, "canceled");
            dispatch(deleteOrder({ orderId: order.$id, orderStateArrayName: order.state }));
            dispatch(updateOrder({ orderId: order.$id, updatedOrderData, orderStateArrayName: "canceled" }));
            setIsCancelling(false);
        }
    };

    if (!order) {
        return <div className="redirect-message"></div>;
    }

    return (
        <>
            <header>
                <Navbar userData={userData} headerTitle={"ORDER DETAIL"} onBackNavigation={() => navigate(-1)} />
            </header>

            <div className="order-details-container">
                <header className="order-header">
                    <h1>{getOrderTitle(order.state)}</h1>
                    <p>Hello, {userData?.name || "USER"} <br /></p>
                    <p>Your order is {order.state}</p>
                </header>

                <div className="order-summary">
                    <div className="order-product-card">
                        <div className="order-product-card-img" onClick={() => navigate(`/product/${order.productId}`)}>
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
                        </div>
                    </div>

                    {(order.state === "pending" || order.state === "confirmed") && (
                        <div className="order-detail-cancel" onClick={isCancelling ? null : handleCancel}>
                            {isCancelling ? (
                                <Oval height={20} width={20} color="white" secondaryColor="#b41818" ariaLabel="loading" />
                            ) : (
                                "CANCEL ORDER"
                            )}
                        </div>
                    )}
                    {console.log(order, "shubham")}
                    <div className="order-info">
                        <div className="order-info-c">
                            <div className="order-info-h">ORDERED DATE</div>
                            <span>{new Date(order.$createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="order-info-c">
                            <div className="order-info-h">ORDER ID</div>
                            <span>{order.$id}</span>
                        </div>
                        <div className="order-info-c">
                            <div className="order-info-h">PAYMENT METHOD</div>
                            <span className="payment-icon">CASH ON DELIVERY</span>
                        </div>
                        <div className="order-info-c">
                            <div className="order-info-h">SHIPPING ADDRESS</div>
                            <span>{order.address}</span>
                        </div>
                        {order.building &&
                            <div className="order-info-c">
                                <div className="order-info-h">BUILDING NO.</div>
                                <span>{order.building}</span>
                            </div>}
                        {order.houseNo &&
                            <div className="order-info-c">
                                <div className="order-info-h">HOUSE NO.</div>
                                <span>{order.houseNo}</span>
                            </div>}
                        {order.landMark &&
                            <div className="order-info-c">
                                <div className="order-info-h">LANDMARK</div>
                                <span>{order.landMark}</span>
                            </div>}
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

                    <div className="order-detail-shop">
                        <span onClick={() => navigate(`/shop/${order.shopId}`)}>VISIT SHOP</span>
                        <TiInfoOutline size={20} onClick={() => setShowi(!showi)} />
                    </div>
                    {showi && (
                        <div className="info-box">
                            For any order-related issues, please contact the shop. Shop details are available on the Shop page.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderDetails;
