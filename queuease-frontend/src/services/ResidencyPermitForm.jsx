import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser,FaPassport,FaHome,FaFileAlt,FaFileUpload,FaPaperclip,FaArrowRight,FaCalendarAlt } from 'react-icons/fa';
import './ResidencyPermitForm.scss';

const ResidencyPermitForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    passportNumber: '',
    currentVisaType: '',
    visaExpiryDate: '',
    residencyType: '',
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
    <div className="residency-permit-form-container">
      <div className="form-header">
        <h2>Residency Permit Application</h2>
        <p>Apply for temporary or permanent residency in Ethiopia</p>
      </div>

      <div className="progress-indicator">
        {[1, 2].map((step) => (
          <div 
            key={step} 
            className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{step < currentStep ? '✓' : step}</div>
            <div className="step-label">
              {step === 1 && 'Applicant Information'}
              {step === 2 && 'Supporting Documents'}
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
                <FaPassport className="input-icon" />
                Passport Number
              </label>
              <input
                type="text"
                name="passportNumber"
                value={form.passportNumber}
                onChange={handleChange}
                placeholder="Your current passport number"
                required
                pattern="[A-Za-z0-9]{6,12}"
              />
            </div>

            <div className="input-group">
              <label>
                <FaFileAlt className="input-icon" />
                Current Visa Type
              </label>
              <select 
                name="currentVisaType" 
                value={form.currentVisaType} 
                onChange={handleChange} 
                required
              >
                <option value="">-- Select current visa --</option>
                <option value="Tourist">Tourist Visa</option>
                <option value="Business">Business Visa</option>
                <option value="Work">Work Visa</option>
                <option value="Student">Student Visa</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>
                <FaCalendarAlt className="input-icon" />
                Visa Expiry Date
              </label>
              <input
                type="date"
                name="visaExpiryDate"
                value={form.visaExpiryDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FaHome className="input-icon" />
                Type of Residency
              </label>
              <select 
                name="residencyType" 
                value={form.residencyType} 
                onChange={handleChange} 
                required
              >
                <option value="">-- Select residency type --</option>
                <option value="Temporary">Temporary Residency</option>
                <option value="Permanent">Permanent Residency</option>
                <option value="Investor">Investor Residency</option>
                <option value="Retiree">Retiree Residency</option>
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
                <li>Passport copy (all pages)</li>
                <li>Current visa copy</li>
                <li>Proof of address in Ethiopia</li>
                <li>Financial stability proof</li>
                {form.residencyType === 'Work' && <li>Employment contract</li>}
                {form.residencyType === 'Investor' && <li>Investment documentation</li>}
                {form.residencyType === 'Retiree' && <li>Proof of pension/retirement funds</li>}
                <li>Medical certificate</li>
                <li>Police clearance certificate</li>
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

export default ResidencyPermitForm;