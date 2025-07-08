import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaCalendarAlt, FaGlobe, FaIdCard,
  FaClock, FaArrowRight, FaSpinner
} from 'react-icons/fa';
import './NewPassportForm.scss';

const NewPassportForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    nationality: 'Ethiopian',
    idFile: null,
    appointmentDate: '',
    timeSlot: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'idFile' && files) {
      const file = files[0];
      setFileName(file.name);
      setForm({ ...form, idFile: file });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1 && (!form.fullName || !form.dob)) {
      setError('Please fill in all required fields');
      return;
    }
    if (currentStep === 2 && !form.idFile) {
      setError('Please upload your ID document');
      return;
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  const formData = new FormData();
  // Append all form fields
  formData.append('serviceType', 'new-passport');
  formData.append('fullName', form.fullName);
  // ... append other fields
  if (form.idFile) {
    formData.append('document', form.idFile);
  }

  try {
    const response = await fetch('http://localhost:5000/api/services/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        // Don't set Content-Type header - browser will set it automatically
      },
      body: formData
    });

    // First check if we got ANY response
    if (!response) {
      throw new Error('No response from server - check backend is running');
    }

    // Get raw response text
    const text = await response.text();
    console.log('Raw server response:', text); // Debug log

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // If not JSON, check if it's an HTML error page
      if (text.startsWith('<!DOCTYPE')) {
        throw new Error('Backend returned HTML error page. Check server logs.');
      }
      throw new Error(text || 'Invalid server response');
    }

    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(data.message || `Server error: ${response.status}`);
    }

    // Success case
    localStorage.setItem('latestService', JSON.stringify(data.service));
    navigate('/confirmation');

  } catch (err) {
    setError(err.message);
    console.error('Submission failed:', err);
  } finally {
    setLoading(false);
  }
};

  // Available time slots
  const timeSlots = [
    '08:00:00',
    '09:00:00',
    '10:00:00',
    '11:00:00',
    '13:00:00',
    '14:00:00',
    '15:00:00'
  ];

  return (
    <div className="passport-form-container">
      <div className="form-header">
        <h2>New Passport Application</h2>
        <p>Complete this form to book your passport appointment</p>
      </div>

      <div className="progress-indicator">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{step < currentStep ? '✓' : step}</div>
            <div className="step-label">
              {step === 1 && 'Personal Info'}
              {step === 2 && 'Documents'}
              {step === 3 && 'Schedule'}
            </div>
          </div>
        ))}
      </div>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="modern-form">
        {currentStep === 1 && (
          <div className="form-step">
            <div className="input-group">
              <label><FaUser className="input-icon" /> Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name as it appears on your ID"
                required
              />
            </div>

            <div className="input-group">
              <label><FaCalendarAlt className="input-icon" /> Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="input-group">
              <label><FaGlobe className="input-icon" /> Nationality</label>
              <select 
                name="nationality" 
                value={form.nationality} 
                onChange={handleChange}
                required
              >
                <option value="Ethiopian">Ethiopian</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="next-button" onClick={nextStep}>
                Continue <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <div className="file-upload-container">
              <label><FaIdCard className="input-icon" /> Upload ID Document</label>
              <p className="file-requirements">
                Please upload a clear copy of your current ID (PDF, JPG, or PNG, max 5MB)
              </p>
              <div className="file-upload-box">
                <input
                  type="file"
                  id="idFile"
                  name="idFile"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="file-input"
                  required
                />
                <label htmlFor="idFile" className="file-upload-label">
                  {fileName ? (
                    <span className="file-name">{fileName}</span>
                  ) : (
                    <>
                      <span>Click to upload file</span>
                      <span className="file-types">(PDF, JPG, PNG)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="back-button" onClick={prevStep}>
                Back
              </button>
              <button type="button" className="next-button" onClick={nextStep}>
                Continue <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <div className="input-group">
              <label><FaCalendarAlt className="input-icon" /> Appointment Date</label>
              <input
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="input-group">
              <label><FaClock className="input-icon" /> Time Slot</label>
              <select
                name="timeSlot"
                value={form.timeSlot}
                onChange={handleChange}
                required
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot, index) => {
                  const time = new Date(`2000-01-01T${slot}`);
                  const endTime = new Date(time.getTime() + 60 * 60 * 1000); // Add 1 hour
                  return (
                    <option key={index} value={slot}>
                      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-summary">
              <h4>Application Summary</h4>
              <div className="summary-item">
                <span>Service:</span>
                <span>New Passport Application</span>
              </div>
              <div className="summary-item">
                <span>Name:</span>
                <span>{form.fullName || 'Not provided'}</span>
              </div>
              <div className="summary-item">
                <span>Date of Birth:</span>
                <span>{form.dob || 'Not provided'}</span>
              </div>
              <div className="summary-item">
                <span>ID Document:</span>
                <span>{fileName || 'Not uploaded'}</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="back-button" onClick={prevStep}>
                Back
              </button>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner-icon" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewPassportForm;