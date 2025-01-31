import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiMapPin } from "react-icons/fi";
import styled from "@emotion/styled";
import debounce from "lodash.debounce";
import './map.css'

// Styled map container
const MapWrapper = styled.div`
  height: 100vh;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  position: relative;
`;

// Custom SVG marker
const createCustomIcon = (color = "#FF4757") =>
  L.divIcon({
    className: "custom-marker",
    html: `
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="fill:${color};height:42px;width:42px;">
      <path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
    </svg>
  `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });

const LocationMap = () => {
  const [position, setPosition] = useState([23.8100428, 86.4425328]); // Default position
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const mapRef = useRef();
  const abortControllerRef = useRef(new AbortController());

  const getAddressFromLatLng = useCallback(async (lat, lon) => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setAddress(data.display_name);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching address:", error);
      }
    }
  }, []);

  // Debounced function to fetch address
  const debouncedGetAddress = useRef(
    debounce((lat, lon) => getAddressFromLatLng(lat, lon), 1000) // 1-second debounce
  ).current;

  // Function to get user's current location
  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
          debouncedGetAddress(latitude, longitude); // Fetch address for current location
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 13, { animate: true });
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [debouncedGetAddress]);

  // Fetch address when position changes
  useEffect(() => {
    if (position) {
      debouncedGetAddress(position[0], position[1]);
    }
  }, [position, debouncedGetAddress]);

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Handle click event to update position
  const MapClickHandler = () => {
    const map = useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setPosition([lat, lng]);
        debouncedGetAddress(lat, lng); // Fetch address for clicked position
      }
    });
    return null; // This component is only used for the map events
  };

  return (
    <MapWrapper>
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Map click handler */}
        <MapClickHandler />

        <Marker position={position} icon={createCustomIcon("#25CCF7")} draggable={true}>
          <Popup>
            <div>
              <FiMapPin className="inline-block mr-2" />
              <span className="font-semibold text-blue-600">
                Lat: {position[0]?.toFixed(4)}, Lng: {position[1]?.toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>

        <ZoomControl position="bottomright" />
        <div className="mp-div">{address}</div>
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md">
        <strong>Lat:</strong> {position[0]?.toFixed(4)} | <strong>Lng:</strong> {position[1]?.toFixed(4)}
      </div>

      {/* Display fetched address */}
      {address && (
        <div className="absolute bottom-14 left-4 bg-white p-2 rounded-md shadow-md max-w-md">
          <strong>Address:</strong> {address}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
          <div className="animate-pulse">Locating you...</div>
        </div>
      )}
    </MapWrapper>
  );
};

export default LocationMap;
