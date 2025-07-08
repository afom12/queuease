import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance'; // axios with token
import './AdminBookingTable.scss';

const AdminBookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterService, setFilterService] = useState('');

  const fetchAll = async () => {
    try {
      const res = await axios.get('/api/bookings/admin');
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Error loading bookings', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/bookings/status/${id}`, { status });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const updateNotes = async (id, notes) => {
    try {
      await axios.patch(`/api/bookings/status/${id}`, { staffNotes: notes });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = bookings.filter(b =>
    (!filterStatus || b.status === filterStatus) &&
    (!filterService || b.serviceType === filterService)
  );

  return (
    <div className="admin-booking-table">
      <div className="filters">
        <select value={filterService} onChange={e => setFilterService(e.target.value)}>
          <option value="">All Services</option>
          <option value="New Passport">New Passport</option>
          <option value="Visa">Visa</option>
          <option value="Work Permit">Work Permit</option>
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <table>
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
          {filtered.map(b => (
            <tr key={b._id}>
              <td>{b.user?.fullName}</td>
              <td>{b.serviceType}</td>
              <td>{new Date(b.appointmentDate).toLocaleDateString()}</td>
              <td>
                <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <textarea
                  rows="2"
                  value={b.staffNotes}
                  onChange={e => updateNotes(b._id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookingTable;
