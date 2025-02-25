import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import "./orderProductCard.css"; // Added explicit import

import { FaExclamationTriangle, FaLuggageCart, FaSadCry } from "react-icons/fa";
import { RiChatSmileFill } from "react-icons/ri";
import { GiPartyPopper } from "react-icons/gi";
import { Oval } from "react-loader-spinner";
import {
    updateOrderStateToConfirmed,
    updateOrderStateToDispatched,
    updateOrderStateToCanceled,
    updateOrderStateToDelivered
} from "../../../appWrite/order/order";
import { updateOrder, deleteOrder } from "../../../redux/features/retailer/orderSlice";

const STATUS_ICONS = {
    pending: <FaExclamationTriangle className="status-icon pending" />,
    confirmed: <RiChatSmileFill className="status-icon accepted" />,
    dispatched: <FaLuggageCart className="status-icon dispatched" />,
    canceled: <FaSadCry className="status-icon canceled" />,
    delivered: <GiPartyPopper className="status-icon delivered" />
};

const STATE_ACTIONS = {
    pending: [
        { action: 'confirm', label: 'CONFIRM', input: 'datetime', key: 'pending-confirm' },
        { action: 'cancel', label: 'CANCEL', input: null, key: 'pending-cancel' }
    ],
    confirmed: [
        { action: 'dispatch', label: 'DISPATCH', input: 'phone', key: 'confirmed-dispatch' },
        { action: 'cancel', label: 'CANCEL', input: null, key: 'confirmed-cancel' }
    ],
    dispatched: [
        { action: 'deliver', label: 'DELIVERED?', input: null, key: 'dispatched-deliver' },
        { action: 'cancel', label: 'CANCEL', input: null, key: 'dispatched-cancel' }
    ]
};

const UPDATE_FUNCTIONS = {
    confirm: updateOrderStateToConfirmed,
    dispatch: updateOrderStateToDispatched,
    cancel: updateOrderStateToCanceled,
    deliver: updateOrderStateToDelivered
};

const ActionButton = React.memo(({ action, label, isLoading, onClick }) => (
    isLoading ? (
        <Oval height={20} width={20} color="green" secondaryColor="white" />
    ) : (
        <div className={`order-product-card-detail-3-state-${action}`} onClick={onClick}>
            {label}
        </div>
    )
));

const OrderDetails = ({ price, quantity }) => (
    <div className="order-product-card-detail-2">
        {['price', 'quantity', 'subtotal'].map((field, idx) => (
            <div key={`${field}-${idx}`} className="order-product-card-detail-2-1">
                <p className="order-product-card-detail-2-1-tag">{field.toUpperCase()}</p>
                <p className="opcdp">
                    {field === 'price' ? `₹${price}` : 
                     field === 'quantity' ? quantity : 
                     `₹${price * quantity}`}
                </p>
            </div>
        ))}
    </div>
);

const AddressInfo = ({ order }) => {
    const addressFields = [
        ['ORDER ID', order.$id, 'order-id'],
        ['NAME', order.name, 'customer-name'],
        ['PHONE', order.phoneNumber, 'customer-phone', true],
        ['ADDRESS', order.address, 'delivery-address'],
        ...(order.expectedDeliveryDate ? [
            ['EXP DELIVERY DATE', new Date(order.expectedDeliveryDate).toLocaleDateString(), 'expected-date'],
            ['EXP DELIVERY TIME', new Date(order.expectedDeliveryDate).toLocaleTimeString(), 'expected-time']
        ] : []),
        ...(order.deliveryBoyPhn ? [['DELIVERY BOY', order.deliveryBoyPhn, 'delivery-agent', true]] : [])
    ];

    return (
        <div className="order-product-card-address">
            {addressFields.map(([label, value, key, isPhone], index) => (
                <div key={`${key}-${index}`} className="order-product-card-address-div">
                    <p className="order-product-card-address-p1">{label}</p>
                    <p
                        className={`order-product-card-address-p2 ${isPhone ? 'clickable' : ''}`}
                        onClick={isPhone ? () => window.location.href = `tel:${value}` : undefined}
                    >
                        {value}
                    </p>
                </div>
            ))}
        </div>
    );
};

