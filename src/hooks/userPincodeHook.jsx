import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { reupdateProduct, reupdateShop, reupdateRefurbish } from '../redux/features/pincodeUpdatedSlice.jsx';
import { useDispatch } from 'react-redux';

// Constants
const PINCODE_MAX_LENGTH = 6;
const COOKIE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

// Utility function to retrieve pincodes from cookie
const getPincodesFromCookie = () => {
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith('userpincodes='));
  if (cookieValue) {
    const pincodes = decodeURIComponent(cookieValue.split('=')[1]);
    try {
      return JSON.parse(pincodes);
    } catch (error) {
      console.error("Failed to parse cookie pincodes:", error);
    }
  }
  return [];
};

export const useUserPincode = () => {

  const dispatch = useDispatch();
  const [userPincodes, setUserPincodes] = useState(getPincodesFromCookie());
  const [inputValue, setInputValue] = useState('');

  // Handle input change with max pincode length validation
  const handleInputChange = useCallback((e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= PINCODE_MAX_LENGTH) {
      setInputValue(value);
    } else {
      toast.error("Please enter a valid pincode!");
    }
  }, []);


  // Add new pincode after validation
  const handleAddPincode = useCallback(() => {
    if (inputValue.trim() === '') {
      toast.error("Pincode cannot be empty!");
      return;
    }

    if (userPincodes.some(pincode => pincode.pincode === inputValue)) {
      toast.error(`Pincode ${inputValue} already exists!`);
      return;
    }

    const newPincode = { pincode: inputValue, selected: true };

    setUserPincodes(prevPincodes => {
      const updatedPincodes = [...prevPincodes, newPincode];
      updateCookies(updatedPincodes);
      return updatedPincodes;
    });

    toast.success(`Pincode ${inputValue} added successfully!`);
  }, [inputValue, userPincodes]);



  
  // Toggle pincode selection state
  const togglePincodeSelection = useCallback((pincode) => {
    setUserPincodes(prevPincodes => {
      const updatedPincodes = prevPincodes.map(pin =>
        pin.pincode === pincode ? { ...pin, selected: !pin.selected } : pin
      );
      updateCookies(updatedPincodes);
      return updatedPincodes;
    });
  }, []);

  // Delete a pincode and update state and cookies
  const handleDeletePincode = useCallback((pincode) => {
    setUserPincodes(prevPincodes => {
      const updatedPincodes = prevPincodes.filter(pin => pin.pincode !== pincode);
      updateCookies(updatedPincodes);
      toast.success(`Pincode ${pincode} deleted successfully!`);
      return updatedPincodes;
    });
  }, []);

  // Update cookies with new pincode list
  const updateCookies = (pincodes) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + COOKIE_EXPIRATION_TIME);

    // Dispatching redux actions to update various components based on pincode changes
    dispatch(reupdateProduct());
    dispatch(reupdateShop());
    dispatch(reupdateRefurbish());

    // Updating cookie
    document.cookie = `userpincodes=${encodeURIComponent(JSON.stringify(pincodes))}; expires=${expires.toUTCString()}; path=/`;
  };

  return {
    userPincodes,
    inputValue,
    handleInputChange,
    handleAddPincode,
    togglePincodeSelection,
    handleDeletePincode,
  };
};
