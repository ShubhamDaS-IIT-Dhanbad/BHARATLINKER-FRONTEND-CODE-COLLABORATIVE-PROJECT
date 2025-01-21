import React, { memo, useCallback,useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import HomePageNavbar from '../a.navbarComponent/navbar.jsx';
import HomeFooter from './homeFooter.jsx';
import HomeTestimonial from './homeTestimonial.jsx';

import { MdOutlineStore } from "react-icons/md";
import { RiSunCloudyLine } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import Cookie from 'js-cookie';

const Home = () => {
    const navigate = useNavigate();

    const handleRetailerClick = useCallback(() => {
        const retailerCookie = Cookie.get('BharatLinkerShopData');
        if (retailerCookie) {
            const shopData = JSON.parse(retailerCookie);
            const path = shopData.registrationStatus === 'pending' ? '/retailer/pending' :
                shopData.registrationStatus === 'rejected' ? '/retailer/rejected' : '/retailer';
            navigate(path);
        } else {
            navigate('/retailer/login');
        }
    }, [navigate]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HomePageNavbar headerTitle={"Bharat | Linker"}/>
            <div id="home-div" style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgb(255, 255, 255)',
                marginTop: '99px',
                maxWidth: '100vw',
                marginBottom: '60px'
            }}>
                <HomeTestimonial />
                <HomeFooter />
            </div>
            <div id="home-footer" style={{
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                height: '60px',
                backgroundColor: 'rgb(255, 255, 255)',
                position: 'fixed',
                bottom: '0',
                zIndex: '1000'
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
