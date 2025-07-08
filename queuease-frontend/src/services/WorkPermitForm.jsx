import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBriefcase, FaBuilding, FaFileSignature, FaFileUpload, FaPaperclip, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import './WorkPermitForm.scss';

const WorkPermitForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    passportNumber: '',
    employerName: '',
    jobTitle: '',
    contractStartDate: '',
    documents: null
  });
  const [fileName, setFileName] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'documents' && files) {
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
    <div className="work-permit-form-container">
      <div className="form-header">
        <h2>Work Permit Application</h2>
        <p>Complete this form to apply for your Ethiopian work permit</p>
      </div>

      <div className="progress-indicator">
        {[1, 2].map((step) => (
          <div 
            key={step} 
            className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{step < currentStep ? '✓' : step}</div>
            <div className="step-label">
              {step === 1 && 'Personal & Employment'}
              {step === 2 && 'Documents'}
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
                placeholder="As shown in your passport"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FaFileSignature className="input-icon" />
                Passport Number
              </label>
              <input
                type="text"
                name="passportNumber"
                value={form.passportNumber}
                onChange={handleChange}
                placeholder="Your passport number"
                required
                pattern="[A-Za-z0-9]{6,12}"
              />
            </div>

            <div className="input-group">
              <label>
                <FaBuilding className="input-icon" />
                Employer Name
              </label>
              <input
                type="text"
                name="employerName"
                value={form.employerName}
                onChange={handleChange}
                placeholder="Your employer's legal name"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FaBriefcase className="input-icon" />
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                placeholder="Your position in the company"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FaCalendarAlt className="input-icon" />
                Contract Start Date
              </label>
              <input
                type="date"
                name="contractStartDate"
                value={form.contractStartDate}
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
                Required Documents
              </label>
              <div className="file-upload-box">
                <input
                  type="file"
                  id="documents"
                  name="documents"
                  accept=".pdf,.jpg,.png"
                  onChange={handleChange}
                  required
                  className="file-input"
                />
                <label htmlFor="documents" className="file-upload-label">
                  {fileName ? (
                    <>
                      <FaPaperclip className="file-icon" />
                      <span className="file-name">{fileName}</span>
                    </>
                  ) : (
                    <>
                      <span>Drag & drop files or click to browse</span>
                      <span className="file-types">(PDF, JPG, PNG - Max 10MB each)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="document-checklist">
              <h4>Required Documents:</h4>
              <ul>
                <li>Passport copy (bio page and visa page)</li>
                <li>Employment contract</li>
                <li>Employer's business license</li>
                <li>Educational certificates</li>
                <li>Professional qualifications</li>
                <li>Medical certificate</li>
                <li>Two passport-sized photos</li>
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

export default WorkPermitForm;