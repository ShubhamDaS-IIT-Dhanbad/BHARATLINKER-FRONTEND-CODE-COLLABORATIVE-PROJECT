import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaDoorClosed,
  FaDoorOpen,
  FaSpinner,
} from "react-icons/fa";
import { TbShoppingCartHeart } from "react-icons/tb";
import { MdOutlineAdminPanelSettings, MdMyLocation } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { RiLogoutCircleLine, RiLockPasswordLine } from "react-icons/ri";
import { GrDocumentImage } from "react-icons/gr";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import useRetailerAuthHook from "../../hooks/retailerAuthHook.jsx";
import Password from "./password/password.jsx";
import shopIllustration from "./asset/r1.png";
import { fetchShopDataByAttribute } from '../../appWrite/shop/shopData.js';
import "./style/shopHome.css";

const Profile = ({ shopData }) => {
  const navigate = useNavigate();
  const { updateShopCookie, updateShopCookieOnly, logout } = useRetailerAuthHook();

  const [isOpen, setIsOpen] = useState(shopData.isShopOpen);
  const [showPopup, setShowPopup] = useState(!shopData.shopAddress);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [openClosePopup, setOpenClosePopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const shopDataRef = useRef(shopData);
  const hasFetched = useRef(false);

  useEffect(() => {
    shopDataRef.current = shopData;
  }, [shopData]);

  const fetchAndUpdateShopData = useCallback(async () => {
    if (shopDataRef.current.shopRegistrationStatus === "pending" && !hasFetched.current) {
      try {
        setLoading(true);
        hasFetched.current = true;
        const freshData = await fetchShopDataByAttribute(
          shopDataRef.current.shopPhoneNumber,
          ["shopRegistrationStatus"]
        );
        if (freshData) {
          await updateShopCookieOnly(
            { shopRegistrationStatus: freshData.shopRegistrationStatus },
            shopDataRef.current.shopId
          );
          shopDataRef.current = {
            ...shopDataRef.current,
            shopRegistrationStatus: freshData.shopRegistrationStatus
          };
        }
      } catch (error) {
        console.error("Failed to fetch and update shop data:", error);
        hasFetched.current = false;
      } finally {
        setLoading(false);
      }
    }
  }, []);


  const shopRegistrationStatusPending = shopDataRef.current.shopRegistrationStatus === "pending";

  const handleOpenCloseToggle = useCallback(() => setOpenClosePopup(true), []);

  const confirmOpenCloseToggle = useCallback(async () => {
    if (isOpen === null) return;
    
    setLoading(true);
    try {
      await updateShopCookie({ isShopOpen: !isOpen }, shopDataRef.current.shopId);
      setIsOpen(!isOpen);
      navigate("/secure/shop");
    } catch (error) {
      console.error("Failed to update shop status:", error);
    } finally {
      setLoading(false);
      setOpenClosePopup(false);
    }
  }, [isOpen, updateShopCookie, navigate]);

  const handlePasswordClick = useCallback(() => setShowPassword(true), []);
  const handleBackClick = useCallback(() => navigate("/"), [navigate]);

  const menuItems = useMemo(
    () => [
      { icon: <MdOutlineAdminPanelSettings size={26} />, label: "Shop Data", path: "/secure/shopdata" },
      { icon: <MdMyLocation size={24} />, label: "Shop Location", path: "/secure/shop/address" },
      { icon: <GrDocumentImage size={22} />, label: "Upload Here", path: "/secure/shop/upload" },
      { icon: <AiOutlineProduct size={26} />, label: "All Products", path: "/secure/retailer/products" },
      { icon: <RiLockPasswordLine size={26} />, label: "Password", path: "#", onClick: handlePasswordClick },
      { icon: <MdOutlineWorkspacePremium size={26} />, label: "Subscription", path: "" },
      { icon: <RiLogoutCircleLine size={22} />, label: "Log Out", path: "#", onClick: () => setLogoutPopup(true) },
      {
        icon: isOpen ? <FaDoorOpen size={26} /> : <FaDoorClosed size={26} />,
        label: isOpen ? "Opened" : "Closed",
        path: "#",
        onClick: handleOpenCloseToggle,
      },
    ],
    [isOpen, handleOpenCloseToggle, handlePasswordClick]
  );

  return (
    <>
      <header>
        <div className="shop-home-1">
          <button
            className="shop-home-back-btn"
            onClick={() => navigate("/")}
            aria-label="Back to Home"
          >
            <FaChevronLeft />
          </button>
          <span>DASHBOARD</span>
          <button
            className="shop-home-header-t2"
            onClick={() => navigate("/secure/shop/orders")}
            aria-label="View Orders"
          >
            <TbShoppingCartHeart />
          </button>
        </div>
      </header>

      <main>
        <div className="shop-home-profile-container">
          <div className="shop-home-profile-header">
            <img
              src={shopIllustration}
              className="shop-home-profile-header-pic"
              alt={`${shopDataRef.current?.shopName} illustration`}
            />
            <span className="shop-home-profile-header-shop-name">
              {shopDataRef.current?.shopName.toUpperCase()}
            </span>
            <span className="shop-home-profile-header-store">
              Own E-Commerce Platform
            </span>
          </div>

          <div className="info-box">
            "Just like <strong>Bharat</strong> is rising as a global powerhouse, stay ahead in the competitive e-commerce market—innovate, adapt, and lead the way!" 🚀🔥
          </div>

          <div className="menu">
            {menuItems.map((item, index) => (
              <div
                className="menu-item"
                key={index}
                onClick={item.onClick || (() => navigate(item.path))}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && (item.onClick || (() => navigate(item.path)))()}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showPopup && (
        <Popup
          title="Select Your Shop Location"
          text="We need your shop's location to provide a curated assortment from the nearest store."
          buttons={[
            { label: "Use Current Location", primary: true, onClick: () => {} },
            { label: "Set Manually", primary: false, onClick: () => setShowPopup(false) },
          ]}
        />
      )}

      {logoutPopup && (
        <Popup
          title="Are You Sure You Want to Log Out?"
          text=""
          buttons={[
            { label: "OK", primary: true, onClick: logout },
            { label: "Cancel", primary: false, onClick: () => setLogoutPopup(false) },
          ]}
        />
      )}

      {shopRegistrationStatusPending && (
        <Popup
          title="Your Shop is in 'Pending' State"
          text="We are reviewing your shop. This may take up to 24 hours, and our team might contact you for verification. Once approved, your shop will be live for users. Please check back periodically."
          buttons={[
            { label: "BACK", primary: true, onClick: handleBackClick },
            { 
              label: loading ? (
                <FaSpinner className="spinner-oval" size={20} />
              ) : "REFRESH", 
              primary: false, 
              onClick: fetchAndUpdateShopData,
              disabled: loading
            },
            { label: "LOG-OUT", primary: false, onClick: logout },
          ]}
        />
      )}

      {showPassword && (
        <Password
          shopId={shopDataRef.current.shopId}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      )}

      {openClosePopup && (
        <Popup
          title={!isOpen ? "Ready to Open Your Shop?" : "Close Shop for Now?"}
          text={`Are you sure you want to ${!isOpen ? "open" : "close"} your shop? This action will be visible to customers.`}
          buttons={[
            {
              label: loading ? <FaSpinner className="spinner" size={20} /> : "Confirm",
              primary: true,
              onClick: confirmOpenCloseToggle,
              disabled: loading,
            },
            {
              label: "Cancel",
              primary: false,
              onClick: () => setOpenClosePopup(false),
              disabled: loading,
            },
          ]}
        />
      )}
    </>
  );
};

const Popup = React.memo(({ title, text, buttons }) => (
  <div className="shop-page-popup-overlay">
    <div className="shop-page-popup-card">
      <div className="shop-page-popup-pointer"></div>
      <h2 className="shop-page-popup-title">{title}</h2>
      {text ? <p className="shop-page-popup-text">{text}</p> : null}
      <div className="shop-page-popup-buttons">
        {buttons.map((btn, index) => (
          <button
            key={index}
            className={
              btn.primary
                ? "shop-page-popup-button-primary"
                : "shop-page-popup-button-secondary"
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
));

export default React.memo(Profile);