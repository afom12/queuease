import React from 'react';
import { FaGlobeAfrica, FaClock, FaUserShield, FaMobileAlt } from 'react-icons/fa';
import './About.scss';

const About = () => {
  return (
    <div className="about-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Redefining Immigration Services</h1>
          <p className="tagline">Digital transformation for Ethiopia's immigration system</p>
        </div>
      </div>

      <div className="content-container">
        <section className="mission-section">
          <h2>
            <span className="highlight">QueueEase</span> is revolutionizing how Ethiopia manages immigration services
          </h2>
          <div className="mission-grid">
            <p className="lead-text">
              Our innovative platform transforms the traditional queue system into a streamlined digital experience, saving time and reducing stress for thousands of citizens.
            </p>
            <div className="feature-image"></div>
          </div>
        </section>

        <section className="features-section">
          <div className="feature-cards">
            <div className="feature-card">
              <div className="icon-container">
                <FaGlobeAfrica className="feature-icon" />
              </div>
              <h3>Nationwide Access</h3>
              <p>Available across all major immigration offices in Ethiopia with plans for full national coverage</p>
            </div>

            <div className="feature-card">
              <div className="icon-container">
                <FaClock className="feature-icon" />
              </div>
              <h3>Time Savings</h3>
              <p>Reduce wait times by up to 80% with our smart scheduling system</p>
            </div>

            <div className="feature-card">
              <div className="icon-container">
                <FaUserShield className="feature-icon" />
              </div>
              <h3>Secure Platform</h3>
              <p>Military-grade encryption protects your personal data and documents</p>
            </div>

            <div className="feature-card">
              <div className="icon-container">
                <FaMobileAlt className="feature-icon" />
              </div>
              <h3>Mobile Friendly</h3>
              <p>Full functionality on any device, with SMS notifications for appointment updates</p>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-item">
            <span className="stat-number">50,000+</span>
            <span className="stat-label">Monthly Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">85%</span>
            <span className="stat-label">Reduced Wait Times</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24</span>
            <span className="stat-label">Service Locations</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.9★</span>
            <span className="stat-label">User Rating</span>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to experience the future of immigration services?</h2>
          <button className="cta-button">Get Started Today</button>
        </section>
      </div>
    </div>
  );
};

export default About;