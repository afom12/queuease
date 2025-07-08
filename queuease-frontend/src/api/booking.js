import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookings';

// ✅ Create Booking (with file upload)
export const createBooking = async (formData) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// ✅ Get My Bookings
export const fetchMyBookings = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Cancel Booking
export const cancelBooking = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.patch(`${API_URL}/cancel/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Reschedule Booking
export const rescheduleBooking = async (id, newDate) => {
  const token = localStorage.getItem('token');
  const res = await axios.patch(`${API_URL}/reschedule/${id}`, { appointmentDate: newDate }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};