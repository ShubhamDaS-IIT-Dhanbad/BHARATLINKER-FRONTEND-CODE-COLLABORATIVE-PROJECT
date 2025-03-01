import React, { useState } from "react";
import "./style/userTestimonial.css";

const Testimonial = ({ti1}) => {
  const testimonials = [
    {
      title: "Struggles in the Tech Era",
      description:
        "In this new technological era, local rural retailers struggle to keep up with e-commerce giants like Flipkart, Zepto, and Blinkit. Limited digital access and resources put them at a disadvantage. We’re here to bridge that gap.",
      image: ti1,
    },    
    {
      title: "Empowering Rural Retail",
      description:
        "At BharatLinker, we aim to empower rural retailers facing the challenges of this tech-driven age. Our platform helps them compete with giants like Flipkart and Blinkit by connecting them to a wider audience.",
      image: ti1,
    },
    {
      title: "Help Us Lift Local Stores",
      description:
        "Rural retailers battle high fees, low visibility, and fast delivery promises from platforms like Zepto in this technological era. Your support and feedback can help us create tools to level the playing field.",
      image: ti1,
    },
    {
      title: "Join Our Mission",
      description:
        "Be part of BharatLinker’s effort to support rural retailers in this digital age. Together, we can help them overcome the dominance of e-commerce giants like Flipkart and Blinkit for a fairer future.",
      image: ti1,
    },
    {
      title: "Our Commitment to Growth",
      description:
        "BharatLinker is dedicated to helping rural retailers thrive in this new technological era. We provide affordable, innovative solutions to counter the challenges posed by e-commerce giants.",
      image: ti1,
    },
    {
      title: "Your Input Shapes Tomorrow",
      description:
        "Rural retailers need your help to adapt to this tech-driven world. Your feedback enables BharatLinker to tackle their struggles against platforms like Flipkart and Zepto effectively.",
      image: ti1,
    },
    {
      title: "Building a Future Together",
      description:
        "In this technological era, e-commerce giants often outpace rural stores. Join us in creating a platform that boosts their growth and resilience against companies like Blinkit and Flipkart.",
      image: ti1,
    },
    {
      title: "Support Local, Stay Connected",
      description:
        "By staying connected with BharatLinker, you help rural retailers navigate the challenges of this digital age. Support local businesses as they stand up to e-commerce giants and thrive.",
      image: ti1,
    },
  ];

  const [current, setCurrent] = useState(0);

  const handleDotClick = (index) => {
    setCurrent(index);
  };

  return (
    <div className="user-testimonial-container">
      <div className="user-testimonial">
        <img
          src={testimonials[current].image}
          alt={testimonials[current].title}
          className="user-testimonial-image"
        />
        <h3 className="user-testimonial-title">{testimonials[current].title.toUpperCase()}</h3>
        <p className="user-testimonial-description">{testimonials[current].description}</p>
      </div>
      <div className="user-testimonial-dots">
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`user-testimonial-dot ${index === current ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;