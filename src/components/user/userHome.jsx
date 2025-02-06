import React, { useState, useEffect } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiUploadCloud } from "react-icons/fi";
import { TbDeviceMobileCharging } from "react-icons/tb";
import { AiOutlineProduct } from "react-icons/ai";
import { CiBoxList } from "react-icons/ci";
import { Oval } from "react-loader-spinner";
import SetPinPage from "./setPin.jsx";
import useUserAuth from "../../hooks/userAuthHook.jsx";
import "./style/userHome.css";

function UserHome({ userData}) {
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!userData.password) {setPinSet(false);
        } else {setPinSet(true);}
    }, [userData]);

    const { logout } = useUserAuth();
    const [isLogout, setIsLogout] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pinSet, setPinSet] = useState(true);
    const navigate = useNavigate();

    // Handle user logout
    const handleLogout = async () => {
        setIsLoading(true);
        await logout();
    };
    return (
        <>
            <header>
                <div className="dashboard-header-parent">
                    <HiOutlineUserCircle
                        id="dashboard-header-ham"
                        size={35}
                        aria-label="User profile"
                    />
                    <div className="dashboard-header-user">
                        <p id="dashboard-header-user-location">Bharat | Linker</p>
                        <p id="dashboard-header-user-phn">
                            {userData ? `+${userData.phone}` : "xxxxx xxxxx"}
                        </p>
                    </div>
                    <IoHomeOutline
                        size={25}
                        className="dashboard-header-parent-refurbished"
                        aria-label="Home"
                        onClick={() => navigate("/")}
                    />
                </div>
            </header>

            <main>
                <section className="dashboard-Your-information">
                    <article
                        className="dashboard-Your-Refurbished"
                        onClick={() => navigate("/user/profile")}
                    >
                        <HiOutlineUserCircle
                            size={27}
                            className="dashboard-Your-information-icons"
                            aria-label="Your profile"
                        />
                        <p className="dashboard-Your-info-p">Profile</p>
                    </article>
                    <article
                        className="dashboard-Your-Refurbished"
                        onClick={() => navigate("/user/refurbished")}
                    >
                        <AiOutlineProduct
                            className="dashboard-Your-information-icons"
                            aria-label="Your refurbished items"
                        />
                        <p className="dashboard-Your-info-p">Your refurbished</p>
                    </article>
                    <article
                        className="dashboard-Your-Refurbished"
                        onClick={() => navigate("/user/upload/book")}
                    >
                        <FiUploadCloud
                            className="dashboard-Your-information-icons"
                            aria-label="Upload books"
                        />
                        <p className="dashboard-Your-info-p">Upload Books</p>
                    </article>
                    <article
                        className="dashboard-Your-Refurbished"
                        onClick={() => navigate("/user/upload/gadget")}
                    >
                        <TbDeviceMobileCharging
                            className="dashboard-Your-information-icons"
                            aria-label="Upload gadgets"
                        />
                        <p className="dashboard-Your-info-p">Upload Gadgets</p>
                    </article>
                    <article
                        className="dashboard-Your-Refurbished"
                        onClick={() => navigate("/user/order")}
                    >
                        <CiBoxList
                            className="dashboard-Your-information-icons"
                            aria-label="Your orders"
                        />
                        <p className="dashboard-Your-info-p">Order</p>
                    </article>
                    <article
                        className="dashboard-Your-Refurbished"
                        onClick={() => setIsLogout(true)}
                    >
                        <MdOutlineAdminPanelSettings
                            className="dashboard-Your-information-icons"
                            aria-label="Logout"
                        />
                        <p className="dashboard-Your-info-p">Logout</p>
                    </article>
                </section>
            </main>

            {/* Logout confirmation pop-up */}
            {isLogout && (
                <div className="logout-pop-up">
                    <div className="logout-pop-up-inner-div">
                        <div className="logout-pop-up-inner-div-logout-statement">
                            Are you sure you want to logout?
                        </div>
                        <div className="logout-pop-up-inner-div-no-yes">
                            <div
                                className="logout-pop-up-inner-div-no"
                                onClick={() => setIsLogout(false)}
                            >
                                No
                            </div>
                            <div
                                className="logout-pop-up-inner-div-yes"
                                onClick={handleLogout}
                            >
                                {isLoading ? (
                                    <Oval
                                        height={30}
                                        width={30}
                                        color="green"
                                        secondaryColor="white"
                                        ariaLabel="loading"
                                    />
                                ) : (
                                    "Yes"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!pinSet && <SetPinPage onPinSet={()=>{setPinSet(false)}}/>}
        </>
    );
}

export default UserHome;
