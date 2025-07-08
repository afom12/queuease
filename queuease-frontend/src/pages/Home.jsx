import React, { useEffect, useState } from 'react';
import './Home.scss';

const Home = () => {
  const [queueData, setQueueData] = useState(null); // initially no queue

  useEffect(() => {
    // Simulate fetching live data from API
    const fetchData = async () => {
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated queue data response
      const data = {
        isQueueActive: true,
        activeBookings: 7,
        estimatedWait: '40 mins',
        notifications: '5 unread',
      };

      setQueueData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Welcome Card */}
      <section className="welcome-card">
        <h1>
          Welcome to <span>QueueEase</span>
        </h1>
        <p>
          Streamline your immigration process with online queue registration,
          live tracking, and real-time notifications.
        </p>
      </section>

      {/* Show live stats only if queue is active */}
      {queueData?.isQueueActive && (
        <section className="dashboard-cards">
          <div className="card">
            <h4>📋 Active Bookings</h4>
            <p>{queueData.activeBookings}</p>
          </div>
          <div className="card">
            <h4>⏳ Estimated Wait</h4>
            <p>{queueData.estimatedWait}</p>
          </div>
          <div className="card">
            <h4>🔔 Notifications</h4>
            <p>{queueData.notifications}</p>
          </div>
        </section>
      )}

      {/* Optional: loading or no active queue message */}
      {queueData && !queueData.isQueueActive && (
        <p style={{ color: '#666', marginBottom: '30px' }}>
          No active queue at the moment.
        </p>
      )}

      {/* Hero Image */}
      <section className="hero-image">
        <img
          src="/assets/queue.png"
          alt="People using QueueEase to manage immigration queue"
        />
      </section>
    </div>
  );
};

export default Home;
