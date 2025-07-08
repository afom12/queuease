import React, { useEffect, useState } from 'react';
import { fetchMyBookings } from '../api/booking';
import axios from 'axios';
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaHourglassStart,
  FaRedoAlt,
  FaTimesCircle
} from 'react-icons/fa';
import './MyBookings.scss';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data.bookings);
      } catch (err) {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.patch(`http://localhost:5000/api/bookings/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
    } catch (err) {
      alert('Failed to cancel booking.');
    }
  };

  const rescheduleBooking = async (id) => {
    if (!newDate) return alert('Please select a new date.');

    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}/reschedule`, {
        appointmentDate: newDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refetch or update local state
      const data = await fetchMyBookings();
      setBookings(data.bookings);
      setRescheduleId(null);
      setNewDate('');
    } catch (err) {
      alert('Rescheduling failed.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <span className="status-badge confirmed"><FaCheckCircle /> Confirmed</span>;
      case 'pending':
        return <span className="status-badge pending"><FaSpinner /> Pending</span>;
      case 'cancelled':
        return <span className="status-badge cancelled"><FaExclamationTriangle /> Cancelled</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) return <div className="loader">Loading bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-bookings">
      <div className="bookings-header">
        <h2><FaCalendarAlt /> My Appointments</h2>
        <p className="subtitle">Manage your appointments: cancel or reschedule</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt size={40} />
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.serviceType}</h3>
                {getStatusBadge(booking.status)}
              </div>

              <div className="booking-details">
                <p><FaCalendarAlt /> {new Date(booking.appointmentDate).toLocaleDateString()}</p>
                <p><FaClock /> {new Date(booking.appointmentDate).toLocaleTimeString()}</p>
                {booking.status !== 'Cancelled' && (
                  <p><FaHourglassStart /> Est. Wait: {booking.estimatedWaitMinutes} mins</p>
                )}
              </div>

              <div className="booking-actions">
                {booking.status !== 'Cancelled' && (
                  <>
                    <button
                      className="action-button cancel"
                      onClick={() => cancelBooking(booking._id)}
                    >
                      <FaTimesCircle /> Cancel
                    </button>

                    {rescheduleId === booking._id ? (
                      <div className="reschedule-form">
                        <input
                          type="datetime-local"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                        />
                        <button onClick={() => rescheduleBooking(booking._id)}>
                          <FaCheckCircle /> Confirm
                        </button>
                        <button onClick={() => setRescheduleId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button
                        className="action-button reschedule"
                        onClick={() => setRescheduleId(booking._id)}
                      >
                        <FaRedoAlt /> Reschedule
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
