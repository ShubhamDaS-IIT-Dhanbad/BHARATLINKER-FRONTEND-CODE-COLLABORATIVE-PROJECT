import React, { memo, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import HomePageNavbar from '../navbar.jsx';
import HomeTestimonial from './homeTestimonial.jsx';
import { AiFillShop } from "react-icons/ai";
import { AiFillProduct } from "react-icons/ai";
import { RiHome3Fill } from "react-icons/ri";
import { TbCircleLetterBFilled } from "react-icons/tb";
import HowItWorks from './howItWorks.jsx';
import './home.css'

const ti1 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737378115/ptnykpibqxqobs3gywoq.png';
const Home = () => {
    const navigate = useNavigate();
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
            }}>
                <HomeTestimonial ti1={ti1} />
            </div>
            <div id="home-footer-1">
                <div
                    onClick={() => navigate('/')}
                    className='home-footer-div'
                >
                    <div
                        className='home-footer-div-icon'
                        id='home-footer-div-home-icon'>
                        <RiHome3Fill size={20} /></div>
                </div>
                <FooterButton icon={<AiFillProduct size={20} />} label="Products" onClick={() => navigate('/search')} />
                <FooterButton icon={<AiFillShop size={20} />} label="Shop" onClick={() => navigate('/shop')} />
                <FooterButton icon={<TbCircleLetterBFilled size={20} />} label="bharat linker" onClick={() => navigate('/')} />

            </div>
           <HowItWorks/>
        </>
    );
};

const FooterButton = memo(({ icon, onClick }) => (
    <div
        onClick={onClick}
        className='home-footer-div'
    >
        <div
            className='home-footer-div-icon'>
            {icon}</div>
    </div>
));

export default memo(Home);