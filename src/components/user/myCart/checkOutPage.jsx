import React, { useState } from 'react';
import { FaAngleLeft } from "react-icons/fa6";
import OrderProductCard from './cartCard.jsx';
import { placeOrderProvider } from '../../../appWrite/order/order.js';
import handleSendEmail from '../../../appWrite/services/emailServiceToShop.js';
import './checkOutPage.css';

function CheckOutPage({ userData, items, deliveryAddress, setDeliveryAddress, setShowCheckOutPage, setShowAddressDetail }) {
  const totalPrice = items.reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0);
  const totalSaved = items.reduce((acc, item) => acc + (item.price - item.discountedPrice) * item.quantity, 0);
  
  const [placingOrder, setPlacingOrder] = useState(false);

  // Function to handle order placing
  async function placeOrder() {
    setPlacingOrder(true);

    try {
      // Use a for...of loop to handle each item asynchronously
      for (const item of items) {
        // Place order in the backend for each item
        const order = await placeOrderProvider({
          userId: userData.$id,
          shopId: item.shopId,
          productId: item.productId,
          quantity: Number(item.quantity),
          price: Number(item.price),
          discountedPrice: Number(item.discountedPrice),
          shopEmail: item.shopEmail,
          image: item.image,
          title: item.title,
          address: deliveryAddress.address,
          lat: deliveryAddress.lat,
          long: deliveryAddress.long,
          name: userData.name,
          phoneNumber: userData.phoneNumber,
        });

        // Send email asynchronously for each item (don't wait for email sending to complete)
        handleSendEmail({
          to: item.shopEmail,
          type: 'orderPlaced', // Assuming 'orderPlaced' is the correct type here
          orderId: order.$id,
          image: item.image,
          title: item.title,
          address: deliveryAddress.address,
          phoneNumber: userData.phoneNumber,
          quantity: Number(item.quantity),
          price: Number(item.price),
          discountedPrice: Number(item.discountedPrice),
        }).catch(err => {
          console.error("Error sending email for item: ", item.title, err);
        });
      }

      // After placing the order, show success and hide the checkout page
      alert('Order Placed Successfully!');
      setShowCheckOutPage(false);
      setShowAddressDetail(false);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an issue placing your order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <>
      {/* Header */}
      <header>
        <div className="saved-location-header">
          <FaAngleLeft
            className="back-icon"
            onClick={() => {
              setDeliveryAddress(null);
              setShowCheckOutPage(false);
              setShowAddressDetail(false);
            }}
          />
          <h2>Check Out</h2>
        </div>
      </header>

      <div className="checkout-page">
        <div className="checkout-main">
          <div className="cart-items-section">
            <div className="cart-items-container">
              {items.map((item) => (
                <OrderProductCard
                  key={item.productId}
                  productId={item.productId}
                  order={item}
                />
              ))}
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h3>Order Summary</h3>
              <div className="price-details">
                <div className="price-row">
                  <span>Total MRP</span>
                  <span>{totalPrice.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Discount on MRP</span>
                  <span className="discount">-{totalSaved.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Shipping Fee</span>
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="total-price-row">
                  <span>Total Amount</span>
                  <span>{totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="proceed-to-payment-btn"
                onClick={placeOrder}
                disabled={placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>

            {/* Shipping Address Section */}
            <div className="shipping-address-card">
              <h3>Shipping Address</h3>
              <div className="address-details">
                <p><strong>Address:</strong> {deliveryAddress?.address}</p>
                <p><strong>Building No:</strong> {deliveryAddress?.buildingNo}</p>
                <p><strong>House No:</strong> {deliveryAddress?.houseNo}</p>
                <p><strong>Landmark:</strong> {deliveryAddress?.landmark}</p>
              </div>
              <button className="change-address-btn" onClick={() => setShowAddressDetail(true)}>
                Change Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckOutPage;
