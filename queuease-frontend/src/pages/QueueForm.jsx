import React, { useState } from 'react';
import './QueueForm.scss';

const QueueForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    serviceType: '',
    date: '',
    time: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted! Check console for data.');
    console.log('Queue Registration Submitted:', formData);
  };

  return (
    <div className="queue-form-container">
      <form className="queue-form" onSubmit={handleSubmit}>
        <h2>Register for Immigration Service</h2>
        
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="passportNumber"
          placeholder="Passport Number"
          value={formData.passportNumber}
          onChange={handleChange}
          required
        />

        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
        >
          <option value="">Select Service</option>
          <option value="passport-renewal">Passport Renewal</option>
          <option value="visa-application">Visa Application</option>
          <option value="residency">Residency Permit</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default QueueForm;
