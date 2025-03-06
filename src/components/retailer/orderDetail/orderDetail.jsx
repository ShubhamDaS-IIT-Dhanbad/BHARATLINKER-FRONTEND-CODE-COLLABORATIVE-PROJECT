import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft } from 'react-icons/fa';
import { Oval } from "react-loader-spinner";
import "./orderDetail.css";

const OrderDetails = ({ orderId, setSelectedOrderId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const {
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        canceledOrders,
        dispatchedOrders
    } = useSelector((state) => state.retailerorders);

    const retailerData = useSelector((state) => state.retailer?.data);

    // Combine all orders
    const allOrders = [
        ...pendingOrders.data,
        ...confirmedOrders.data,
        ...deliveredOrders.data,
        ...canceledOrders.data,
        ...dispatchedOrders.data
    ];

    // Fetch order details using orderId prop
    useEffect(() => {
        if (!orderId) {
            setSelectedOrderId(null);
            navigate("/retailer/orders");
            return;
        }

        if (allOrders.length > 0) {
            const foundOrder = allOrders.find(order => order.$id === orderId);
            if (!foundOrder) {
                setSelectedOrderId(null);
                navigate("/retailer/orders");
            } else {
                setOrder(foundOrder);
            }
        }
    }, [allOrders, orderId, navigate, setSelectedOrderId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCancelOrder = async () => {
        if (isCancelling) return;
        setIsCancelling(true);

        try {
            // TODO: Add actual cancel order dispatch action
            // dispatch(cancelOrder(order.$id));
            setSelectedOrderId(null);
            navigate("/retailer/orders");
        } catch (error) {
            console.error("Failed to cancel order:", error);
        } finally {
            setIsCancelling(false);
        }
    };

    const onClickPhn = (phoneNumber) => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            alert("Please enter a valid phone number.");
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
                    onClick={() => {
                        setSelectedOrderId(null); // Only sets selectedOrderId to null
                    }}
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

            <main className="retailer-order-detail-order-content">
                <div className="retailer-order-detail-order-details-container">
                    <section className="retailer-order-detail-order-summary">
                        <div className="retailer-order-detail-order-product-card">
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
                            <div className="retailer-order-detail-order-product-card-details">
                                <h3 className="retailer-order-detail-product-title">{order.title}</h3>
                                <div className="retailer-order-detail-order-meta">
                                    <div className="retailer-order-detail-meta-item">
                                        <span className="retailer-order-detail-meta-label">PRICE</span>
                                        <span className="retailer-order-detail-meta-value">₹{order.discountedPrice}</span>
                                    </div>
                                    <div className="retailer-order-detail-meta-item">
                                        <span className="retailer-order-detail-meta-label">QTY</span>
                                        <span className="retailer-order-detail-meta-value">{order.quantity}</span>
                                    </div>
                                    <div className="retailer-order-detail-meta-item">
                                        <span className="retailer-order-detail-meta-label">SUBTOTAL</span>
                                        <span className="retailer-order-detail-meta-value">
                                            ₹{(order.discountedPrice * order.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        

                        <div className="retailer-order-detail-order-info-section">
                            <div className="retailer-order-detail-info-group">
                                <h4 className="retailer-order-detail-info-title">ORDER ID</h4>
                                <p>{order.$id}</p>
                            </div>
                            <div className="retailer-order-detail-info-group">
                                <h4 className="retailer-order-detail-info-title">NAME</h4>
                                <p>{order.name}</p>
                            </div>
                            <div className="retailer-order-detail-info-group">
                                <h4 className="retailer-order-detail-info-title">PHONE</h4>
                                <div onClick={() => onClickPhn(order.phoneNumber)}>
                                    {order.phoneNumber}
                                </div>
                            </div>
                            <div className="retailer-order-detail-info-group">
                                <h4 className="retailer-order-detail-info-title">SHIPPING ADDRESS</h4>
                                <p>{order.address}</p>
                            </div>
                            <div className="retailer-order-detail-info-group">
                                <h4 className="retailer-order-detail-info-title">PAYMENT METHOD</h4>
                                <p>{order.paymentMethod || "Cash on Delivery"}</p>
                            </div>
                            <div className="retailer-order-detail-info-group">
                                <h4 className="retailer-order-detail-info-title">ORDER DATE</h4>
                                <p>{new Date(order.$createdAt).toLocaleDateString()}</p>
                            </div>
                            {order.building && (
                                <div className="retailer-order-detail-info-group">
                                    <div className="retailer-order-detail-info-title">BUILDING NO.</div>
                                    <p>{order.building}</p>
                                </div>
                            )}
                            {order.houseNo && (
                                <div className="retailer-order-detail-info-group">
                                    <div className="retailer-order-detail-info-title">HOUSE NO.</div>
                                    <p>{order.houseNo}</p>
                                </div>
                            )}
                            {order.landMark && (
                                <div className="retailer-order-detail-info-group">
                                    <div className="retailer-order-detail-info-title">LANDMARK</div>
                                    <p>{order.landMark}</p>
                                </div>
                            )}
                            {order.expectedDeliveryDate && (
                                <div className="retailer-order-detail-info-group">
                                    <h4 className="retailer-order-detail-info-title">EXPECTED DELIVERY DATE</h4>
                                    <p>{new Date(order.expectedDeliveryDate).toLocaleDateString()}</p>
                                </div>
                            )}
                            {order.expectedDeliveryDate && (
                                <div className="retailer-order-detail-info-group">
                                    <h4 className="retailer-order-detail-info-title">EXPECTED DELIVERY TIME</h4>
                                    <p>{new Date(order.expectedDeliveryDate).toLocaleTimeString()}</p>
                                </div>
                            )}
                            {order.deliveryBoyPhn && (
                                <div className="retailer-order-detail-info-group">
                                    <h4 className="retailer-order-detail-info-title">DELIVERY BOY PHONE NUMBER</h4>
                                    <div onClick={() => onClickPhn(order.deliveryBoyPhn)}>
                                        {order.deliveryBoyPhn}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="retailer-order-detail-shop-info-message">
                            <p>
                                For any order-related issues, please contact the shop directly.
                                Shop details are available on the Shop page.
                            </p>
                            <button
                                className="retailer-order-detail-view-shop-button"
                                onClick={() => navigate(`/shop/${retailerData?.$id}`)}
                            >
                                VIEW SHOP
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default OrderDetails;