import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.scss';
import { serviceCategories } from '../data/services';

const Services = () => {
  const navigate = useNavigate();

  const handleStart = (serviceId) => {
    navigate(`/dashboard/book/${serviceId}`);
  };

  return (
    <div className="services-page">
      <h2>Immigration Services</h2>
      <p>Select a service to get started.</p>

      {serviceCategories.map((category, i) => (
        <div className="category-block" key={i}>
          <h3>{category.name}</h3>
          <div className="services-grid">
            {category.services.map((service) => (
              <div className="service-card" key={service.id}>
                <div className="icon">{service.icon}</div>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <button onClick={() => handleStart(service.id)} className="action-btn">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Services;
