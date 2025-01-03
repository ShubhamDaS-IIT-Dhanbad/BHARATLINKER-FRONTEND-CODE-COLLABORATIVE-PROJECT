import React, { useEffect,useState } from 'react';
import { TbShieldMinus } from 'react-icons/tb';
import { IoHomeOutline } from 'react-icons/io5';
import { BiSearchAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiUploadCloud } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { TbDeviceMobileCharging } from "react-icons/tb";
import { AiOutlineProduct } from "react-icons/ai";
import { Client, Account, ID } from 'appwrite';
import Cookies from 'js-cookie'
import './userHome.css';

function UserHome() {
    const [userData, setUserData] = useState({phn:''});
    const [isLogout, setIsLogout] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const userSession = Cookies.get('BharatLinkerUser');
        setUserData(JSON.parse(userSession));
    },[])
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('670211c2003bf4774272');

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
                <div className='dashboard-header-parent'>
                    <HiOutlineUserCircle
                        id='dashboard-header-ham'
                        size={35}
                        aria-label="User profile"
                    />
                    <div className='dashboard-header-user'>
                        <p id='dashboard-header-user-location'>Bharat | Linker</p>
                        <p id='dashboard-header-user-email'>{userData.phn ? userData.phn:""}</p>
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
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/refurbished')}>
                        <AiOutlineProduct className='dashboard-Your-information-icons' aria-label="Your refurbished items" />
                        <p className='dashboard-Your-info-p'>Your refurbished</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/upload/books')}>
                        <FiUploadCloud className='dashboard-Your-information-icons' aria-label="Upload books" />
                        <p className='dashboard-Your-info-p'>Upload Books</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/upload/gadgets')}>
                        <TbDeviceMobileCharging  className='dashboard-Your-information-icons' aria-label="Upload books" />
                        <p className='dashboard-Your-info-p'>Upload Gadgets</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/notification')} >
                        <CiBellOn className='dashboard-Your-information-icons' aria-label="Update refurbished items" />
                        <p className='dashboard-Your-info-p'>Notification</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => navigate('/user/privacy')}>
                        <CiLock className='dashboard-Your-information-icons' aria-label="Account privacy settings" />
                        <p className='dashboard-Your-info-p'>Account Privacy</p>
                    </article>
                    <article className='dashboard-Your-Refurbished' onClick={() => setIsLogout(true)}>
                        <MdOutlineAdminPanelSettings className='dashboard-Your-information-icons' aria-label="Logout" />
                        <p className='dashboard-Your-info-p'>Logout</p>
                    </article>
                </section>
            </main>

            <footer>
                <p className='dashboard-footer-p'>© 2024 Bharat Linker</p>
            </footer>

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
                            <div className='logout-pop-up-inner-div-yes' onClick={()=>{handleLogout()}}>
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
