import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderByUserId, updateOrderState } from '../../../appWrite/order/order.js';
import Cookies from 'js-cookie';

import { useSelector } from 'react-redux';
import { FaAngleLeft } from "react-icons/fa";

import './order.css';

import Modal from './modal.jsx'; 

function Order() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null); 

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
                    const sortedOrders = orders.sort((a, b) => new Date(b.$updatedAt) - new Date(a.$updatedAt));

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
        } catch (error) {
            console.error(`Error canceling order ${orderId}:`, error.message);
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === 'all') return true;
        return order.state === filter;
    });

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
                            <p className="order-summary" onClick={() => handleSelectOrder(order)}>
                                <strong>Order ID:</strong> {order.$id}  {order.title} | <strong>Price:</strong> ${order.price}
                                <br />
                                {order.product && <span><strong>Product:</strong> {order.product.title}</span>}
                            </p>
                        </li>
                    ))
                ) : (
                    <p>No orders found</p>
                )}
            </ul>

            {/* Modal for order details */}
            {selectedOrder && (
                <Modal order={selectedOrder} onClose={handleCloseModal} />
            )}
        </div>
    );
}

export default Order;
