import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { SlLocationPin } from 'react-icons/sl';
import { TiInfoOutline } from "react-icons/ti";
import { IoSearch, IoClose } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import PropTypes from 'prop-types';

// Project components and utilities
import Navbar from "../a.navbarComponent/navbar.jsx";
import OrderProductCard from './cartCard.jsx';
import { updateCartStateAsync, fetchUserCart } from '../../../redux/features/user/cartSlice.jsx';
import useLocationFromCookie from '../../../hooks/useLocationFromCookie.jsx';
import { placeOrderProvider } from '../../../appWrite/order/order.js';
import handleSendEmail from '../../../appWrite/services/emailServiceToShop.js';
import conf from '../../../conf/conf.js';

// Styles
import '../userProfile/userProfile.css';
import './myCart.css';
import '../../searchPage/sortby.css';

const MyCartPage = ({ userData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { fetchLocationSuggestions } = useLocationFromCookie();
    const { cart, totalQuantity, totalPrice } = useSelector((state) => state.userCart);

    // State management
    const [deliveryAddress, setDeliveryAddress] = useState({
        text: '',
        coordinates: { lat: null, lng: null }
    });
    const [searchState, setSearchState] = useState({
        query: '',
        suggestions: [],
        isLoading: false
    });
    const [uiState, setUiState] = useState({
        isFetchingLocation: false,
        showAddressInfo: false,
        isPlacingOrder: false,
        showConfirmation: false
    });

    // Cart initialization
    useEffect(() => {
        if (cart?.length === 0 && userData?.phoneNumber) {
            dispatch(fetchUserCart(userData.phoneNumber));
        }
        window.scrollTo(0, 0);
    }, [dispatch, userData?.phoneNumber]);

    // Cart item removal handler
    const handleRemoveItem = useCallback(async (productId) => {
        try {
            const updatePayload = {
                productId,
                quantity: 0,
                phoneNumber: userData?.phoneNumber
            };
            await dispatch(updateCartStateAsync(updatePayload));
        } catch (error) {
            console.error("Cart update failed:", error);
        }
    }, [dispatch, userData?.phoneNumber]);

    // Location handling
    const handleGeolocation = useCallback(async () => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported');
            return;
        }

        setUiState(prev => ({ ...prev, isFetchingLocation: true }));

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            const response = await fetch(
                `${conf.opencageapiurl}?key=${conf.opencageapikey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`
            );
            const data = await response.json();

            setDeliveryAddress({
                text: data.results[0]?.formatted || 'Current Location',
                coordinates: { lat: latitude, lng: longitude }
            });
        } catch (error) {
            console.error('Location retrieval failed:', error);
        } finally {
            setUiState(prev => ({ ...prev, isFetchingLocation: false }));
        }
    }, []);

    // Address suggestions
    const fetchAddressSuggestions = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchState(prev => ({ ...prev, suggestions: [] }));
            return;
        }

        setSearchState(prev => ({ ...prev, isLoading: true }));

        try {
            const results = await fetchLocationSuggestions(query);
            setSearchState(prev => ({ ...prev, suggestions: results || [] }));
        } catch (error) {
            console.error('Address suggestion error:', error);
        } finally {
            setSearchState(prev => ({ ...prev, isLoading: false }));
        }
    }, [fetchLocationSuggestions]);

    // Order processing
    const processOrder = useCallback(async () => {
        if (!deliveryAddress.text || !deliveryAddress.coordinates.lat || !userData?.phoneNumber) {
            setUiState(prev => ({ ...prev, showAddressInfo: true }));
            return;
        }

        if (cart.length === 0) {
            alert("Please add items to your cart before ordering.");
            return;
        }

        setUiState(prev => ({ ...prev, isPlacingOrder: true }));

        try {
            await Promise.all(cart.map(async (item) => {
                const { productId, shopId, quantity, discountedPrice, price, title, image, shopEmail } = item;

                const order = await placeOrderProvider(
                    userData.$id,
                    shopId,
                    productId,
                    quantity,
                    price,
                    discountedPrice,
                    deliveryAddress.text,
                    deliveryAddress.coordinates.lat,
                    deliveryAddress.coordinates.lng,
                    image,
                    title,
                    userData.name,
                    userData.phoneNumber,
                    shopEmail
                );

                await handleSendEmail(
                    shopEmail,
                    1,
                    order.$id,
                    title,
                    deliveryAddress.text,
                    quantity,
                    price,
                    discountedPrice,
                    userData.phoneNumber,
                    image
                ).catch(console.error);

                dispatch(updateCartStateAsync({
                    productId,
                    quantity: 0,
                    phoneNumber: userData.phoneNumber
                }));
            }));

            navigate("/user/order");
        } catch (error) {
            console.error("Order processing failed:", error);
            alert("Order placement failed. Please try again.");
        } finally {
            setUiState(prev => ({ ...prev, isPlacingOrder: false, showConfirmation: false }));
        }
    }, [cart, deliveryAddress, userData, dispatch, navigate]);

    return (
        <div className="cart-container">
            <header className="cart-header">
                <Navbar
                    headerTitle="MY CART"
                    onBackNavigation={() => navigate(-1)}
                />
            </header>

            <main className="cart-content">
                {cart?.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-illustration" />
                        <h2>Your Cart is Empty</h2>
                        <p>Discover our products and find something you'll love</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="cta-button primary"
                        >
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <>
                        <section className="cart-items-section">
                            {cart.map(item => (
                                <OrderProductCard
                                    key={item.productId}
                                    productId={item.productId}
                                    order={item}
                                    onRemove={() => handleRemoveItem(item.productId)}
                                />
                            ))}
                        </section>

                        <section className="delivery-section">
                            <div className="address-search">
                                <div className="search-input-group">
                                    <IoSearch size={25} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Enter delivery address"
                                        value={searchState.query}
                                        onChange={(e) => setSearchState(prev => ({
                                            ...prev,
                                            query: e.target.value
                                        }))}
                                        onKeyDown={(e) => e.key === 'Enter' && fetchAddressSuggestions(searchState.query)}
                                    />
                                </div>

                                {searchState.isLoading  && (
                                    <div className="loading-indicator">
                                        <Oval width={20} height={20} color="#2d5a27" />
                                    </div>
                                )}

                                {searchState.suggestions.length > 0 && (
                                    <ul className="address-suggestions">
                                        {searchState.suggestions.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setDeliveryAddress({
                                                        text: suggestion.label,
                                                        coordinates: {
                                                            lat: suggestion.lat,
                                                            lng: suggestion.lon
                                                        }
                                                    });
                                                    setSearchState(prev => ({
                                                        ...prev,
                                                        query: suggestion.label,
                                                        suggestions: []
                                                    }));
                                                }}
                                            >
                                                <SlLocationPin />
                                                <span>{suggestion.label}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="current-location-group">
                                <button
                                    className="geo-location-button"
                                    onClick={handleGeolocation}
                                    disabled={uiState.isFetchingLocation}
                                >
                                    {uiState.isFetchingLocation ? (
                                        <Oval width={20} height={20} color="#fff" />
                                    ) : (
                                        <>
                                            <MdMyLocation />
                                            Use Current Location
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="address-confirmation">
                                <div className="address-display">
                                    <span>{deliveryAddress.text || 'No address selected'}</span>
                                    <TiInfoOutline
                                        onClick={() => setUiState(prev => ({
                                            ...prev,
                                            showAddressInfo: !prev.showAddressInfo
                                        }))}
                                    />
                                </div>

                                {uiState.showAddressInfo && (
                                    <div className="address-info-banner">
                                        <p>
                                            Accurate location information ensures timely delivery.
                                            Please verify your delivery address.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>

            {cart?.length > 0 && (
                <footer className="cart-footer">
                    <button
                        className="cta-button checkout-button"
                        onClick={() => setUiState(prev => ({
                            ...prev,
                            showConfirmation: true
                        }))}
                        disabled={uiState.isPlacingOrder}
                    >
                        {uiState.isPlacingOrder ? (
                            <Oval width={24} height={24} color="#fff" />
                        ) : (
                            `Proceed to Checkout (${totalQuantity} items)`
                        )}
                    </button>
                </footer>
            )}

            {uiState.showConfirmation && (
                <div className="confirmation-modal">
                    <div className="modal-content">
                        <button
                            className="close-button"
                            onClick={() => setUiState(prev => ({
                                ...prev,
                                showConfirmation: false
                            }))}
                        >
                            <IoClose />
                        </button>

                        <h3>Confirm Order</h3>
                        <p>Total Amount: ₹{totalPrice.toFixed(2)}</p>
                        <p>Delivery to: {deliveryAddress.text}</p>

                        <div className="confirmation-actions">
                            <button
                                className="cta-button secondary"
                                onClick={() => setUiState(prev => ({
                                    ...prev,
                                    showConfirmation: false
                                }))}
                            >
                                Cancel
                            </button>
                            <button
                                className="cta-button primary"
                                onClick={processOrder}
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

MyCartPage.propTypes = {
    userData: PropTypes.shape({
        $id: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        name: PropTypes.string
    }).isRequired
};

export default React.memo(MyCartPage);