import React, { useState } from "react";
import "./homeTestimonial.css";

const Testimonial = ({ ti1 }) => {
  const testimonials = [
    {
      title: "Empowering Local Retailers",
      description:
        "With giants like Zepto and Blinkit expanding into Tier 2 and Tier 3 cities, small retailers face tough competition. BharatLinker provides a powerful digital platform to help retailers stay ahead and thrive in the online era.",
      image: ti1, // Replace with actual image
    },
    {
      title: "Bridging the Digital Gap",
      description:
        "The rise of big e-commerce players is disrupting traditional supply chains. BharatLinker is here to level the playing field by offering retailers a seamless online platform to grow their business and compete effectively.",
      image: ti1, // Replace with actual image
    },
    {
      title: "Tech for Retailers, Power to You",
      description:
        "As large corporations enter local markets, BharatLinker stands with small retailers by providing innovative digital solutions to enhance visibility, streamline operations, and drive customer engagement.",
      image: ti1, // Replace with actual image
    },
    {
      title: "Digital Transformation for Retail",
      description:
        "Big players are rapidly capturing customers, leaving small retailers struggling. BharatLinker empowers local businesses with the tech they need to compete, grow, and offer online services effortlessly.",
      image: ti1, // Replace with actual image
    },
    {
      title: "Redefining Retail for the Future",
      description:
        "The supply chain is evolving, and we ensure that local retailers are not left behind. BharatLinker provides a robust digital platform to help businesses adapt, connect with customers, and stay competitive in the changing market.",
      image: ti1, // Replace with actual image
    }

  ];

  const [current, setCurrent] = useState(0);

  const handleDotClick = (index) => {
    setCurrent(index);
  };

  return (
    <div className="testimonial-container">
      <div className="testimonial">
        <img
          src={testimonials[current].image}
          alt={testimonials[current].title}
          className="testimonial-image"
        />
        <h3 className="testimonial-title">{testimonials[current].title.toUpperCase()}</h3>
        <div className="home-testimonial-description">{testimonials[current].description}</div>
      </div>
      <div className="testimonial-dots">
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
