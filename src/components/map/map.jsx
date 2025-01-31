import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiMapPin } from "react-icons/fi";
import styled from "@emotion/styled";

// Styled map container
const MapWrapper = styled.div`
  height: 100vh;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
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

// Function to track sliding movement
const MapSlideHandler = ({ setPosition, mapRef }) => {
  useMapEvents({
    dragend: () => {
      const map = mapRef.current;
      if (map) {
        const center = map.getCenter();
        setPosition([center.lat, center.lng]); // Update marker position after sliding
      }
    },
  });
  return null;
};

const LocationMap = () => {
  const [position, setPosition] = useState([23.8100428, 86.4425328]); // Default position
  const [loading, setLoading] = useState(true);
  const mapRef = useRef();

  // Function to get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 13, { animate: true }); // Smooth movement
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <MapWrapper>
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        {/* OpenStreetMap Standard Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Detect sliding and update marker */}
        <MapSlideHandler setPosition={setPosition} mapRef={mapRef} />

        {/* Static Marker at the center of the screen */}
        <Marker position={position} icon={createCustomIcon("#25CCF7")} draggable={false}>
          <Popup>
            <div>
              <FiMapPin className="inline-block mr-2" />
              <span className="font-semibold text-blue-600">
                Lat: {position[0]}, Lng: {position[1]}
              </span>
            </div>
          </Popup>
        </Marker>

        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Display latitude & longitude */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md">
        <strong>Lat:</strong> {position[0]} | <strong>Lng:</strong> {position[1]}
      </div>

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
