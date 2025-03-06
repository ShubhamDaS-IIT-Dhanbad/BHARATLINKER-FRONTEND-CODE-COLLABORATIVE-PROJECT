import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { 
  fetchOrdersByStatus, 
  loadMoreOrders, 
  resetShopOrders 
} from "../../../redux/features/retailer/orderSlice.jsx";
import OrderProductCard from "./orderProductCard";
import RetailerOrderDetail from '../orderDetail/orderDetail.jsx';
import { LuRefreshCcw } from "react-icons/lu";
import { FaChevronLeft } from "react-icons/fa";
import "./order.css";



import e1 from "./e1.png";
function Order({ shopData }) {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderType, setSelectedOrderType] = useState("pending");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch orders from Redux store
  const {
    pendingOrders,
    confirmedOrders,
    dispatchedOrders,
    deliveredOrders,
    canceledOrders,
    loading,
  } = useSelector((state) => state.retailerorders);

  // Order categories
  const orderStates = {
    pending: pendingOrders,
    confirmed: confirmedOrders,
    dispatched: dispatchedOrders,
    delivered: deliveredOrders,
    canceled: canceledOrders,
  };

  const selectedOrders = orderStates[selectedOrderType] || { 
    data: [], 
    hasMore: false, 
    currentPage: 1 
  };
  
  const isAnyLoading = Object.values(orderStates).some(state => state.loading);

  // Fetch orders initially
  useEffect(() => {
    if (!shopData?.shopId) return;
    
    const orderTypes = ["pending", "confirmed", "dispatched", "delivered", "canceled"];
    orderTypes.forEach((type) => {
      if (orderStates[type]?.data.length === 0 && 
          !orderStates[type]?.loading && 
          !orderStates[type]?.fetched) {
        dispatch(fetchOrdersByStatus({ 
          shopId: shopData.shopId, 
          status: type, 
          page: 1 
        }));
      }
    });
  }, [shopData, dispatch]);

  // Handle browser back button
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      if (selectedOrderId) {
        // If order detail is showing, close it first
        setSelectedOrderId(null);
        // Push current state to prevent actual back navigation
        window.history.pushState(null, null, window.location.pathname);
      } else {
        // If no order detail is showing, navigate to /secure/shop
        navigate("/secure/shop");
      }
    };

    // Add event listener for popstate (browser back/forward)
    window.addEventListener('popstate', handleBackButton);

    // Push initial state to allow for back button handling
    window.history.pushState(null, null, window.location.pathname);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [selectedOrderId, navigate]);

  // Load more orders for infinite scroll
  const fetchNextPage = () => {
    if (!shopData?.shopId) return;
    const nextPage = selectedOrders.currentPage + 1;
    dispatch(loadMoreOrders({ 
      shopId: shopData.shopId, 
      status: selectedOrderType, 
      page: nextPage 
    }));
  };

  // Reset orders and refetch
  const handleResetOrders = () => {
    if (!shopData?.shopId) return;

    setIsRefreshing(true);
    dispatch(resetShopOrders());

    const orderTypes = ["pending", "confirmed", "dispatched", "delivered", "canceled"];
    Promise.all(
      orderTypes.map((type) =>
        dispatch(fetchOrdersByStatus({ 
          shopId: shopData.shopId, 
          status: type, 
          page: 1 
        })).unwrap()
      )
    )
      .then(() => setIsRefreshing(false))
      .catch(() => setIsRefreshing(false));
  };

  // Scroll to top when changing order type
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedOrderType]);

  return (
    <>
      {selectedOrderId ? (
        <RetailerOrderDetail 
          orderId={selectedOrderId} 
          setSelectedOrderId={setSelectedOrderId}
        />
      ) : (
        <div className="order-container no-pull-refresh">
          <header style={{ position: "fixed", top: "0", width: "100%", zIndex: 100 }}>
            <div className="shop-order-1">
              <button 
                className="shop-order-back-btn" 
                onClick={() => {
                  if (selectedOrderId) {
                    setSelectedOrderId(null);
                  } else {
                    navigate("/secure/shop");
                  }
                }}
              >
                <FaChevronLeft />
              </button>
              <span>ORDER DETAILS</span>
              <button 
                className="shop-order-refresh-btn" 
                onClick={handleResetOrders}
              >
                <LuRefreshCcw 
                  className={isRefreshing || isAnyLoading ? "rotate" : ""}
                />
              </button>
            </div>
            <div className="retailer-order-type-buttons">
              {["pending", "confirmed", "dispatched", "delivered", "canceled"].map((type) => (
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
                <Oval 
                  height={30} 
                  width={30} 
                  color="green" 
                  secondaryColor="white" 
                  ariaLabel="loading" 
                />
              </div>
            }
            style={{ paddingTop: "120px" }}
          >
            <div className="retailer-order-div-container">
              {selectedOrders.data.length === 0 && !loading ? (
                <div className="retailer-order-empty">
                  <img 
                    className="retailer-order-empty-img" 
                    src={e1} 
                    alt="No Orders" 
                  />
                </div>
              ) : (
                selectedOrders.data.map((order) => (
                  <OrderProductCard 
                    order={order} 
                    key={order.$id} 
                    setSelectedOrderId={setSelectedOrderId}
                  />
                ))
              )}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </>
  );
}

export default Order;