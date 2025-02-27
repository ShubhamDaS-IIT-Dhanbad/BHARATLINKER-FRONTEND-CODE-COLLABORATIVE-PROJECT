import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { updateOrderStateToCanceled } from "../../../appWrite/order/order.js";
import { deleteOrder, updateOrder } from "../../../redux/features/user/orderSlice.jsx";
import "./orderDetail.css";
import { TiInfoOutline } from "react-icons/ti";
import Navbar from "../navbar.jsx";
import { Oval } from "react-loader-spinner";

const UserOrderDetail = ({ userData, order, setOrder }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showInfo, setShowInfo] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getOrderTitle = (state) => {
        switch (state) {
            case "pending":
                return "Your Order Is Pending!";
            case "confirmed":
                return "Your Order Confirmed!";
            case "dispatched":
                return "Your Order is on the Way!";
            case "delivered":
                return "Your Order Has Been Delivered!";
            case "canceled":
                return "Your Order Has Been Canceled";
            default:
                return "Order Details";
        }
    };

    const handleCancel = async () => {
        const confirmation = window.confirm("Are you sure you want to cancel this order?");
        if (confirmation) {
            setIsCancelling(true);
            try {
                const updatedOrderData = await updateOrderStateToCanceled(order.$id, "canceled");
                dispatch(deleteOrder({ orderId: order.$id, orderStateArrayName: order.state }));
                dispatch(updateOrder({ 
                    orderId: order.$id, 
                    updatedOrderData, 
                    orderStateArrayName: "canceled" 
                }));
                setOrder(null);
            } catch (error) {
                console.error("Failed to cancel order:", error);
                alert("Failed to cancel order. Please try again.");
            } finally {
                setIsCancelling(false);
            }
        }
    };

    const handlePhoneClick = (phoneNumber) => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        }
    };

    if (!order) {
        return <div className="redirect-message">No order selected</div>;
    }

    return (
        <>
            <header>
                <Navbar 
                onBackNavigation={()=>{setOrder(null)}}
                    userData={userData} 
                    headerTitle="ORDER DETAIL"
                />
            </header>

            <div className="user-order-detail-container">
                <header className="user-order-detail-header">
                    <h1>{getOrderTitle(order.state.toLowerCase())}</h1>
                    <p>Hello, {userData?.name || "USER"}</p>
                    <p>Your order is {order.state}</p>
                </header>

                <div className="user-order-detail-summary">
                    <div className="order-product-card">
                        <div 
                            className="order-product-card-img" 
                            onClick={() => navigate(`/product/${order.productId}`)}
                        >
                            <img src={order.image} alt={order.title} />
                        </div>
                        <div className="order-product-card-detail">
                            <div className="order-product-card-detail-1">{order.title}</div>
                            <div className="order-product-card-detail-2">
                                <div style={{ display: "flex", gap: "7px" }}>
                                    <div className="order-product-card-detail-2-1">
                                        <p className="order-product-card-detail-2-1-tag">PRICE</p>
                                        <p className="opcdp">₹{order.discountedPrice}</p>
                                    </div>
                                    <div className="order-product-card-detail-2-1">
                                        <p className="order-product-card-detail-2-1-tag">QTY</p>
                                        <p className="opcdp">{order.quantity}</p>
                                    </div>
                                    <div className="order-product-card-detail-2-1">
                                        <p className="order-product-card-detail-2-1-tag">SUBTOTAL</p>
                                        <p className="opcdp">₹{order.discountedPrice * order.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(order.state === "pending" || order.state === "confirmed") && (
                        <button 
                            className="user-order-detail-cancel" 
                            onClick={handleCancel}
                            disabled={isCancelling}
                        >
                            {isCancelling ? (
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
                        </button>
                    )}
                    <div className="user-order-detail-info">
                        <div className="user-order-detail-info-c">
                            <div className="user-order-detail-info-h">ORDERED DATE</div>
                            <span>{new Date(order.$createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="user-order-detail-info-c">
                            <div className="user-order-detail-info-h">ORDER ID</div>
                            <span>{order.$id}</span>
                        </div>
                        <div className="user-order-detail-info-c">
                            <div className="user-order-detail-info-h">PAYMENT METHOD</div>
                            <span className="payment-icon">CASH ON DELIVERY</span>
                        </div>
                        <div className="user-order-detail-info-c">
                            <div className="user-order-detail-info-h">SHIPPING ADDRESS</div>
                            <span>{order.address}</span>
                        </div>
                        {order.building && (
                            <div className="user-order-detail-info-c">
                                <div className="user-order-detail-info-h">BUILDING NO.</div>
                                <span>{order.building}</span>
                            </div>
                        )}
                        {order.houseNo && (
                            <div className="user-order-detail-info-c">
                                <div className="user-order-detail-info-h">HOUSE NO.</div>
                                <span>{order.houseNo}</span>
                            </div>
                        )}
                        {order.landMark && (
                            <div className="user-order-detail-info-c">
                                <div className="user-order-detail-info-h">LANDMARK</div>
                                <span>{order.landMark}</span>
                            </div>
                        )}
                    </div>

                    {order.expectedDeliveryDate && (
                        <>
                            <div className="order-product-card-address-div">
                                <p className="order-product-card-address-p1">EXP DELIVERY DATE</p>
                                <p className="order-product-card-address-p2">
                                    {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="order-product-card-address-div">
                                <p className="order-product-card-address-p1">EXP DELIVERY TIME</p>
                                <p className="order-product-card-address-p2">
                                    {new Date(order.expectedDeliveryDate).toLocaleTimeString()}
                                </p>
                            </div>
                        </>
                    )}
                    {order.deliveryBoyPhn && (
                        <div className="order-product-card-address-div">
                            <p className="order-product-card-address-p1">DELIVERY BOY</p>
                            <button 
                                className="order-product-card-address-p2" 
                                onClick={() => handlePhoneClick(order.deliveryBoyPhn)}
                            >
                                {order.deliveryBoyPhn}
                            </button>
                        </div>
                    )}

                    <div className="user-order-detail-shop">
                        <button onClick={() => navigate(`/shop/${order.shopId}`)}>VISIT SHOP</button>
                        <TiInfoOutline 
                            size={20} 
                            onClick={() => setShowInfo(!showInfo)} 
                            aria-label="Toggle shop info"
                        />
                    </div>
                    {showInfo && (
                        <div className="user-order-detail-info-box">
                            For any order-related issues, please contact the shop. Shop details are available on the Shop page.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

UserOrderDetail.propTypes = {
    userData: PropTypes.shape({
        name: PropTypes.string
    }).isRequired,
    order: PropTypes.shape({
        $id: PropTypes.string,
        $createdAt: PropTypes.string,
        productId: PropTypes.string,
        shopId: PropTypes.string,
        image: PropTypes.string,
        title: PropTypes.string,
        discountedPrice: PropTypes.number,
        quantity: PropTypes.number,
        state: PropTypes.string,
        address: PropTypes.string,
        building: PropTypes.string,
        houseNo: PropTypes.string,
        landMark: PropTypes.string,
        expectedDeliveryDate: PropTypes.string,
        deliveryBoyPhn: PropTypes.string
    }),
    setOrder: PropTypes.func.isRequired
};

export default UserOrderDetail;