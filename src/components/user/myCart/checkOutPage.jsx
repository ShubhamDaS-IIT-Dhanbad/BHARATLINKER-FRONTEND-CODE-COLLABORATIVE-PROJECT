import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { FaAngleLeft } from "react-icons/fa6";
import OrderProductCard from './cartCard.jsx';
import { placeOrderProvider } from '../../../appWrite/order/order.js';
import handleSendEmail from '../../../appWrite/services/emailServiceToShop.js';
import { removeFromUserCart } from '../../../redux/features/user/cartSlice.jsx';
import './checkOutPage.css';

function CheckOutPage({ userData, items, deliveryAddress, setDeliveryAddress, setShowCheckOutPage, setShowAddressDetail }) {
  const dispatch = useDispatch();
  console.log(items, "here");
  const totalPrice = items.reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0);
  const totalSaved = items.reduce((acc, item) => acc + (item.price - item.discountedPrice) * item.quantity, 0);

  const [placingOrder, setPlacingOrder] = useState(false);

  // Function to handle order placing with optimized email sending
  async function placeOrder() {
    setPlacingOrder(true);
    try {
      // Group items by shopId
      const shopOrders = items.reduce((acc, item) => {
        const shopId = item.shopId || 'unknown';
        if (!acc[shopId]) {
          acc[shopId] = {
            shopEmail: item.shopEmail,
            items: [],
            orderIds: [],
          };
        }
        acc[shopId].items.push(item);
        return acc;
      }, {});

      // Place orders and collect order IDs
      for (const shopId in shopOrders) {
        const shopData = shopOrders[shopId];
        for (const item of shopData.items) {
          const order = await placeOrderProvider({
            userId: userData.userId,
            shopId: item.shopId,
            productId: item.productId,
            quantity: Number(item.quantity),
            price: Number(item.price),
            discountedPrice: Number(item.discountedPrice),
            shopEmail: item.shopEmail,
            image: item.productImage,
            title: item.title,
            address: deliveryAddress.address,
            latitude: deliveryAddress.lat,
            longitude: deliveryAddress.long,
            name: userData.name || "user",
            phoneNumber: userData.phoneNumber,
            houseNo: deliveryAddress.buildingNo,
            building: deliveryAddress.houseNo,
            landMark: deliveryAddress.landmark
          });
          shopData.orderIds.push(order.$id);
          dispatch(removeFromUserCart({ productId: item.productId, cartId: item.$id }));
        }
      }

      // Send one email per shop with bundled order data
      for (const shopId in shopOrders) {
        const { shopEmail, items: shopItems, orderIds } = shopOrders[shopId];
        const orderDetails = shopItems.map(item => ({
          orderId: orderIds[shopItems.indexOf(item)], // Match order ID with item
          image: item.productImage,
          title: item.title,
          quantity: Number(item.quantity),
          price: Number(item.price),
          discountedPrice: Number(item.discountedPrice),
        }));

        await handleSendEmail({
          to: shopEmail,
          type: 'orderPlaced',
          orderIds: orderIds.join(', '), // Comma-separated list of order IDs
          orderDetails, // Array of item details
          address: deliveryAddress.address,
          phoneNumber: userData.phoneNumber,
        }).catch(err => console.error(`Error sending email to ${shopEmail}:`, err));
      }

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
                <OrderProductCard key={item.productId} productId={item.productId} order={item} />
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
              <button className="proceed-to-payment-btn" onClick={placeOrder} disabled={placingOrder}>
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