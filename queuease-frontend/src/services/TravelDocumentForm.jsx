import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser,FaPassport,FaGlobe,FaInfoCircle,FaCalendarAlt,FaFileUpload,FaPaperclip,FaArrowRight} from 'react-icons/fa';
import './TravelDocumentForm.scss';

const TravelDocumentForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    previousPassportNumber: '',
    nationality: 'Ethiopian',
    dateOfBirth: '',
    reason: '',
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
    <div className="travel-document-form-container">
      <div className="form-header">
        <h2>Travel Document Application</h2>
        <p>Apply for an Ethiopian travel document (for stateless persons or refugees)</p>
      </div>

      <div className="progress-indicator">
        {[1, 2].map((step) => (
          <div 
            key={step} 
            className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{step < currentStep ? '✓' : step}</div>
            <div className="step-label">
              {step === 1 && 'Personal Information'}
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
                placeholder="Your full legal name"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FaPassport className="input-icon" />
                Previous Passport Number (if any)
              </label>
              <input
                type="text"
                name="previousPassportNumber"
                value={form.previousPassportNumber}
                onChange={handleChange}
                placeholder="Enter previous passport number if applicable"
              />
            </div>

            <div className="input-group">
              <label>
                <FaGlobe className="input-icon" />
                Nationality
              </label>
              <select 
                name="nationality" 
                value={form.nationality} 
                onChange={handleChange} 
                required
              >
                <option value="Ethiopian">Ethiopian</option>
                <option value="Stateless">Stateless</option>
                <option value="Refugee">Refugee</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>
                <FaCalendarAlt className="input-icon" />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FaInfoCircle className="input-icon" />
                Reason for Application
              </label>
              <select 
                name="reason" 
                value={form.reason} 
                onChange={handleChange} 
                required
              >
                <option value="">-- Select reason --</option>
                <option value="LostPassport">Lost passport</option>
                <option value="RefugeeStatus">Refugee status</option>
                <option value="Stateless">Stateless person</option>
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
              <label>
                <FaFileUpload className="input-icon" />
                Supporting Documents
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
                <li>Birth certificate or other proof of identity</li>
                <li>Two recent passport-sized photographs</li>
                {form.reason === 'LostPassport' && <li>Police report for lost passport</li>}
                {form.reason === 'RefugeeStatus' && <li>Refugee status documentation</li>}
                {form.reason === 'Stateless' && <li>Proof of statelessness</li>}
                <li>Any previous travel documents</li>
                <li>Residence permit (if applicable)</li>
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

export default TravelDocumentForm;