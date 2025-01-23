import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cancelUserOrder } from "../../../redux/features/user/orderSlice.jsx";
import "./orderDetail.css";

import { TiInfoOutline } from "react-icons/ti";
import Navbar from "../a.navbarComponent/navbar.jsx";
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

    const { orders } = useSelector((state) => state.userOrders);

    // Fetch order details
    useEffect(() => {
        if (orders.length > 0) {
            const foundOrder = orders.find((order) => order.$id === id);
            if (!foundOrder) {
                navigate("/user/order");
            } else {
                setOrder(foundOrder);
            }
        } else {
            navigate("/user/order");
        }
    }, [orders, id, navigate]);

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

    const handleCancelOrder = async () => {
        setIsCancelling(true);
        const orderId = order.$id;
        try {
            await dispatch(cancelUserOrder(orderId));
            navigate("/user/order");
        } catch (error) {
            console.error("Failed to cancel order:", error);
        } finally {
            setIsCancelling(false);
        }
    };

    if (!order) {
        return <div className="redirect-message"></div>;
    }

    return (
        <>
            <header>
                <div className="user-refurbished-product-page-header">
                    <Navbar
                        headerTitle={"ORDER DETAIL"}
                        onBackNavigation={() => navigate(-1)}
                    />
                </div>
            </header>

            <div className="order-details-container">
                <header className="order-header">
                    <h1>{getOrderTitle(order.state)}</h1>
                    <p>
                        Hello, {userData?.name || "USER"} <br />
                    </p>
                    <p>your order is {order.state}</p>
                </header>

                <div className="order-summary">
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
                            </div>
                        </div>
                    </div>

                    {(order.state === "pending" || order.state === "confirmed") && (
                        <div
                            className="order-detail-cancel"
                            onClick={isCancelling ? null : handleCancelOrder}
                        >
                            {isCancelling  ? (
                                <Oval
                                    height={20}
                                    width={20}
                                    color="white"
                                    secondaryColor="#b41818"
                                    ariaLabel="loading"
                                />
                            ) : (
                                "CANCEL ORDER"
                            )}
                        </div>
                    )}

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
                            <div className="order-info-h">PAYMENT METHOD</div>{" "}
                            <span className="payment-icon">CASH ON DELIVERY</span>
                        </div>
                        <div className="order-info-c">
                            <div className="order-info-h">SHIPPING ADDRESS</div>
                            <span>{order.address}</span>
                        </div>
                    </div>

                    {(order.state === "confirmed" || order.state === "shipped") && (
                        <div className="oscd">
                            <div className="oscd-info-c">
                                <div className="oscd-info-h">EXPECTED DELIVERY DATE</div>
                                <span>{order.expectedDeliveryDate}</span>
                            </div>
                            <div className="oscd-info-c">
                                <div className="oscd-info-h">MESSAGE FROM SHOP</div>
                                <span> {order.message}</span>
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
                            You can view the shop by clicking VIEW SHOP.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderDetails;
