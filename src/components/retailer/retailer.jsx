import React, { useState, useEffect } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { FiUploadCloud } from 'react-icons/fi';
import { TbDeviceMobileCharging } from 'react-icons/tb';
import { AiOutlineProduct } from 'react-icons/ai';
import { Oval } from 'react-loader-spinner';
import ToggleIsOpenShop from './ToggleShop/main.jsx';
import './retailer.css';
import '../user/style/userHome.css';

function UserHome({ shopData }) {
  const navigate = useNavigate();

  const [isLogout, setIsLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      document.cookie = "BharatLinkerShopData=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate('/');
      }, 1000);
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick }) => (
    <article className='dashboard-Your-Refurbished' onClick={onClick}>
      <Icon className='retailer-home-route-icons' aria-label={label} />
      <p className='dashboard-Your-info-p'>{label}</p>
    </article>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
              {shopData?.shopName?.toUpperCase() || ""}
            </p>
            <p id='retailer-home-header-user-email'>
              {shopData?.phoneNumber || ""}
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
            onClick={() => navigate('/retailer/orders')}
            label="Orders"
          />
          <MenuItem
            icon={MdOutlineAdminPanelSettings}
            label="Logout"
            onClick={() => setIsLogout(true)}
          />

          <div className='retailer-home-toggle-isopen'>
            <ToggleIsOpenShop shopData={shopData} />
          </div>
        </section>
      </main>

      {isLogout && (
        <div className='logout-pop-up'>
          <div className='logout-pop-up-inner-div'>
            <div className='logout-pop-up-inner-div-logout-statement'>
              {shopData.shopName} - LOGOUT ?
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
                onClick={() => { handleLogout() }}
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
