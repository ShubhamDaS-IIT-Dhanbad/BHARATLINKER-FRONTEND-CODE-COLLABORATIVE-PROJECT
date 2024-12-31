import React from "react";
import "./homeFooter.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3 className="footer-heading">NEED HELP?</h3>
        <hr className="footer-line" />
        <ul className="footer-list">
          <li className="footer-list-item">
            <a href="#increase-contrast" className="footer-link">Increase contrast</a>
          </li>
          <li className="footer-list-item">
            <a href="#store-locator" className="footer-link">Store Locator</a>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-heading">CONTACT US</h3>
        <hr className="footer-line" />
        <ul className="footer-list">
          <li className="footer-list-item">
            <a href="#contact" className="footer-link">Contact Us</a>
          </li>
          <li className="footer-list-item">
            <a href="#careers" className="footer-link">Careers</a>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-heading">LEGAL</h3>
        <hr className="footer-line" />
        <ul className="footer-list">
          <li className="footer-list-item">
            <a href="#legal-terms" className="footer-link">Legal terms</a>
          </li>
          <li className="footer-list-item">
            <a href="#privacy-policy" className="footer-link">Privacy Policy</a>
          </li>
          <li className="footer-list-item">
            <a href="#cookie-management" className="footer-link">Notice about cookie management</a>
          </li>
          <li className="footer-list-item">
            <a href="#transparency" className="footer-link">California Transparency in Supply Chains Act</a>
          </li>
          <li className="footer-list-item">
            <a href="#faq" className="footer-link">FAQ</a>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-heading">FOLLOW US</h3>
        <hr className="footer-line" />
        <div className="footer-social-icons">
          <a href="#twitter" className="footer-icon">🐦</a>
          <a href="#facebook" className="footer-icon">📘</a>
          <a href="#instagram" className="footer-icon">📸</a>
          <a href="#youtube" className="footer-icon">▶️</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
