import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import Cookies from 'js-cookie';
import UploadGadgetsForm from './uploadGadgetsForm.jsx';

import './gadgetsUpload.css';

const UploadGadgetsHome = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('gadgets');
    const [userData, setUserData] = useState('');
    const [allField, setAllField] = useState(true);
    
    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUser');
        if (userSession) {
            setUserData(JSON.parse(userSession));
        }
    }, []);

    return (
        <>
            <div className='upload-gadgets-header'>
                <FaArrowLeft
                    id='upload-gadgets-header-left-icon'
                    size={25}
                    onClick={() => navigate('/user')}
                    aria-label="User Account"
                    tabIndex={0}
                />
                <div className='upload-gadgets-header-inner-div'>
                    <p className='upload-gadgets-header-inner-div-p'>UPLOAD {type.toUpperCase()}</p>
                    <div
                        className={`upload-gadgets-header-inner-div-phn-div`}
                        onClick={() => navigate('/pincode')}
                        aria-label="Change Location"
                        tabIndex={0}
                    >
                        {userData.phn}
                    </div>
                </div>
            </div>

            <div className='upload-gadgets-type'>
                
                <div
                    className={`upload-gadgets-type-option ${type === 'gadgets' ? 'active' : ''}`}
                    onClick={() => setType('other')}
                >
                    Gadgets
                </div>
            </div>

           
            {type === 'gadgets' && (
                <UploadGadgetsForm userData={userData}/>
            )}
            

            {!allField && (
                <div className='upload-gadgets-all-field-required-div'>
                    <div className='upload-gadgets-all-field-required-div-inner' onClick={() => setAllField(true)}>
                        All the * marked fields are Required
                        <div className='upload-gadgets-all-field-required-div-inner-ok'>
                            OK
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UploadGadgetsHome;
