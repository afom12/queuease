import React, { useEffect, useState } from 'react';
import './AdminNotifications.scss';

const AdminNotifications = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/notifications/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="admin-notifications">
      <h2>📨 Notification Logs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Status</th>
              <th>Message</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{log.type}</td>
                <td className={log.status}>{log.status}</td>
                <td>{log.message}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminNotifications;
