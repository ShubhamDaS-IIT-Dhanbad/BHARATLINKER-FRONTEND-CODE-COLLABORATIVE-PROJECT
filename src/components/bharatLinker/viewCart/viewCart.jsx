import React from 'react';
import './viewCart.css';

import { FaCaretRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";

const AddToCartTab = ({totalQuantity,totalPrice}) => {
  const navigate = useNavigate();

  const handleViewCart = () => {
    if (totalQuantity > 0) {
      navigate("/user/cart");
    }
  };

  return (
    <div className="nbl-add-to-cart-tab">
      <div className="nbl-cart-info">
        <div className="nbl-cart-icon">
          <FaCartShopping size={19} className="nbl-shopping-cart" />
        </div>
        
        <div className="nbl-cart-details">
          <span className="nbl-item-count">
            {totalQuantity} item{totalQuantity > 1 ? 's' : ''}
          </span>
          <span className="nbl-total-price">₹ {totalPrice}</span>
        </div>
      </div>

      <div
        onClick={handleViewCart}
        className={`nbl-view-cart-button ${totalQuantity > 0 ? '' : 'disabled'}`}
      >
        Quick Cart <FaCaretRight size={20} />
      </div>
    </div>
  );
};

export default AddToCartTab;