import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { fetchOrdersByStatus, loadMoreOrders } from "../../../redux/features/retailer/orderSlice";
import OrderProductCard from "./orderProductCard";
import e1 from './e1.png';

import { FaChevronLeft } from "react-icons/fa";
import "./order.css";

function Order({ shopData }) {
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
  const loading = orderStates[selectedOrderType].loading;

  const fetchInitialOrders = (status) => {
    const shopId = shopData?.shopId;
    if (!shopId) return;
    dispatch(fetchOrdersByStatus({ shopId, status, page: 1 }));
  };

  const fetchNextPage = () => {
    const shopId = shopData?.shopId;
    if (!shopId) return;
    const nextPage = selectedOrders.currentPage + 1;
    dispatch(loadMoreOrders({ shopId, status: selectedOrderType, page: nextPage }));
  };

  useEffect(() => {
    if (shopData?.shopId) {
      if (pendingOrders.data.length === 0) fetchInitialOrders("pending");
      if (confirmedOrders.data.length === 0) fetchInitialOrders("confirmed");
      if (deliveredOrders.data.length === 0) fetchInitialOrders("delivered");
      if (canceledOrders.data.length === 0) fetchInitialOrders("canceled");
    }
  }, [shopData]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedOrderType])
  return (
    <>
      {/* Header */}
      <header style={{position:"fixed",top:"0"}}>
        <div className="shop-order-1">
          <button className="shop-order-back-btn" onClick={() => navigate("/secure/shop")}>
            <FaChevronLeft />
          </button>
          <span>ORDER DETAILS</span>
        </div>
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
      </header>

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
          {selectedOrders.data.length === 0 && !loading? (
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
