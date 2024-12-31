import React from 'react';
import { IoClose } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import './locationTab.css';

function LocationTab({ setLocationTab }) {
    return (
        <div className={`location-tab active`}>
            <div className='location-tab-IoIosCloseCircle' onClick={() => setLocationTab(false)}>
                <IoClose size={25} />
            </div>
            <div className='location-tab-bottom-div'>
                <p className='location-tab-bottom-div-p'>Select your Location</p>
                <div className='location-tab-bottom-div-input-div'>
                    <IoSearch size={20} />
                    <input
                        className='location-tab-bottom-div-input'
                        placeholder='search your location'
                    />
                </div>
                <div className='location-tab-bottom-div-current-location'>
                    <MdMyLocation size={23} />
                    Use current location
                </div>

                <div className='location-tab-location-info-div'>
                    < SlLocationPin size={17} />
                    <div className='location-tab-location-info-inner-div'>
                        <p className='location-tab-location-info-inner-div-1'>
                            Beharampur,Murshidabad,West Bengal
                        </p>
                        <p className='location-tab-location-info-inner-div-2'>
                            Beharampur,Murshidabad,West Bengal
                        </p>
                        <p className='location-tab-location-info-inner-div-3'>
                            740001,740002,740003,740004
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default LocationTab;
