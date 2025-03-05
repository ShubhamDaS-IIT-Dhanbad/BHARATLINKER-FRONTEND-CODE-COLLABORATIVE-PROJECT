import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillShop } from "react-icons/ai";
import { AiFillProduct } from "react-icons/ai";
import { RiHome3Fill } from "react-icons/ri";
import { TbCircleLetterBFilled } from "react-icons/tb";
import './home.css';

// Lazy load components
const HomePageNavbar = React.lazy(() => import('../navbar.jsx'));
const HomeTestimonial = React.lazy(() => import('./homeTestimonial.jsx'));
const HowItWorks = React.lazy(() => import('./howItWorks.jsx'));

const ti1 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737378115/ptnykpibqxqobs3gywoq.png';

// Custom hook to detect when an element is in view
const useInView = () => {
    const [isInView, setIsInView] = useState(false);
    const [ref, setRef] = useState(null);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect(); // Stop observing once visible
                }
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );

        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref]);

    return [setRef, isInView];
};

const Home = () => {
    const navigate = useNavigate();

    // Hooks to detect visibility
    const [navbarRef, navbarInView] = useInView();
    const [testimonialRef, testimonialInView] = useInView();
    const [howItWorksRef, howItWorksInView] = useInView();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div id="productSearchPage-container-top" ref={navbarRef}>
                {navbarInView && (
                    <React.Suspense fallback={<div></div>}>
                        <HomePageNavbar headerTitle={"Bharat | Linker"} />
                    </React.Suspense>
                )}
            </div>

            <div id="home-div" style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f9f9f9',
                marginTop: '99px',
                maxWidth: '100vw',
            }} ref={testimonialRef}>
                {testimonialInView && (
                    <React.Suspense fallback={<div></div>}>
                        <HomeTestimonial ti1={ti1} />
                    </React.Suspense>
                )}
            </div>

            <div id="home-footer-1">
                <div
                    onClick={() => navigate('/')}
                    className='home-footer-div'
                >
                    <div className='home-footer-div-icon' id='home-footer-div-home-icon'>
                        <RiHome3Fill size={20} />
                    </div>
                </div>
                <FooterButton 
                    icon={<AiFillProduct size={20} />} 
                    label="Products" 
                    onClick={() => navigate('/search')} 
                />
                <FooterButton 
                    icon={<AiFillShop size={20} />} 
                    label="Shop" 
                    onClick={() => navigate('/shop')} 
                />
                <FooterButton 
                    icon={<TbCircleLetterBFilled size={20} />} 
                    label="bharat linker" 
                    onClick={() => navigate('/bharatlinker/search')} 
                />
            </div>

            <div ref={howItWorksRef}>
                {howItWorksInView && (
                    <React.Suspense fallback={<div></div>}>
                        <HowItWorks />
                    </React.Suspense>
                )}
            </div>
        </>
    );
};

const FooterButton = memo(({ icon, onClick }) => (
    <div onClick={onClick} className='home-footer-div'>
        <div className='home-footer-div-icon'>{icon}</div>
    </div>
));

export default memo(Home);