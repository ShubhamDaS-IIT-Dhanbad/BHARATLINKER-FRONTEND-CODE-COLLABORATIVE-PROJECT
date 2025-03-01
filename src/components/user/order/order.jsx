import React, { useEffect, useState, useCallback } from "react";
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    orders,
    hasMore,
    currentPage,
    error
  } = useSelector((state) => state.userorders);

  const fetchInitialOrders = useCallback(() => {
    if (!userData?.phoneNumber) return;
    dispatch(fetchUserOrders({ phoneNumber: userData.phoneNumber, page: 1 }));
  }, [userData?.phoneNumber, dispatch]);

  const fetchNextPage = useCallback(() => {
    if (!userData?.phoneNumber || !hasMore || loading) return;
    dispatch(loadMoreOrders({ phoneNumber: userData.phoneNumber, page: currentPage + 1 }));
  }, [userData?.phoneNumber, dispatch, hasMore, currentPage, loading]);

  const handleImageClick = useCallback((productId) => {
    if (!productId) {
      console.error('Product ID is missing');
      return;
    }
    try {
      navigate(`/product/${encodeURIComponent(productId)}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchInitialOrders();
  }, [fetchInitialOrders]);

  // Render orders
  const renderOrders = () => {
    if (loading && orders.length === 0) {
      return (
        <div className="user-order-loading">
          <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="user-order-error">
          <p>Error: {error}</p>
          <button onClick={fetchInitialOrders} className="user-order-retry-btn">
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
        setOrder={setSelectedOrder}
        onImageClick={() => handleImageClick(orderItem.productId)}
      />
    ));
  };

  return (
    <>
      {selectedOrder ? (
        <UserOrderDetail
          userData={userData}
          order={selectedOrder}
          onImageClick={() => handleImageClick(selectedOrder.productId)}
          setOrder={setSelectedOrder}
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
                  <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading-more" />
                </div>
              )
            }
            endMessage={
              orders.length > 0 && !hasMore && <p className="user-order-end">...</p>
            }
          >
            <div className="user-order-div-container">{renderOrders()}</div>
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