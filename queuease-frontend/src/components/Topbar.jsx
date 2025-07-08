import React, { useState } from 'react';
import { FaBell, FaCog, FaSearch } from 'react-icons/fa';
import './Topbar.scss';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    '📢 Your booking has been confirmed for April 15',
    '✅ Your queue status was updated',
    '⏳ Estimated wait time: 25 mins',
  ];

  return (
    <div className="topbar">
      <div className="search-box">
        <FaSearch />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="topbar-right">
        {/* Notifications Dropdown */}
        <div className="icon" onClick={() => setShowNotifications(!showNotifications)}>
          <FaBell />
          {showNotifications && (
            <div className="dropdown notifications">
              <h4>Notifications</h4>
              <ul>
                {notifications.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Settings Icon - Direct Navigation */}
        <div className="icon" onClick={() => navigate('/settings')}>
          <FaCog />
        </div>
      </div>
    </div>
  );
};

export default Topbar;