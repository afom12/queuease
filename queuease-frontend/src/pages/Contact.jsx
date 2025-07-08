import React from 'react';
import './Contact.scss';

const Contact = () => {
  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p>If you need support, reach out to us through the form below or email support@queueease.et</p>

      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
