import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./shopCard.css";

function ShopCard({ shop }) {
    const navigate = useNavigate();
    const [showAddress, setShowAddress] = useState(false);

    const shopImageUrl = shop.shopImages && shop.shopImages[0] ? shop.shopImages[0] : 'https://via.placeholder.com/300x180';
    const shopDisplayName = shop.shopName || 'Shop Name';

    const toggleAddress = () => {
        setShowAddress(!showAddress);
    };

    const handleCardClick = () => {
        navigate(`/shop/${shop.$id}`, { state: { fromShopCard: true } }); // Set fromShopCard to true
    };
      
    return (
        <div className="shop-card-container">
            <div className="shop-card-header" onClick={handleCardClick}>
                <img className="shop-card-image" src={shopImageUrl} alt={shopDisplayName} />
            </div>

            <div className='shop-card-details'>
                <span className='shop-card-name'>{shopDisplayName.toUpperCase()}</span>

                <div className="shop-card-info">
                    <div className="shop-card-divider"></div>
                    <div className="shop-card-address-toggle" onClick={toggleAddress}>
                        <div>{shop?.category?.length > 0 ? shop.category.toUpperCase() : <>About</>}</div>
                        {showAddress ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </div>

                    {showAddress && (
                        <div className="shop-card-address">
                            Address:
                            <p>{shop.address}</p>
                        </div>
                    )}

                    <div className="shop-card-divider"></div>
                </div>
            </div>
        </div>
    );
}

export default ShopCard;
