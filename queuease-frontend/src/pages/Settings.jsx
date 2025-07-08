import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import './Settings.scss';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const getTabFromURL = () => new URLSearchParams(location.search).get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(getTabFromURL());
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'English');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile({
          fullName: response.data.fullName,
          email: response.data.email,
          phone: response.data.phone || '',
          avatar: response.data.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
        });
        setAvatarPreview(response.data.avatar || 'https://randomuser.me/api/portraits/men/32.jpg');
        
        if (response.data.preferences) {
          setLanguage(response.data.preferences.language || 'English');
          setNotifications(response.data.preferences.notifications || {
            email: true,
            sms: false,
            push: true
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const currentTab = getTabFromURL();
    setActiveTab(currentTab);
  }, [location.search]);

  const handleTabChange = (tab) => {
    navigate(`/settings?tab=${tab}`);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/user', profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        const avatarResponse = await axios.post('/api/user/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setProfile(prev => ({ ...prev, avatar: avatarResponse.data.avatarUrl }));
        setAvatarPreview(avatarResponse.data.avatarUrl);
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreferencesUpdate = async () => {
    try {
      await axios.put('/api/user/preferences', {
        language,
        notifications
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      navigate('/login');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={`tab-content ${theme}`}>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your settings...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <div className={`tab-content ${theme}`}>
            <div className="profile-header">
              <div className="avatar-container">
                <img src={avatarPreview} alt="Profile" className="avatar" />
                <label htmlFor="avatar-upload" className="avatar-upload">
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <i className="fas fa-camera"></i>
                </label>
              </div>
              <h2>Profile Information</h2>
              <p>Update your personal details and profile picture</p>
            </div>
            
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profile.fullName} 
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} 
                  placeholder="Enter your full name" 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                  placeholder="Enter your email" 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={profile.phone} 
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                  placeholder="Enter your phone number" 
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="secondary">
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );

      case 'settings':
        return (
          <div className={`tab-content ${theme}`}>
            <div className="section-header">
              <h2>Application Settings</h2>
              <p>Customize your QueueEase experience</p>
            </div>
            
            <div className="settings-section">
              <h3><i className="fas fa-palette"></i> Appearance</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="icon-circle">
                    <i className="fas fa-moon"></i>
                  </div>
                  <div>
                    <h4>Dark Mode</h4>
                    <p>Switch between light and dark theme</p>
                  </div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={theme === 'dark'} 
                    onChange={toggleTheme} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="icon-circle">
                    <i className="fas fa-language"></i>
                  </div>
                  <div>
                    <h4>Language</h4>
                    <p>Select your preferred language</p>
                  </div>
                </div>
                <select 
                  value={language} 
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    handlePreferencesUpdate();
                  }}
                  className="language-select"
                >
                  <option value="English">English</option>
                  <option value="Amharic">አማርኛ</option>
                  <option value="Oromo">Afaan Oromoo</option>
                </select>
              </div>
            </div>
            
            <div className="settings-section">
              <h3><i className="fas fa-bell"></i> Notifications</h3>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="icon-circle">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4>Email Notifications</h4>
                    <p>Receive important updates via email</p>
                  </div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.email} 
                    onChange={() => {
                      setNotifications({...notifications, email: !notifications.email});
                      handlePreferencesUpdate();
                    }} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="icon-circle">
                    <i className="fas fa-sms"></i>
                  </div>
                  <div>
                    <h4>SMS Notifications</h4>
                    <p>Get text message alerts</p>
                  </div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.sms} 
                    onChange={() => {
                      setNotifications({...notifications, sms: !notifications.sms});
                      handlePreferencesUpdate();
                    }} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="icon-circle">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <div>
                    <h4>Push Notifications</h4>
                    <p>Enable app notifications</p>
                  </div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.push} 
                    onChange={() => {
                      setNotifications({...notifications, push: !notifications.push});
                      handlePreferencesUpdate();
                    }} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className={`tab-content ${theme}`}>
            <div className="section-header">
              <h2>Help & Support</h2>
              <p>Find answers or contact our support team</p>
            </div>
            
            <div className="help-section">
              <div className="help-card">
                <div className="card-icon">
                  <i className="fas fa-book-open"></i>
                </div>
                <h3>Knowledge Base</h3>
                <p>Browse our documentation and FAQs</p>
                <button className="text-button">View Articles <i className="fas fa-arrow-right"></i></button>
              </div>
              
              <div className="help-card">
                <div className="card-icon">
                  <i className="fas fa-comment-dots"></i>
                </div>
                <h3>Live Chat</h3>
                <p>Chat with our support team in real-time</p>
                <button className="text-button">Start Chat <i className="fas fa-arrow-right"></i></button>
              </div>
              
              <div className="help-card">
                <div className="card-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email Support</h3>
                <p>Contact us via email</p>
                <a href="mailto:support@queueease.et" className="text-button">support@queueease.et <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className={`tab-content ${theme}`}>
            <div className="section-header">
              <h2>Contact Information</h2>
              <p>Reach out to our team through these channels</p>
            </div>
            
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-building"></i>
                </div>
                <div>
                  <h3>Headquarters</h3>
                  <p>Addis Ababa, Ethiopia</p>
                  <p>Bole Road, Next to Friendship Center</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h3>Phone</h3>
                  <p>+251 900 000 000</p>
                  <p>Mon-Fri, 8:00 AM - 5:00 PM</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h3>Email</h3>
                  <p>info@queueease.et</p>
                  <p>support@queueease.et</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'logout':
        return (
          <div className={`tab-content ${theme}`}>
            <div className="logout-container">
              <div className="logout-icon">
                <i className="fas fa-sign-out-alt"></i>
              </div>
              <h2>Ready to leave?</h2>
              <p>You can always sign back in anytime</p>
              <div className="logout-actions">
                <button onClick={() => handleTabChange('profile')} className="secondary">Cancel</button>
                <button onClick={handleLogout} className="danger">Sign Out</button>
              </div>
            </div>
          </div>
        );
          
      default:
        return <div className={`tab-content ${theme}`}>Unknown section.</div>;
    }
  };

  return (
    <div className={`settings-page ${theme}`}>
      <div className="settings-container">
        <aside className={`settings-sidebar ${theme}`}>
          <div className="sidebar-header">
            <h2>Settings</h2>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              onClick={() => handleTabChange('profile')} 
              className={`nav-button ${activeTab === 'profile' ? 'active' : ''} ${theme}`}
            >
              <span className="nav-icon"><i className="fas fa-user"></i></span>
              <span>Profile</span>
            </button>
            
            <button 
              onClick={() => handleTabChange('settings')} 
              className={`nav-button ${activeTab === 'settings' ? 'active' : ''} ${theme}`}
            >
              <span className="nav-icon"><i className="fas fa-cog"></i></span>
              <span>Settings</span>
            </button>
            
            <button 
              onClick={() => handleTabChange('help')} 
              className={`nav-button ${activeTab === 'help' ? 'active' : ''} ${theme}`}
            >
              <span className="nav-icon"><i className="fas fa-question-circle"></i></span>
              <span>Help</span>
            </button>
            
            <button 
              onClick={() => handleTabChange('contact')} 
              className={`nav-button ${activeTab === 'contact' ? 'active' : ''} ${theme}`}
            >
              <span className="nav-icon"><i className="fas fa-phone-alt"></i></span>
              <span>Contact</span>
            </button>
            
            <div className={`nav-divider ${theme}`}></div>
            
            <button 
              onClick={() => handleTabChange('logout')} 
              className={`nav-button ${activeTab === 'logout' ? 'active' : ''} ${theme}`}
            >
              <span className="nav-icon"><i className="fas fa-sign-out-alt"></i></span>
              <span>Logout</span>
            </button>
          </nav>
        </aside>
        
        <main className={`settings-main ${theme}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Settings;