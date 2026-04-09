import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch {
      // ignore
    }
  };

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
        <h2 className="heading-2">Notifications</h2>
        <div className="text-dim">Unread: {unreadCount}</div>
      </div>

      {error && <div className="badge badge-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600, color: 'var(--dark-blue)' }}>All notifications</div>
          <button className="btn btn-secondary" onClick={fetchNotifications} disabled={loading} style={{ padding: '0.35rem 0.75rem' }}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Loading…</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No notifications yet.</div>
        ) : (
          <div>
            {items.map((n) => (
              <div key={n._id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--dark-blue)' }}>{n.title || 'Notification'}</div>
                  <div className="text-dim" style={{ marginTop: '0.25rem' }}>{n.message || ''}</div>
                  <div className="text-dim" style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {n.read ? (
                    <span className="badge badge-success">Read</span>
                  ) : (
                    <span className="badge badge-warning">Unread</span>
                  )}
                  {!n.read && (
                    <button className="btn btn-primary" onClick={() => markRead(n._id)} style={{ padding: '0.35rem 0.75rem' }}>
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
