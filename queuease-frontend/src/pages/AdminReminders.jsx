import React, { useEffect, useState } from 'react';
import './AdminReminders.scss';
import axios from 'axios';

const AdminReminders = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/reminders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(res.data.logs);
      } catch (err) {
        console.error('Failed to fetch reminders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="admin-reminders">
      <h2>📩 Notification Logs</h2>
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <div className="log-table-wrapper">
          <table className="log-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Channel</th>
                <th>Message</th>
                <th>Status</th>
                <th>Sent At</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td>{log.user?.fullName || 'Unknown'}</td>
                  <td>{log.channel.toUpperCase()}</td>
                  <td>{log.message}</td>
                  <td className={log.status}>{log.status}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="error">{log.error || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReminders;
