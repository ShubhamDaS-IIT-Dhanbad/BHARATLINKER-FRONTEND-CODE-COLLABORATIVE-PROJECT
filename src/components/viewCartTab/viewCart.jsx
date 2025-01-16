import React from 'react';
import './viewCart.css';
import { IoMdCart } from "react-icons/io";
import { FaCaretRight } from "react-icons/fa";
const AddToCartTab = ({ itemCount, totalPrice, onViewCart }) => {
  return (
    <div className="add-to-cart-tab">
      <div className="cart-info">
        <div className="cart-icon">
          <IoMdCart size={25} className="shopping-cart"/>
        </div>
        <div className="cart-details">
          <span className="item-count">1 item{itemCount > 1 ? 's' : ''}</span>
          <span className="total-price">₹ 417</span>
        </div>
      </div>

      <div className="view-cart-button" onClick={onViewCart}>
        View Cart < FaCaretRight size={25}/>

      </div>
    </div>
  );
};

export default AddToCartTab;


