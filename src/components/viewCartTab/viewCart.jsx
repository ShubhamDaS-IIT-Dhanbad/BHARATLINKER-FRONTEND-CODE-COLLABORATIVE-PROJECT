import React from 'react';
import './viewCart.css';
import { IoMdCart } from "react-icons/io";
import { FaCaretRight } from "react-icons/fa";

const AddToCartTab = ({ cart, onViewCart }) => {
  if (!Array.isArray(cart)) {
    console.error("Cart is not an array:", cart);
    return null; // or you can return an empty state or fallback UI
  }

  // Calculate total discounted price and total count
  const totalPrice = cart.reduce((acc, item) => acc + item.discountedPrice * item.count, 0);
  const totalCount = cart.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="add-to-cart-tab">
      <div className="cart-info">
        <div className="cart-icon">
          <IoMdCart size={25} className="shopping-cart" />
        </div>
        <div className="cart-details">
          <span className="item-count">
            {totalCount} item{totalCount > 1 ? 's' : ''}
          </span>
          <span className="total-price">₹ {totalPrice}</span>
        </div>
      </div>

      <div className="view-cart-button" onClick={onViewCart}>
        View Cart <FaCaretRight size={25} />
      </div>
    </div>
  );
};

export default AddToCartTab;
