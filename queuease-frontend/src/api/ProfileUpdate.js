// ProfileUpdate.js (React Component)

import React, { useState } from 'react';
import axios from 'axios';

const ProfileUpdate = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    try {
      // Replace with your backend URL (localhost during development or deployed URL)
      const response = await axios.put('http://localhost:5000/api/user/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add the JWT token if authentication is required
        },
      });
      setMessage('Profile updated successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="profilePhoto">Profile Photo:</label>
          <input
            type="file"
            id="profilePhoto"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfileUpdate;
