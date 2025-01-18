import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderByUserId, updateOrderState } from '../../../appWrite/order/order.js';
import Cookies from 'js-cookie';
import { FaAngleLeft } from "react-icons/fa";
import './order.css';

function Order() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all'); // State for the selected filter

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userDataString = Cookies.get('BharatLinkerUserData');
                if (!userDataString) {
                    console.error('BharatLinkerUserData cookie is missing');
                    return;
                }

                const userData = JSON.parse(userDataString);
                const userId = userData.$id;

                if (userId) {
                    const orders = await getOrderByUserId(userId);

                    // Sort orders by updatedAt (descending)
                    const sortedOrders = orders.sort((a, b) => 
                        new Date(b.$updatedAt) - new Date(a.$updatedAt)
                    );

                    setOrders(sortedOrders);
                } else {
                    console.error('User ID is missing in cookie data');
                }
            } catch (error) {
                console.error('Error fetching orders:', error.message);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            await updateOrderState(orderId, 'canceled');
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.$id === orderId ? { ...order, state: 'canceled', $updatedAt: new Date().toISOString() } : order
                ).sort((a, b) => new Date(b.$updatedAt) - new Date(a.$updatedAt))
            );
            console.log(`Order ${orderId} has been canceled.`);
        } catch (error) {
            console.error(`Error canceling order ${orderId}:`, error.message);
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === 'all') return true;
        return order.state === filter;
    });

    return (
        <div className="order-container">
            <div className="order-title">
                 <FaAngleLeft size={20} onClick={() => navigate('/user')} /> My Orders
            </div>

            {/* Filter Buttons */}
            <div className="order-filters">
                <button 
                    className={`filter-button ${filter === 'all' ? 'selected' : ''}`} 
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button 
                    className={`filter-button ${filter === 'pending' ? 'selected' : ''}`} 
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button 
                    className={`filter-button ${filter === 'confirmed' ? 'selected' : ''}`} 
                    onClick={() => setFilter('confirmed')}
                >
                    Confirmed
                </button>
                <button 
                    className={`filter-button ${filter === 'dispatched' ? 'selected' : ''}`} 
                    onClick={() => setFilter('dispatched')}
                >
                    Dispatched
                </button>
                <button 
                    className={`filter-button ${filter === 'canceled' ? 'selected' : ''}`} 
                    onClick={() => setFilter('canceled')}
                >
                    Canceled
                </button>
                <button 
                    className={`filter-button ${filter === 'completed' ? 'selected' : ''}`} 
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            <ul className="order-list">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <li key={order.$id} className="order-item">
                            <p className="order-detail">
                                <strong>Order ID:</strong> {order.$id}
                            </p>
                            <p className="order-detail">
                                <strong>Address:</strong> {order.address}
                            </p>
                            <p className="order-detail">
                                <strong>Price:</strong> <span className="price">${order.price}</span>
                            </p>
                            <p className="order-detail">
                                <strong>Discounted Price:</strong> <span className="discounted-price">${order.discountedPrice}</span>
                            </p>
                            <p className="order-detail">
                                <strong>State:</strong> {order.state}
                            </p>
                            <p className="order-detail">
                                <strong>Last Updated:</strong> {new Date(order.$updatedAt).toLocaleString()}
                            </p>
                            <p className="coordinates">
                                <strong>Coordinates:</strong> Lat {order.lat}, Long {order.long}
                            </p>
                            {(order.state === 'pending' || order.state === 'confirmed') && (
                                <button
                                    className="cancel-button"
                                    onClick={() => handleCancelOrder(order.$id)}
                                >
                                    Cancel Order
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No orders found</p>
                )}
            </ul>
        </div>
    );
}

export default Order;
