import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Oval } from 'react-loader-spinner';
import { fetchUserOrders } from '../../../redux/features/user/orderSlice.jsx';
import OrderProductCard from './orderProductCard.jsx';
import { BsBasket2Fill } from "react-icons/bs";
import useUserAuth from '../../../hooks/userAuthHook.jsx';
import './order.css';

import { FaArrowLeft } from 'react-icons/fa';

function Order() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userData } = useUserAuth();
    const { orders, loading } = useSelector((state) => state.userOrders);

    useEffect(() => {
        if (userData && orders.length == 0) {
            dispatch(fetchUserOrders(userData.$id));
        }
    }, [userData]);

    return (
        <>
            <div className="user-order-container">
                <FaArrowLeft
                    id="product-page-user-icon"
                    size={25}
                    onClick={() => navigate('/user')}
                    aria-label="Go to Home"
                    tabIndex={0}
                />
                <div className="product-page-user-location">
                    <p className="product-page-location-label">ORDER DETAILS</p>
                    <p id="dashboard-header-user-phn" style={{color:"white"}}>
                        {userData ? userData.phoneNumber : 'xxxxx xxxxx'}
                    </p>
                </div>
            </div>
            <div className="user-orders-container-order">
                {loading ? (
                    <div className="fallback-loading">
                        <Oval height={30} width={30} color="white" secondaryColor="gray" ariaLabel="loading" />
                    </div>
                ) : (
                    <div className="user-orders-list">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.$id} className="order-item">
                                    <OrderProductCard
                                        order={order}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No orders found for the selected filter.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default Order;
