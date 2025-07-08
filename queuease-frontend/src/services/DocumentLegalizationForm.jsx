import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBuilding, FaBriefcase, FaCalendarAlt, FaFileUpload, FaPaperclip, FaArrowRight } from 'react-icons/fa';
import './DocumentLegalizationForm.scss';

const DocumentLegalizationForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    companyName: '',
    position: '',
    travelDate: '',
    document: null
  });
  const [fileName, setFileName] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'document' && files) {
      setFileName(files[0].name);
    }
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('latestBooking', JSON.stringify(form));
    navigate('/dashboard/booking-confirmation');
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="document-form-container">
      <div className="form-header">
        <h2>Document Legalization Service</h2>
        <p>Complete this form to legalize your documents for international use</p>
      </div>

      <div className="progress-indicator">
        {[1, 2].map((step) => (
          <div 
            key={step} 
            className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{step < currentStep ? '✓' : step}</div>
            <div className="step-label">
              {step === 1 && 'Personal Details'}
              {step === 2 && 'Document Upload'}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        {currentStep === 1 && (
          <div className="form-step">
            <div className="input-group">
              <label>
                <FaUser className="input-icon" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full legal name"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FaBuilding className="input-icon" />
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FaBriefcase className="input-icon" />
                Position
              </label>
              <select 
                name="position" 
                value={form.position} 
                onChange={handleChange} 
                required
              >
                <option value="">-- Select your position --</option>
                <option value="Director">Director</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
                <option value="Owner">Owner</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>
                <FaCalendarAlt className="input-icon" />
                Travel Date
              </label>
              <input
                type="date"
                name="travelDate"
                value={form.travelDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
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
              <label>
                <FaFileUpload className="input-icon" />
                Document to Legalize
              </label>
              <div className="file-upload-box">
                <input
                  type="file"
                  id="document"
                  name="document"
                  accept=".pdf,.jpg,.png"
                  onChange={handleChange}
                  required
                  className="file-input"
                />
                <label htmlFor="document" className="file-upload-label">
                  {fileName ? (
                    <>
                      <FaPaperclip className="file-icon" />
                      <span className="file-name">{fileName}</span>
                    </>
                  ) : (
                    <>
                      <span>Drag & drop file here or click to browse</span>
                      <span className="file-types">(PDF, JPG, PNG - Max 10MB)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="document-requirements">
              <h4>Document Requirements:</h4>
              <ul>
                <li>Clear, legible copies of original documents</li>
                <li>Maximum file size: 10MB</li>
                <li>Accepted formats: PDF, JPG, PNG</li>
                <li>Documents must be in English or include certified translation</li>
              </ul>
            </div>

            <div className="form-actions">
              <button type="button" className="back-button" onClick={prevStep}>
                Back
              </button>
              <button type="submit" className="submit-button">
                Submit Application
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default DocumentLegalizationForm;