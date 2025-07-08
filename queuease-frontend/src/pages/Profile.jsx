import React, { useState } from 'react';
import './Profile.scss';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: 'Abebe Kebede',
    email: 'abebe@example.com',
    phone: '0912345678',
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert('Profile updated successfully! (not saved to backend yet)');
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-form">
        <img src="/assets/avatar.png" alt="Avatar" className="avatar" />

        <input
          type="text"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          placeholder="Full Name"
        />
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          placeholder="Phone Number"
        />

        <button onClick={handleSave}>Update Profile</button>
      </div>
    </div>
  );
};

export default Profile;