const InputModal = ({ show, type, value, onChange, onConfirm, onCancel }) => {
    if (!show) return null;
    return (
        <div className="retailer-datetime-modal-overlay">
            <div className="retailer-datetime-modal modern-modal">
                <div className="modal-header">
                    <h3 className="modal-title">
                        {type === 'datetime' 
                            ? 'Expected Delivery Date & Time' 
                            : 'Delivery Agent Phone'}
                    </h3>
                </div>
                <div className="modal-body">
                    <div className="shop-order-input-container">
                        <input
                            type={type === 'datetime' ? 'datetime-local' : 'tel'}
                            value={value}
                            onChange={e => {
                                if (type === 'phone') {
                                    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    onChange(cleaned);
                                } else {
                                    onChange(e.target.value);
                                }
                            }}
                            min={type === 'datetime' ? new Date().toISOString().slice(0, 16) : undefined}
                            placeholder={type === 'phone' ? 'Enter 10-digit phone number' : undefined}
                            className="modern-input"
                        />
                    </div>
                    <div className="shop-address-popup-buttons">
                        <button
                            className="shop-address-popup-button-primary"
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                        <button
                            className="shop-address-popup-button-secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfirmationPopup = ({ show, type, message, onConfirm, onCancel }) => (
    show && (
        <div className="shop-address-popup-overlay">
            <div className="shop-address-popup-card">
                <h2 className="shop-address-popup-title">
                    {type === 'cancel' ? "Order Cancellation" : "Delivery Confirmation"}
                </h2>
                <p className="shop-address-popup-text" style={{ fontSize: "13px" }}>{message}</p>
                <div className="shop-address-popup-buttons">
                    <button className="shop-address-popup-button-primary" onClick={onConfirm}>OK</button>
                    <button className="shop-address-popup-button-secondary" onClick={onCancel}>Close</button>
                </div>
            </div>
        </div>
    )
);

const OrderProductCard = ({ order }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const [state, setState] = useState({
        showInput: null,
        type: '',
        inputValue: '',
        loading: new Set(),
        error: '',
        showPopup: false,
        popupMessage: '',
        pendingAction: null
    });

    
const handleStateUpdate = useCallback(async (action, payload = null) => {
    const nextState = {
        confirm: 'confirmed',
        dispatch: 'dispatched',
        deliver: 'delivered',
        cancel: 'canceled'
    }[action];

    try {
        setState(prev => ({
            ...prev,
            loading: new Set([...prev.loading, action]),
            error: ''
        }));

        const processedPayload = action === 'dispatch' 
            ? String(payload).padStart(10, '0')
            : action === 'confirm'
            ? new Date(payload).toISOString()
            : payload;

        // Modified data handling here
        const response = await UPDATE_FUNCTIONS[action](
            order.$id,
            nextState,
            processedPayload
        );

        if (!response) throw new Error('No response from server');

        if (['confirm', 'cancel', 'deliver'].includes(action)) {
            const prevState = action === 'deliver' ? 'dispatched' : order.state;
            dispatch(deleteOrder({ 
                orderId: order.$id, 
                orderStateArrayName: prevState 
            }));
        }

        // Dispatch properly structured data
        console.log({
            orderId: order.$id,
            updatedOrderData: response.data || response,
            orderStateArrayName: nextState,
            ko:"lplp"
        })
        dispatch(updateOrder({
            orderId: order.$id,
            updatedOrderData: response.data || response,
            orderStateArrayName: nextState
        }));

    } catch (error) {
        console.error('Order update error:', error);
        setState(prev => ({
            ...prev,
            error: error.message || `Failed to ${action} order. Please try again.`
        }));
    } finally {
        setState(prev => ({
            ...prev,
            loading: new Set([...prev.loading].filter(a => a !== action))
        }));
    }
}, [dispatch, order.$id, order.state]);

    const handleAction = useCallback((action, inputType) => {
        if (inputType) {
            setState(prev => ({ 
                ...prev, 
                showInput: inputType, 
                inputValue: '',
                error: '' 
            }));
            return;
        }

        const needsConfirmation = ['cancel', 'deliver'].includes(action);
        if (needsConfirmation) {
            setState(prev => ({
                ...prev,
                showPopup: true,
                type: action,
                popupMessage: `Are you sure you want to ${action} this order?`,
                pendingAction: action
            }));
            return;
        }

        handleStateUpdate(action);
    }, [handleStateUpdate]);

    const handleInputConfirm = useCallback(() => {
        const { showInput, inputValue } = state;
        const action = showInput === 'datetime' ? 'confirm' : 'dispatch';

        if (!inputValue) {
            setState(prev => ({
                ...prev,
                error: showInput === 'datetime' 
                    ? 'Please select date and time' 
                    : 'Please enter phone number'
            }));
            return;
        }

        if (showInput === 'phone' && !/^\d{10}$/.test(inputValue)) {
            setState(prev => ({
                ...prev,
                error: 'Please enter a valid 10-digit phone number'
            }));
            return;
        }

        if (showInput === 'datetime' && new Date(inputValue) < new Date()) {
            setState(prev => ({
                ...prev,
                error: 'Delivery date cannot be in the past'
            }));
            return;
        }

        handleStateUpdate(action, inputValue);
        setState(prev => ({ ...prev, showInput: null }));
    }, [state, handleStateUpdate]);

    const renderActionButtons = useCallback(() => (
        (STATE_ACTIONS[order.state] || []).map(({ action, label, input, key }) => (
            <ActionButton
                key={key}
                action={action}
                label={label}
                isLoading={state.loading.has(action)}
                onClick={() => handleAction(action, input)}
            />
        ))
    ), [order.state, state.loading, handleAction]);

    return (
        <div className="order-product-card-parent">
            <div className="order-product-card">
                <div className="order-product-card-img">
                    <img 
                        className="order-product-card-img" 
                        src={order.image} 
                        alt={order.title} 
                        loading="lazy"
                    />
                </div>
                <div className="order-product-card-detail">
                    <div className="order-product-card-detail-1">{order.title}</div>
                    <OrderDetails price={order.discountedPrice} quantity={order.quantity} />
                    <div className="order-product-card-detail-3-state">
                        {renderActionButtons()}
                        {pathname === "/secure/shop/orders" && (
                            <div
                                className="retailer-order-product-card-detail-2"
                                onClick={() => navigate(`/secure/shop/order/${order.$id}`)}
                                role="button"
                                tabIndex={0}
                            >
                                DETAIL
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddressInfo order={order} />
            <InputModal
                show={!!state.showInput}
                type={state.showInput}
                value={state.inputValue}
                onChange={(value) => setState(prev => ({ ...prev, inputValue: value }))} // Fixed syntax here
                onConfirm={handleInputConfirm}
                onCancel={() => setState(prev => ({ ...prev, showInput: null }))}
            />
            {state.error && <div className="error-message" role="alert">{state.error}</div>}
            <ConfirmationPopup
                show={state.showPopup}
                type={state.type}
                message={state.popupMessage}
                onConfirm={() => {
                    handleStateUpdate(state.pendingAction);
                    setState(prev => ({ ...prev, showPopup: false }));
                }}
                onCancel={() => setState(prev => ({ ...prev, showPopup: false }))}
            />
        </div>
    );
};

OrderProductCard.propTypes = {
    order: PropTypes.shape({
        $id: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        discountedPrice: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        state: PropTypes.oneOf([
            'pending',
            'confirmed',
            'dispatched',
            'canceled',
            'delivered'
        ]).isRequired,
        name: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        expectedDeliveryDate: PropTypes.string,
        deliveryBoyPhn: PropTypes.number
    }).isRequired
};

export default React.memo(OrderProductCard);