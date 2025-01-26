import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaArrowLeft } from 'react-icons/fa';
import "./order.css";
import { fetchOrdersByStatus, loadMoreOrders } from "../../../redux/features/retailer/orderSlice";

import OrderProductCard from "./orderProductCard";
import { useNavigate } from "react-router-dom";
function Order({ retailerData }) {
  const navigate=useNavigate();
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
    if (retailerData?.$id && pendingOrders.data.length == 0) fetchInitialOrders("pending");
    if (retailerData?.$id && confirmedOrders.data.length == 0) fetchInitialOrders("confirmed");
    if (retailerData?.$id && deliveredOrders.data.length == 0) fetchInitialOrders("delivered");
    if (retailerData?.$id && canceledOrders.data.length == 0) fetchInitialOrders("canceled");
  }, []);

  return (
    <>
      <div className="retailer-update-header">
        <FaArrowLeft
          id="retailer-update-header-left-icon"
          size={25}
          onClick={() => navigate('/retailer')}
          aria-label="User Account"
          tabIndex={0}
        />
        <div className="retailer-update-header-inner-div">
          <p className="retailer-update-header-inner-div-p">
            ORDER DETAILS
          </p>
          {retailerData?.shopName && (
            <div
              className={`retailer-upload-product-header-shopname`}
              aria-label="Change Location"
              tabIndex={0}
            >
              {retailerData?.shopName?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
      <div className="retailer-order-type-buttons" style={{ marginTop: "87px" }}>
        {["pending", "confirmed", "delivered", "canceled"].map((type) => (
          <div
            key={type}
            className={`retailer-order-type-button ${selectedOrderType === type ? "active" : ""
              }`}
            onClick={() => setSelectedOrderType(type)}
          >
            {type.toUpperCase()}
          </div>
        ))}
      </div>


      




      <div className="retailer-order-div-container">
        <InfiniteScroll
          dataLength={selectedOrders.data.length}
          next={fetchNextPage}
          hasMore={selectedOrders.hasMore}
          loader={
            <div id="search-shop-load-more-shop-loader">
              loading
            </div>
          }
          className="user-orders-container-order"
        >
          {selectedOrders.loading && selectedOrders.currentPage === 1 ? (
            <>loading
            </>
          ) : selectedOrders.data.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            selectedOrders.data.map((order) => (
              <OrderProductCard order={order} key={order.$id} />
            ))
          )}
        </InfiniteScroll>
      </div>



    </>
  );
}
export default Order;
