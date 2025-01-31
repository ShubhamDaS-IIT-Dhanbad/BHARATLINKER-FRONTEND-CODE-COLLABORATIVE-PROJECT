import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiMapPin } from "react-icons/fi";
import debounce from "lodash.debounce";
import "./map.css";
import { FaAngleLeft } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";

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

const LocationMap = ({ latMap, saveAndContinue, addressMap, longMap, setLat, setLong, setAddress, setShowMap,setSearchQuery }) => {
    const [position, setPosition] = useState([latMap, longMap]);
    const [loading, setLoading] = useState(false);
    const [address, setAddressState] = useState(addressMap);
    const mapRef = useRef(null);
    const abortControllerRef = useRef(new AbortController());

    const getAddressFromLatLng = async (lat, lon) => {
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        setLoading(true);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
                { signal: abortControllerRef.current.signal }
            );
            if (!response.ok) throw new Error("Network error");
            const data = await response.json();
            setAddressState(data.display_name);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching address:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const debouncedGetAddress = useRef(debounce(getAddressFromLatLng, 1000)).current;

    useEffect(() => {
        return () => {
            debouncedGetAddress.cancel();
        };
    }, [debouncedGetAddress]);

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) return;

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                setPosition([latitude, longitude]);
                debouncedGetAddress(latitude, longitude);
                if (mapRef.current) {
                    mapRef.current.setView([latitude, longitude], 13, { animate: true });
                }
            },
            (error) => {
                console.error("Error getting location: ", error);
                setLoading(false);
            }
        );
    }, [debouncedGetAddress]);

    const MapClickHandler = () => {
        useMapEvents({
            click(event) {
                const { lat, lng } = event.latlng;
                setPosition([lat, lng]);
                debouncedGetAddress(lat, lng);
            },
        });
        return null;
    };

    const handleConfirm = () => {
        setLat(position[0]);
        setLong(position[1]);
        setAddress(address);
        setSearchQuery(address);
        saveAndContinue();
    };

    return (
        <div className="map-parent-container">
            <div className="map-back-bar">
                <FaAngleLeft size={23} onClick={() => setShowMap(false)} className="map-back-bar-icon" />
                Location Information
            </div>

            <div className="map-wrapper">
                <MapContainer
                    center={position}
                    zoom={10}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                    whenCreated={(map) => (mapRef.current = map)}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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

                <div className="map-address-container">
                    <div className="map-address-content">
                        {loading ? (
                            <div className="map-address-oval">
                                <Oval height={20} width={20} color="green" secondaryColor="white" ariaLabel="loading" />
                            </div>
                        ) : (
                            <p className="map-address-text">{address}</p>
                        )}
                        <div className="map-confirm-btn" onClick={handleConfirm}>
                            Confirm & Continue
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationMap;
