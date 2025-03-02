// LocationMap.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import debounce from "lodash.debounce";
import { FaAngleLeft } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import useLocationFromCookie from "../../hooks/useLocationFromCookie.jsx";
import { updateUserById } from "../../appWrite/user/userData.js";
import { useNavigate } from "react-router-dom";
import { TiLocation } from "react-icons/ti";
import "./map.css";

const DEFAULT_ZOOM = 15;
const MAP_CONTAINER_STYLE = { height: "100%", width: "100%" };

const markerIcon = {
  url: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
      <path fill="#ff0000" d="${TiLocation().props.children[0].props.d}" />
    </svg>
  `)}`,
};

const LocationMap = React.memo(({
  documentId,
  latMap,
  longMap,
  addressMap,
  setShowMap,
  setLocationTab,
  setDeliveryAddress,
  setShopAddress,
  setShowAddressDetail,
}) => {
  const navigate = useNavigate();
  const { updateLocation } = useLocationFromCookie();
  const [position, setPosition] = useState({ lat: latMap || 0, lng: longMap || 0 });
  const [loading, setLoading] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [address, setAddress] = useState(addressMap || "");

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const containerRef = useRef(null);
  const geocoderRef = useRef(null);

  const getAddressFromLatLng = useCallback(async (lat, lng) => {
    setLoading(true);
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      setLoading(false);
      return;
    }
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
    const latLng = { lat, lng };
    try {
      const response = await geocoderRef.current.geocode({ location: latLng });
      if (response.results && response.results.length > 0) {
        setAddress(response.results[0].formatted_address);
      } else {
        setAddress("No address found");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setAddress("Error fetching address");
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedGetAddress = useRef(debounce((lat, lng) => {
    getAddressFromLatLng(lat, lng);
  }, 500)).current; // Reduced debounce time to 500ms for quicker response

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(containerRef.current, {
        center: position,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      markerRef.current = new window.google.maps.Marker({
        position: position,
        map: mapRef.current,
        title: "Your Location",
        draggable: true,
        icon: markerIcon,
      });

      // Enhanced map click handler
      mapRef.current.addListener("click", (event) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        const newPosition = { lat: newLat, lng: newLng };
        
        // Update position state
        setPosition(newPosition);
        
        // Move marker to new position
        if (markerRef.current) {
          markerRef.current.setPosition(newPosition);
        }
        
        // Center map on new position
        if (mapRef.current) {
          mapRef.current.panTo(newPosition);
        }
        
        // Get new address
        debouncedGetAddress(newLat, newLng);
      });

      // Add dragend listener for when marker is dragged
      markerRef.current.addListener("dragend", (event) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        const newPosition = { lat: newLat, lng: newLng };
        
        setPosition(newPosition);
        mapRef.current.panTo(newPosition);
        debouncedGetAddress(newLat, newLng);
      });
    }

    return () => {
      debouncedGetAddress.cancel();
      if (mapRef.current) {
        window.google.maps.event.clearInstanceListeners(mapRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [debouncedGetAddress, getAddressFromLatLng]);

 
  async function handleUserProfileUpdate(locationData) {
    if (window.location.pathname === "/user/profile") {
      const userData = JSON.parse(Cookies.get("BharatLinkerUserData") || "{}");
      if (!userData || !userData.address || !Array.isArray(userData.address)) {
        console.warn("No valid address data found.");
        return;
      }
      let updatedAddressList = userData.address.map((addr) =>
        `${addr.latitude}@${addr.longitude}@${addr.address}`
      );
      if (locationData?.lat && locationData?.long && locationData?.address) {
        updatedAddressList.push(
          `${locationData.lat}@${locationData.long}@${locationData.address.slice(0, 60)}`
        );
      }
      const updateData = {
        documentId: userData.userId,
        address: updatedAddressList,
      };
      try {
        await updateUserById(updateData);
        setDeliveryAddress(updatedAddressList);
        const parsedAddress = updatedAddressList.map((addr) => {
          const [latitude, longitude, address] = addr.split("@").map((val) => val.trim());
          return {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address: address,
          };
        });
        const updatedUserData = { ...userData, address: parsedAddress };
        Cookies.set("BharatLinkerUserData", JSON.stringify(updatedUserData), { expires: 30 });
        navigate("/user/profile");
      } catch (error) {
        console.error("Error updating user address:", error);
      }
    }
  }

  const handleConfirm = useCallback(() => {
    setLoadingConfirm(true);
    const locationData = {
      lat: position.lat,
      long: position.lng,
      address: address,
    };

    if (window.location.pathname === "/user/profile") {
      handleUserProfileUpdate(locationData);
    } else if (window.location.pathname === "/secure/shop/address") {
      setShopAddress(locationData);
      setTimeout(() => {
        setLoadingConfirm(false);
        setShowMap(false);
        setLocationTab(false);
        setShowAddressDetail(true);
      }, 900);
    } else if (window.location.pathname === "/user/cart") {
      setDeliveryAddress(locationData);
      setTimeout(() => {
        setLoadingConfirm(false);
        setShowMap(false);
        setLocationTab(false);
        setShowAddressDetail(true);
      }, 1000);
    } else {
      updateLocation({
        radius: 5,
        lat: position.lat,
        lon: position.lng,
        address: address,
        country: "",
        state: "",
      });
      setTimeout(() => {
        setLoadingConfirm(false);
        setLocationTab(false);
        setShowMap(false);
      }, 1000);
    }
  }, [
    position,
    address,
    setDeliveryAddress,
    setShopAddress,
    setShowMap,
    setLocationTab,
    setShowAddressDetail,
    updateLocation,
    navigate,
  ]);

  return (
    <div className="map-parent-container">
      <div className="map-back-bar">
        <FaAngleLeft
          size={24}
          onClick={() => setShowMap(false)}
          className="map-back-bar-icon"
        />
        <span className="map-back-bar-title">Location Information</span>
      </div>

      <div className="map-wrapper">
        <div ref={containerRef} style={MAP_CONTAINER_STYLE} />

        <div className="map-address-container">
          <div className="map-address-content">
            {loading ? (
              <div className="map-address-oval">
                <Oval
                  height={20}
                  width={20}
                  color="#7B2CFD"
                  secondaryColor="#e0e0e0"
                  ariaLabel="loading"
                />
              </div>
            ) : (
              <p className="map-address-text">{address || "Select a location on the map"}</p>
            )}
            <button
              className={`map-confirm-btn ${loading || !address ? "disabled" : ""}`}
              onClick={!loading && address ? handleConfirm : undefined}
              disabled={loading || !address}
            >
              {loadingConfirm ? (
                  <Oval height={30} width={30} color="white" secondaryColor="#e93571" ariaLabel="loading" />
              ) : (
                "Confirm & Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LocationMap;