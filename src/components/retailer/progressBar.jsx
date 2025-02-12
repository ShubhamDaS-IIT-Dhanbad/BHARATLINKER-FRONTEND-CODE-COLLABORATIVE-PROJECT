import React from 'react';
import PropTypes from 'prop-types';
import './style/progressBar.css'
const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`step ${index < currentStep ? 'active' : ''}`}
        >
          <div className="step-icon">
            {step.icon || (index + 1)}
          </div>
          <span className="step-title">{step.title}</span>
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