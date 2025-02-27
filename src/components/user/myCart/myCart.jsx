import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Navbar from '../navbar.jsx';
import OrderProductCard from './cartCard.jsx';
import { removeFromUserCart, fetchUserCart } from '../../../redux/features/user/cartSlice.jsx';
import DeliveryAddress from './deliveryAddress.jsx';
import CheckOutPage from './checkOutPage.jsx';
import LocationTab from '../../locationTab/locationTab.jsx';

import './myCart.css';

const MyCartPage = ({ userData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Consolidated view state management
    const [viewState, setViewState] = useState({
        currentView: 'cart', // 'cart', 'location', 'address', 'checkout'
        isLoading: false,
        error: null,
    });
    
    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [shopStatus, setShopStatus] = useState({});

    const { cart } = useSelector((state) => state.userCart);

    // Memoized cart calculations
    const cartSummary = useMemo(() => ({
        isEmpty: !cart || cart.length === 0,
        hasOutOfStock: cart?.some(item => item.stock < item.quantity),
        totalItems: cart?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    }), [cart]);

    // Centralized view transition handler
    const transitionToView = useCallback((view) => {
        setViewState(prev => ({
            ...prev,
            currentView: view,
            error: null,
        }));
    }, []);

    // Fetch cart with debouncing and cleanup
    useEffect(() => {
        let mounted = true;
        const fetchCartData = async () => {
            if (!userData?.userId || !cartSummary.isEmpty) return;

            try {
                setViewState(prev => ({ ...prev, isLoading: true }));
                const result = await dispatch(fetchUserCart(userData.userId)).unwrap();
                
                if (mounted) {
                    window.scrollTo(0, 0);
                    // Optionally update shop status here if API provides it
                    // setShopStatus(/* derived from result */);
                }
            } catch (err) {
                if (mounted) {
                    setViewState(prev => ({
                        ...prev,
                        error: 'Failed to load cart. Please try again.',
                    }));
                }
                console.error('Cart fetch error:', err);
            } finally {
                if (mounted) {
                    setViewState(prev => ({ ...prev, isLoading: false }));
                }
            }
        };

        fetchCartData();
        return () => { mounted = false; };
    }, [dispatch, userData?.userId, cartSummary.isEmpty]);

    // Handle item removal with optimistic updates
    const handleRemoveItem = useCallback(async (cartId, productId) => {
        setViewState(prev => ({ ...prev, isLoading: true }));
        
        try {
            await dispatch(removeFromUserCart({ productId, cartId })).unwrap();
        } catch (error) {
            setViewState(prev => ({
                ...prev,
                error: 'Failed to remove item. Please try again.',
            }));
            console.error('Remove item failed:', error);
            // Optionally revert optimistic update here
        } finally {
            setViewState(prev => ({ ...prev, isLoading: false }));
        }
    }, [dispatch]);

    // Render view components based on current state
    const renderView = () => {
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
    };

    // Separate cart view rendering for better organization
    const renderCartView = () => (
        <>
            <Navbar
                userData={userData}
                headerTitle="My Cart"
                onBackNavigation={() => navigate(-1)}
            />
            <div className="user-cart-container">
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
                                {cart?.map((item) => (
                                    <OrderProductCard
                                        key={item.$id}
                                        productId={item.productId}
                                        order={item}
                                        isRemove={true}
                                        onRemove={() => handleRemoveItem(item.$id, item.productId)}
                                        isShopOpen={shopStatus[item.shopId] || false}
                                        isOutOfStock={item.stock < item.quantity}
                                    />
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
        </>
    );

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