import React, { useEffect, useState } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiUploadCloud } from "react-icons/fi";
import { CiBellOn } from "react-icons/ci";
import { TbDeviceMobileCharging } from "react-icons/tb";
import { AiOutlineProduct } from "react-icons/ai";
import { CiBoxList } from "react-icons/ci";
import { Client, Account } from 'appwrite';
import Cookies from 'js-cookie'
import './userHome.css';
import conf from '../../conf/conf.js';
function UserHome() {
    const [userData, setUserData] = useState();
    const [isLogout, setIsLogout] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const userSession = Cookies.get('BharatLinkerUserData');
            if (userSession) {
                const parsedUserSession = JSON.parse(userSession);
                setUserData(parsedUserSession);
            } else {
                console.warn("No user session found in cookies.");
            }
        } catch (error) {
            console.error("Error parsing user session:", error);
        }
    }, []);
    
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(conf.appwriteUsersProjectId);

    const account = new Account(client);
    const handleLogout = async () => {
        try {
            Cookies.remove('BharatLinkerUserData');
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
                <div className='dashboard-header-parent'>
                    <HiOutlineUserCircle
                        id='dashboard-header-ham'
                        size={35}
                        aria-label="User profile"
                    />
                    <div className='dashboard-header-user'>
                        <p id='dashboard-header-user-location'>Bharat | Linker</p>
                        <p id='dashboard-header-user-email'>{userData?.phoneNumber ? userData?.phoneNumber : ""}</p>
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
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/profile')}>
                        <HiOutlineUserCircle size={27} className='dashboard-Your-information-icons' aria-label="Your refurbished items" />
                        <p className='dashboard-Your-info-p'>Profile</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/refurbished')}>
                        <AiOutlineProduct className='dashboard-Your-information-icons' aria-label="Your refurbished items" />
                        <p className='dashboard-Your-info-p'>Your refurbished</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/upload/book')}>
                        <FiUploadCloud className='dashboard-Your-information-icons' aria-label="Upload books" />
                        <p className='dashboard-Your-info-p'>Upload Books</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/upload/gadget')}>
                        <TbDeviceMobileCharging className='dashboard-Your-information-icons' aria-label="Upload books" />
                        <p className='dashboard-Your-info-p'>Upload Gadgets</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/order')} >
                        <CiBoxList className='dashboard-Your-information-icons' aria-label="Update refurbished items" />
                        <p className='dashboard-Your-info-p'>Order</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/notification')} >
                        <CiBellOn className='dashboard-Your-information-icons' aria-label="Update refurbished items" />
                        <p className='dashboard-Your-info-p'>Notification</p>
                    </article>
                    {/* <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/privacy')}>
                        <CiLock className='dashboard-Your-information-icons' aria-label="Account privacy settings" />
                        <p className='dashboard-Your-info-p'>Account Privacy</p>
                    </article> */}
                    <article className='dashboard-Your-Refurbished' onClick={() => setIsLogout(true)}>
                        <MdOutlineAdminPanelSettings className='dashboard-Your-information-icons' aria-label="Logout" />
                        <p className='dashboard-Your-info-p'>Logout</p>
                    </article>
                </section>
            </main>

            {isLogout &&
                <div className='logout-pop-up'>
                    <div className='logout-pop-up-inner-div'>
                        <div className='logout-pop-up-inner-div-logout-statement'>
                            Are tou sure you want to logout?
                        </div>
                        <div className='logout-pop-up-inner-div-no-yes'>
                            <div className='logout-pop-up-inner-div-no' onClick={() => setIsLogout(false)}>
                                No
                            </div>
                            <div className='logout-pop-up-inner-div-yes' onClick={() => { handleLogout() }}>
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
