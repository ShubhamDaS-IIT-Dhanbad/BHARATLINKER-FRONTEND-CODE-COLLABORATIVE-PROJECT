import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../retailerStyles/retailer.css'

import Cookies from 'js-cookie'; 

import Skeleton from 'react-loading-skeleton'; // Import skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton styles

const Retailer = () => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Add loading state

    const retailerimg='http://res.cloudinary.com/dthelgixr/image/upload/v1727870088/hd7kcjuz8jfjajnzmqkp.webp';
    const images = [retailerimg, retailerimg, retailerimg, retailerimg];

    // Check if BharatLinkerRetailerData cookie is present
    useEffect(() => {
        const retailerData = Cookies.get('BharatLinkerRetailerData'); // Fetch cookie
        if (retailerData) {
            navigate('/retailer/shop'); // Redirect to home if cookie is found
        } else {
            setLoading(false); // Set loading to false after checking for cookie
        }
    }, [navigate]); // Ensure useEffect runs on mount

    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {loading ? (
                // Show skeleton loaders while loading
                <div style={{ marginBottom: '20px' }}>
                    <Skeleton height={300} width={'100%'} />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        {images.map((_, index) => (
                            <Skeleton key={index} circle={true} height={10} width={10} style={{ margin: '0 5px' }} />
                        ))}
                    </div>
                    <Skeleton height={40} width={'10%'} style={{ margin: '20px auto' }} />
                    <Skeleton height={20} width={'80%'} style={{ margin: '10px auto' }} />
                    <Skeleton height={40} width={'30%'} style={{ margin: '10px auto' }} />
                    <Skeleton height={40} width={'30%'} style={{ margin: '10px auto' }} />
                </div>
            ) : (
                <>
                    <div className="image-slider">
                        <img src={images[currentImageIndex]} alt="Teamwork" style={{ width: '100%', height: 'auto' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        {images.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => handleDotClick(index)}
                                style={{
                                    display: 'inline-block',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: index === currentImageIndex ? '#000' : '#ddd',
                                    margin: '0 5px',
                                    cursor: 'pointer',
                                }}
                            ></span>
                        ))}
                    </div>

                    <h1 style={{ fontSize: '2em', margin: '20px 0' }}>Bharat | Linker</h1>
                    <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>
                        Simplify the way you manage your shop. Join us and streamline your retail business with ease and efficiency.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' ,
                    marginTop:"90px"
                        
                    }}>
                        <button
                            onClick={() => navigate('/retailer/login')}
                            className="retailer-page-login-button"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => navigate('/retailer/signup')}
                            className="retailer-page-signup-button"
                        >
                            Register
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Retailer;
