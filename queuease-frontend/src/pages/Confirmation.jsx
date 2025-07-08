import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, FaCalendarAlt, FaUser, FaFileAlt, 
  FaHome, FaFilePdf, FaCalendarPlus, FaShareAlt 
} from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ConfirmationPDF from './ConfirmationPDF'; // You'll create this component
import './Confirmation.scss';

const Confirmation = () => {
  const navigate = useNavigate();
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const service = JSON.parse(localStorage.getItem('latestService'));
  const queue = JSON.parse(localStorage.getItem('latestQueue'));

  useEffect(() => {
    if (!service) {
      navigate('/dashboard');
    }
    return () => localStorage.removeItem('latestService');
  }, [service, navigate]);

  // Formatting functions
  const formatServiceType = (type) => 
    type?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

  const formatTime = (timeString) => 
    timeString ? new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', minute: '2-digit' 
    }) : '';

  // Calendar integration
  const addToCalendar = (platform) => {
    const startDate = new Date(`${service.appointment.date}T${service.appointment.timeSlot}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    if (platform === 'google') {
      window.open(`https://www.google.com/calendar/render?action=TEMPLATE&dates=${
        startDate.toISOString().replace(/[-:]/g, '').split('.')[0]
      }Z/${
        endDate.toISOString().replace(/[-:]/g, '').split('.')[0]
      }Z&text=${encodeURIComponent(service.serviceType)} Appointment&details=${encodeURIComponent(
        `Your ${formatServiceType(service.serviceType)} appointment is scheduled`
      )}`);
    } else {
      // For other calendar apps (download .ics file)
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `SUMMARY:${service.serviceType} Appointment`,
        `DESCRIPTION:Your ${formatServiceType(service.serviceType)} appointment`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\n');
      
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'appointment.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Share functionality
  const shareDetails = async () => {
    const shareData = {
      title: 'My Immigration Appointment',
      text: `I have a ${formatServiceType(service.serviceType)} appointment on ${
        formatDate(service.appointment.date)
      } at ${formatTime(service.appointment.timeSlot)}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Sharing cancelled');
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(shareData.text);
      alert('Appointment details copied to clipboard!');
    }
  };

  if (!service) return null;

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        {/* Header section */}
        <div className="confirmation-header">
          <FaCheckCircle className="success-icon" />
          <h2>Application Submitted Successfully!</h2>
          <p className="confirmation-message">
            Your {formatServiceType(service.serviceType)} application has been received.
            {queue && ` Your queue number is ${queue.queueNumber}.`}
          </p>
        </div>

        {/* Details section */}
        <div className="confirmation-details">
          <h3>Application Summary</h3>
          
          <div className="detail-item">
            <FaUser className="detail-icon" />
            <div>
              <span className="detail-label">Applicant Name:</span>
              <span className="detail-value">{service.details.fullName}</span>
            </div>
          </div>

          <div className="detail-item">
            <FaFileAlt className="detail-icon" />
            <div>
              <span className="detail-label">Service Type:</span>
              <span className="detail-value">{formatServiceType(service.serviceType)}</span>
            </div>
          </div>

          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <div>
              <span className="detail-label">Appointment:</span>
              <span className="detail-value">
                {formatDate(service.appointment.date)} at {formatTime(service.appointment.timeSlot)}
              </span>
            </div>
          </div>

          <div className="status-badge">
            <span className={`status-${service.status}`}>
              {service.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="confirmation-actions">
          <button className="action-button primary" onClick={() => navigate('/dashboard')}>
            <FaHome /> Dashboard
          </button>
          
          <PDFDownloadLink
            document={<ConfirmationPDF service={service} queue={queue} />}
            fileName="appointment_confirmation.pdf"
          >
            {({ loading }) => (
              <button className="action-button secondary" disabled={loading}>
                <FaFilePdf /> {loading ? 'Generating...' : 'Download PDF'}
              </button>
            )}
          </PDFDownloadLink>
          
          <button 
            className="action-button secondary" 
            onClick={() => setShowCalendarOptions(!showCalendarOptions)}
          >
            <FaCalendarPlus /> Add to Calendar
          </button>
          
          <button className="action-button secondary" onClick={shareDetails}>
            <FaShareAlt /> Share
          </button>
        </div>

        {/* Calendar options dropdown */}
        {showCalendarOptions && (
          <div className="calendar-options">
            <button onClick={() => addToCalendar('google')}>Google Calendar</button>
            <button onClick={() => addToCalendar('outlook')}>Outlook/Apple Calendar</button>
          </div>
        )}

        {/* Service-specific tips */}
        <div className="service-tips">
          <h4>Next Steps:</h4>
          <ul>
            <li>Bring your original ID document and this confirmation</li>
            <li>Arrive 15 minutes before your appointment</li>
            {service.serviceType === 'new-passport' && (
              <li>Bring 2 passport-sized photos with white background</li>
            )}
            {service.serviceType === 'visa-application' && (
              <li>Prepare all supporting documents mentioned in requirements</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;