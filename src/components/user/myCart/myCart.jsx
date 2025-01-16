import React, { useState, useEffect } from 'react';
import './myCart.css';
import { useSelector } from 'react-redux';
import { IoIosCloseCircleOutline } from "react-icons/io";
import searchProductService from "../../../appWrite/searchProduct.js";

const MyCartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const { products } = useSelector((state) => state.searchproducts);  // Assuming the redux state has a searchproducts slice
    console.log(cartItems)
    // Fetch cart data from cookies when the component mounts
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
                    return { ...item, iage: product?.images[0], name: product?.title, price: product?.price, discountedPrice: product?.discountedPrice };
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
                    item.quantity += 1;
                } else if (type === 'decrease' && item.quantity > 1) {
                    item.quantity -= 1;
                }
            }
            return item;
        });
        setCartItems(updatedCart);
    };

    return (
        <>
            <div className="mycart-header">
                <span>My Cart</span>
                <IoIosCloseCircleOutline  size={30}/>
            </div>
            <div className="my-cart-container">
                <div className='my-cart-total-saving'>
                    <span>Your total savings</span>
                    <span>₹73</span>
                </div>

                <div className="my-cart-items-container">
                    {cartItems.map((item) => (
                        <div key={item.id} className="my-cart-item">
                            <div className="item-details">
                                <p className="item-name">{item.name}</p>
                                <p className="item-price">₹{item.price}</p>
                                <div className="item-quantity">
                                    <button onClick={() => handleQuantityChange(item.id, 'decrease')}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id, 'increase')}>+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <div className="bill-details">
                    <div className="bill-item">
                        <p>Items total</p>
                        <p>₹{calculateTotal()}</p>
                    </div>
                    <div className="bill-item">
                        <p>Delivery charge</p>
                        <p>₹25</p>
                    </div>
                    <div className="bill-item">
                        <p>Handling charge</p>
                        <p>₹2</p>
                    </div>
                    <div className="bill-item">
                        <p>Tip for delivery</p>
                        <p>₹50</p>
                    </div>
                    <div className="bill-item">
                        <p><strong>Grand total</strong></p>
                        <p><strong>₹{calculateTotal() + 25 + 2 + 50}</strong></p>
                    </div>
                </div> */}

                <div className="address-selection">
                    <button className="select-address">Please select an address</button>
                </div>
            </div>
        </>
    );
};

export default MyCartPage;
