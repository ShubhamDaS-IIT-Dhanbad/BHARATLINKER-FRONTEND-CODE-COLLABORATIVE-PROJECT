import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./orderDetail.css";

import Navbar from "../a.navbarComponent/navbar.jsx";
import useUserAuth from "../../../hooks/userAuthHook.jsx";
import { fetchShopDetailsById } from "../../../redux/features/user/orderSlice.jsx";

const OrderDetails = () => {
    const { id } = useParams();
    const { userData } = useUserAuth();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { orders, loading } = useSelector((state) => state.userOrders);
    const shopState = useSelector((state) => state.userOrders.shop);

    const [order, setOrder] = useState(null);
    const [shop, setShop] = useState(null);

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

    // Fetch shop details if order is available
    useEffect(() => {
        if (order) {
            const shopId = order.shopId;
            const existingShop = shopState.find((shop) => shop.$id === shopId);

            if (existingShop) {
                setShop(existingShop);
            } else {
                dispatch(fetchShopDetailsById(shopId));
            }
        }
    }, [order, shopState, dispatch]);

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
                    <div className="order-info">
                        <p>
                            <strong>Order Date:</strong>{" "}
                            {new Date(order.$createdAt).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Order No:</strong> {order.$id}
                        </p>
                        <p>
                            <strong>Payment:</strong>{" "}
                            <span className="payment-icon">CASH ON DELIVERY</span>
                        </p>
                        <p>
                            <strong>Shipping Address:</strong> {order.address}
                        </p>
                        <p>
                            <strong>Shipping LAT:</strong> {order.lat}
                        </p>
                        <p>
                            <strong>Shipping LONG:</strong> {order.long}
                        </p>
                    </div>

                    {(order.state === "confirmed" || order.state === "shipped") && (
                        <div className="order-status-details">
                            <p>
                                <strong>Expected Delivery Date:</strong>{" "}
                                {order.expectedDeliveryDate}
                            </p>
                            <p>
                                <strong>Message:</strong> {order.message}
                            </p>
                        </div>
                    )}

                    {shop && (
                        <div className="shop-details">
                            <h3>Shop Details</h3>
                            <p>
                                <strong>Shop Name:</strong> {shop?.shopName}
                            </p>
                            <p>
                                <strong>Shop Address:</strong> {shop?.address}
                            </p>
                            <p>
                                <strong>Shop LAT:</strong> {shop?.lat}
                            </p>
                            <p>
                                <strong>Shop LONG:</strong> {shop?.long}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderDetails;
