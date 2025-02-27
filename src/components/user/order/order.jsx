// Order.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import Navbar from '../navbar.jsx';
import { fetchOrdersByStatus, loadMoreOrders } from "../../../redux/features/user/orderSlice.jsx";
import OrderProductCard from "./orderProductCard";
import UserOrderDetail from '../orderDetail/orderDetail.jsx';
import e1 from './e1.png';
import "./order.css";

const ORDER_TYPES = ["pending", "confirmed", "dispatched", "delivered", "canceled"]; // Added "dispatched" to match orderStates

const Order = ({ userData }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderType, setSelectedOrderType] = useState("pending");
  const dispatch = useDispatch();
  const { 
    loading,
    pendingOrders,
    confirmedOrders,
    dispatchedOrders,  // Changed from dispatchedOrders to match selector
    deliveredOrders,
    canceledOrders 
  } = useSelector((state) => state.userorders);

  const orderStates = {
    pending: pendingOrders,
    confirmed: confirmedOrders,
    dispatched: dispatchedOrders,  // Changed from dispatched to match ORDER_TYPES
    delivered: deliveredOrders,
    canceled: canceledOrders,
  };

  const selectedOrders = orderStates[selectedOrderType] || { 
    data: [], 
    hasMore: false, 
    currentPage: 0 
  };  // Added fallback for undefined state

  const fetchInitialOrders = useCallback((status) => {
    if (!userData?.phoneNumber) return;
    dispatch(fetchOrdersByStatus({ 
      phoneNumber: userData.phoneNumber, 
      status, 
      page: 1 
    }));
  }, [userData, dispatch]);

  const fetchNextPage = useCallback(() => {
    if (!userData?.phoneNumber || !selectedOrders.hasMore) return;
    const nextPage = selectedOrders.currentPage + 1;
    dispatch(loadMoreOrders({ 
      phoneNumber: userData.phoneNumber, 
      status: selectedOrderType, 
      page: nextPage 
    }));
  }, [userData, dispatch, selectedOrders, selectedOrderType]);

  useEffect(() => {
    if (userData?.phoneNumber && selectedOrders.data.length === 0) {
      fetchInitialOrders(selectedOrderType);
    }
  }, [selectedOrderType, userData, selectedOrders.data.length, fetchInitialOrders]);

  const renderOrders = () => {
    if (loading && selectedOrders.data.length === 0) {
      return (
        <div className="retailer-order-loading">
          <Oval 
            height={30} 
            width={30} 
            color="green" 
            secondaryColor="white" 
            ariaLabel="loading" 
            visible={true}
          />
        </div>
      );
    }
    
    if (selectedOrders.data.length === 0) {
      return (
        <div className="retailer-order-empty">
          <img className="retailer-order-empty-img" src={e1} alt="No Orders" />
        </div>
      );
    }

    return selectedOrders.data.map((order) => (
      <OrderProductCard
        key={order.$id}
        order={order}
        setSelectedOrderId={setSelectedOrderId}
      />
    ));
  };

  return (
    <>
      {selectedOrderId ? (
        <UserOrderDetail
          userData={userData}
          orderId={selectedOrderId}
          setSelectedOrderId={setSelectedOrderId}
        />
      ) : (
        <>
          <header>
            <Navbar userData={userData} headerTitle="YOUR ORDER" />
          </header>

          <div className="retailer-order-type-buttons">
            {ORDER_TYPES.map((type) => (
              <button
                key={type}
                className={`retailer-order-type-button ${selectedOrderType === type ? "active" : ""}`}
                onClick={() => setSelectedOrderType(type)}
                aria-label={`View ${type} orders`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <InfiniteScroll
            dataLength={selectedOrders.data.length}
            next={fetchNextPage}
            hasMore={selectedOrders.hasMore}
            loader={
              <div className="retailer-order-loading">
                <Oval
                  height={30}
                  width={30}
                  color="green"
                  secondaryColor="white"
                  ariaLabel="loading"
                  visible={true}
                />
              </div>
            }
           
          >
            <div className="retailer-order-div-container">
              {renderOrders()}
            </div>
          </InfiniteScroll>
        </>
      )}
    </>
  );
};

Order.propTypes = {
  userData: PropTypes.shape({
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
};

export default Order;