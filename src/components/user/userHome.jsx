import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiLocationOn, CiMobile3 } from "react-icons/ci";
import { PiShoppingBagOpenThin } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { BsChatLeftText } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { WiNightCloudyWindy } from "react-icons/wi";
import useUserAuth from "../../hooks/userAuthHook.jsx";
import Navbar from "./navbar.jsx";
import AddToCartTab from "../viewCartTab/viewCart.jsx";
import "./style/userHome.css";
import rd1 from "./asset/rd1.png";

// Reusable Confirmation Popup Component
const ConfirmationPopup = ({ isOpen, title, text, buttons }) => {
    if (!isOpen) return null;

    return (
        <div className="user-dashboard-popup-overlay">
            <div className="user-dashboard-popup-card">
                <div className="user-dashboard-popup-pointer"></div>
                <h2 className="user-dashboard-popup-title">{title}</h2>
                {text && <p className="user-dashboard-popup-text">{text}</p>}
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
    );
};

function UserHome({ userData }) {
    const navigate = useNavigate();
    const { totalQuantity, totalPrice } = useSelector((state) => state.userCart);
    const { logout } = useUserAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [popup, setPopup] = useState({ isOpen: false, type: null });

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Capture PWA install prompt
    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    // Handle logout
    const handleLogout = async () => {
        setIsLoading(true);
        await logout();
        setIsLoading(false);
        setPopup({ isOpen: false, type: null });
    };

    // Handle Bharat Linker Lite PWA install
    const handleBharatLinkerInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User ${outcome === "accepted" ? "accepted" : "dismissed"} the PWA install prompt`);
            setDeferredPrompt(null);
        } else {
            alert("To install Bharat Linker Lite, please add this page to your home screen via your browser settings.");
            navigate("/bharatlinker");
        }
        setPopup({ isOpen: false, type: null });
    };

    // Popup configurations
    const popupConfigs = {
        logout: {
            title: "Confirm Logout",
            text: "Are you sure you want to log out? This will end your current session, and you'll need to sign in again to access your account. Any unsaved changes or activities might be lost.",
            buttons: [
                { label: "Yes", onClick: handleLogout, primary: true, disabled: isLoading },
                { label: "No", onClick: () => setPopup({ isOpen: false, type: null }), primary: false },
            ],
        },
        support: {
            title: "Contact Support",
            text: "We’re here to assist you! For inquiries, email us at bharatlinker@gmail.com or call our support team at +91 8250846979. Our team is continuously working to enhance your experience with Bharat Linker.",
            buttons: [
                { label: "OK", onClick: () => {setPopup({ isOpen: false, type: null }); }, primary: true },
                { label: "Close", onClick: () => setPopup({ isOpen: false, type: null }), primary: false },
            ],
        },
        about: {
            title: "About Us",
            text: "At Bharat Linker, we are dedicated to empowering retailers by building a robust platform to thrive in the era of e-commerce and quick commerce. Our mission is to provide innovative tools and solutions that enable retailers to compete effectively with leading platforms, ensuring their success in a dynamic digital marketplace. Visit our About Us page to learn more about our vision and commitment.",
            buttons: [
                { label: "OK", onClick: () => {setPopup({ isOpen: false, type: null }); }, primary: true },
                { label: "Close", onClick: () => setPopup({ isOpen: false, type: null }), primary: false },
            ],
        },
        bharatLinker: {
            title: "Bharat Linker Lite",
           text: "To install Bharat Linker Lite, tap the three-dot menu in the top-right corner of your browser, select 'Add to Home Screen,' and follow the prompts to complete the installation.",
            buttons: [
                { label: "Ok",onClick: () => setPopup({ isOpen: false, type: null }), primary: true },
                { label: "Cancel", onClick: () => setPopup({ isOpen: false, type: null }), primary: false },
            ],
        },
    };

    // Dynamic dashboard items
    const dashboardItems = [
        { icon: CiLocationOn, text: "Address book", path: "/user/profile" },
        { icon: PiShoppingBagOpenThin, text: "Order", path: "/user/order" },
        { 
            icon: BsChatLeftText, 
            text: "Support", 
            size: 24, 
            onClick: () => setPopup({ isOpen: true, type: "support" }) 
        },
        { 
            icon: WiNightCloudyWindy, 
            text: "About Us", 
            onClick: () => setPopup({ isOpen: true, type: "about" }) 
        },
        { 
            icon: CiMobile3, 
            text: "Bharat Linker Lite", 
            onClick: () => setPopup({ isOpen: true, type: "bharatLinker" }), 
            ariaLabel: "Install Bharat Linker Lite" 
        },
        { 
            icon: IoIosLogOut, 
            text: "Log - Out", 
            onClick: () => setPopup({ isOpen: true, type: "logout" }), 
            ariaLabel: "Logout" 
        },
    ];

    return (
        <>
            <header>
                <Navbar onBackNavigation={() => navigate("/")} userData={userData} headerTitle="USER PROFILE" />
            </header>

            <main>
                <section className="user-dashboard-info-section">
                    
                    <div className="user-dashboard-header-row">


                        {dashboardItems.map((item, index) => (
                            <article
                                key={index}
                                className="user-dashboard-refurbished-item"
                                onClick={item.onClick || (() => navigate(item.path))}
                            >
                                <item.icon
                                    size={item.size || 25}
                                    className="user-dashboard-info-icon"
                                    aria-label={item.ariaLabel || item.text}
                                />
                                <p className="user-dashboard-info-text">{item.text}</p>
                            </article>
                        ))}
                    </div>
                    <img src={rd1} alt="User dashboard" />
                </section>
            </main>

            {/* Unified popup */}
            {popup.isOpen && (
                <ConfirmationPopup
                    isOpen={popup.isOpen}
                    title={popupConfigs[popup.type].title}
                    text={popupConfigs[popup.type].text}
                    buttons={popupConfigs[popup.type].buttons}
                />
            )}

            <AddToCartTab totalQuantity={totalQuantity} totalPrice={totalPrice} />
        </>
    );
}

export default UserHome;