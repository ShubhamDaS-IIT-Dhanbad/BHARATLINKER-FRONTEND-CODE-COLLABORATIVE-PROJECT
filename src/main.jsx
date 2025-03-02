import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import store from './redux/store/store.jsx';
import './index.css';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBIqmoXgxN8g5ji_81BukR6ZHVUXLQFMLA";

const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=maps&loading=async&v=beta`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.body.appendChild(script);
  });
};

// Load the Google Maps script before rendering the app
loadGoogleMapsScript()
  .then(() => {
    createRoot(document.getElementById('root')).render(
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    );
  })
  .catch((error) => {
    console.error(error);
    // Optionally render an error state or fallback UI
    createRoot(document.getElementById('root')).render(
      <div>Error loading Google Maps: {error.message}</div>
    );
  });