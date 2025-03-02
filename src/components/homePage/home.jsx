import React, { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePageNavbar from '../navbar.jsx';
import HomeTestimonial from './homeTestimonial.jsx';
import { AiFillShop } from "react-icons/ai";
import { AiFillProduct } from "react-icons/ai";
import { RiHome3Fill } from "react-icons/ri";
import { TbCircleLetterBFilled } from "react-icons/tb";
import Cookie from 'js-cookie';
import './home.css';

const ti1 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737378115/ptnykpibqxqobs3gywoq.png';

const Home = () => {
    const navigate = useNavigate();
    const [transitionTarget, setTransitionTarget] = useState(null);
    const [transitionPosition, setTransitionPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleNavigation = useCallback((path, targetId, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTransitionPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
        setTransitionTarget(targetId);
        setTimeout(() => {
            navigate(path);
            setTransitionTarget(null);
        }, 300); // Increased to 500ms to give more time for full-screen animation
    }, [navigate]);

    return (
        <>
            {transitionTarget && (
                <div 
                    className="full-screen-transition"
                    style={{
                        '--start-x': `${transitionPosition.x}px`,
                        '--start-y': `${transitionPosition.y}px`,
                    }}
                />
            )}
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
            <div id="home-footer-1" className={transitionTarget ? 'page-transition' : ''}>
                <div
                    onClick={(e) => handleNavigation('/', 'home-icon', e)}
                    className='home-footer-div'
                >
                    <div
                        className='home-footer-div-icon'
                        id='home-footer-div-home-icon'>
                        <RiHome3Fill size={28}/>
                    </div>
                </div>
                <FooterButton 
                    icon={<AiFillProduct size={28} />} 
                    label="Products" 
                    onClick={(e) => handleNavigation('/search', 'products-icon', e)}
                    isActive={transitionTarget === 'products-icon'}
                />
                <FooterButton 
                    icon={<AiFillShop size={28} />} 
                    label="Shop" 
                    onClick={(e) => handleNavigation('/shop', 'shop-icon', e)}
                    isActive={transitionTarget === 'shop-icon'}
                />
                <FooterButton 
                    icon={<TbCircleLetterBFilled size={28} />} 
                    label="bharat linker" 
                    onClick={(e) => handleNavigation('/', 'bharat-icon', e)}
                    isActive={transitionTarget === 'bharat-icon'}
                />
            </div>
        </>
    );
};

const FooterButton = memo(({ icon, label, onClick, isActive }) => (
    <div
        onClick={onClick}
        className='home-footer-div'
    >
        <div
            className='home-footer-div-icon'>
            {icon}
        </div>
    </div>
));

export default memo(Home);