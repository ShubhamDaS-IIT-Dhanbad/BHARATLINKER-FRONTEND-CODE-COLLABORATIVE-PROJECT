import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Navbar from '../navbar.jsx';
import OrderProductCard from './cartCard.jsx';
import { removeFromUserCart } from '../../../redux/features/user/cartSlice.jsx';
import DeliveryAddress from './deliveryAddress.jsx';
import CheckOutPage from './checkOutPage.jsx';
import LocationTab from '../../locationTab/locationTab.jsx';
import c1 from '../asset/c1.png';
import './myCart.css';

const MyCartPage = ({ userData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart } = useSelector((state) => state.userCart);

    const [viewState, setViewState] = useState({
        currentView: 'cart',
        isLoading: false,
        error: null,
    });

    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [pendingRemoval, setPendingRemoval] = useState(null);

    const cartSummary = useMemo(() => ({
        isEmpty: !cart || cart.length === 0,
        hasOutOfStock: cart?.some(item => item.stock < item.quantity),
        totalItems: cart?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    }), [cart]);

    const transitionToView = useCallback((view) => {
        setViewState(prev => ({ ...prev, currentView: view, error: null }));
        // Push new state to history for browser navigation
        window.history.pushState({ view }, '', `#${view}`);
    }, []);

    // Handle browser back/forward navigation
    useEffect(() => {
        const handlePopState = (event) => {
            const newView = event.state?.view || 'cart';
            setViewState(prev => ({
                ...prev,
                currentView: newView
            }));
        };

        window.addEventListener('popstate', handlePopState);

        // Initial state push
        window.history.replaceState({ view: 'cart' }, '', '#cart');

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        if (cartSummary.isEmpty && !viewState.isLoading && viewState.currentView === 'cart') {
            navigate('/search');
        }
    }, [cartSummary.isEmpty, viewState.isLoading, viewState.currentView, navigate]);

    const confirmRemoveItem = useCallback((cartId, productId) => {
        setPendingRemoval({ cartId, productId });
        setShowConfirmPopup(true);
    }, []);

    const handleRemoveItem = useCallback(async () => {
        if (!pendingRemoval) return;

        setViewState(prev => ({ ...prev, isLoading: true }));
        setShowConfirmPopup(false);

        try {
            await dispatch(removeFromUserCart({
                productId: pendingRemoval.productId,
                cartId: pendingRemoval.cartId
            })).unwrap();
        } catch (error) {
            setViewState(prev => ({
                ...prev,
                error: 'Failed to remove item. Please try again.',
            }));
            console.error('Remove item failed:', error);
        } finally {
            setViewState(prev => ({ ...prev, isLoading: false }));
            setPendingRemoval(null);
        }
    }, [dispatch, pendingRemoval]);

    const renderConfirmPopup = useCallback(() => (
        <div className="user-dashboard-popup-overlay">
            <div className="user-dashboard-popup-card">
                <div className="user-dashboard-popup-pointer"></div>
                <h2 className="user-dashboard-popup-title">Confirm Removal</h2>
                <p className="user-dashboard-popup-text">
                    Are you sure you want to remove this item from your cart?
                </p>
                <div className="user-dashboard-popup-buttons">
                    {[
                        {
                            label: 'Cancel',
                            onClick: () => {
                                setShowConfirmPopup(false);
                                setPendingRemoval(null);
                            },
                            primary: false,
                        },
                        {
                            label: 'Remove',
                            onClick: handleRemoveItem,
                            primary: true,
                        },
                    ].map((btn, index) => (
                        <button
                            key={index}
                            className={
                                btn.primary
                                    ? "user-dashboard-popup-button-primary"
                                    : "user-dashboard-popup-button-secondary"
                            }
                            onClick={btn.onClick}
                            disabled={btn.disabled || viewState.isLoading}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    ), [handleRemoveItem, viewState.isLoading]);

    const handleBackNavigation = useCallback(() => {
        navigate(-1);
    }, []);

    const renderCartView = useCallback(() => (
        <>
            <Navbar
                userData={userData}
                headerTitle="My Cart"
                onBackNavigation={handleBackNavigation}
            />
            <div className="user-cart-container">
                <div className="user-cart-container-img-div"><img src={c1} /></div>
                <main className="user-cart-content">
                    {viewState.isLoading && (
                        <div className="loading-spinner">Loading...</div>
                    )}
                    {viewState.error && (
                        <div className="error-message">{viewState.error}</div>
                    )}
                    {cartSummary.isEmpty && !viewState.isLoading ? (
                        <div className="user-cart-empty">
                            <div className="user-cart-empty-illustration" />
                            <h2>Your Cart is Empty</h2>
                            <p>Discover our products and find something you'll love</p>
                            <button
                                onClick={() => navigate('/shop')}
                                className="user-cart-cta-button primary"
                                disabled={viewState.isLoading}
                            >
                                Explore Products
                            </button>
                        </div>
                    ) : (
                        <>
                            <section className="user-cart-items-section">
                                {/* Group cart items by shopId */}
                                {Object.entries(
                                    cart.reduce((acc, item) => {
                                        const shopId = item.shopId || 'unknown'; // Fallback if shopId is missing
                                        if (!acc[shopId]) {
                                            acc[shopId] = [];
                                        }
                                        acc[shopId].push(item);
                                        return acc;
                                    }, {})
                                ).map(([shopId, items]) => (
                                    <div key={shopId} className="user-cart-items-section-filedset">
                                        {/* <legend>{items[0]?.shopName}</legend> */}
                                        {items.map((item) => (
                                            <OrderProductCard
                                                key={item.$id}
                                                productId={item.productId}
                                                order={item}
                                                isRemove={true}
                                                onRemove={() => confirmRemoveItem(item.$id, item.productId)}
                                                isOutOfStock={item.stock < item.quantity}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </section>
                            <div className="cart-check-out-container">
                                <button
                                    className="cart-check-out-container-button"
                                    onClick={() => transitionToView('location')}
                                    disabled={viewState.isLoading || cartSummary.isEmpty || cartSummary.hasOutOfStock}
                                    aria-label="Proceed to checkout"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    )}
                </main>
            </div>
            {showConfirmPopup && renderConfirmPopup()}
        </>
    ), [viewState, cartSummary, userData, showConfirmPopup, confirmRemoveItem, transitionToView, navigate, handleBackNavigation]);

    const renderView = useCallback(() => {
        switch (viewState.currentView) {
            case 'location':
                return (
                    <LocationTab
                        header="Delivery Address"
                        setDeliveryAddress={setDeliveryAddress}
                        setShowAddressDetail={() => transitionToView('address')}
                        setLocationTab={() => transitionToView('cart')}
                    />
                );
            case 'address':
                return (
                    <DeliveryAddress
                        deliveryAddress={deliveryAddress}
                        setDeliveryAddress={setDeliveryAddress}
                        setShowCheckOutPage={() => transitionToView('checkout')}
                        setShowAddressDetail={() => transitionToView('cart')}
                    />
                );
            case 'checkout':
                return (
                    <CheckOutPage
                        userData={userData}
                        items={cart}
                        deliveryAddress={deliveryAddress}
                        setDeliveryAddress={setDeliveryAddress}
                        setShowCheckOutPage={() => transitionToView('cart')}
                        setShowAddressDetail={() => transitionToView('address')}
                    />
                );
            case 'cart':
            default:
                return renderCartView();
        }
    }, [viewState.currentView, deliveryAddress, cart, userData, transitionToView, renderCartView]);

    return renderView();
};

MyCartPage.propTypes = {
    userData: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        name: PropTypes.string
    }).isRequired
};

export default React.memo(MyCartPage);