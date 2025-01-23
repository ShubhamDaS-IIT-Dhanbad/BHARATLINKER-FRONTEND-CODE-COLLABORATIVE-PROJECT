import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { SlLocationPin } from 'react-icons/sl';
import { TiInfoOutline } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import conf from '../../../conf/conf.js'
import Navbar from "../a.navbarComponent/navbar.jsx";
import OrderProductCard from './cartCard.jsx';
import { updateCartStateAsync, fetchUserCart } from '../../../redux/features/user/cartSlice.jsx';
import useLocationFromCookie from '../../../hooks/useLocationFromCookie.jsx';
import { IoClose } from "react-icons/io5";
import { placeOrderProvider } from '../../../appWrite/order/order.js'

import '../userProfile/userProfile.css';
import './myCart.css';
import '../../searchPage/sortby.css'

const MyCartPage = ({ userData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { fetchLocationSuggestions } = useLocationFromCookie();
    const { cart, totalQuantity, totalPrice } = useSelector((state) => state.userCart);

    const [address, setAddress] = useState('');
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);


    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [fetchingUserLocation, setFetchingUserLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    // Fetch the user's cart on initial render if empty
    useEffect(() => {
        if (cart?.length === 0 && userData) {
            dispatch(fetchUserCart(userData.phoneNumber));
        }
    }, []);

    const handleRemove = useCallback(async (productId) => {
        try {
            const newItem = {
                productId: productId,
                quantity: 0,
                phoneNumber: userData?.phoneNumber,
            }
            await dispatch(updateCartStateAsync(newItem));
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    }, []);

    const handleLocationClick = useCallback(() => {
        if (navigator.geolocation) {
            setFetchingUserLocation(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const apiKey = conf.opencageapikey;
                    const apiUrl = `${conf.opencageapiurl}?key=${apiKey}&q=${latitude},${longitude}&pretty=1&no_annotations=1`;

                    try {
                        const response = await fetch(apiUrl);
                        const data = await response.json();
                        setAddress(data.results[0]?.formatted || 'Unknown Address');
                        setLat(latitude);
                        setLong(longitude);
                    } catch (error) {
                        console.error('Error fetching address:', error);
                    } finally {
                        setFetchingUserLocation(false);
                    }
                },
                (error) => {
                    console.error('Error fetching current location:', error);
                    setFetchingUserLocation(false);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const handleAddressClick = useCallback((suggestion) => {
        setSearchQuery(suggestion.label);
        setAddress(suggestion.label);
        setLat(suggestion.lat);
        setLong(suggestion.lon);
        setSuggestions([]);
    }, []);

    const fetchSuggestions = useCallback(async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const response = await fetchLocationSuggestions(query);
            setSuggestions(response || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const renderedSuggestions = useMemo(() => (
        suggestions.map((suggestion, index) => (
            <div
                key={index}
                className="user-location-tab-suggestion-info-div"
                onClick={() => handleAddressClick(suggestion)}
            >
                <SlLocationPin size={17} />
                <p>{suggestion.label}</p>
            </div>
        ))
    ), []);





    const [orderPlacing, setOrderPlacing] = useState(false);
    const [confirmOrder, setConfirmOrder] = useState(false);
    // Function to handle the order placement
    const placeOrderConfirm = async () => {

        if (!address || !lat || !long) {
            setShowInfo(true);
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty. Please add items to the cart before placing an order.");
            return;
        }

        setOrderPlacing(true);
        try {
            for (const cartItem of cart) {
                const { productId, shopId, quantity, discountedPrice, price, title, image } = cartItem;
                console.log(cartItem)
                const userId = userData.$id;
                await placeOrderProvider(
                    userId,
                    shopId,
                    productId,
                    quantity,
                    price,
                    discountedPrice,
                    address,
                    lat,
                    long,
                    image,
                    title
                );
                const newItem = {
                    productId: productId,
                    quantity: 0,
                    phoneNumber: userData?.phoneNumber,
                }
                await dispatch(updateCartStateAsync(newItem));
            }
            navigate("/user/order");
        } catch (error) {
            console.error("Error placing orders:", error);
            alert("An error occurred while placing your order. Please try again.");
        } finally {
            setOrderPlacing(false);
        }
    };






    return (
        <div>
            <header>
                <div className="user-refurbished-product-page-header">
                    <Navbar headerTitle="MY CART" onBackNavigation={() => navigate(-1)} />
                </div>
            </header>
            <div className="my-cart-container">
                {cart?.length === 0 ? (
                    <div className="empty-cart-container">
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <button onClick={() => navigate('/shop')} className="shop-now-button">
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="my-cart-items-container">
                            {cart?.map((item) => (
                                <div key={item.productId} className="my-cart-item">
                                    <OrderProductCard
                                        order={item}
                                        functionToWork={() => handleRemove(item.productId)}
                                        productId={item.productId}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="user-profile-div">
                            <div className="user-location-tab-bottom-div-input-div">
                                <IoSearch onClick={() => fetchSuggestions(searchQuery)} size={20} />
                                <input
                                    className="user-location-tab-bottom-div-input"
                                    placeholder="Search location"
                                    value={searchQuery}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchSuggestions(searchQuery)}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {loading && (
                                <div className="location-tab-loader">
                                    <Oval height={20} width={20} color="green" ariaLabel="loading" />
                                </div>
                            )}
                            {!loading && suggestions.length > 0 && (
                                <div className="user-location-tab-suggestions">
                                    {renderedSuggestions}
                                </div>
                            )}
                            <div className="user-profile-field">
                                <div id="address" className="user-profile-form-input">
                                    {address || 'Delivery address'}
                                </div>
                                <TiInfoOutline size={30} onClick={() => setShowInfo(!showInfo)} />
                            </div>
                            {showInfo && (
                                <div className="info-box">
                                    Location REQUIRED!
                                    This location will help determine the delivery area. Please ensure your locality is accurately specified.
                                </div>
                            )}
                            <div style={{ display: 'flex', width: '98%' }}>
                                <div className="user-profile-lat-input">{lat || 'LATITUDE'}</div>
                                <div className="user-profile-lat-input">{long || 'LONGITUDE'}</div>
                            </div>
                            <div
                                className="user-location-tab-bottom-div-current-location"
                                onClick={handleLocationClick}
                                aria-label="Use current location"
                            >
                                {fetchingUserLocation ? (
                                    <Oval height={20} width={20} color="white" ariaLabel="loading" />
                                ) : (
                                    <>
                                        <MdMyLocation size={23} />
                                        Use current location
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className='my-cart-count-container-parent'>
                {!confirmOrder &&
                    <div
                        className="my-cart-count-container"
                        onClick={() => { 
                            if (!address || !lat || !long) {
                                setShowInfo(true);
                                setTimeout(() => {
                                    window.scrollTo({
                                        top: document.body.scrollHeight,
                                        behavior: "smooth",
                                    });
                                }, 0);
                            
                                return;
                            }setConfirmOrder(true) }}
                        disabled={orderPlacing || cart.length === 0}
                    >
                        PLACE ORDER
                    </div>
                }
            </div>
            {/* */}

            {confirmOrder &&
                <div className="productSearch-page-sort-by-tab">
                    <div className='location-tab-IoIosCloseCircle' onClick={()=>{placeOrderConfirm}}  aria-label="Close sort options">
                        <IoClose onClick={() => { setConfirmOrder(false) }} size={25} />
                    </div>
                    <div style={{ color: "white" }}>place order?</div>
                    <div id="productSearch-page-sort-by-header">
                        <div id="productSearch-page-sortby-options">
                            <div className="order-confirm-no" onClick={() => { setConfirmOrder(false) }}>NO</div>
                            <div className="order-confirm-yes">YES</div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};
export default React.memo(MyCartPage);










{/* 
                        <div className="my-cart-delivery-address-container" style={{ marginBottom: "20vh" }}>
                            Return Policy
                            <div className="my-cart-return-policy">
                                For returns and enquiry about delivery, please contact the shop owner directly. Shop details are available on their page in the "Shop" section.
                            </div>
                        </div>
 */}

{/* {
                !loading && <div className="my-cart-address-selection">
                    <div className="select-address" onClick={() => { placeOrder() }}>Proceed to Place order <GrCaretNext style={{ marginLeft: "7px" }} /></div>
                </div>
            }
            {confirmOrder &&
                <div className='my-cart-confirm-order-parent' >
                    <div className='my-cart-confirm-order-div' >
                        Confirm Cash On Delivery Order
                        <div className='my-cart-confirm-order-div-img-div' ></div>
                        <div className='my-cart-confirm-order-div-yes-no-div' >
                            <div className='my-cart-confirm-order-div-yes' onClick={() => { if (!orderPlacing) setConfirmOrder(false) }} >Cancel</div>
                            <button className='my-cart-confirm-order-div-no' onClick={() => { placeOrderConfirm(cartItems) }} disabled={orderPlacing}>
                                {orderPlacing ? (
                                    <TailSpin height={25} width={25} />
                                ) : (
                                    "Confirm order"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            } */}











