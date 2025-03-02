import React, { memo, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import HomePageNavbar from '../navbar.jsx';
import HomeTestimonial from './homeTestimonial.jsx';
import { AiFillShop } from "react-icons/ai";
import { AiFillProduct } from "react-icons/ai";
import { RiHome3Fill } from "react-icons/ri";
import { TbCircleLetterBFilled } from "react-icons/tb";

import './home.css'
const ti1 = 'https://res.cloudinary.com/demc9mecm/image/upload/v1737378115/ptnykpibqxqobs3gywoq.png';
import hl1 from '../../assets/hl1.png';
import hsp1 from '../../assets/hs1.png';

import hss1 from '../../assets/hss1.png';
import hpp1 from '../../assets/hpp1.jpg';
import hc1 from '../../assets/hc1.avif';

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



            <div className="how-it-works-container">
                <p>HOW IT WORKS</p>
                <div className="steps-container">
                    <div className="step-card">
                        <img src={hl1} style={{height:"90%"}} alt="Select location" className="step-icon" />
                        <div className="step-card-1">
                            <div className="step-card-1-1">Select Your Location</div>
                            <div className="step-card-1-2">
                                Choose the location where you want to search. You can also adjust the radius of your search from the selected location to refine your results.
                            </div>
                        </div>
                    </div>
                    <div className="step-card">
                        <img src={hsp1} style={{height:"90%"}} alt="Search products" className="step-icon" />
                        <div className="step-card-1">
                            <div className="step-card-1-1">Search for Products</div>
                            <div className="step-card-1-2">
                                Easily find the products you need by searching our extensive catalog. Search by name or category to quickly locate your desired items.
                            </div>
                        </div>
                    </div>
                    <div className="step-card">
                        <img src={hss1} style={{height:"90%"}} alt="Search shops" className="step-icon" />
                        <div className="step-card-1">
                            <div className="step-card-1-1">Search for Shops</div>
                            <div className="step-card-1-2">
                                Discover nearby shops with real-time status updates (open or closed) and access comprehensive shop information to make informed decisions.
                            </div>
                        </div>
                    </div>
                    <div className="step-card">
                        <img src={hc1} style={{height:"90%"}}  alt="Add to cart" className="step-icon" />
                        <div className="step-card-1">
                            <div className="step-card-1-1">Add Products to Cart</div>
                            <div className="step-card-1-2">
                                Select your desired products and add them to your cart for a seamless shopping experience. Review your items before proceeding to checkout.
                            </div>
                        </div>
                    </div>
                    <div className="step-card">
                        <img src={hpp1} style={{height:"90%"}}  alt="Place order" className="step-icon" />
                        <div className="step-card-1">
                            <div className="step-card-1-1">Place Your Order</div>
                            <div className="step-card-1-2">
                                Once your order is placed, it will be received by the shop owner who possesses the products. The shop will handle the delivery process to ensure your items arrive promptly.
                            </div>
                        </div>
                    </div>
                </div>
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
    </div>
));

export default memo(Home);