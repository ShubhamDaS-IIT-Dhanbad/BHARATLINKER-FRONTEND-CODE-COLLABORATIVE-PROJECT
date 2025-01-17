import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './myCart.css';
import { useSelector } from 'react-redux';
import { IoIosCloseCircleOutline } from "react-icons/io";
import searchProductService from "../../../appWrite/searchProduct.js";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import Cookies from 'js-cookie';
import { getDistance } from 'geolib';
import { RotatingLines } from "react-loader-spinner";
import { IoIosAddCircleOutline } from "react-icons/io";

import { SlLocationPin } from 'react-icons/sl';
import conf from '../../../conf/conf.js';

import { IoSearch } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";

import { placeOrderProvider } from '../../../appWrite/order/order.js'

const MyCartPage = ({ setShowMyCart, updateCartData }) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const [cartItems, setCartItems] = useState([]);
    const [userLat, setUserLat] = useState(null);
    const [userLong, setUserLong] = useState(null);
    const [loading, setLoading] = useState(true);
    const { products } = useSelector((state) => state.searchproducts);

    const deliveryCostPerKm = 10;
    const handlingCharge = 5;

    useEffect(() => {
        const getCartFromCookie = () => {
            try {
                const userDataCookie = Cookies.get('BharatLinkerUserData');

                if (!userDataCookie) {
                    window.location.href = '/login';
                    return;
                }
                const userData = JSON.parse(decodeURIComponent(userDataCookie));
                if (userData) {
                    setUserData(userData);
                }
                const cart = userData.cart || [];
                const updatedCartItems = cart.map(async (item) => {
                    const product = products.find((prod) => prod.$id === item.id) || await searchProductService.getProductById(item.id);
                    return {
                        ...item,
                        image: product?.images[0],
                        name: product?.title,
                        price: product?.price,
                        discountedPrice: product?.discountedPrice,
                        lat: product?.lat,
                        long: product?.long,
                        shopId: product?.shop
                    };
                });

                Promise.all(updatedCartItems).then((items) => {
                    setCartItems(items);
                    setLoading(false);
                });
            } catch (error) {
                console.error("Error fetching cart data from cookie:", error);
                setLoading(false);
            }
        };

        getCartFromCookie();
    }, [products]);

    const calculateTotal = () => {
        return (cartItems.reduce((acc, item) => acc + (item.discountedPrice || item.price) * item.count, 0)).toFixed(1);
    };
    const calculateDiscountdPrice = () => {
        return (cartItems.reduce((acc, item) => acc + (item.price || item.discountedPrice) * item.count, 0)).toFixed(1);
    };

    const calculateSavings = () => {
        return (cartItems.reduce((acc, item) => acc + (item.price - item.discountedPrice) * item.count, 0)).toFixed(1);
    };

    const calculateDeliveryCharge = () => {
        const totalDistance = cartItems.reduce((acc, item) => {
            if (userLat && userLong && item.lat && item.long) {
                const distance = calculateDistance(userLat, userLong, item.lat, item.long);
                return acc + parseFloat(distance);
            }
            return acc;
        }, 0);
        return (totalDistance * deliveryCostPerKm).toFixed(1);
    };

    const calculateGrandTotal = () => {
        const totalCost = parseFloat(calculateTotal());
        const deliveryCharge = parseFloat(calculateDeliveryCharge());
        const handling = handlingCharge;

        const grandTotal = totalCost + deliveryCharge + handling;
        return grandTotal.toFixed(1);
    };

    const handleQuantityChange = (id, type) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                if (type === 'increase') {
                    if (item.count >= 3) { alert("maximum quantity reached"); return item; }
                    item.count = item.count + 1;
                } else if (type === 'decrease') {
                    item.count = item.count - 1;
                }

                if (item.count === 0) {
                    return null;
                }

            }
            return item;
        }).filter(item => item !== null);
        setCartItems(updatedCart);
        updateCartData(updatedCart);

        const userDataCookie = Cookies.get('BharatLinkerUserData');
        if (userDataCookie) {
            const userData = JSON.parse(decodeURIComponent(userDataCookie));
            userData.cart = updatedCart;
            Cookies.set('BharatLinkerUserData', JSON.stringify(userData), { path: '/' });
        }
    };

    const calculateDistance = (lat1, long1, lat2, long2) => {
        if (lat1 && long1 && lat2 && long2) {
            const distanceInMeters = getDistance(
                { latitude: lat1, longitude: long1 },
                { latitude: lat2, longitude: long2 }
            );
            return (distanceInMeters / 1000).toFixed(2);
        }
        return 0;
    };

















    const [loadingSuggestion, setLoadingSuggestion] = useState(false);
    const [address, setAddress] = useState("");
    const [suggestion, setSuggestions] = useState(""); // Longitude
    const [searchQuery, setSearchQuery] = useState("");
    const [locationAvailable, setLocationAvailable] = useState(false); // Location available status
    const [fetchingUserLocation, setFetchingUserLocation] = useState(false); // Fetching location state

    // Function to handle current location click
    const handleLocationClick = () => {
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
                        const address = data.results[0].formatted;
                        setAddress(address);
                        setUserLat(latitude);
                        setUserLong(longitude);
                        setLocationAvailable(true);
                    } catch (error) {
                        console.error("Error fetching address:", error);
                    } finally {
                        setFetchingUserLocation(false);
                    }
                },
                (error) => {
                    console.error("Error fetching current location:", error);
                    setFetchingUserLocation(false);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setFetchingUserLocation(false);
        }
    };

    // Function to fetch suggestions based on query
    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        const apiKey = conf.geoapifyapikey;
        const apiUrl = `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${apiKey}&lang=en`;

        setLoadingSuggestion(true);

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const formattedSuggestions = data.features
                    .filter(
                        (feature) =>
                            feature.properties.country === "India" && feature.properties.state
                    )
                    .map((feature) => ({
                        label: feature.properties.formatted,
                        lat: feature.geometry.coordinates[1],
                        lon: feature.geometry.coordinates[0],
                        country: feature.properties.country,
                        state: feature.properties.state,
                    }));
                setSuggestions(formattedSuggestions);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        } finally {
            setLoadingSuggestion(false);
        }
    };

    // Handle search query
    const handleSearch = () => fetchSuggestions(searchQuery);
    const handleAddressClick = (suggestion) => {
        setSearchQuery(suggestion.label);
        setSuggestions([]);
        setAddress(suggestion.label);
        setUserLat(suggestion.lat);
        setUserLong(suggestion.lon);
    };












    const placeOrder = async (cartItems) => {

        if (!address || !userLat || !userLong) { alert("address is empty latitude and longitude"); return; }
        try {
            for (const cartItem of cartItems) {


                const userId = userData.$id;
                const productId = cartItem.id;
                const count = cartItem.count;
                const discountedPrice = cartItem.discountedPrice;
                const price = cartItem.price;
                const shopId = cartItem.shopId;



                await placeOrderProvider(userId, shopId, productId,
                    count,
                    price,
                    discountedPrice,
                    address, userLat, userLong
                );
            }




            const userDataCookie = Cookies.get('BharatLinkerUserData');
            if (userDataCookie) {
                const userData = JSON.parse(decodeURIComponent(userDataCookie));
                userData.cart = '';
                Cookies.set('BharatLinkerUserData', JSON.stringify(userData), { path: '/' });

                updateCartData([]);
            }

            setCartItems([]);

        } catch (error) {
            console.error("Error placing orders:", error);
        }
    };
















    return (
        <div>
            <div className="mycart-header">
                <span>My Cart</span>
                <IoIosCloseCircleOutline onClick={() => { setShowMyCart(false) }} size={30} />
            </div>
            <div className="my-cart-container">
                {loading ? (
                    <div className="my-cart-loading-container">
                        <RotatingLines width="50" height="50" />
                    </div>
                ) : (
                    <>
                        <div className='my-cart-total-saving'>
                            <span>Your total savings</span>
                            <span>₹{calculateSavings()}</span>
                        </div>

                        <div className="my-cart-items-container">
                            {cartItems.map((item) => (
                                <div key={item.id} className="my-cart-item">
                                    <img onClick={() => { setShowMyCart(false); navigate(`/product/${item.id}`) }} className="my-cart-item-img" src={item.image} alt={item.name} />
                                    <div className="my-cart-item-second">
                                        <p className="item-name">{item.name}</p>
                                        <div className="price-container">
                                            <p className="item-price-strikethrough">₹{item.price}</p>
                                            <p className="item-price">₹{item.discountedPrice}</p>
                                        </div>
                                        {userLat && userLong && item.lat && item.long && (
                                            <span className='my-cart-item-distance'>{calculateDistance(userLat, userLong, item.lat, item.long)} km away</span>
                                        )}
                                    </div>
                                    <div className="my-cart-count-container-parent">
                                        <div className="my-cart-count-container">
                                            <FaMinus size={12} onClick={() => handleQuantityChange(item.id, 'decrease')} />
                                            {item.count}
                                            <FaPlus size={13} onClick={() => handleQuantityChange(item.id, 'increase')} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="my-cart-items-bill-details-container">
                            Bill details
                            <div className="my-cart-items-bill-details-items">
                                <div className="my-cart-items-bill-details-item">
                                    <p className="item-name">Item total cost</p>
                                    <p className="item-price"><span style={{ textDecoration: "line-through", paddingRight: "5px" }}>₹{calculateDiscountdPrice()}</span>₹{calculateTotal()}</p>
                                </div>
                                <div className="my-cart-items-bill-details-item">
                                    <p className="item-name">Delivery charge</p>
                                    <p className="item-price">₹{calculateDeliveryCharge()}</p>
                                </div>
                                <div className="my-cart-items-bill-details-item">
                                    <p className="item-name">Handling charge</p>
                                    <p className="item-price">₹{handlingCharge}</p>
                                </div>
                                <div className="my-cart-items-bill-details-item">
                                    <p className="item-name">Grand total</p>
                                    <p className="item-price">₹{calculateGrandTotal()}</p>
                                </div>
                            </div>
                        </div>




























                        <div className="my-cart-delivery-address-container">
                            Delivery Address
                            <div className="my-cart-items-bill-details-items">
                                <div className="my-cart-items-bill-details-item">
                                    <p className="item-name">Address</p>
                                    <p className="item-address">{address}</p>
                                </div>
                                <div className="my-cart-items-bill-details-item">
                                    <p className="item-name">Latitude</p>
                                    <p className="item-price">{userLat}</p>
                                </div>
                                <div className="my-cart-items-bill-details-item">
                                    <p className="item-name">Longitude</p>
                                    <p className="item-price">{userLong}</p>
                                </div>
                                <div className="my-cart-items-bill-details-item">
                                    <p className="item-name">Landmark</p>
                                    <input className='cart-landmark-div-input' placeholder='Street / statue / building'></input>
                                </div>
                            </div>
                        </div>


                        <div className="my-cart-delivery-location-container">
                            <p className="add-address-text">Search Address</p>
                            <div className="user-cart-location" onClick={handleLocationClick}>
                                USE CURRENT LOCATION AS DELIVERY LOCATION
                                <MdMyLocation
                                    size={20}
                                    color={"white"}
                                    style={{ cursor: "pointer" }}
                                    aria-label="Get Current Location"
                                />
                            </div>
                            <div className="location-tab-bottom-div-input-div">
                                <IoSearch onClick={handleSearch} size={20} />
                                <input
                                    className="location-tab-bottom-div-input"
                                    placeholder="Search your city/village/town"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSearch();
                                        }
                                    }}
                                />
                            </div>

                        </div>


                        <div className="my-cart-delivery-suggestion-container">
                            {loadingSuggestion || fetchingUserLocation && (
                                <div className="location-tab-loader">
                                    <RotatingLines
                                        width="50"
                                        height="50"
                                        color="#00BFFF"
                                        ariaLabel="rotating-lines-loading"
                                    />
                                </div>
                            )}

                            {!loading && suggestion.length > 0 && (
                                <div className="location-tab-suggestions">
                                    {suggestion.map((suggestion, index) => (
                                        <div
                                            className="location-tab-suggestion-info-div"
                                            key={index}
                                            onClick={() => handleAddressClick(suggestion)}
                                        >
                                            <SlLocationPin size={17} />
                                            <p className="location-tab-location-info-inner-div-2">
                                                {suggestion.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                    </>
                )}
            </div>
            {
                !loading && <div className="my-cart-address-selection">
                    <div className="select-address" onClick={() => { placeOrder(cartItems) }}>Procedd to checkout</div>
                </div>
            }
        </div >
    );
};

export default MyCartPage;
