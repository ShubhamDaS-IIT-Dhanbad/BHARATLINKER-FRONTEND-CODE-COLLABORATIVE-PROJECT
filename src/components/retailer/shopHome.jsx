import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaDoorClosed, FaDoorOpen, FaSpinner } from "react-icons/fa";
import { TbShoppingCartHeart } from "react-icons/tb";
import { MdOutlineAdminPanelSettings, MdMyLocation } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { RiLogoutCircleLine, RiLockPasswordLine } from "react-icons/ri";
import { GrDocumentImage } from "react-icons/gr";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import useRetailerAuthHook from "../../hooks/retailerAuthHook.jsx";
import Password from './password/password.jsx'; // Assuming this is the correct path
import i1 from "./asset/r1.png";
import "./style/shopHome.css";

const Profile = ({ shopData }) => {
  const navigate = useNavigate();
  const { updateShopCookie, logout } = useRetailerAuthHook();
  const [isOpen, setIsOpen] = useState(shopData.isShopOpen);
  const [showPopup, setShowPopup] = useState(!shopData.shopAddress);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [openClosePopup, setOpenClosePopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Added for Password component
  const [loading, setLoading] = useState(false);

  const handleOpenCloseToggle = useCallback(() => {
    setOpenClosePopup(true);
  }, []);

  const confirmOpenCloseToggle = useCallback(async () => {
    if (isOpen !== null) {
      setLoading(true);
      try {
        await updateShopCookie({ isShopOpen: !isOpen }, shopData.shopId);
        setIsOpen(!isOpen); // Update state only on success
      } catch (error) {
        console.error("Failed to update shop status:", error);
      } finally {
        setLoading(false);
        setOpenClosePopup(false);
        navigate('/secure/shop');
      }
    }
  }, [isOpen, updateShopCookie, shopData.shopId, navigate]);

  const handlePasswordClick = useCallback(() => {
    setShowPassword(true);
  }, []);

  const menuItems = useMemo(() => [
    { icon: <MdOutlineAdminPanelSettings size={26} />, label: "SHOP DATA", path: "/secure/shopdata" },
    { icon: <MdMyLocation size={24} />, label: "SHOP LOCATION", path: "/secure/shop/address" },
    { icon: <GrDocumentImage size={22} />, label: "UPLOAD HERE", path: "/secure/shop/upload" },
    { icon: <AiOutlineProduct size={26} />, label: "ALL PRODUCT", path: "/secure/retailer/products" },
    { icon: <RiLockPasswordLine size={26} />, label: "PASSWORD", path: "#", onClick: handlePasswordClick },
    { icon: <MdOutlineWorkspacePremium size={26} />, label: "SUBSCRIPTION", path: "/secure/shop/subscription" },
    { icon: <RiLogoutCircleLine size={22} />, label: "LOG - OUT", path: "#", onClick: () => setLogoutPopup(true) },
    {
      icon: isOpen ? <FaDoorOpen size={26} /> : <FaDoorClosed size={26} />,
      label: isOpen ? "OPENED" : "CLOSED",
      path: "#",
      onClick: handleOpenCloseToggle,
    },
  ], [isOpen, handleOpenCloseToggle, handlePasswordClick]);

  return (
    <>
      <header>
        <div className="shop-home-1">
          <button className="shop-home-back-btn" onClick={() => navigate("/")}>
            <FaChevronLeft />
          </button>
          <span>DASHBOARD</span>
          <button className="shop-home-header-t2" onClick={() => navigate("/secure/shop/orders")}>
            <TbShoppingCartHeart />
          </button>
        </div>
      </header>

      <main>
        <div className="shop-home-profile-container">
          <div className="shop-home-profile-header">
            <div className="shop-home-profile-header-pic-header">
              <img src={i1} className="shop-home-profile-header-pic" alt="Shop" />
            </div>
            <span className="shop-home-profile-header-shop-name">
              {shopData?.shopName.toUpperCase()}
            </span>
            <span className="shop-home-profile-header-store">OWN E-COMMERCE PLATFORM</span>
          </div>
          <div className="info-box">
            "Just like <strong>Bharat</strong> is rising as a global powerhouse, stay ahead in the competitive e-commerce market—innovate, adapt, and lead the way!" 🚀🔥
          </div>
          <div className="menu">
            {menuItems.map((item, index) => (
              <div
                className="menu-item"
                key={index}
                onClick={item.onClick ? item.onClick : () => navigate(item.path)}
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
          title="Select your shop location"
          text="We need your shop's location to provide a curated assortment from the nearest store."
          buttons={[
            { label: "Use current location", primary: true, onClick: () => {} }, // Add functionality if needed
            { label: "Set manually", primary: false, onClick: () => setShowPopup(false) }, // Example action
          ]}
        />
      )}

      {logoutPopup && (
        <Popup
          title="Are you sure you want to log out?"
          text=""
          buttons={[
            { label: "OK", primary: true, onClick: logout },
            { label: "Cancel", primary: false, onClick: () => setLogoutPopup(false) },
          ]}
        />
      )}

      {showPassword && (
        <Password shopId={shopData.shopId} showPassword={showPassword} setShowPassword={setShowPassword} />
      )}

      {openClosePopup && (
        <Popup
          title={!isOpen ? "Ready to Open Your Shop?" : "Close Shop for Now?"}
          text={`Are you sure you want to ${!isOpen ? "open" : "close"} your shop? This action will be visible to customers.`}
          buttons={[
            {
              label: loading ? <FaSpinner className="loading-spinner" /> : "Confirm",
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
      <p className="shop-page-popup-text">{text}</p>
      <div className="shop-page-popup-buttons">
        {buttons.map((btn, index) => (
          <button
            key={index}
            className={btn.primary ? "shop-page-popup-button-primary" : "shop-page-popup-button-secondary"}
            onClick={btn.onClick}
            disabled={btn.disabled}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  </div>
));

export default React.memo(Profile);