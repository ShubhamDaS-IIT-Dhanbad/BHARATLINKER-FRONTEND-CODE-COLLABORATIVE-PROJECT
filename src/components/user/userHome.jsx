import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import Navbar from "./navbar.jsx";
import { PiShoppingBagOpenThin } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";

import { useSelector } from 'react-redux';
import { BsChatLeftText } from "react-icons/bs";
import { CiMobile3 } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import useUserAuth from "../../hooks/userAuthHook.jsx";
import "./style/userHome.css";
import rd1 from './asset/rd1.png';
import AddToCartTab from "../viewCartTab/viewCart.jsx";
import { WiNightCloudyWindy } from "react-icons/wi";
function UserHome({ userData }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { totalQuantity, totalPrice } = useSelector((state) => state.userCart);

    const { logout } = useUserAuth();
    const [isLogout, setIsLogout] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Handle user logout
    const handleLogout = async () => {
        setIsLoading(true);
        await logout();
    };

    const title = "Confirm Logout"; // Define title for the popup
    const text = "Are you sure you want to log out?"; // Define text for the popup
    const buttons = [
        { label: "No", onClick: () => setIsLogout(false), primary: false },
        { label: "Yes", onClick: handleLogout, primary: true, disabled: isLoading },
    ];

    return (
        <>
            <header>
                <Navbar onBackNavigation={() => { navigate("/") }} userData={userData} headerTitle="USER PROFILE" />
            </header>

            <main>
                <section className="user-dashboard-info-section">
                    <img src={rd1} />

                    <div className="user-dashboard-header-row">
                        <button
                            className="user-dashboard-primary-button"
                        >
                            <FaPlus className="user-dashboard-icon-xs" />
                            <span>USER DATA</span>
                        </button>
                        <article
                            className="user-dashboard-refurbished-item"
                            onClick={() => navigate("/user/profile")}
                        >
                            <CiLocationOn
                                size={25}
                                className="user-dashboard-info-icon"
                                aria-label="Your profile"
                            />
                            <p className="user-dashboard-info-text">Address book</p>
                        </article>

                        <article
                            className="user-dashboard-refurbished-item"
                            onClick={() => navigate("/user/order")}
                        >
                            <PiShoppingBagOpenThin
                                size={25}
                                className="user-dashboard-info-icon"
                                aria-label="Your orders"
                            />
                            <p className="user-dashboard-info-text">Order</p>
                        </article>
                        <article
                            className="user-dashboard-refurbished-item"
                            onClick={() => navigate("/support")}
                        >
                            < BsChatLeftText
                                size={24}
                                className="user-dashboard-info-icon"
                                aria-label="Your orders"
                            />
                            <p className="user-dashboard-info-text">Support</p>
                        </article>
                        <article
                            className="user-dashboard-refurbished-item"
                            onClick={() => navigate("/about")}
                        >
                            <WiNightCloudyWindy

                                size={25}
                                className="user-dashboard-info-icon"
                                aria-label="About Us"
                            />
                            <p className="user-dashboard-info-text">About Us</p>
                        </article>
                        <article
                            className="user-dashboard-refurbished-item"
                            onClick={() => navigate("/bharatlinker")}
                        >
                            <CiMobile3
                                size={25}
                                className="user-dashboard-info-icon"
                                aria-label="Your orders"
                            />
                            <p className="user-dashboard-info-text">Bharat Linker Lite</p>
                        </article>
                        <article
                            className="user-dashboard-refurbished-item"
                            onClick={() => setIsLogout(true)}
                        >
                            <IoIosLogOut
                                size={25}
                                className="user-dashboard-info-icon"
                                aria-label="Logout"
                            />
                            <p className="user-dashboard-info-text">Log - Out</p>
                        </article>
                    </div>
                </section>
            </main>

            {/* Logout confirmation pop-up */}
            {isLogout && (
                <div className="user-dashboard-popup-overlay">
                    <div className="user-dashboard-popup-card">
                        <div className="user-dashboard-popup-pointer"></div>
                        <h2 className="user-dashboard-popup-title">{title}</h2>
                        {text ? <p className="user-dashboard-popup-text">{text}</p> : null}
                        <div className="user-dashboard-popup-buttons">
                            {buttons.map((btn, index) => (
                                <button
                                    key={index}
                                    className={
                                        btn.primary
                                            ? "user-dashboard-popup-button-primary"
                                            : "user-dashboard-popup-button-secondary"
                                    }
                                    onClick={btn.onClick}
                                    disabled={btn.disabled || false}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            <AddToCartTab totalQuantity={totalQuantity} totalPrice={totalPrice} />
        </>
    );
}

export default UserHome;