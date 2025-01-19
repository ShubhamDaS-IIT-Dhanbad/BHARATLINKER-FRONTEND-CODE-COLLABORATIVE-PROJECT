import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaArrowLeft } from 'react-icons/fa';
import Cookies from 'js-cookie'
import './userNotification.css';

const un='https://res.cloudinary.com/demc9mecm/image/upload/v1737182575/mz1bdy2skwtmouqxfqtf.jpg';

function UserHome() {
    const [userData, setUserData] = useState({ phn: 8250846979 });
    const navigate = useNavigate();

    useEffect(() => {
        const userSession = Cookies.get('BharatLinkerUser');
        setUserData(JSON.parse(userSession));
    }, [])
    return (
        <>
            <header>
                <div className='dashboard-header-parent'>
                    <FaArrowLeft
                        id='dashboard-header-ham'
                        size={30}
                        aria-label="User profile"
                        onClick={() => navigate('/user')}
                    />
                    <div className='dashboard-header-user'>
                        <p id='dashboard-header-user-location'>NOTIFICATION</p>
                        <p id='dashboard-header-user-email'>{userData.phn ? userData.phn : ""}</p>
                    </div>
                </div>
            </header>

            <main>
                <div className='user-notification-div'>
                    <img className='user-notification-div-img' src={un}/>
                </div>
            </main>


        </>
    );
}

export default UserHome;
