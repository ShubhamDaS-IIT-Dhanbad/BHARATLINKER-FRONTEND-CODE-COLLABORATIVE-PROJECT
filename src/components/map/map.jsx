import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiMapPin, FiSearch, FiNavigation } from "react-icons/fi";
import styled from "@emotion/styled";
import debounce from "lodash.debounce";
import './map.css';
import { CiLocationOn } from "react-icons/ci";

const MapWrapper = styled.div`
  height: 65vh;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 48px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const AddressContainer = styled.div`
  margin-top: 1.5rem;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const createCustomIcon = (color = "#3B82F6") =>
  L.divIcon({
    className: "custom-marker",
    html: `
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="fill:${color};height:42px;width:42px;">
      <path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" 
            stroke="black" stroke-width="1"/>
    </svg>
  `,
    iconSize: [30, 30],
    iconAnchor: [11, 12],
  });


const LocationMap = () => {
  const [position, setPosition] = useState([23.8100428, 86.4425328]);
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
        debouncedGetAddress(lat, lng);
      }
    });
    return null;
  };




  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const results = await fetchLocationSuggestions(query);
      setSuggestions(results);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const [lat, lon] = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
    setPosition([lat, lon]);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    mapRef.current.flyTo([lat, lon], 13, { animate: true });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SearchContainer>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <SearchInput
            type="text"
            placeholder="Search for location..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            onClick={getCurrentLocation}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <FiNavigation className="text-gray-600" />
          </button>
        </div>
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
              >
                {suggestion.display_name}
              </div>
            ))}
          </div>
        )}
      </SearchContainer>

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

          <MapClickHandler />

          <Marker position={position} icon={createCustomIcon("white")} draggable={true}>
            <Popup className="custom-popup">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-blue-500" />
                <span className="text-sm font-medium">
                  Selected Location
                </span>
              </div>
            </Popup>
          </Marker>

          <ZoomControl position="bottomright" />
        </MapContainer>
      </MapWrapper>

      <AddressContainer>
        <FiMapPin className="flex-shrink-0 text-blue-500" />
        <div>
          <p className="font-medium text-gray-900">{address}</p>
          <p className="text-sm mt-1">
            Latitude: {position[0]?.toFixed(4)}, Longitude: {position[1]?.toFixed(4)}
          </p>
        </div>
      </AddressContainer>
    </div>
  );
};

export default LocationMap;