import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import debounce from "lodash.debounce";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet"; // For custom marker icon
import "leaflet/dist/leaflet.css"; // Leaflet styles
import "./map.css";
import { useNavigate } from "react-router-dom";

// Constants
const HERE_API_KEY = "Zq0jzkt4gZyvIS_hKgDgHOxmMND9k3LdKnmGbyBQoTg";
const HERE_GEOCODING_API_URL = "https://revgeocode.search.hereapi.com/v1/revgeocode";
const DEBOUNCE_DELAY = 1000;
const MAP_SIZE = 256; // Match your previous TILE_SIZE
const ZOOM_LEVEL = 12;

// Custom marker icon (red pin similar to your previous style)
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const LocationMap = ({
  documentId,
  latMap = 40.7128, // Default to New York
  longMap = -74.0060,
  addressMap = "",
  setShowMap,
  setLocationTab,
  setDeliveryAddress,
  setShopAddress,
  setShowAddressDetail,
}) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState([latMap, longMap]);
  const [loading, setLoading] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [address, setAddress] = useState(addressMap);
  const abortControllerRef = useRef(null);

  // Fetch address from coordinates using HERE Geocoding API
  const getAddressFromLatLng = useCallback(async (lat, lon) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setLoading(true);

    try {
      const response = await fetch(
        `${HERE_GEOCODING_API_URL}?at=${lat},${lon}&lang=en-US&apiKey=${HERE_API_KEY}`,
        { signal: abortControllerRef.current.signal }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setAddress(data.items[0].address.label);
      } else {
        setAddress("No address found");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Geocoding error:", error);
        setAddress("Error fetching address");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedGetAddress = useRef(debounce(getAddressFromLatLng, DEBOUNCE_DELAY)).current;

  // Initial setup
  useEffect(() => {
    if (!latMap || !longMap) return;
    if (!addressMap) {
      debouncedGetAddress(latMap, longMap);
    }
  }, [latMap, longMap, addressMap, debouncedGetAddress]);

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedGetAddress.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedGetAddress]);

  const handleConfirm = useCallback(async () => {
    setLoadingConfirm(true);
    const locationData = { lat: position[0], long: position[1], address };
    const pathname = window.location.pathname;
    try {
      switch (pathname) {
        case "/user/profile":
          break;
        case "/secure/shop/address":
          setShopAddress(locationData);
          setShowMap(false);
          setLocationTab(false);
          setShowAddressDetail(true);
          break;
        case "/user/cart":
          setDeliveryAddress(locationData);
          setShowMap(false);
          setLocationTab(false);
          setShowAddressDetail(true);
          break;
        default:
          setShowMap(false);
          setLocationTab(false);
      }
    } finally {
      setLoadingConfirm(false);
    }
  }, [position, address, setShopAddress, setDeliveryAddress, setShowMap, setLocationTab, setShowAddressDetail]);

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        debouncedGetAddress(lat, lng);
      },
    });
    return null;
  };

  return (
    <div className="map-parent-container">
      <div className="map-back-bar">
        <FaAngleLeft
          size={23}
          onClick={() => setShowMap(false)}
          className="map-back-bar-icon"
        />
        Location Information
      </div>
      <div className="map-wrapper">
        <MapContainer
          center={position}
          zoom={ZOOM_LEVEL} // Matches your previous ZOOM_LEVEL
          style={{ width: `${MAP_SIZE}px`, height: `${MAP_SIZE}px` }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url={`https://{s}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=${HERE_API_KEY}`}
            subdomains="1234" // HERE uses subdomains 1, 2, 3, 4
            attribution="© HERE 2023"
          />
          <Marker position={position} icon={customIcon} />
          <MapClickHandler />
        </MapContainer>
        <div className="map-address-container">
          <div className="map-address-content">
            {loading ? (
              <div className="map-address-oval">
                <Oval
                  height={20}
                  width={20}
                  color="green"
                  secondaryColor="white"
                  ariaLabel="loading"
                />
              </div>
            ) : (
              <p className="map-address-text">{address || "Select a location"}</p>
            )}
            <button
              className={`map-confirm-btn ${loading || loadingConfirm ? "disabled" : ""}`}
              onClick={handleConfirm}
              disabled={loading || loadingConfirm}
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
};

export default React.memo(LocationMap);