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
    <div className="add-to-cart-tab">
      <div className="cart-info">
        <div className="cart-icon">
          <FaCartShopping size={19} className="shopping-cart" />
        </div>
        
        <div className="cart-details">
          <span className="item-count">
            {totalQuantity} item{totalQuantity > 1 ? 's' : ''}
          </span>
          <span className="total-price">₹ {totalPrice}</span>
        </div>
      </div>

      <div
        onClick={handleViewCart}
        className={`view-cart-button ${totalQuantity > 0 ? '' : 'disabled'}`}
      >
        View Cart <FaCaretRight size={20} />
      </div>
    </div>
  );
};

export default AddToCartTab;
