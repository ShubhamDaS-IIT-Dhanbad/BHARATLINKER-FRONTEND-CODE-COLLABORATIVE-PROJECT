import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';

// Project components and utilities
import Navbar from "../navbar.jsx";
import OrderProductCard from './cartCard.jsx';
import { updateCartStateAsync, removeFromUserCart, fetchUserCart } from '../../../redux/features/user/cartSlice.jsx';
// import { fetchShopStatus } from '../../../appWrite/shop/shop.js';

import DeliveryAddress from './deliveryAddress.jsx';
import CheckOutPage from './checkOutPage.jsx';

import LocationTab from '../../locationTab/locationTab.jsx';

// Styles
import '../style/userProfile.css';
import './myCart.css';
import '../../searchPage/sortby.css';

const MyCartPage = ({ userData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showLocationTab, setShowLocationTab] = useState(false);
    const [showAddressDetail, setShowAddressDetail] = useState(false);
    const [showCheckOutPage, setShowCheckOutPage] = useState(false);

    const {cart} = useSelector((state) => state.userCart);

    // State management
    const [shopStatus, setShopStatus] = useState({});
    const [deliveryAddress, setDeliveryAddress] = useState();

    useEffect(() => {
        if (cart?.length === 0 && userData?.userId) {
            dispatch(fetchUserCart(userData.userId));
        }
        window.scrollTo(0, 0);
    }, []);

    

    const handleRemoveItem = useCallback(async (cartId, productId) => {
        try {
            await dispatch(removeFromUserCart({ productId, cartId }));
        } catch (error) {
            console.error("Cart update failed:", error);
        }
    }, [dispatch, userData?.phoneNumber]);

    if (showLocationTab) return (
        <LocationTab
            header={"Delivery Address"}
            setDeliveryAddress={setDeliveryAddress}
            setShowAddressDetail={setShowAddressDetail}
            setLocationTab={setShowLocationTab}
        />
    );
    if (showAddressDetail) return (
        <DeliveryAddress
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
            setShowCheckOutPage={setShowCheckOutPage}
            setShowAddressDetail={setShowAddressDetail}
        />
    );
    if (showCheckOutPage) {
        return (
            <CheckOutPage
                userData={userData}
                items={cart}
                deliveryAddress={deliveryAddress}

                setDeliveryAddress={setDeliveryAddress}
                setShowCheckOutPage={setShowCheckOutPage}
                setShowAddressDetail={setShowAddressDetail}
            />
        );
    }

    return (
        <>
            <Navbar
                userData={userData} 
                headerTitle="MY CART"
                onBackNavigation={() => navigate(-1)}
            />
            <div className="user-cart-container">
                <main className="user-cart-content">
                    {cart?.length === 0 ? (
                        <div className="user-cart-empty">
                            <div className="user-cart-empty-illustration" />
                            <h2>Your Cart is Empty</h2>
                            <p>Discover our products and find something you'll love</p>
                            <button
                                onClick={() => navigate('/shop')}
                                className="user-cart-cta-button primary"
                            >
                                Explore Products
                            </button>
                        </div>
                    ) : (
                        <>
                            <section className="user-cart-items-section">
                                {cart.map(item => {
                                    const isOutOfStock = item.stock < item.quantity;
                                    return (
                                        <OrderProductCard
                                            key={item.$id}
                                            productId={item.productId}
                                            order={item}
                                            isRemove={true}
                                            onRemove={() => handleRemoveItem(item.$id, item.productId)}
                                            isShopOpen={shopStatus[item.shopId] || false}
                                            isOutOfStock={isOutOfStock}
                                        />
                                    );
                                })}
                            </section>


                            <div className="cart-check-out-container">

                                <div
                                    className="cart-check-out-container-button"
                                    onClick={() => setShowLocationTab(true)}
                                >
                                    Proceed to Checkout

                                </div>
                            </div>

                        </>
                    )}
                </main>
            </div>
        </>
    );
};

MyCartPage.propTypes = {
    userData: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        name: PropTypes.string
    }).isRequired
};

export default React.memo(MyCartPage);
