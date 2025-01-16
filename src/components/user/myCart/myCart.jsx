import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './myCart.css';
import { useSelector } from 'react-redux';
import { IoIosCloseCircleOutline } from "react-icons/io";
import searchProductService from "../../../appWrite/searchProduct.js";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

const MyCartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const { products } = useSelector((state) => state.searchproducts);
    console.log(cartItems);

    useEffect(() => {
        const getCartFromCookie = () => {
            try {
                const userDataCookie = document.cookie.replace(/(?:(?:^|.*;\s*)BharatLinkerUserData\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                if (!userDataCookie) {
                    window.location.href = '/login';
                    return;
                }
                const userData = JSON.parse(decodeURIComponent(userDataCookie));
                const cart = userData.cart || [];

                // Fetch product details for each cart item asynchronously
                const updatedCartItems = cart.map(async (item) => {
                    const product = products.find((prod) => prod.$id === item.id) || await searchProductService.getProductById(item.id);
                    return { ...item, image: product?.images[0], name: product?.title, price: product?.price, discountedPrice: product?.discountedPrice };
                });

                // Wait for all product details to be fetched and update the cart items
                Promise.all(updatedCartItems).then(setCartItems);
            } catch (error) {
                console.error("Error fetching cart data from cookie:", error);
            }
        };
        getCartFromCookie();
    }, [products]);

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    const calculateSavings = () => {
        return cartItems.reduce((acc, item) => acc + (item.originalPrice - item.price) * item.quantity, 0);
    };

    const handleQuantityChange = (id, type) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                if (type === 'increase') {
                    item.count = item.count + 1;
                } else if (type === 'decrease') {
                    item.count = item.count - 1;
                }

                // If quantity becomes 0, remove the item from the cart
                if (item.count === 0) {
                    return null; // Mark for removal
                }
            }
            return item;
        }).filter(item => item !== null); 

        setCartItems(updatedCart);

        // Update the cookie with the new cart
        const userDataCookie = document.cookie.replace(/(?:(?:^|.*;\s*)BharatLinkerUserData\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (userDataCookie) {
            const userData = JSON.parse(decodeURIComponent(userDataCookie));
            userData.cart = updatedCart; // Update the cart
            document.cookie = `BharatLinkerUserData=${encodeURIComponent(JSON.stringify(userData))}; path=/`; // Update the cookie
        }console.log("updated",updatedCart)
    };

    return (
        <>
            <div className="mycart-header">
                <span>My Cart</span>
                <IoIosCloseCircleOutline onClick={() => { navigate(-1) }} size={30} />
            </div>
            <div className="my-cart-container">
                <div className='my-cart-total-saving'>
                    <span>Your total savings</span>
                    <span>₹73</span>
                </div>

                <div className="my-cart-items-container">
                    {cartItems.map((item) => (
                        <div key={item.id} className="my-cart-item">

                            <img className="my-cart-item-img" src={item.image} alt={item.name} />
                            <div className="my-cart-item-second">
                                <p className="item-name">{item.name}</p>
                                <p className="item-price">₹{item.price}</p>
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

                <div className="address-selection">
                    <button className="select-address">Please select an address</button>
                </div>
            </div>
        </>
    );
};

export default MyCartPage;
