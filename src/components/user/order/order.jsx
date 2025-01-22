import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { fetchUserOrders } from "../../../redux/features/user/orderSlice.jsx";
import OrderProductCard from "./orderProductCard.jsx";
import useUserAuth from "../../../hooks/userAuthHook.jsx";
import "./order.css";

import { FaArrowLeft } from "react-icons/fa";

function Order() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userData } = useUserAuth();
    const { orders, loading, error } = useSelector((state) => state.userOrders);

    useEffect(() => {
        if (userData && orders.length === 0 && !loading.orders) {
            dispatch(fetchUserOrders(userData.$id));
        }
    }, [userData]);

    return (
        <>
            <div className="user-order-container">
                <FaArrowLeft
                    id="product-page-user-icon"
                    size={25}
                    onClick={() => navigate("/user")}
                    aria-label="Go to Home"
                    tabIndex={0}
                />
                <div className="product-page-user-location">
                    <p className="product-page-location-label">ORDER DETAILS</p>
                    <p id="dashboard-header-user-phn" style={{ color: "white" }}>
                        {userData ? userData.phoneNumber : "xxxxx xxxxx"}
                    </p>
                </div>
            </div>

            <div className="user-orders-container-order">
                {loading.orders ? (
                    <div className="fallback-loading">
                        <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                    </div>
                ) : (<div className="user-orders-list">
                    {orders.map((order) => (
                        <div key={order.$id} className="order-item">
                            <OrderProductCard order={order} />
                        </div>
                    ))}
                </div>)
            }

            </div>
        </>
    );
}

export default Order;
