import React, { useEffect, useState } from 'react';
import { getOrderByUserId, updateOrderState } from '../../../appWrite/order/order.js';
import Cookies from 'js-cookie';
import './order.css';

function Order() {
    const [orders, setOrders] = useState([]);

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

    return (
        <div className="order-container">
            <h1 className="order-title">Order List</h1>
            <ul className="order-list">
                {orders.length > 0 ? (
                    orders.map((order) => (
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
                            {order.state === 'pending' && (
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
