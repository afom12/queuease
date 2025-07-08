import React from 'react';
import './WelcomePage.scss';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="logo">QUEUEASE</span>
        </div>
        <div className="navbar-actions">
          <button className="secondary-btn" onClick={() => navigate('/login')}>Sign In</button>
          <button className="primary-btn" onClick={() => navigate('/signup')}>Register</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Simplify Your <span className="highlight">Immigration Process</span> in Ethiopia</h1>
            <p className="subtitle">Join thousands who have streamlined their experience with our modern queue management system.</p>
            <div className="cta-buttons">
              <button className="cta-primary" onClick={() => navigate('/signup')}>Get Started Now</button>
              <button className="cta-secondary" onClick={() => navigate('/how-it-works')}>How It Works <span className="play-icon">▶</span></button>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
            <img
               src="/assets/queue1.avif"
               alt="People using QueueEase to manage immigration queue"
           />
              <div className="mockup">
                <div className="screen"></div>
                <div className="notifications">
                  <div className="notification"></div>
                  <div className="notification"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="arrow-down"></div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="trust-indicators">
        <div className="container">
          <span>Trusted by:</span>
          <div className="logos">
            <span className="logo-item">Ethiopian Immigration</span>
            <span className="logo-item">Ministry of Foreign Affairs</span>
            <span className="logo-item">10,000+ Users</span>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <h2><span className="flag">🇪🇹</span> Made for Ethiopia</h2>
        <p className="description">QUEUEASE modernizes the Ethiopian immigration experience—book, track, and manage your services without the hassle of long queues and paperwork.</p>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Monthly Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Success Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Why Choose QUEUEASE?</h2>
          <p>Our platform offers everything you need for a seamless immigration process</p>
        </div>
        <div className="cards">
          <div className="card">
            <div className="card-icon">📘</div>
            <h3>Passport Booking</h3>
            <p>Book your passport appointments online and receive real-time updates on your application status.</p>
          </div>
          <div className="card">
            <div className="card-icon">🛂</div>
            <h3>Visa Applications</h3>
            <p>Apply for visas and track your application progress without visiting the office.</p>
          </div>
          <div className="card">
            <div className="card-icon">🏡</div>
            <h3>Residence Services</h3>
            <p>Manage your residency and work permit applications through our streamlined platform.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <div className="quote">"QUEUEASE saved me hours of waiting in line. The process was so simple!"</div>
            <div className="author">
              <div className="avatar"></div>
              <div className="info">
                <span className="name">Alemayehu Kebede</span>
                <span className="title">Frequent Traveler</span>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <div className="quote">"As an expat, this service made my visa renewal process incredibly smooth."</div>
            <div className="author">
              <div className="avatar"></div>
              <div className="info">
                <span className="name">Sara Molla</span>
                <span className="title">Expat Resident</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Immigration Experience?</h2>
          <p>Join thousands of satisfied users today and say goodbye to long queues.</p>
          <button className="cta-button" onClick={() => navigate('/signup')}>Sign Up Now - It's Free</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <h2>QUEUEASE</h2>
              <p className="tagline">Modernizing Ethiopia's immigration services through technology.</p>
              <div className="social-links">
                <span className="social-icon">f</span>
                <span className="social-icon">t</span>
                <span className="social-icon">in</span>
              </div>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Services</h4>
                <ul>
                  <li>Passport Services</li>
                  <li>Visa Applications</li>
                  <li>Residence Permits</li>
                  <li>Work Permits</li>
                </ul>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <ul>
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Contact</li>
                  <li>Press</li>
                </ul>
              </div>
              <div className="link-group">
                <h4>Resources</h4>
                <ul>
                  <li>Help Center</li>
                  <li>FAQs</li>
                  <li>Blog</li>
                  <li>Status</li>
                </ul>
              </div>
              <div className="link-group">
                <h4>Legal</h4>
                <ul>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="copyright">© 2025 QUEUEASE. All rights reserved.</div>
            <div className="legal-links">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;