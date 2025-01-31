import React, { useState, useEffect, useRef, useCallback } from "react";
import {useNavigate} from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup,useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiMapPin, } from "react-icons/fi";
import debounce from "lodash.debounce";
import './map.css';
import { FaAngleLeft } from "react-icons/fa6";
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
  const navigate = useNavigate();
  
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

  const debouncedGetAddress = useRef(
    debounce((lat, lon) => getAddressFromLatLng(lat, lon), 1000)
  ).current;

  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
          debouncedGetAddress(latitude, longitude);
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

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

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


  return (
    <>

      <div className="map-wrapper">

        <div className="map-back-bar">
          <FaAngleLeft size={23} onClick={()=>{navigate(-1)}} className="map-back-bar-icon"/>
          Location Information
        </div>
        <MapContainer
          ref={mapRef}
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler />

          <Marker position={position} icon={createCustomIcon("white")} draggable={true}>
            <Popup className="custom-popup">
              <div className="popup-content">
                <FiMapPin className="popup-icon" />
                <span className="popup-text">Selected Location</span>
              </div>
            </Popup>
          </Marker>

        </MapContainer>



        <div className="map-address-container">
          <FiMapPin className="map-address-icon" />
          <div>
            <p className="map-address-text">{address}</p>
            <p className="map-coordinates">
              Latitude: {position[0]?.toFixed(4)}, Longitude: {position[1]?.toFixed(4)}
            </p>
          </div>
        </div>

      </div>




    </>
  );
};

export default LocationMap;
