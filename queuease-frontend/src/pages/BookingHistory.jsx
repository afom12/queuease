import React, { useEffect, useState } from 'react';
import './BookingHistory.scss';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    setBookings(history.reverse());
  }, []);

  if (bookings.length === 0) {
    return <p style={{ padding: '40px' }}>No booking history available.</p>;
  }

  return (
    <div className="history-page">
      <h2>My Booking History</h2>
      {bookings.map((booking, index) => (
        <div className="booking-card" key={index}>
          <h4>{booking.serviceName}</h4>
          <p><strong>Name:</strong> {booking.fullName}</p>
          <p><strong>Date:</strong> {booking.appointmentDate}</p>
          <p><strong>Time:</strong> {booking.timeSlot}</p>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;
