import React, { useState } from 'react';
import './main.css';
import Login from './login.jsx';
import Register from './register.jsx';


const sd="https://res.cloudinary.com/demc9mecm/image/upload/v1741231642/sd_ivpyyo.webp";
function Main() {
  const [page, setPage] = useState("default");

  return (
    <>
      {page === "default" && (
        <div className="shop-login-main-default-content">

          <div className="shop-login-main-rocket-image-c">
            <img
              src={sd}
              alt="Rocket illustration"
              className="shop-login-main-rocket-image"
            />
          </div>
          <h1 className="shop-login-main-title">RISE ABOVE,THRIVE WITH BHARAT LINKER</h1>
          <p className="shop-login-main-subtitle">
           A-Rise, Empower your shop, connect with customers, and dominate the market. Join
            Bharat Linker to unlock growth and success for your business today!
          </p>
          <div className="shop-login-main-button-container">
            <button className="shop-login" onClick={() => setPage("login")}>
              Sign In
            </button>
            <button className="register-btn" onClick={() => setPage("register")}>
              Register
            </button>
          </div>
        </div>
      )}

      {page === "login" && <Login setPage={setPage}/>}
      {page === "register" && <Register setPage={setPage}/>}
    </>
  );
}

export default Main;