import React from 'react';
import PropTypes from 'prop-types';
import './progressBar.css'
const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="shop-data-progress-bar">
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`shop-data-step ${index < currentStep ? 'active' : ''}`}
        >
          <div className="shop-data-step-icon">
            {step.icon || (index + 1)}
          </div>
          <span className="shop-data-step-title">{step.title.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
};

ProgressBar.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.node
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired
};

export default ProgressBar;