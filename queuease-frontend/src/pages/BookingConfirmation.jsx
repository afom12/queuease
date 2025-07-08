import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaRegUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './BookingConfirmation.scss';

const BookingConfirmation = () => {
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('latestBooking');
    if (!stored) {
      navigate('/dashboard/home'); // Redirect if no booking found
    } else {
      setBooking(JSON.parse(stored));
    }
  }, [navigate]);

  if (!booking) return null;

  return (
    <div className="confirmation-page">
      <div className="confirmation-box">
        <FaCheckCircle className="confirmation-icon" />
        <h2>Booking Confirmed!</h2>
        <p>Your appointment has been successfully booked. Please arrive on time with the necessary documents.</p>

        <div className="booking-summary">
          <div className="summary-item">
            <FaRegUser /> <strong>Service:</strong> {booking.serviceType}
          </div>
          <div className="summary-item">
            <FaCalendarAlt /> <strong>Date:</strong>{' '}
            {new Date(booking.appointmentDate).toLocaleDateString()}
          </div>
          <div className="summary-item">
            <FaClock /> <strong>Time:</strong>{' '}
            {new Date(booking.appointmentDate).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div className="summary-item">
            <strong>Status:</strong> {booking.status}
          </div>
        </div>

        <button className="home-button" onClick={() => navigate('/dashboard/home')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
