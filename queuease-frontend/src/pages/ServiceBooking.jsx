import React from 'react';
import { useParams } from 'react-router-dom';
import './ServiceBooking.scss';

// Import all form components
import NewPassportForm from '../services/NewPassportForm';
import VisaApplicationForm from '../services/VisaApplicationForm';
import WorkPermitForm from '../services/WorkPermitForm';
import DocumentLegalizationForm from '../services/DocumentLegalizationForm';
import ResidencyPermitForm from '../services/ResidencyPermitForm';
import TravelDocumentForm from '../services/TravelDocumentForm';
import PassportRenewalForm from '../services/PassportRenewalForm';

const ServiceBooking = () => {
  const { serviceId } = useParams();

  const renderForm = () => {
    switch (serviceId) {
      case 'new-passport':
        return <NewPassportForm />;
      case 'visa-application':
        return <VisaApplicationForm />;
      case 'work-permit':
        return <WorkPermitForm />;
      case 'document-legalization':
        return <DocumentLegalizationForm />;
      case 'residency-permit':
        return <ResidencyPermitForm />;
      case 'travel-document':
        return <TravelDocumentForm />;
      case 'passport-renewal':
        return <PassportRenewalForm />;
      default:
        return (
          <div className="form-placeholder">
            <p>Service <strong>{serviceId}</strong> is not yet available for booking.</p>
          </div>
        );
    }
  };

  return (
    <div className="booking-page">
      <h2>Book: {formatServiceName(serviceId)}</h2>
      {renderForm()}
    </div>
  );
};

const formatServiceName = (id) =>
  id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default ServiceBooking;
