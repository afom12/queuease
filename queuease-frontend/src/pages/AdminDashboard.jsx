import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAdminBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data.bookings);
      } catch (error) {
        console.error('❌ Error fetching admin bookings', error);
      }
    };

    fetchAdminBookings();
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h2>📋 Admin Dashboard - All Bookings</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id}>
              <td>{booking.user?.fullName}</td>
              <td>{booking.serviceType}</td>
              <td>{new Date(booking.appointmentDate).toLocaleString()}</td>
              <td>{booking.status}</td>
              <td>{booking.staffNotes || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
