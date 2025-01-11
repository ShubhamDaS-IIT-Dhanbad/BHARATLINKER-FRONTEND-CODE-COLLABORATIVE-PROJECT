import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import RetailerLogin from "./login/login.jsx";
import RetailerRegister from "./register/register.jsx";
import RetailerPending from "./pending/pending.jsx";

const RetailerRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const shopData = Cookies.get("BharatLinkerShopData");
    if (shopData) {
      try {
        const parsedData = JSON.parse(shopData);
        const { registrationStatus } = parsedData;
        if (registrationStatus === "pending") {
          navigate("retailer/pending");
        } else if (registrationStatus === "approved") {
          navigate("/retailer");
        }
      } catch (error) {
        console.error("Failed to parse BharatLinkerShopData from cookies:", error);
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/retailer/login" element={<RetailerLogin />} />
      <Route path="/retailer/register" element={<RetailerRegister />} />
      <Route path="/retailer/pending" element={<RetailerPending />} />
    </Routes>
  );
};

export default RetailerRoutes;
