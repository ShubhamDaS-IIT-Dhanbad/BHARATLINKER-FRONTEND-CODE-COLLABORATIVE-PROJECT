import React, { memo, useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import HomePageNavbar from '../navbar.jsx';
import HomeTestimonial from './homeTestimonial.jsx';

import { MdOutlineStore } from "react-icons/md";
import { RiSunCloudyLine } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import Cookie from 'js-cookie';

import './home.css'
const ti1 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737378115/ptnykpibqxqobs3gywoq.png';

const Home = () => {
    const navigate = useNavigate();
    const handleRetailerClick = useCallback(() => {
        const retailerCookie = Cookie.get('BharatLinkerShopData');
        if (retailerCookie) {
            const shopData = JSON.parse(retailerCookie);
            const path = shopData.registrationStatus === 'pending' ? '/retailer/pending' :
                shopData.registrationStatus === 'rejected' ? '/retailer/rejected' : '/secure/shop';
            navigate(path);
        } else {
            navigate('/secure/login');
        }
    }, [navigate]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <>
            <div id="productSearchPage-container-top">
                <HomePageNavbar headerTitle={"Bharat | Linker"} />
            </div>

            <div id="home-div" style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f9f9f9',
                marginTop: '99px',
                maxWidth: '100vw',
                marginBottom: '60px'
            }}>
                <HomeTestimonial ti1={ti1} />
            </div>
            <div id="home-footer-1">
                <FooterButton icon={<RiSunCloudyLine size={28} />} label="Home" onClick={() => navigate('/')} />
                <FooterButton icon={<TbCategoryPlus size={28} />} label="Products" onClick={() => navigate('/search')} />
                <FooterButton icon={<MdOutlineStore size={28} />} label="Shop" onClick={() => navigate('/shop')} />
                <FooterButton icon={<MdOutlineAdminPanelSettings size={28} />} label="Retailer" onClick={handleRetailerClick} />
            </div>

        </>
    );
};

const FooterButton = memo(({ icon, label, onClick }) => (
    <div
        onClick={onClick}
        className='home-footer-div'
    >
        <div
            className='home-footer-div-icon'>
            {icon}</div>
        <div
            className='home-footer-div-label'>
            {label}</div>
    </div>
));

export default memo(Home);
