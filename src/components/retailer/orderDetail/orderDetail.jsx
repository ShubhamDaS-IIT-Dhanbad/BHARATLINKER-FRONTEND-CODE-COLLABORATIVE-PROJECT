import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TiInfoOutline } from "react-icons/ti";
import { FaArrowLeft } from 'react-icons/fa';
import { Oval } from "react-loader-spinner";
import "./orderDetail.css";

const OrderDetails = ({ retailerData }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showInfo, setShowInfo] = useState(true);
    const [order, setOrder] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const {
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        canceledOrders,
    } = useSelector((state) => state.retailerorders);

    // Combine all orders
    const allOrders = [
        ...pendingOrders.data,
        ...confirmedOrders.data,
        ...deliveredOrders.data,
        ...canceledOrders.data
    ];

    // Fetch order details
    useEffect(() => {
        if (allOrders.length > 0) {
            const foundOrder = allOrders.find(order => order.$id === id);
            if (!foundOrder) {
                navigate("/retailer/orders");
            } else {
                setOrder(foundOrder);
            }
        } else {
            navigate("/retailer/orders");
        }
    }, [allOrders, id, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getOrderTitle = (state) => {
        switch (state) {
            case "pending":
                return "Order Is Pending!";
            case "confirmed":
                return "Order Confirmed!";
            case "shipped":
                return "Order is on the Way!";
            case "delivered":
                return "Order Has Been Delivered!";
            default:
                return "Order Details";
        }
    };

    const handleCancelOrder = async () => {
        if (isCancelling) return;
        setIsCancelling(true);

        try {
            navigate("/retailer/orders");
        } catch (error) {
            console.error("Failed to cancel order:", error);
        } finally {
            setIsCancelling(false);
        }
    };

    if (!order) {
        return (
            <div className="loading-container">
                <Oval height={50} width={50} color="#000" secondaryColor="#ccc" />
            </div>
        );
    }

    return (
        <>
            <header className="retailer-update-header">
                <FaArrowLeft
                    className="retailer-update-header-left-icon"
                    size={25}
                    onClick={() => navigate('/retailer/orders')}
                    aria-label="Back to orders"
                    tabIndex={0}
                />
                <div className="retailer-update-header-inner-div">
                    <h1 className="retailer-update-header-inner-div-p">
                        ORDER DETAILS
                    </h1>
                    {retailerData?.shopName && (
                        <div className="retailer-upload-product-header-shopname">
                            {retailerData.shopName.toUpperCase()}
                        </div>
                    )}
                </div>
            </header>
            <main className="retaile-order-detail-order-content">
                <div className="retailer-order-detail-order-details-container">
                    <section className="retaile-order-detail-order-header">
                        <h2>{getOrderTitle(order.state)}</h2>
                        <p className="retaile-order-detail-order-status">Current status: {order.state}</p>
                    </section>

                    <section className="retaile-order-detail-order-summary">
                        <div className="retaile-order-detail-order-product-card">
                            <div
                                className="retailer-order-detail-order-product-card-img"
                                onClick={() => navigate(`/product/${order.productId}`)}
                                role="button"
                                tabIndex={0}
                            >
                                <img
                                    src={order.image}
                                    alt={order.title}
                                    loading="lazy"
                                />
                            </div>
                            <div className="retaile-order-detail-order-product-card-details">
                                <h3 className="retaile-order-detail-product-title">{order.title}</h3>
                                <div className="retaile-order-detail-order-meta">
                                    <div className="retaile-order-detail-meta-item">
                                        <span className="retaile-order-detail-meta-label">PRICE</span>
                                        <span className="retaile-order-detail-meta-value">₹{order.discountedPrice}</span>
                                    </div>
                                    <div className="retaile-order-detail-meta-item">
                                        <span className="retaile-order-detail-meta-label">QTY</span>
                                        <span className="retaile-order-detail-meta-value">{order.quantity}</span>
                                    </div>
                                    <div className="retaile-order-detail-meta-item">
                                        <span className="retaile-order-detail-meta-label">SUBTOTAL</span>
                                        <span className="retaile-order-detail-meta-value">
                                            ₹{(order.discountedPrice * order.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(order.state === "pending" || order.state === "confirmed") && (
                            <button
                                className={`retaile-order-detail-cancel-button ${isCancelling ? 'disabled' : ''}`}
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                            >
                                {isCancelling ? (
                                    <Oval
                                        height={20}
                                        width={20}
                                        color="#fff"
                                        secondaryColor="#ccc"
                                    />
                                ) : (
                                    "CANCEL ORDER"
                                )}
                            </button>
                        )}

                        <div className="retaile-order-detail-order-info-section">
                            <div className="retaile-order-detail-info-group">
                                <h4 className="retaile-order-detail-info-title">ORDER DATE</h4>
                                <p>{new Date(order.$createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="retaile-order-detail-info-group">
                                <h4 className="retaile-order-detail-info-title">ORDER ID</h4>
                                <p>{order.$id}</p>
                            </div>
                            <div className="retaile-order-detail-info-group">
                                <h4 className="retaile-order-detail-info-title">PAYMENT METHOD</h4>
                                <p>{order.paymentMethod || "Cash on Delivery"}</p>
                            </div>
                            <div className="retaile-order-detail-info-group">
                                <h4 className="retaile-order-detail-info-title">SHIPPING ADDRESS</h4>
                                <p>{order.address}</p>
                            </div>
                        </div>

                        {(order.state === "confirmed" || order.state === "shipped") && (
                            <div className="retaile-order-detail-delivery-info">
                                <div className="retaile-order-detail-info-group">
                                    <h4 className="retaile-order-detail-info-title">EXPECTED DELIVERY</h4>
                                    <p>
                                        {new Date(order.expectedDeliveryDate).toLocaleDateString()} at {' '}
                                        {new Date(order.expectedDeliveryDate).toLocaleTimeString()}
                                    </p>
                                </div>
                                {order.deliveryBoyContact && (
                                    <div className="retaile-order-detail-info-group">
                                        <h4 className="retaile-order-detail-info-title">DELIVERY CONTACT</h4>
                                        <p>{order.deliveryBoyContact}</p>
                                    </div>
                                )}
                                {order.customerMessage && (
                                    <div className="retaile-order-detail-info-group">
                                        <h4 className="retaile-order-detail-info-title">CUSTOMER MESSAGE</h4>
                                        <p>{order.customerMessage}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="retaile-order-detail-shop-info-toggle">
                            <TiInfoOutline
                                size={20}
                                onClick={() => setShowInfo(!showInfo)}
                                aria-label="Toggle shop information"
                                role="button"
                            />
                        </div>

                        {showInfo && (
                            <div className="retaile-order-detail-shop-info-message">
                                <p>
                                    For any order-related issues, please contact the shop directly.
                                    Shop details are available on the Shop page.
                                </p>
                                <button
                                    className="retaile-order-detail-view-shop-button"
                                    onClick={() => navigate(`/shop/${retailerData.$id}`)}
                                >
                                    VIEW SHOP
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};

export default OrderDetails;