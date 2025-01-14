import React from "react";
import { Routes, Route} from "react-router-dom";


import Retailer from "./retailer.jsx";

import RetailerDashboard from './dashboard/dashboard.jsx';
import RetailerUpload from './upload/upload.jsx';

import RetailerLogin from "./login/login.jsx";
import RetailerRegister from "./register/register.jsx";
import RetailerPending from "./pending/pending.jsx";

import './retailer.css';

const RetailerRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/retailer/login" element={<RetailerLogin />} />
        <Route path="/retailer/register" element={<RetailerRegister />} />
        <Route path="/retailer/pending" element={<RetailerPending />} />

        {/* Protected routes */}
        <Route
          path="/retailer"
          element={<Retailer />}
        />
        <Route
          path="/retailer/dashboard"
          element={<RetailerDashboard />}
        />
        <Route
          path="/retailer/products"
          element={<RetailerDashboard />}
        />
        <Route
          path="/retailer/upload"
          element={<RetailerUpload />}
        />
        <Route
          path="/retailer/update"
          element={<Retailer />}
        />
        <Route
          path="/retailer/notification"
          element={<Retailer />}
        />
      </Routes>
    </>
  );
};

export default RetailerRoutes;
