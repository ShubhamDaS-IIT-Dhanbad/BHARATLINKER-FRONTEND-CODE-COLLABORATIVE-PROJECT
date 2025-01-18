import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderByUserId, updateOrderState } from '../../../appWrite/order/order.js';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { FaAngleLeft } from "react-icons/fa";
import './order.css';
import { Oval,RotatingLines,RotatingSquare,RotatingTriangles,RevolvingDot} from 'react-loader-spinner';

import Modal from './modal.jsx';

function Order() {
    const navigate = useNavigate();
    const [filteredOrders, setFilteredOrders] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true); // Ensure loading state is set at the beginning.
            try {
                const userDataString = Cookies.get('BharatLinkerUserData');
                if (!userDataString) {
                    console.error('BharatLinkerUserData cookie is missing');
                    setLoading(false);
                    return;
                }

                const userData = JSON.parse(userDataString);
                const userId = userData.$id;

                if (userId) {
                    const orders = await getOrderByUserId(userId);
                    const sortedOrders = orders.sort((a, b) => new Date(b.$updatedAt) - new Date(a.$updatedAt));
                    setOrders(sortedOrders);

                    const filteredOrders = sortedOrders.filter((order) => {
                        if (filter === 'all') return true;
                        return order.state === filter;
                    });
                    setFilteredOrders(filteredOrders);
                } else {
                    console.error('User ID is missing in cookie data');
                }


            } catch (error) {
                console.error('Error fetching orders:', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();

    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            await updateOrderState(orderId, 'canceled');
            setOrders((prevOrders) =>
                prevOrders
                    .map((order) =>
                        order.$id === orderId
                            ? { ...order, state: 'canceled', $updatedAt: new Date().toISOString() }
                            : order
                    )
                    .sort((a, b) => new Date(b.$updatedAt) - new Date(a.$updatedAt))
            );
        } catch (error) {
            console.error(`Error canceling order ${orderId}:`, error.message);
        }
    };

useEffect(()=>{
console.log("ko");
},[filteredOrders])
    const filterProduct = (order) => {
        setLoading(true);
        const filteredOrder = orders.filter((order) => {
            if (filter === 'all') return true;
            return order.state === filter;
        });
        setFilteredOrders(filteredOrder);
        setLoading(false);
    };

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="order-container">
            <div className="order-title">
                <FaAngleLeft size={20} onClick={() => navigate('/user')} /> My Orders
            </div>

            <div className="order-filters">
                {['all', 'pending', 'confirmed', 'dispatched', 'canceled', 'completed'].map((state) => (
                    <button
                        key={state}
                        className={`filter-button ${filter === state ? 'selected' : ''}`}
                        onClick={() =>{ filterProduct(state); setFilter(state)}}
                    >
                        {state.charAt(0).toUpperCase() + state.slice(1)}
                    </button>
                ))}
            </div>

            {loading? (
                        <div className='order-loading-container' >
                          <RotatingLines height={80}
                        width={80}
                        color=" rgb(85, 108, 254) "
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={loading}
                        ariaLabel="oval-loading"
                        secondaryColor=" rgb(85, 108, 254) "
                        strokeWidth={2}
                        strokeWidthSecondary={2}/>
                        </div>
            ) : (
                <ul className="order-list">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div key={order.$id} className="order-item">
                                <img
                                    onClick={() => { navigate(`/product/${order.productId}`); }}
                                    className="my-cart-item-img"
                                    src={order.image}
                                    alt={order.title}
                                />
                                <div className="order-item-second">
                                    <div className="price-container">
                                        <p className="item-name">{order.title}</p>
                                        <p className="item-price-strikethrough">₹{order.price}</p>
                                        <p className="item-price">₹{order.discountedPrice}</p>
                                    </div>
                                    <div className='order-states-container'>
                                        <div
                                            className='order-states-container-states'
                                            style={{ width: "90px", height: "22px" }}
                                        >
                                            {order.state}
                                        </div>
                                        {['pending', 'confirmed'].includes(order.state) && (
                                            <div
                                                className="my-cart-count-container"
                                                style={{ width: "90px", height: "22px" }}
                                                onClick={() => { handleSelectOrder(order); }}
                                            >
                                                Cancel Order
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No orders found</p>
                    )}
                </ul>
            )}

            {selectedOrder && (
                <Modal handleCancelOrder={handleCancelOrder} order={selectedOrder} onClose={handleCloseModal} />
            )}
        </div>
    );
}

export default Order;
