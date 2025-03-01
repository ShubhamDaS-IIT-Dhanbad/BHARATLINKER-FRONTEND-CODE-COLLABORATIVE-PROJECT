import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import Navbar from '../navbar.jsx';
import { fetchUserOrders, loadMoreOrders } from "../../../redux/features/user/orderSlice.jsx";
import OrderProductCard from "./orderProductCard";
import UserOrderDetail from '../orderDetail/orderDetail.jsx';
import e1 from './e1.png';
import "./order.css";

const Order = ({ userData }) => {
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  const { 
    loading,
    orders,
    hasMore,
    currentPage,
    error
  } = useSelector((state) => state.userorders);

  const fetchInitialOrders = useCallback(async () => {
    if (!userData?.phoneNumber) return;
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    
    try {
      await dispatch(fetchUserOrders({ 
        phoneNumber: userData.phoneNumber,
        page: 1 
      })).unwrap();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch initial orders:', err);
      }
    }
  }, [userData, dispatch]);

  const fetchNextPage = useCallback(async () => {
    if (!userData?.phoneNumber || !hasMore || loading) return;
    const nextPage = currentPage + 1;
    
    try {
      await dispatch(loadMoreOrders({ 
        phoneNumber: userData.phoneNumber, 
        page: nextPage 
      })).unwrap();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to load more orders:', err);
      }
    }
  }, [userData, dispatch, hasMore, currentPage, loading]);

  useEffect(() => {
    const handlePopState = () => {
      if (order) {
        setOrder(null);
      } else {
        navigate('/user');
      }
    };

    window.addEventListener('popstate', handlePopState);

    if (userData?.phoneNumber && orders.length === 0) {
      fetchInitialOrders();
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      abortControllerRef.current?.abort();
    };
  }, [userData, fetchInitialOrders, order, navigate]);

  // Define onImageClick handler
  const handleImageClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderOrders = () => {
    if (loading && orders.length === 0) {
      return (
        <div className="user-order-loading">
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

    if (error) {
      return (
        <div className="user-order-error">
          <p>Error: {error}</p>
          <button 
            onClick={fetchInitialOrders}
            className="user-order-retry-btn"
          >
            Retry
          </button>
        </div>
      );
    }
    
    if (orders.length === 0) {
      return (
        <div className="user-order-empty">
          <img className="user-order-empty-img" src={e1} alt="No Orders" />
          <p>No orders found</p>
        </div>
      );
    }

    return orders.map((orderItem) => (
      <OrderProductCard
        key={orderItem.$id}
        order={orderItem}
        setOrder={setOrder}
        onImageClick={() => handleImageClick(orderItem.productId)} // Added prop
      />
    ));
  };

  return (
    <>
      {order ? (
        <UserOrderDetail
          userData={userData}
          order={order}
          onImageClick={() => handleImageClick(order.productId)}
          setOrder={setOrder}
        />
      ) : (
        <>
          <header>
            <Navbar userData={userData} headerTitle="YOUR ORDERS" />
          </header>

          <InfiniteScroll
            dataLength={orders.length}
            next={fetchNextPage}
            hasMore={hasMore}
            loader={
              loading && orders.length > 0 && (
                <div className="user-order-loading-more">
                  <Oval 
                    height={20} 
                    width={20} 
                    color="green" 
                    secondaryColor="white" 
                    ariaLabel="loading-more" 
                  />
                </div>
              )
            }
            endMessage={
              orders.length > 0 && !hasMore && (
                <p className="user-order-end">
                  ...
                </p>
              )
            }
          >
            <div className="user-order-div-container">
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