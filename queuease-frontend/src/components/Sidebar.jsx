import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaInfoCircle, FaCog, FaPhoneAlt, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.scss';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h2 className="logo">Queue <span>Ease</span></h2>
      <nav>
        <NavLink to="/dashboard/home" activeclassname="active"><FaHome /> Home</NavLink>
        <NavLink to="/dashboard/services" activeclassname="active"><FaBook /> Services</NavLink>
        <NavLink to="/dashboard/how-it-works" activeclassname="active"><FaCog /> How It Works</NavLink>
        <NavLink to="/dashboard/about" activeclassname="active"><FaInfoCircle /> About</NavLink>
        <NavLink to="/dashboard/contact" activeclassname="active"><FaPhoneAlt /> Contact</NavLink>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </nav>

      <div className="logout">
        {/* Could also move logout here visually if you want */}
      </div>
    </div>
  );
};

export default Sidebar;
