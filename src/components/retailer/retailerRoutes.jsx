import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Retailer from "./retailer.jsx";
import RetailerLogin from "./login/login.jsx";
import RetailerRegister from "./register/register.jsx";
import RetailerPending from "./pending/pending.jsx";

import { ThreeDots } from 'react-loader-spinner';
import './retailer.css';

const RetailerRoutes = () => {
  const navigate = useNavigate();
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New state to track loading

  useEffect(() => {
    if (!isInitialCheckDone) {
      const shopData = Cookies.get("BharatLinkerShopData");

      if (shopData) {
        try {
          const parsedData = JSON.parse(shopData);
          const { registrationStatus } = parsedData;

          setTimeout(() => {
            if (registrationStatus === "pending") {
              navigate("/retailer/pending");
            } else if (registrationStatus === "approved") {
              navigate("/retailer");
            }
            setIsLoading(false);
          }, 1000);

        } catch (error) {
          console.error("Failed to parse BharatLinkerShopData from cookies:", error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }

      setIsInitialCheckDone(true);
    }
  }, [navigate, isInitialCheckDone]);

  const Loader = () => (
    <div className="retailer-routes-loading">
      <ThreeDots size={20} color="#EB3678" />
    </div>
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/retailer/login" element={<RetailerLogin />} />
          <Route path="/retailer/register" element={<RetailerRegister />} />
          <Route path="/retailer/pending" element={<RetailerPending />} />
          <Route path="/retailer" element={<Retailer />} />
        </Routes>
      )}
    </>
  );
};

export default RetailerRoutes;
