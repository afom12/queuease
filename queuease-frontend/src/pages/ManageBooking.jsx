import React, { useState } from 'react';
import './ManageBooking.scss';

const ManageBooking = () => {
  const [booking, setBooking] = useState({
    fullName: 'Abebe Kebede',
    service: 'Visa Application',
    date: '2025-04-15',
    time: '10:30',
  });

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleReschedule = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      alert('Please select both new date and time.');
      return;
    }
    alert('Booking rescheduled successfully!');
    setBooking({ ...booking, date: newDate, time: newTime });
    setNewDate('');
    setNewTime('');
  };

  const handleCancel = () => {
    const confirmed = window.confirm('Are you sure you want to cancel your booking?');
    if (confirmed) {
      alert('Booking cancelled.');
      setBooking(null);
    }
  };

  return (
    <div className="manage-container">
      <div className="manage-box">
        <h2>Manage Your Booking</h2>

        {booking ? (
          <>
            <div className="booking-info">
              <p><strong>Name:</strong> {booking.fullName}</p>
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
            </div>

            <form onSubmit={handleReschedule} className="reschedule-form">
              <h3>Reschedule Appointment</h3>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              <button type="submit">Reschedule</button>
            </form>

            <button className="cancel-btn" onClick={handleCancel}>Cancel Booking</button>
          </>
        ) : (
          <p className="no-booking">No active booking found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;
