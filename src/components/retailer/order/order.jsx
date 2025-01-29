import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaArrowLeft } from 'react-icons/fa';
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { fetchOrdersByStatus, loadMoreOrders } from "../../../redux/features/retailer/orderSlice";
import OrderProductCard from "./orderProductCard";
import e1 from './e1.png';

import "./order.css";

function Order({ retailerData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    canceledOrders,
  } = useSelector((state) => state.retailerorders);

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
    const shopId = retailerData?.$id;
    if (!shopId) return;
    dispatch(fetchOrdersByStatus({ shopId, status, page: 1 }));
  };

  const fetchNextPage = () => {
    const shopId = retailerData?.$id;
    if (!shopId) return;
    const nextPage = selectedOrders.currentPage + 1;
    dispatch(loadMoreOrders({ shopId, status: selectedOrderType, page: nextPage }));
  };

  useEffect(() => {
    if (retailerData?.$id) {
      if (pendingOrders.data.length === 0) fetchInitialOrders("pending");
      if (confirmedOrders.data.length === 0) fetchInitialOrders("confirmed");
      if (deliveredOrders.data.length === 0) fetchInitialOrders("delivered");
      if (canceledOrders.data.length === 0) fetchInitialOrders("canceled");
    }
  }, [retailerData]);

  return (
    <>
      {/* Header */}
      <div className="retailer-update-header">
        <FaArrowLeft
          id="retailer-update-header-left-icon"
          size={25}
          onClick={() => navigate('/retailer')}
          aria-label="Back to retailer home"
          tabIndex={0}
        />
        <div className="retailer-update-header-inner-div">
          <p className="retailer-update-header-inner-div-p">
            ORDER DETAILS
          </p>
          {retailerData?.shopName && (
            <div className="retailer-upload-product-header-shopname" aria-label="Change Location" tabIndex={0}>
              {retailerData?.shopName?.toUpperCase()}
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
          {selectedOrders.data.length === 0 ? (
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
