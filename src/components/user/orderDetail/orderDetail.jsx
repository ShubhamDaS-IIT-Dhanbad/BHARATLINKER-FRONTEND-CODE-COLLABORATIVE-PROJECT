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
import OrderProductCard from "../order/orderProductCard.jsx";

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
        return <div className="uod-redirect-message">No order selected</div>;
    }

    return (
        <>
            <header>
                <Navbar 
                    onBackNavigation={() => setOrder(null)}
                    userData={userData} 
                    headerTitle="ORDER DETAIL"
                />
            </header>

            <div className="uod-container">
                <header className="uod-header">
                    <h1>{getOrderTitle(order.state.toUpperCase())}</h1>
                    <p>Hello, {userData?.name || "USER"}</p>
                    <p>Your order is {order.state}</p>
                </header>

                <div className="uod-summary">
                    <div className="uod-product-card">
                        <OrderProductCard
                            order={order}
                            onImageClick={() => navigate(`/product/${order.productId}`)}
                        />
                    </div>
                    <div className="uod-info">
                        <div className="uod-info-c">
                            <div className="uod-info-h">ORDERED DATE</div>
                            <span>{new Date(order.$createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="uod-info-c">
                            <div className="uod-info-h">ORDER ID</div>
                            <span>{order.$id}</span>
                        </div>
                        <div className="uod-info-c">
                            <div className="uod-info-h">PAYMENT METHOD</div>
                            <span className="uod-payment-icon">CASH ON DELIVERY</span>
                        </div>
                        <div className="uod-info-c">
                            <div className="uod-info-h">SHIPPING ADDRESS</div>
                            <span>{order.address}</span>
                        </div>
                        {order.building && (
                            <div className="uod-info-c">
                                <div className="uod-info-h">BUILDING NO.</div>
                                <span>{order.building}</span>
                            </div>
                        )}
                        {order.houseNo && (
                            <div className="uod-info-c">
                                <div className="uod-info-h">HOUSE NO.</div>
                                <span>{order.houseNo}</span>
                            </div>
                        )}
                        {order.landMark && (
                            <div className="uod-info-c">
                                <div className="uod-info-h">LANDMARK</div>
                                <span>{order.landMark}</span>
                            </div>
                        )}
                    </div>

                    {order.expectedDeliveryDate && (
                        <>
                            <div className="uod-product-card-address-div">
                                <p className="uod-product-card-address-p1">EXP DELIVERY DATE</p>
                                <p className="uod-product-card-address-p2">
                                    {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="uod-product-card-address-div">
                                <p className="uod-product-card-address-p1">EXP DELIVERY TIME</p>
                                <p className="uod-product-card-address-p2">
                                    {new Date(order.expectedDeliveryDate).toLocaleTimeString()}
                                </p>
                            </div>
                        </>
                    )}
                    {order.deliveryBoyPhn && (
                        <div className="uod-product-card-address-div">
                            <p className="uod-product-card-address-p1">DELIVERY BOY</p>
                            <button 
                                className="uod-product-card-address-p2" 
                                onClick={() => handlePhoneClick(order.deliveryBoyPhn)}
                            >
                                {order.deliveryBoyPhn}
                            </button>
                        </div>
                    )}

                    <div className="uod-shop">
                        <button onClick={() => navigate(`/shop/${order.shopId}`)}>VISIT SHOP</button>
                        <TiInfoOutline 
                            size={20} 
                            onClick={() => setShowInfo(!showInfo)} 
                            aria-label="Toggle shop info"
                        />
                    </div>
                    {showInfo && (
                        <div className="uod-info-box">
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
    }),
    order: PropTypes.shape({
        $id: PropTypes.string.isRequired,
        $createdAt: PropTypes.string.isRequired,
        productId: PropTypes.string.isRequired,
        shopId: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        discountedPrice: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        state: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        building: PropTypes.string,
        houseNo: PropTypes.string,
        landMark: PropTypes.string,
        expectedDeliveryDate: PropTypes.string,
        deliveryBoyPhn: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) // Updated to allow string or number
    }).isRequired,
    setOrder: PropTypes.func.isRequired
};

export default UserOrderDetail;