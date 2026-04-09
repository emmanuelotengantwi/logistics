import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const CustomerShipments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = (searchParams.get('q') || '').trim().toLowerCase();

  const fetchShipments = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/shipments');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((s) => {
      const values = [
        s.trackingID,
        s.type,
        s.status,
        s.origin,
        s.destination,
        s.container?.containerNumber,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return values.includes(query);
    });
  }, [items, query]);

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
        <h2 className="heading-2">My Shipments</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/dashboard/track" className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem' }}>Track</Link>
          <button className="btn btn-primary" onClick={fetchShipments} disabled={loading} style={{ padding: '0.5rem 0.9rem' }}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="badge badge-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Search</label>
          <input
            className="input-field"
            placeholder="Tracking ID, status, origin…"
            defaultValue={searchParams.get('q') || ''}
            onChange={(e) => {
              const value = e.target.value;
              const params = new URLSearchParams(searchParams);
              if (value.trim()) params.set('q', value);
              else params.delete('q');
              navigate(`/dashboard/shipments?${params.toString()}`);
            }}
          />
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>Shipments</div>
          <div className="text-dim">{filtered.length} item(s)</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Route</th>
                <th>Container</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No shipments found.</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{s.trackingID}</td>
                    <td>{s.type || '—'}</td>
                    <td>
                      <span className="badge badge-neutral">{s.status || 'Pending'}</span>
                    </td>
                    <td>{(s.origin || '—') + ' → ' + (s.destination || '—')}</td>
                    <td>{s.container?.containerNumber || '—'}</td>
                    <td>{s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/dashboard/track?id=${encodeURIComponent(s.trackingID)}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                        Track
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerShipments;

