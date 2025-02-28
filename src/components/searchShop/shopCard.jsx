import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./shopCard.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function ShopCard({ shop }) {
    const navigate = useNavigate();
    const [showAddress, setShowAddress] = useState(false);

    // Fixed: Added error handling for shop.shopImages
    const urlParts = shop?.shopImages?.[0]?.split('/') || [];
    const publicIdWithExtension = urlParts[urlParts.length - 1] || '';
    const publicId = publicIdWithExtension.split('@X@XX@X@')[1] || '';

    const shopImageUrl = shop?.shopImages?.[0] 
        ? `https://bharatlinker.publit.io/file/${publicId}` 
        : 'https://via.placeholder.com/300x180';
    const shopDisplayName = shop?.shopName || 'Shop Name';

    const toggleAddress = () => {
        setShowAddress(!showAddress);
    };

    const handleCardClick = () => {
        navigate(`/shop/${shop.$id}`, { state: { fromShopCard: true } });
    };

    return (
        <div className="shop-card-container">
            <div className="shop-card-header" onClick={handleCardClick}>
                <LazyLoadImage
                    className="shop-card-image"
                    src={shopImageUrl}
                    alt={shopDisplayName}
                    effect="fadeIn" // Changed from blur to fadeIn since blur.css is imported
                    loading="lazy"  
                />
            </div>

            <div className='shop-card-details'>
                <span className='shop-card-name'>{shopDisplayName.toUpperCase()}</span>

                <div className="shop-card-info">
                    <div className="shop-card-divider"></div>
                    <div className="shop-card-address-toggle" onClick={toggleAddress}>
                        {/* Fixed: Removed unnecessary fragment and simplified conditional */}
                        <div>{shop?.category?.length > 0 ? shop.category.toUpperCase() : 'About'}</div>
                        {showAddress ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </div>

                    {showAddress && (
                        <div className="shop-card-address">
                            Address:
                            <p>{shop?.address || 'No address available'}</p>
                        </div>
                    )}

                    <div className="shop-card-divider"></div>
                </div>
            </div>
        </div>
    );
}

export default ShopCard;