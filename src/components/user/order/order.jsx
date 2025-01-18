import React, { useEffect, useState } from 'react';
import { getOrderByUserId } from '../../../appWrite/order/order.js';
import Cookies from 'js-cookie';
import './Order.css'; // Import the CSS file

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
                    setOrders(orders);
                } else {
                    console.error('User ID is missing in cookie data');
                }
            } catch (error) {
                console.error('Error fetching orders:', error.message);
            }
        };

        fetchOrders();
    }, []);

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
                                <strong>Created At:</strong> {new Date(order.$createdAt).toLocaleString()}
                            </p>
                            <p className="coordinates">
                                <strong>Coordinates:</strong> Lat {order.lat}, Long {order.long}
                            </p>
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
