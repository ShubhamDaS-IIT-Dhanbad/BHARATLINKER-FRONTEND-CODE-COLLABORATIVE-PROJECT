import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaArrowLeft } from 'react-icons/fa';
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { fetchOrdersByStatus, loadMoreOrders } from "../../../redux/features/user/orderSlice.jsx";
import OrderProductCard from "./orderProductCard";
import e1 from './e1.png';

import "./order.css";

function Order({ userData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    canceledOrders,
  } = useSelector((state) => state.userorders);

  // State to track selected order type
  const [selectedOrderType, setSelectedOrderType] = useState("pending");
  const orderStates = {
    pending: pendingOrders,
    confirmed: confirmedOrders,
    delivered: deliveredOrders,
    canceled: canceledOrders,
  };

  const selectedOrders = orderStates[selectedOrderType];

  const fetchInitialOrders = (status) => {
    const userId = userData?.$id;
    if (!userId) return;
    dispatch(fetchOrdersByStatus({ userId, status, page: 1 }));
  };

  const fetchNextPage = () => {
    const userId = userData?.$id;
    if (!userId) return;
    const nextPage = selectedOrders.currentPage + 1;
    dispatch(loadMoreOrders({ userId, status: selectedOrderType, page: nextPage }));
  };

  useEffect(() => {
    if (userData?.$id) {
      if (pendingOrders.data.length === 0) fetchInitialOrders("pending");
      if (confirmedOrders.data.length === 0) fetchInitialOrders("confirmed");
      if (deliveredOrders.data.length === 0) fetchInitialOrders("delivered");
      if (canceledOrders.data.length === 0) fetchInitialOrders("canceled");
    }
  }, [userData]);
  useEffect(()=>{
    window.scrollTo(0,0);
  },[selectedOrderType])
  return (
    <>
      {/* Header */}
      <div className="retailer-update-header">
        <FaArrowLeft
          id="retailer-update-header-left-icon"
          size={25}
          onClick={() => navigate('/user')}
          aria-label="Back to retailer home"
          tabIndex={0}
        />
        <div className="retailer-update-header-inner-div">
          <p className="retailer-update-header-inner-div-p">
            ORDER DETAILS
          </p>
          {userData?.phoneNumber && (
            <div className="retailer-upload-product-header-shopname" aria-label="Change Location" tabIndex={0}>
              {userData?.phoneNumber}
            </div>
          )}
        </div>
      </div>

      {/* Order Type Buttons */}
      <div className="retailer-order-type-buttons">
        {["pending", "confirmed", "delivered", "canceled"].map((type) => (
          <div
            key={type}
            className={`retailer-order-type-button ${selectedOrderType === type ? "active" : ""}`}
            onClick={() => setSelectedOrderType(type)}
          >
            {type.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Infinite Scroll for Orders */}
      <InfiniteScroll
        dataLength={selectedOrders.data.length}
        next={fetchNextPage}
        hasMore={selectedOrders.hasMore}
        loader={
          <div className="retailer-order-loading">
            <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
          </div>
        }
      >
        <div className="retailer-order-div-container">
          {selectedOrders.data.length === 0? (
            <div className="retailer-order-empty">
              <img className="retailer-order-empty-img" src={e1} alt="No Orders" />
            </div>
          ) : (
            selectedOrders.data.map((order) => (
              <OrderProductCard order={order} key={order.$id} />
            ))
          )}
        </div>
      </InfiniteScroll>
    </>
  );
}

export default Order;
