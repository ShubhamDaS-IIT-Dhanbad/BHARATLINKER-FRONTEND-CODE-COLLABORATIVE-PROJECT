import React, { useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePageNavbar from './homeNavBar';

import { MdOutlineStore } from "react-icons/md";
import { RiSunCloudyLine } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import bh2 from '../../assets/i1.avif';


// import ExploreByCategories from '../homePageComponent/exploreByCategory';
// import ShopByStore from '../homePageComponent/shopByStore.jsx';
import HomeFooter from './homeFooter.jsx';
import HomeTestimonial from './homeTestimonial.jsx';
import HomeAboutUs from './homeAboutUs.jsx';

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
        navigate(retailerCookie ? '/retailer/home' : '/retailer');
    }, [navigate]);

    return (
        <>
            <HomePageNavbar />

            <div id="home-div" ref={containerRef}>
                {/* <div  id="home-div-img-div">
                    <img src={bh2} style={{height:"60vh"}}/>
                </div> */}
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
                    label="Retailer"
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
