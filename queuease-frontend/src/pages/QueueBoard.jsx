import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QueueBoard.scss';

const chime = new Audio('/sounds/notify.mp3');

const QueueBoard = () => {
  const [current, setCurrent] = useState(null);
  const [next, setNext] = useState([]);
  const [filter, setFilter] = useState('');

  const fetchQueue = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/queue/live');

      // Play chime if the current user has changed
      if (current && res.data.current?._id !== current._id) {
        chime.play();
      }

      setCurrent(res.data.current);
      setNext(res.data.next);
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000); // auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const filteredNext = filter
    ? next.filter(b => b.serviceType === filter)
    : next;

  return (
    <div className="queue-board">
      <div className="header">
        <h1>📋 Queue Status – Ethiopian Immigration</h1>
        <div className="filters">
          <label>Filter by Service:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="New Passport">New Passport</option>
            <option value="Visa">Visa</option>
            <option value="Work Permit">Work Permit</option>
          </select>
        </div>
      </div>

      <div className="now-serving">
        <h2>Now Serving</h2>
        {current ? (
          <div className="current-box">
            <h3>{current.user?.fullName}</h3>
            <p>Service: <strong>{current.serviceType}</strong></p>
            <p>Time: {new Date(current.appointmentDate).toLocaleTimeString()}</p>
          </div>
        ) : (
          <p>No one currently being served</p>
        )}
      </div>

      <div className="next-up">
        <h2>Next In Line</h2>
        <p className="waiting-count">👥 {filteredNext.length} waiting</p>
        <ul>
          {filteredNext.map((b) => (
            <li key={b._id}>
              <strong>{b.user?.fullName}</strong> – {b.serviceType} at {new Date(b.appointmentDate).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QueueBoard;
