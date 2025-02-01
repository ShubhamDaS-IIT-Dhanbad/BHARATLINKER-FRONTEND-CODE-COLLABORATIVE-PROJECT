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
    const onClickPhn = (phoneNumber) => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            alert("Please enter a valid phone number.");
        }
    };
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

                        {(order.state === "pending" || order.state === "confirmed") && (
                            <button
                                className={`retailer-order-detail-cancel-button ${isCancelling ? 'disabled' : ''}`}
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

                        <div className="retailer-order-detail-order-info-section">

                            <div className="retailer-order-detail-info-group">
                                <h4 className="retailer-order-detail-info-title">ORDER ID</h4>
                                <p>{order.$id}</p>
                            </div>
                            <div className="retailer-order-detail-info-group">
                                <h4 className="retailer-order-detail-info-title">NAME
                                </h4>
                                <p>{order.name}
                                </p>
                            </div>
                            <div className="retailer-order-detail-info-group">
                                <h4 className="retailer-order-detail-info-title">PHONE
                                </h4>
                                <div onClick={() => { onClickPhn(order.phoneNumber) }}>
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
                            {order.building &&
                                <div className="retailer-order-detail-info-group">
                                    <div className="retailer-order-detail-info-title">BUILDING NO.</div>
                                    <p>{order.building}</p>
                                </div>
                            }
                            {order.houseNo &&
                                <div className="retailer-order-detail-info-group">
                                    <div className="retailer-order-detail-info-title">HOUSE NO.</div>
                                    <p>{order.houseNo}</p>
                                </div>
                            }
                            {order.landMark &&
                                <div className="retailer-order-detail-info-group">
                                    <div className="retailer-order-detail-info-title">LANDMARK</div>
                                    <p>{order.landMark}</p>
                                </div>
                            }
                            {order.expectedDeliveryDate &&
                                <div className="retailer-order-detail-info-group">
                                    <h4 className="retailer-order-detail-info-title">EXPECTED DELIVERY DATE
                                    </h4>
                                    <p >
                                        {new Date(order.expectedDeliveryDate).toLocaleDateString()}{" "}
                                    </p>
                                </div>
                            }
                            {order.expectedDeliveryDate &&
                                <div className="retailer-order-detail-info-group">
                                    <h4 className="retailer-order-detail-info-title">EXPECTED DELIVERY TIME
                                    </h4>
                                    <p >
                                        {new Date(order.expectedDeliveryDate).toLocaleTimeString()}
                                    </p>
                                </div>
                            }
                            {order.deliveryBoyPhn &&
                                <div className="retailer-order-detail-info-group">
                                    <h4 className="retailer-order-detail-info-title"> DELIVERY BOY PHONE NUMBER
                                    </h4>
                                    <div onClick={() => { onClickPhn(order.deliveryBoyPhn) }} >
                                        {order.deliveryBoyPhn}
                                    </div>
                                </div>
                            }
                        </div>




                        {true && (
                            <div className="retailer-order-detail-shop-info-message">
                                <p>
                                    For any order-related issues, please contact the shop directly.
                                    Shop details are available on the Shop page.
                                </p>
                                <button
                                    className="retailer-order-detail-view-shop-button"
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