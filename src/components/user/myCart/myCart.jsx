import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Navbar from '../navbar.jsx';
import OrderProductCard from './cartCard.jsx';
import { removeFromUserCart } from '../../../redux/features/user/cartSlice.jsx';
import DeliveryAddress from './deliveryAddress.jsx';
import {CheckOutPage} from './checkOutPage.jsx';
import LocationTab from '../../locationTab/locationTab.jsx';
import './myCart.css';


const c1="https://res.cloudinary.com/demc9mecm/image/upload/v1741103724/c1_1_o6ehkw.webp";
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
    const [placingOrder, setPlacingOrder] = useState(false);

    const cartSummary = useMemo(() => {
        const items = cart || [];
        const totalPrice = items.reduce((sum, item) => {
            const price = item.discountedPrice || item.price || 0;
            return sum + (price * item.quantity);
        }, 0);
        const totalSaved = items.reduce((sum, item) => {
            const price = item.price || 0;
            const discountedPrice = item.discountedPrice || price;
            return sum + ((price - discountedPrice) * item.quantity);
        }, 0);

        return {
            isEmpty: !items.length,
            hasOutOfStock: items.some(item => item.stock < item.quantity),
            totalItems: items.reduce((sum, item) => sum + item.quantity, 0) || 0,
            totalSavings: totalSaved, // Kept as totalSavings to match original usage
            totalPrice,
            totalSaved,
        };
    }, [cart]);

    const transitionToView = useCallback((view) => {
        setViewState(prev => ({ ...prev, currentView: view, error: null }));
        window.history.pushState({ view }, '', `#${view}`);
    }, []);

    useEffect(() => {
        const handlePopState = (event) => {
            const newView = event.state?.view || 'cart';
            setViewState(prev => ({
                ...prev,
                currentView: newView,
            }));
        };

        window.addEventListener('popstate', handlePopState);
        window.history.replaceState({ view: 'cart' }, '', '#cart');
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        if (cartSummary.isEmpty && !viewState.isLoading && viewState.currentView === 'cart') {
            navigate('/search');
        }
    }, []);

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
                cartId: pendingRemoval.cartId,
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
        switch (viewState.currentView) {
            case 'location':
                transitionToView('cart');
                break;
            case 'address':
                transitionToView('location');
                break;
            case 'checkout':
                transitionToView('address');
                break;
            case 'cart':
            default:
                navigate('/search'); // Exit cart page to previous route (e.g., search page)
                break;
        }
    }, [viewState.currentView, transitionToView, navigate]);

    const renderCartView = useCallback(() => (
        <>
            <Navbar
                userData={userData}
                headerTitle="My Cart"
                onBackNavigation={handleBackNavigation}
            />
            <div className="user-cart-container">
                <main className="user-cart-content">
                    {viewState.isLoading && (
                        <div className="loading-spinner">Loading...</div>
                    )}
                    {viewState.error && (
                        <div className="error-message">{viewState.error}</div>
                    )}
                    {!cartSummary.isEmpty && viewState.isLoading ? (
                        <>
                        </>
                    ) : (
                        <>
                            <div className="user-cart-container-img-div"><img src={c1} /></div>
                            <section className="user-cart-items-section">
                                {Object.entries(
                                    cart.reduce((acc, item) => {
                                        const shopId = item.shopId || 'unknown';
                                        if (!acc[shopId]) {
                                            acc[shopId] = [];
                                        }
                                        acc[shopId].push(item);
                                        return acc;
                                    }, {})
                                ).map(([shopId, items]) => (
                                    <div key={shopId} className="user-cart-items-section-filedset">{console.log(items)}
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
                            {!cartSummary.isEmpty && (
                                <div className="order-summary-card">
                                    <h3>ORDER SUMMARY</h3>
                                    <div className="price-details">
                                        <div className="price-row">
                                            <span>Total MRP</span>
                                            <span>Rs {(cartSummary.totalPrice + cartSummary.totalSaved).toFixed(2)}</span>
                                        </div>
                                        <div className="price-row">
                                            <span>Discount on MRP</span>
                                            <span className="discount">-Rs{cartSummary.totalSaved.toFixed(2)}</span>
                                        </div>
                                        <div className="price-row">
                                            <span>Shipping Fee</span>
                                            <span className="free-shipping">FREE</span>
                                        </div>
                                        <div className="total-price-row">
                                            <span>TOTAL AMOUNT</span>
                                            <span>Rs {cartSummary.totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
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
    ), [viewState, cartSummary, userData, showConfirmPopup, confirmRemoveItem, transitionToView, handleBackNavigation, placingOrder]);

    const renderView = useCallback(() => {
        switch (viewState.currentView) {
            case 'location':
                return (
                    <LocationTab
                        cartSummary={cartSummary}
                        userData={userData}
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
        name: PropTypes.string,
    }).isRequired,
};

export default React.memo(MyCartPage);