import React, { useState } from "react";
import "./homeTestimonial.css";


const ti1='';
const ti2='';

const Testimonial = () => {
  const testimonials = [
    {
      title: "BHARAT | LINKER",
      description:"We are testing our platform in the Berhampur and Murshidabad regions. As a small team of recent graduates, our resources are limited, but we are passionate about improving and expanding our services based on your feedback.",
      image: ti1,
    },    
    {
      title: "Our Aim",
      description:
        "At BharatLinker, our goal is to create a seamless and efficient platform that connects users with the right services. We aim to provide solutions that foster growth and development for businesses and individuals alike.",
      image: ti1,
    },
    {
      title: "Help Us Grow",
      description:
        "We are constantly working towards improving our platform and services. Your feedback and support are invaluable in helping us expand and refine our offerings to better serve your needs.",
      image: ti2, // Replace with actual image
    },
    {
      title: "Join Us in Our Mission",
      description:
        "We invite you to be a part of BharatLinker’s journey. Whether you’re a user or a service provider, together, we can build a more connected and efficient digital ecosystem.",
      image: ti1, // Replace with actual image
    },
    {
      title: "Our Commitment",
      description:
        "BharatLinker is committed to delivering exceptional service and innovative solutions. We are here to support you every step of the way and provide a reliable platform for your digital needs.",
      image: ti2, // Replace with actual image
    },
    {
      title: "Your Feedback Matters",
      description:
        "We value the input of our users. Your feedback helps us shape the future of BharatLinker, allowing us to provide better features and improve the overall experience for everyone.",
      image: ti2, // Replace with actual image
    },
    {
      title: "Building the Future Together",
      description:
        "As we continue to grow, we remain focused on creating a platform that truly addresses the needs of our users. Join us in building the future of digital connections.",
      image: ti1, // Replace with actual image
    },
    {
      title: "Stay Connected",
      description:
        "At BharatLinker, we believe in the power of connection. Stay updated with our latest features and developments by following us and becoming part of our community.",
      image: "https://via.placeholder.com/100", // Replace with actual image
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
          alt={testimonials[current].title}
          className="testimonial-image"
        />
        <h3 className="testimonial-title">{testimonials[current].title}</h3>
        <p className="testimonial-description">{testimonials[current].description}</p>
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
