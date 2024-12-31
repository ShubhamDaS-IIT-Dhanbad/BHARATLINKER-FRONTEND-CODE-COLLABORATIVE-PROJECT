import React, { useState } from "react";
import "./homeTestimonial.css";

import ti1 from '../../assets/ti1.png'
import ti2 from '../../assets/ti2.png'

const Testimonial = () => {
  const testimonials = [
    {
      name: "Williamson",
      position: "Web Developer",
      image: ti1,
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam enim diam, tempus vel ultrices viverra, luctus in elit.",
    },
    {
      name: "Jessica",
      position: "UI/UX Designer",
      image: ti2, // Replace with actual image
      quote:
        "Aliquam tempus blandit velit, in pharetra ex volutpat a. Cras eu augue ac nisi tempor commodo.",
    },
    {
      name: "Michael",
      position: "Project Manager",
      image: "https://via.placeholder.com/100", // Replace with actual image
      quote:
        "Praesent vitae eros eget tellus tristique bibendum. Donec rutrum sed sem quis venenatis.",
    },
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
          alt={testimonials[current].name}
          className="testimonial-image"
        />
        <h3 className="testimonial-name">
          {testimonials[current].name}, <span>{testimonials[current].position}</span>
        </h3>
        <p className="testimonial-quote">{testimonials[current].quote}</p>
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
