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

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBIqmoXgxN8g5ji_81BukR6ZHVUXLQFMLA";
const DEFAULT_ZOOM = 15;
const MAP_CONTAINER_STYLE = { height: "100%", width: "100%" };

// Convert TiLocation SVG to a Google Maps marker icon
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
  const mapRef = useRef(null); // Ref for map instance
  const markerRef = useRef(null); // Ref for marker instance
  const containerRef = useRef(null); // Ref for map container DOM element
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

  const debouncedGetAddress = useRef(debounce(getAddressFromLatLng, 1000)).current;

  // Initialize map and marker once on mount
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    // Initialize map if not already initialized
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(containerRef.current, {
        center: position,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Initialize legacy Marker (not AdvancedMarkerElement)
      markerRef.current = new window.google.maps.Marker({
        position: position,
        map: mapRef.current,
        title: "Your Location",
        draggable: true,
        icon: markerIcon, // Use the custom SVG icon
      });

      // Handle map click
      mapRef.current.addListener("click", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setPosition({ lat, lng });
        debouncedGetAddress(lat, lng);
      });

      // Handle marker drag end
      markerRef.current.addListener("dragend", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setPosition({ lat, lng });
        debouncedGetAddress(lat, lng);
      });
    }

    // Cleanup
    return () => {
      debouncedGetAddress.cancel();
      if (mapRef.current) {
        window.google.maps.event.clearInstanceListeners(mapRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [debouncedGetAddress]);

  // Update position when props or state change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const newPosition = { lat: position.lat, lng: position.lng };
      markerRef.current.setPosition(newPosition);
      mapRef.current.panTo(newPosition);
    }
    if (!addressMap && latMap && longMap) {
      debouncedGetAddress(latMap, longMap);
    }
  }, [position, latMap, longMap, addressMap, debouncedGetAddress]);

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
              <p className="map-address-text">{address || "No address available"}</p>
            )}
            <button
              className={`map-confirm-btn ${loading ? "disabled" : ""}`}
              onClick={!loading ? handleConfirm : undefined}
              disabled={loading}
            >
              {loadingConfirm ? (
                <Oval height={20} width={20} color="white" ariaLabel="loading" />
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