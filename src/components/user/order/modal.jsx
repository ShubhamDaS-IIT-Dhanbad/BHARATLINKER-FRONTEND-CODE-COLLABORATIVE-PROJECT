import React from 'react';
import './modal.css'; // Add custom styles for the modal

function Modal({ order, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Order Summary</h2>
                <p><strong>Order ID:</strong> {order.$id}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Price:</strong> ${order.price}</p>
                <p><strong>Discounted Price:</strong> ${order.discountedPrice}</p>
                <p><strong>State:</strong> {order.state}</p>
                <p><strong>Last Updated:</strong> {new Date(order.$updatedAt).toLocaleString()}</p>
                <p><strong>Coordinates:</strong> Lat {order.lat}, Long {order.long}</p>
                {(order.state === 'pending' || order.state === 'confirmed') && (
                    <button className="cancel-button" onClick={() => onClose()}>Cancel Order</button>
                )}
            </div>
        </div>
    );
}

export default Modal;
