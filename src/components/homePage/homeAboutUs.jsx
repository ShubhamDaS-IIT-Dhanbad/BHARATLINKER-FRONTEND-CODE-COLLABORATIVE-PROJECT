import React from "react";
import "./homeAboutUs.css"; // Assuming you put the CSS in a file named AboutUs.css

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <div className="about-us-image">
          <img
            src="https://via.placeholder.com/500x300"
            alt="About Us"
          />
        </div>
        <div className="about-us-text">
          <h2>Who Are We?</h2>
          <p>
            We help people to build incredible brands and superior products.
            Our perspective is to furnish outstanding captivating services.
          </p>
          <p>
            Nullam gravida orci ac luctus molestie. Fusce finibus congue erat,
            non aliquam magna tincidunt at. Aenean lacinia arcu ac, sed pharetra
            nibh porta a. Curabitur vel consequat nibh, ac interdum nisl. Nunc
            pulvinar nec massa vitae sollicitudin.
          </p>
          <div className="about-us-services">
            <div className="service">
              <span className="icon">⚙️</span>
              <h4>Versatile Brand</h4>
              <p>
                We are crafting a digital method that subsists life across all
                mediums.
              </p>
            </div>
            <div className="service">
              <span className="icon">💧</span>
              <h4>Digital Agency</h4>
              <p>
                We believe in innovation by integrating primary with elaborate
                ideas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
