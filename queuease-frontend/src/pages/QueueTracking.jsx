import React, { useState } from 'react';
import './QueueTracking.scss';

const QueueTracking = () => {
  const [queueData, setQueueData] = useState({
    name: 'Abebe Kebede',
    service: 'Passport Renewal',
    position: 7,
    estimatedWaitTime: '25 mins',
    status: 'Waiting'
  });

  return (
    <div className="tracking-container">
      <div className="tracking-card">
        <h2>Live Queue Status</h2>
        <div className="info">
          <p><strong>Name:</strong> {queueData.name}</p>
          <p><strong>Service:</strong> {queueData.service}</p>
          <p><strong>Your Position:</strong> {queueData.position}</p>
          <p><strong>Estimated Wait:</strong> {queueData.estimatedWaitTime}</p>
          <p><strong>Status:</strong> {queueData.status}</p>
        </div>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${100 - queueData.position * 10}%` }}
          ></div>
        </div>
        <button className="refresh-btn" onClick={() => alert("Refreshing queue (not connected yet)")}>
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default QueueTracking;
