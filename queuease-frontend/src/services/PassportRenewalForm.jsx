import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser,FaPassport,FaFileAlt,FaCalendarAlt,FaFileUpload,FaPaperclip,FaArrowRight } from 'react-icons/fa';
import './PassportRenewalForm.scss';

const PassportRenewalForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    passportNumber: '',
    visaType: '',
    travelDate: '',
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
    <div className="passport-renewal-form-container">
      <div className="form-header">
        <h2>Passport Renewal Application</h2>
        <p>Renew your Ethiopian passport for continued international travel</p>
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
                placeholder="As shown in your current passport"
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
                Visa Type
              </label>
              <select 
                name="visaType" 
                value={form.visaType} 
                onChange={handleChange} 
                required
              >
                <option value="">-- Select visa type --</option>
                <option value="Tourist">Tourist Visa</option>
                <option value="Business">Business Visa</option>
                <option value="Transit">Transit Visa</option>
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
                <li>Current passport copy (all pages)</li>
                <li>Two recent passport-sized photographs</li>
                <li>Completed application form</li>
                <li>Proof of Ethiopian citizenship</li>
                <li>Payment receipt for renewal fees</li>
                {form.visaType === 'Business' && <li>Business invitation letter</li>}
                <li>Any previous name change documents</li>
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

export default PassportRenewalForm;