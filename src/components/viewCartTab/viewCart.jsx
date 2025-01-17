import React from 'react';
import './viewCart.css';
import { IoMdCart } from "react-icons/io";
import { FaCaretRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

import { LuRefreshCw } from "react-icons/lu";
const AddToCartTab = ({ cart,setShowMyCart ,checkProductInCartRefresh}) => {
  const navigate = useNavigate();



  
  if (!Array.isArray(cart)) {
    console.error("Cart is not an array:", cart);
    return null;
  }

  // Calculate total discounted price and total count
  const totalPrice = cart.reduce((acc, item) => acc + item.discountedPrice * item.count, 0);
  const totalCount = cart.reduce((acc, item) => acc + item.count, 0);

  const handleViewCart = () => {
    if (totalCount > 0) {
      setShowMyCart(true);
    }
  };

  return (
    <div className="add-to-cart-tab">
      <div className="cart-info">
        <div className="cart-icon">
          <LuRefreshCw onClick={()=>{checkProductInCartRefresh()}} size={25} className="shopping-cart" />
        </div>
        
        <div className="cart-details">
          <span className="item-count">
            {totalCount} item{totalCount > 1 ? 's' : ''}
          </span>
          <span className="total-price">₹ {totalPrice}</span>
        </div>
      </div>

      <div
        onClick={handleViewCart}
        className={`view-cart-button ${totalCount > 0 ? '' : 'disabled'}`}

      >
        View Cart <FaCaretRight size={25} />
      </div>
    </div>
  );
};

export default AddToCartTab;
