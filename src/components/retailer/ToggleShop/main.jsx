import React, { useState } from "react";
import './main.css';
import { updateShopOpenedStatus } from '../../../appWrite/shop/shop.js';
import Cookies from 'js-cookie';
const ToggleSwitch = ({ retailerData }) => {
  // Initialize the state based on retailerData.isOpened
  const [isOn, setIsOn] = useState(retailerData?.isOpened);
  const toggleSwitch = async () => {
    try {
      // Toggle the local state first
      setIsOn((prevState) => !prevState);

      // Update the status in the backend (Appwrite)
      const updated=await updateShopOpenedStatus(retailerData.$id, !isOn);
      Cookies.set('BharatLinkerShopData', JSON.stringify({ ...retailerData, ...updated }));

    } catch (error) {
      console.error('Error updating the shop status:', error.message);
    }
  };

  return (
    <div 
      className={`toggle-switch ${isOn ? "OPENED" : "CLOSED"}`} 
      onClick={toggleSwitch}
    >
      <div className="switch-handle"></div>
      <span className="switch-label">{isOn ? "OPENED" : "CLOSED"}</span>
    </div>
  );
};

export default ToggleSwitch;
