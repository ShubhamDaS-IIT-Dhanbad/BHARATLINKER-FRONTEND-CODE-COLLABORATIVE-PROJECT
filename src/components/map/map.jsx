import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiMapPin } from "react-icons/fi";
import Cookies from 'js-cookie';
import debounce from "lodash.debounce";
import { FaAngleLeft } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import useLocationFromCookie from "../../hooks/useLocationFromCookie.jsx";
import { updateUserById } from "../../appWrite/user/userData.js";
import "./map.css";
import { useNavigate } from "react-router-dom";
// Constants for better readability
const DEFAULT_ZOOM = 15;
const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org/reverse?format=json";
const DEBOUNCE_DELAY = 1000;

// Custom marker icon
const createCustomIcon = (color = "#4CAF50") =>
    L.divIcon({
        className: "custom-marker",
        html: `
            <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" style="fill:${color};height:42px;width:42px;">
                <path d="M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" 
                      stroke="black" stroke-width="0.5"/>
            </svg>
        `,
        iconSize: [30, 30],
        iconAnchor: [11, 12],
    });

const LocationMap = ({
    documentId,
    latMap,
    longMap,
    addressMap,
    setShowMap,
    setLocationTab,
    setDeliveryAddress,
    setShowAddressDetail,
}) => {
    const navigate=useNavigate();
    const { updateLocation } = useLocationFromCookie();
    const [position, setPosition] = useState([latMap, longMap]);
    const [loading, setLoading] = useState(true);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [address, setAddress] = useState(addressMap);
    const mapRef = useRef(null);
    const abortControllerRef = useRef(new AbortController());

    // Fetch address from coordinates
    const getAddressFromLatLng = useCallback(async (lat, lon) => {
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        setLoading(true);

        try {
            const response = await fetch(
                `${NOMINATIM_API_URL}&lat=${lat}&lon=${lon}`,
                { signal: abortControllerRef.current.signal }
            );
            if (!response.ok) throw new Error("Network error");
            const data = await response.json();
            setAddress(data.display_name);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching address:", error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced address fetch
    const debouncedGetAddress = useRef(debounce(getAddressFromLatLng, DEBOUNCE_DELAY)).current;

    // Fetch address on initial load
    useEffect(() => {
        if (!addressMap && latMap && longMap) {
            debouncedGetAddress(latMap, longMap);
        }
    }, [addressMap, latMap, longMap, debouncedGetAddress]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => debouncedGetAddress.cancel();
    }, [debouncedGetAddress]);

    const MapClickHandler = () => {
        useMapEvents({
            click(event) {
                setLoading(true); // Move it here
                const { lat, lng } = event.latlng;
                setPosition([lat, lng]);
                debouncedGetAddress(lat, lng);
            },
        });
        return null;
    };
    





    async function handleUserProfileUpdate(locationData) {
        if (window.location.pathname === "/user/profile") {
            const userData = JSON.parse(Cookies.get("BharatLinkerUserData") || "{}");
            if (!userData || !userData.address || !Array.isArray(userData.address)) {
                console.warn("No valid address data found.");
                return;
            }
            let updatedAddressList = userData.address.map(addr => 
                `${addr.latitude}@${addr.longitude}@${addr.address}`
            );
            if (locationData?.lat && locationData?.long && locationData?.address) {
                updatedAddressList.push(`${locationData.lat}@${locationData.long}@${locationData.address.slice(0, 60)}`);
            }
            const updateData = {
                documentId: userData.userId,
                address: updatedAddressList,
            };
            try {
                await updateUserById(updateData);
                setDeliveryAddress(updatedAddressList);
                const parsedAddress = updatedAddressList.map(addr => {
                    const [latitude, longitude, address] = addr.split('@').map(val => val.trim());
                    return {
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        address: address
                    };
                });
                const updatedUserData = { ...userData, address: parsedAddress };
                Cookies.set("BharatLinkerUserData", JSON.stringify(updatedUserData), { expires: 30 });
    
                console.log("User address updated successfully:", updatedAddressList);
                navigate('/user/profile')
            } catch (error) {
                console.error("Error updating user address:", error);
            }
        }
    }
    
    
    // Confirm location handler
    const handleConfirm = useCallback(() =>  {
        setLoadingConfirm(true);

        const locationData = {
            lat: position[0],
            long: position[1],
            address: address,
        };
        if(window.location.pathname === "/user/profile"){
            handleUserProfileUpdate(locationData);
        }else if (window.location.pathname === "/user/cart") {
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
                lat: position[0],
                lon: position[1],
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
    }, [position, address, setDeliveryAddress, setShowMap, setLocationTab, setShowAddressDetail, updateLocation]);






    // Memoized map component
    const memoizedMap = useMemo(() => (
        <MapContainer
            center={position}
            zoom={DEFAULT_ZOOM}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            whenCreated={(map) => (mapRef.current = map)}
        >
            <TileLayer url={TILE_LAYER_URL} />
            <MapClickHandler />
            <Marker position={position} icon={createCustomIcon("#4CAF50")} draggable={true}>
                <Popup className="custom-popup">
                    <div className="popup-content">
                        <FiMapPin className="popup-icon" />
                        <span className="popup-text">Selected Location</span>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    ), [position]);

    return (
        <div className="map-parent-container">
            <div className="map-back-bar">
                <FaAngleLeft size={23} onClick={() => setShowMap(false)} className="map-back-bar-icon" />
                Location Information
            </div>

            <div className="map-wrapper">
                {memoizedMap}

                <div className="map-address-container">
                    <div className="map-address-content">
                        {loading ? (
                            <div className="map-address-oval">
                                <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />
                            </div>
                        ) : (
                            <p className="map-address-text">{address}</p>
                        )}
                        <div className={`map-confirm-btn ${loading ? "disabled" : ""}`}
                            onClick={!loading ? handleConfirm : undefined}
                        >
                            {loadingConfirm ? (
                                <Oval height={20} width={20} color="white" ariaLabel="loading" />
                            ) : (
                                "Confirm & Continue"
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(LocationMap);