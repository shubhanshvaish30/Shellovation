import React from "react";
import './OrderBar.css';
import { FaShippingFast, FaCheck, FaCreditCard } from "react-icons/fa";

function OrderBar({ currentStep }) {
  const steps = [
    { id: 1, name: 'Shipping Address', icon: <FaShippingFast /> },
    { id: 2, name: 'Confirmation', icon: <FaCheck /> },
    { id: 3, name: 'Payment', icon: <FaCreditCard /> }
  ];

  return (
    <div className="order-bar">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="steps">
            <div className={`step-icon ${currentStep >= step.id ? 'completed' : ''}`}>
                {step.icon}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`step-line ${currentStep > step.id ? 'completed' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default OrderBar;
