import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { TbShoppingCartHeart } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { RiLogoutCircleLine } from "react-icons/ri";
import { GrDocumentImage } from "react-icons/gr";
import { MdMyLocation } from "react-icons/md";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import i1 from './asset/r1.png';
import './style/shopHome.css';

const Profile = ({ shopData }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(shopData.isopend);
  const [isLocationHas, setIsLocationHas] = useState(!shopData.location);

  return (
    <>
      <header>
        <div className="shop-home-1">
          <button className="shop-home-back-btn" onClick={() => navigate('/')}>
            <FaChevronLeft />
          </button>
          <span>DASHBOARD</span>
          <button className="shop-home-header-t2" onClick={() => navigate('/shop/orders')}>
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
            <span className="shop-home-profile-header-shop-name">ARCHANA DRESSES</span>
            <span className="shop-home-profile-header-store">OWN E-COMMERCE PLATFORM</span>
          </div>
          <div className="info-box">
            "Just like <strong>Bharat</strong> is rising as a global powerhouse, stay ahead in the competitive e-commerce market—innovate, adapt, and lead the way!" 🚀🔥
          </div>
          <div className="menu">
            {[
              { icon: <MdOutlineAdminPanelSettings size={26} />, label: 'SHOP DATA', path: '/shopdata' },
              { icon: <MdMyLocation size={24} />, label: 'SHOP LOCATION', path: '/secure/shop/address' },
              { icon: <GrDocumentImage size={22} />, label: 'UPLOAD HERE', path: '/upload' },
              { icon: <AiOutlineProduct size={26} />, label: 'ALL PRODUCT', path: '/product' },
              { icon: <RiLogoutCircleLine size={22} />, label: 'LOG - OUT', path: '/logout' },
              {
                icon: isOpen ? <FaDoorOpen size={26} /> : <FaDoorClosed size={26} />,
                label: isOpen ? 'OPENED' : 'CLOSED',
                path: '#'
              }
            ].map((item, index) => (
              <div
                className="menu-item"
                key={index}
                onClick={() => item.path !== '#' && navigate(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {!isLocationHas && (
        <div className="shop-page-popup-overlay">
          <div className="shop-page-popup-card">
            <div className="shop-page-popup-pointer"></div>
            <h2 className="shop-page-popup-title">Select your shop location</h2>
            <p className="shop-page-popup-text">
              We need your shop's location to provide a curated assortment from the nearest store.
            </p>
            <div className="shop-page-popup-buttons">
              <button className="shop-page-popup-button-primary" onClick={() => {}}>
                Use current location
              </button>
              <button className="shop-page-popup-button-secondary">Set manually</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
