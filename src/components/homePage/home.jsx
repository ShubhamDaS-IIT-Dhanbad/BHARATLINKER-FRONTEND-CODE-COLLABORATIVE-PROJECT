import React, { useRef, useCallback, memo,useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import HomePageNavbar from './homeNavBar';

import { MdOutlineStore } from "react-icons/md";
import { RiSunCloudyLine } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import HomeFooter from './homeFooter.jsx';
import HomeTestimonial from './homeTestimonial.jsx';

import './home.css';

const Home = () => {
    // Initialize ref with null, not true
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const getCookieValue = (cookieName) => {
        const name = `${cookieName}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let cookie of cookieArray) {
            cookie = cookie.trim();
            if (cookie.startsWith(name)) {
                return cookie.substring(name.length);
            }
        }
        return null;
    };

    const handleRetailerClick = useCallback(() => {
        const retailerCookie = getCookieValue('BharatLinkerRetailer');
        navigate(retailerCookie ? '/retailer/home' : '/retailer/login');
    }, [navigate]);

    return (
        <>
            <HomePageNavbar />

            <div id="home-div" ref={containerRef}>
                <HomeTestimonial/>
                <HomeFooter/>
            </div>

            <div id="home-footer">
                <FooterButton
                    icon={<RiSunCloudyLine size={37} />}
                    label="Home"
                    onClick={() => navigate('/')}
                />
                <FooterButton
                    icon={<TbCategoryPlus size={37} />}
                    label="Products"
                    onClick={() => navigate('/search')}
                />
                <FooterButton
                    icon={<MdOutlineStore size={37} />}
                    label="Shop"
                    onClick={() => navigate('/shop')}
                />
                <FooterButton
                    icon={<MdOutlineAdminPanelSettings size={37} />}
                    label="Admin"
                    onClick={handleRetailerClick}
                />
            </div>
        </>
    );
};

const FooterButton = memo(({ icon, label, onClick }) => (
    <div className="home-footer-shop" onClick={onClick}>
        {icon}
        {label}
    </div>
));

export default memo(Home);




