import React from 'react';
import './HowItWorks.scss';

const steps = [
  {
    step: 'Step 1: Create Your Account',
    detail: 'Register in seconds with your email to access our booking platform.',
    icon: '📝',
  },
  {
    step: 'Step 2: Choose Your Service',
    detail: 'Select from passport applications, visa processing, or other immigration services.',
    icon: '🛂',
  },
  {
    step: 'Step 3: Reserve Your Time Slot',
    detail: 'View real-time availability and book the most convenient appointment for you.',
    icon: '⏰',
  },
  {
    step: 'Step 4: Get Smart Notifications',
    detail: 'Receive timely reminders and live queue updates directly to your device.',
    icon: '🔔',
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <header className="section-header">
        <h2 className="section-title">How QueueEase Works</h2>
        <p className="section-subtitle">Streamline your immigration process in just four simple steps</p>
      </header>

      <div className="steps-container">
        {steps.map((step, index) => (
          <article className="step-card" key={index}>
            <span className="step-icon" role="img" aria-label={step.step}>{step.icon}</span>
            <h3 className="step-title">{step.step}</h3>
            <p className="step-detail">{step.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;