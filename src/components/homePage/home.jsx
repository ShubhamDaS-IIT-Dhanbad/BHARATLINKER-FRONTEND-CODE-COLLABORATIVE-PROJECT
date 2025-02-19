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
            <div id="home-footer" style={{
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                height: '60px',
                backgroundColor: '#f9f9f9',
                position: 'fixed',
                bottom: '0',
                zIndex: '100'
            }}>
                <FooterButton icon={<RiSunCloudyLine size={37} />} label="Home" onClick={() => navigate('/')} />
                <FooterButton icon={<TbCategoryPlus size={37} />} label="Products" onClick={() => navigate('/search')} />
                <FooterButton icon={<MdOutlineStore size={37} />} label="Shop" onClick={() => navigate('/shop')} />
                <FooterButton icon={<MdOutlineAdminPanelSettings size={37} />} label="Retailer" onClick={handleRetailerClick} />
            </div>

        </>
    );
};

const FooterButton = memo(({ icon, label, onClick }) => (
    <div style={{
        width: '65px',
        height: '55px',
        fontWeight: '600',
        fontSize: '1rem',
        color: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '7px',
        marginBottom: '5px'
    }} onClick={onClick}>

        {icon}
        {label}
    </div>
));

export default memo(Home);
