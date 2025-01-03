import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import UpdateModule from './moduleUpdateForm.jsx'
import { IoClose } from 'react-icons/io5';
import { CiImageOn } from "react-icons/ci";
import Cookies from 'js-cookie';

import userUploadBooks from '../../../appWrite/UserUploadRefurbished/userUploadBooks.js';
import './userUpdateBook.css';

const UploadProduct = () => {
  const navigate = useNavigate();
  const productId = useParams('id');
  const [type, setType] = useState('module');
  const [userData, setUserData] = useState('');


  useEffect(() => {
    const userSession = Cookies.get('BharatLinkerUser');
    if (userSession) {
      setUserData(JSON.parse(userSession));
    }
  }, []);

 

  return (
    <>
      <div className='user-update-books-header'>
        <FaArrowLeft
          id='user-update-books-header-left-icon'
          size={25}
          onClick={() => navigate('/user/refurbished')}
          aria-label="User Account"
          tabIndex={0}
        />
        <div className='user-update-books-header-inner-div'>
          <p className='user-update-books-header-inner-div-p'>UPDATE {type?.toUpperCase()}</p>
          <div
            className={`user-update-books-header-inner-div-phn-div`}
            onClick={() => navigate('/pincode')}
            aria-label="Change Location"
            tabIndex={0}
          >
            {userData.phn}
          </div>
        </div>
      </div>

      <div className='user-update-book-type'>
        <div
          className={`user-update-book-type-book ${type === 'module' ? 'active' : ''}`}
          onClick={() => setType('books')}
        >
          {type}
        </div>

      </div>

      <UpdateModule userData={userData}/>
    </>
  );
};

export default UploadProduct;

