import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import Cookies from 'js-cookie';
import UploadBooksForm from './uploadBooksForm.jsx';
import UploadModuleForm from './uploadModuleForm.jsx';

import './bookUpload.css';

const UploadProduct = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('books');
    const [userData, setUserData] = useState('');
    const [allField, setallField] = useState(true);
    
    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUser');
        if (userSession) {
            setUserData(JSON.parse(userSession));
        }
    }, []);


    return (
        <>
            <div className='user-upload-books-header'>
                <FaArrowLeft
                    id='user-upload-books-header-left-icon'
                    size={25}
                    onClick={() => navigate('/user')}
                    aria-label="User Account"
                    tabIndex={0}
                />
                <div className='user-upload-books-header-inner-div'>
                    <p className='user-upload-books-header-inner-div-p'>UPLOAD {type.toUpperCase()}</p>
                    <div
                        className={`user-upload-books-header-inner-div-phn-div`}
                        onClick={() => navigate('/pincode')}
                        aria-label="Change Location"
                        tabIndex={0}
                    >
                        {userData?.phn}
                    </div>
                </div>
            </div>

            <div className='user-upload-book-type'>
                <div
                    className={`user-upload-book-type-book ${type === 'books' ? 'active' : ''}`}
                    onClick={() => setType('books')}
                >
                    Book
                </div>
                <div
                    className={`user-upload-book-type-module ${type === 'modules' ? 'active' : ''}`}
                    onClick={() => setType('modules')}
                >
                    Module
                </div>
            </div>

            {type === 'books' && (
                <UploadBooksForm userData={userData}/>
            )}
             {type === 'modules' && (
                <UploadModuleForm userData={userData}/>
            )}


            {!allField && (
                <div className='use-book-upload-all-field-required-div' >
                    <div className='use-book-upload-all-field-required-div-inner' onClick={() => setallField(true)}>
                        All the * mark field are Required
                        <div className='use-book-upload-all-field-required-div-inner-ok'>
                            ok
                        </div>
                    </div>

                </div>)
            }
        </>
    );
};

export default UploadProduct;