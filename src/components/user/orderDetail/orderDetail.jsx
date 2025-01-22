import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./orderDetail.css";

import useUserAuth from '../../../hooks/userAuthHook.jsx';
import { fetchShopById } from "../../../redux/features/singleShopSlice.jsx";

const OrderDetails = () => {
    const { id } = useParams();
    const { userData } = useUserAuth();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [fetched, setFetched] = useState(true);

    const { orders, loading } = useSelector((state) => state.userOrders);

    const [order, setOrder] = useState(null);
    const [shop, setShop] = useState(null);

    useEffect(() => {
        if (orders && orders.length > 0 && fetched) {
            setFetched(false);
            const foundOrder = orders.find((order) => order.$id === id);
            if (!foundOrder) {
                navigate("/user/order");
                return;
            }
            setOrder(foundOrder);
        } else {
            navigate("/user/order");
        }
    }, []);

    useEffect(() => {
        if (order) {
            const shopId = order.shopId;

            dispatch(fetchShopById(shopId))
                .unwrap()
                .then((shopData) => setShop(shopData))
                .catch((err) => console.error("Error fetching shop:", err));
        }
    }, [order]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!order) {
        return <p>Redirecting...</p>;
    }

    // Dynamically set the header title based on order state
    const getOrderTitle = (state) => {
        switch (state) {
            case 'pending':
                return 'Your Order Is Pending!';
            case 'confirmed':
                return 'Your Order Confirmed!';
            case 'shipped':
                return 'Your Order is on the Way!';
            case 'delivered':
                return 'Your Order Has Been Delivered!';
            default:
                return 'Order Details';
        }
    };

    return (
        <div className="order-details-container">
            <header className="order-header">
                <h1>{getOrderTitle(order.state)}</h1>
                <p>
                    Hello, {userData?.name ? userData?.name : "USER"} <br />
                </p>
            </header>

            <div className="order-summary">
                <div className="order-info">
                    <p><strong>Order Date:</strong> {order.$createdAt}</p>
                    <p><strong>Order No:</strong> {order.$id}</p>
                    <p><strong>Payment:</strong> <span className="payment-icon">CASH ON DELIVERY</span></p>
                    <p><strong>Shipping Address:</strong> {order.address}</p>
                    <p><strong>Shipping LAT:</strong> {order.lat}</p>
                    <p><strong>Shipping LONG:</strong> {order.long}</p>
                </div>

                {order.state === 'confirmed' || order.state === 'shipped' ? (
                    <div className="order-status-details">
                        <p><strong>Expected Delivery Date:</strong> {order.expectedDeliveryDate}</p>
                        <p><strong>Message:</strong> {order.message}</p>
                    </div>
                ) : null}

                {shop && (
                    <div>
                        <h3>Shop Details</h3>
                        <p><strong>Shop Name:</strong> {shop?.shopName}</p>
                        <p><strong>Shop address:</strong> {shop?.address}</p>
                        <p><strong>Shop LAT:</strong> {shop?.lat}</p>
                        <p><strong>Shop LONG:</strong> {shop?.long}</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default OrderDetails;
