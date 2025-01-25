import React, { useState } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { FiUploadCloud } from 'react-icons/fi';
import { CiBellOn } from 'react-icons/ci';
import { TbDeviceMobileCharging } from 'react-icons/tb';
import { AiOutlineProduct } from 'react-icons/ai';
import { Oval } from 'react-loader-spinner';

import useRetailerAuthHook from '../../hooks/retailerAuthHook';

import './retailer.css';
import '../user/userHome.css';

function UserHome({ retailerData }) {
  const navigate = useNavigate();
  const { logout } = useRetailerAuthHook();

  const [isLogout, setIsLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
      navigate('/');
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick }) => (
    <article className='dashboard-Your-Refurbished' onClick={onClick}>
      <Icon className='retailer-home-route-icons' aria-label={label} />
      <p className='dashboard-Your-info-p'>{label}</p>
    </article>
  );

  return (
    <>
      <header>
        <div className='dashboard-header-parent'>
          <HiOutlineUserCircle
            id='dashboard-header-ham'
            size={35}
            aria-label="User profile"
          />
          <div className='retailer-home-header-user'>
            <p id='retailer-home-header-user-location'>
              {retailerData?.shopName?.toUpperCase() || ""}
            </p>
            <p id='retailer-home-header-user-email'>
              {retailerData?.phoneNumber || ""}
            </p>
          </div>
          <IoHomeOutline
            size={25}
            className='dashboard-header-parent-refurbished'
            aria-label="Home"
            onClick={() => navigate('/')}
          />
        </div>
      </header>

      <main>
        <section className='dashboard-Your-information'>
          <MenuItem
            icon={HiOutlineUserCircle}
            label="Dashboard"
            onClick={() => navigate('/retailer/dashboard')}
          />
          <MenuItem
            icon={AiOutlineProduct}
            label="Your Products"
            onClick={() => navigate('/retailer/products')}
          />
          <MenuItem
            icon={FiUploadCloud}
            label="Upload Products"
            onClick={() => navigate('/retailer/upload')}
          />
          <MenuItem
            icon={TbDeviceMobileCharging}
            label="Orders"
          />
          <MenuItem
            icon={CiBellOn}
            label="Notification"
          />
          <MenuItem
            icon={MdOutlineAdminPanelSettings}
            label="Logout"
            onClick={() => setIsLogout(true)}
          />
        </section>
      </main>

      {isLogout && (
        <div className='logout-pop-up'>
          <div className='logout-pop-up-inner-div'>
            <div className='logout-pop-up-inner-div-logout-statement'>
              {retailerData.shopName} - LOGOUT ?
            </div>
            <div className='logout-pop-up-inner-div-no-yes'>
              <div
                className='logout-pop-up-inner-div-no'
                onClick={() => setIsLogout(false)}
              >
                No
              </div>
              <div
                className='logout-pop-up-inner-div-yes'
                onClick={()=>{handleLogout()}}
              >
                {isLoggingOut ? (
                  <Oval height={30} width={30} color="green" secondaryColor="white" ariaLabel="loading" />
                ) : (
                  "Yes"
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserHome;
