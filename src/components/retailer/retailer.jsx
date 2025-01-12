import React, { useEffect, useState } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiUploadCloud } from "react-icons/fi";
import { CiBellOn } from "react-icons/ci";
import { TbDeviceMobileCharging } from "react-icons/tb";
import { AiOutlineProduct } from "react-icons/ai";
import { Client, Account, ID } from 'appwrite';
import Cookies from 'js-cookie'
import conf from '../../conf/conf.js';
import './retailer.css'
function UserHome() {
  const [userData, setUserData] = useState({ phn: 8250846979 });
  const [isLogout, setIsLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userSession = Cookies.get('BharatLinkerShopData');
    setUserData(JSON.parse(userSession));
  }, [])
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(conf.appwriteUsersProjectId);

  const account = new Account(client);
  const handleLogout = async () => {
    try {
      Cookies.remove('BharatLinkerUser');
      await account.deleteSession('current');

      navigate('/login');
      console.log('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <>
      <header>
        <div className='retailer-home-header-parent'>
          <HiOutlineUserCircle
            id='retailer-home-header-ham'
            size={35}
            aria-label="User profile"
          />
          <div className='retailer-home-header-user'>
            <p id='retailer-home-header-user-location'>{userData?.shopName}</p>
            <p id='retailer-home-header-user-email'>{userData?.phoneNumber ? userData?.phoneNumber : ""}</p>
          </div>
          <IoHomeOutline
            size={25}
            className='retailer-home-header-parent-icon'
            aria-label="Home"
            onClick={() => navigate('/')}
          />
        </div>
      </header>

      <main>
        <section className='retailer-home-your-information'>
          <article className='retailer-home-your-refurbished'>
            <HiOutlineUserCircle size={27} className='retailer-home-your-information-icons' aria-label="Your refurbished items" />
            <p className='retailer-home-your-info-p'>Profile</p>
          </article>
          <article className='retailer-home-your-refurbished'>
            <AiOutlineProduct className='retailer-home-your-information-icons' aria-label="Your refurbished items" />
            <p className='retailer-home-your-info-p'>Your refurbished</p>
          </article>
          <article className='retailer-home-your-refurbished'>
            <FiUploadCloud className='retailer-home-your-information-icons' aria-label="Upload books" />
            <p className='retailer-home-your-info-p'>Upload Books</p>
          </article>
          <article className='retailer-home-your-refurbished'>
            <TbDeviceMobileCharging className='retailer-home-your-information-icons' aria-label="Upload books" />
            <p className='retailer-home-your-info-p'>Upload Gadgets</p>
          </article>
          <article className='retailer-home-your-refurbished'>
            <CiBellOn className='retailer-home-your-information-icons' aria-label="Update refurbished items" />
            <p className='retailer-home-your-info-p'>Notification</p>
          </article>
          <article className='retailer-home-your-refurbished'>
            <MdOutlineAdminPanelSettings className='retailer-home-your-information-icons' aria-label="Logout" />
            <p className='retailer-home-your-info-p'>Logout</p>
          </article>
        </section>
      </main>

      {isLogout &&
        <div className='retailer-home-logout-pop-up'>
          <div className='retailer-home-logout-pop-up-inner-div'>
            <div className='retailer-home-logout-pop-up-inner-div-logout-statement'>
              Are you sure you want to logout?
            </div>
            <div className='retailer-home-logout-pop-up-inner-div-no-yes'>
              <div className='retailer-home-logout-pop-up-inner-div-no' onClick={() => setIsLogout(false)}>
                No
              </div>
              <div className='retailer-home-logout-pop-up-inner-div-yes' onClick={() => { handleLogout() }}>
                Yes
              </div>
            </div>
          </div>
        </div>
      }
    </>

  );
}

export default UserHome;
