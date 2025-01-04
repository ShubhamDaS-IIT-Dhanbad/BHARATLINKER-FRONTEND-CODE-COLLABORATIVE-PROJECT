import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import Cookies from 'js-cookie';
import UploadBooksForm from './uploadGadgetsForm.jsx';

import './gadgetsUpload.css';

const UploadGadgetsPage = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('gadgets');
    const [userData, setUserData] = useState('');

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUser');
        if (userSession) {
            setUserData(JSON.parse(userSession));
        }
    }, []);

    return (
        <>
            <div className='user-refurbished-gadgets-upload-page-header'>
                <FaArrowLeft
                    id='user-refurbished-gadgets-upload-page-header-left-icon'
                    size={25}
                    onClick={() => navigate('/user')}
                    aria-label="User Account"
                    tabIndex={0}
                />
                <div className='user-refurbished-gadgets-upload-page-header-inner-div'>
                    <p className='user-refurbished-gadgets-upload-page-header-inner-div-p'>UPLOAD {type.toUpperCase()}</p>
                    <div
                        className='user-refurbished-gadgets-upload-page-header-inner-div-phn-div'
                        onClick={() => navigate('/pincode')}
                        aria-label="Change Location"
                        tabIndex={0}
                    >
                        {userData.phn}
                    </div>
                </div>
            </div>

            <div className='user-refurbished-gadgets-upload-page-type'>
                <div className={`user-refurbished-gadgets-upload-page-type-option ${type === 'gadgets' ? 'active' : ''}`}>
                    Gadgets
                </div>
            </div>

            {type === 'gadgets' && (
                <UploadBooksForm userData={userData} />
            )}
        </>

    );
};

export default UploadGadgetsPage;
