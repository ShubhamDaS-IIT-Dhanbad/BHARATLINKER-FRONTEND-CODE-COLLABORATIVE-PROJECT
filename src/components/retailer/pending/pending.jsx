import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { FaArrowLeft } from 'react-icons/fa';
import { IoIosRefresh } from "react-icons/io";

import { MdOutlineContactSupport } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { TailSpin } from 'react-loader-spinner';
import "./pending.css";


const i1='https://res.cloudinary.com/demc9mecm/image/upload/v1737182575/mz1bdy2skwtmouqxfqtf.jpg'; //i1.png
import { getShopData } from '../../../appWrite/shop/shopClodinary.js';

const RetailerPending = () => {
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShopData = async () => {
    setIsLoading(true);
    try {
      const freshShopData = await getShopData(shopData?.phoneNumber);
      if (freshShopData) {
        Cookies.set("BharatLinkerShopData", JSON.stringify(freshShopData), { expires: 7 });
        setShopData(freshShopData);

        if (freshShopData.registrationStatus === "approved") {
          navigate("/retailer");
        } else if (freshShopData.registrationStatus === "pending") {
          navigate("/retailer/pending");
        }else if (freshShopData.registrationStatus === "canceled") {
          navigate("/retailer/canceled");
        }
      } else {
        console.error("Failed to fetch fresh shop data.");
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogOut = () => {
    Cookies.remove("BharatLinkerShopData"); 
    navigate("/"); 
  };

  useEffect(() => {
    const data = Cookies.get("BharatLinkerShopData");
    if (data) {
      const parsedData = JSON.parse(data);
      setShopData(parsedData);
    }
  }, []);

  return (
    <div className="retailer-pending">
      <div className="retailer-login-top-header">
        <FaArrowLeft
          size={25}
          onClick={() => navigate('/')}
          className="retailer-login-back-arrow"
        />
        BHARAT | LINKER
      </div>

      <img src={i1} style={{ width: "70vw" }} alt="Verification in Progress" />

      <div className="retailer-pending-shopname">
        {shopData?.shopName?.toUpperCase()}
      </div>

      <p className="retailer-pending-container-p">
        WE ARE CURRENTLY IN THE PROCESS OF VERIFYING YOUR PROFILE.
      </p>
      <p className="retailer-pending-container-p2">
        KEEP CHECKING AND REFRESHING.
      </p>

      <div className="retailer-pending-actions">
        <button onClick={handleLogOut} className="retailer-pending-support-button">
          <RiLogoutCircleRLine size={33} />
        </button>

        <button onClick={fetchShopData} className="retailer-pending-refresh-button">
          {isLoading ? (
            <TailSpin
              height="25"
              width="25"
              color="#3498db"
              ariaLabel="loading"
            />
          ) : (
            <IoIosRefresh size={30} />
          )}
        </button>

        <button onClick={() => navigate("/support")} className="retailer-pending-refresh-button">
          <MdOutlineContactSupport size={30} />
        </button>
      </div>
    </div>
  );
};

export default RetailerPending;
