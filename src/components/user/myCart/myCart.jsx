import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './myCart.css';
import { useSelector } from 'react-redux';
import { IoIosCloseCircleOutline } from "react-icons/io";
import searchProductService from "../../../appWrite/searchProduct.js";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import Cookies from 'js-cookie';
import { getDistance } from 'geolib'; // Import getDistance from geolib
import { RotatingLines } from "react-loader-spinner"; // Import loader spinner

const MyCartPage = ({setShowMyCart}) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [userLat, setUserLat] = useState(null);
    const [userLong, setUserLong] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const { products } = useSelector((state) => state.searchproducts);

    const deliveryCostPerKm = 10;
    const handlingCharge = 5;

    useEffect(() => {
        const getCartFromCookie = () => {
            try {
                const storedLocation = Cookies.get('BharatLinkerUserLocation')
                    ? JSON.parse(Cookies.get('BharatLinkerUserLocation'))
                    : null;
                if (storedLocation) {
                    setUserLat(storedLocation.lat);
                    setUserLong(storedLocation.lon);
                }

               
                const userDataCookie = Cookies.get('BharatLinkerUser');
                if (!userDataCookie) {
                    window.location.href = '/login';
                    return;
                }
                const userData = JSON.parse(decodeURIComponent(userDataCookie));
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
                        long: product?.long
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
                    if(item.count>=3){alert("maximum quantity reached");return item;}
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


        const userDataCookie = Cookies.get('BharatLinkerUser');
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
                                    <img onClick={() => navigate(`/product/${item.id}`)} className="my-cart-item-img" src={item.image} alt={item.name} />
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
                    </>
                )}
            </div>
           {!loading && <div className="my-cart-address-selection">
                <div className="select-address">Please select an address</div>
            </div>}
        </div>
    );
};

export default MyCartPage;
