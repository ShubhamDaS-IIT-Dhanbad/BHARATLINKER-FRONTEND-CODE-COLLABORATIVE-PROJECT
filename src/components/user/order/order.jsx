import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import Navbar from '../navbar.jsx';
import { fetchOrdersByStatus, loadMoreOrders } from "../../../redux/features/user/orderSlice.jsx";
import OrderProductCard from "./orderProductCard";
import e1 from './e1.png';

import "./order.css";

function Order({ userData }) {
  const dispatch = useDispatch();
  const {
    loading,
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
    const phoneNumber = userData?.phoneNumber;
    if (!phoneNumber) return;
    dispatch(fetchOrdersByStatus({ phoneNumber, status, page: 1 }));
  };

  const fetchNextPage = () => {
    const phoneNumber = userData?.phoneNumber;
    if (!phoneNumber) return;
    const nextPage = selectedOrders.currentPage + 1;
    dispatch(loadMoreOrders({ phoneNumber, status: selectedOrderType, page: nextPage }));
  };

  useEffect(() => {
    if (userData?.phoneNumber) {
      ["pending", "confirmed", "delivered", "canceled"].forEach((status) => {
        if (orderStates[status].data.length === 0 && status==selectedOrderType) {
          console.log(`Fetching ${status} orders`);
          fetchInitialOrders(status);
        }
      });
    }
  }, [selectedOrderType]);
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedOrderType])
  return (
    <>
      {/* Header */}
      <header>
          <Navbar userData={userData} headerTitle={"YOUR ORDER"} />
      </header>

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
          {(selectedOrders.data.length === 0 && !loading) ? (
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
