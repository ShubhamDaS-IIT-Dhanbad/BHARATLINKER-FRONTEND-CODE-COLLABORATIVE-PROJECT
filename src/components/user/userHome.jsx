import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { CiBoxList } from "react-icons/ci";
import Navbar from "./navbar.jsx";
import { IoIosLogOut } from "react-icons/io";
import p1 from './asset/pro1.png';
import { FaPlus } from "react-icons/fa";
import useUserAuth from "../../hooks/userAuthHook.jsx";
import "./style/userHome.css";

function UserHome({ userData }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                <Navbar onBackNavigation={()=>{navigate("/")}} userData={userData} headerTitle="USER PROFILE" />
            </header>

            <main>
                <section className="user-dashboard-info-section">
                    <div className="user-dashboard-profile-div">
                        <img src={p1} alt="User Profile" className="user-dashboard-profile-img"  />
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
                                <p className="user-dashboard-info-text">ADDRESS BOOK</p>
                            </article>

                            <article
                                className="user-dashboard-refurbished-item"
                                onClick={() => navigate("/user/order")}
                            >
                                <CiBoxList
                                size={25}
                                    className="user-dashboard-info-icon"
                                    aria-label="Your orders"
                                />
                                <p className="user-dashboard-info-text">ORDER</p>
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
                                <p className="user-dashboard-info-text">LOG - OUT</p>
                            </article>
                        </div>
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
        </>
    );
}

export default UserHome;