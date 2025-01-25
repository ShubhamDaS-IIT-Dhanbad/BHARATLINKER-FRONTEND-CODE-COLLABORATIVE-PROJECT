import React from 'react';
import './popUp.css';

function ErrorPopup({ error, onClose }) {
  return (
    <div className='user-upload-location-popup'>
      <div className='user-upload-location-popup-message'>{error}</div>
      <div className='user-upload-location-popup-ok' onClick={onClose}>
        OK
      </div>
    </div>
  );
}

function SuccessPopup({ success, onClose }) {
  return (
    <div className='user-upload-location-popup'>
      <div className='user-upload-location-popup-message'>{success}</div>
      <div className='user-upload-location-popup-ok' onClick={onClose}>
        OK
      </div>
    </div>
  );
}

export { ErrorPopup, SuccessPopup };
