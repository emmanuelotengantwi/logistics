import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { useSearchParams } from 'react-router-dom';

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

const CustomerTrackShipment = () => {
  const [searchParams] = useSearchParams();
  const prefill = (searchParams.get('id') || '').trim();

  const [shipments, setShipments] = useState([]);
  const [selectedCode, setSelectedCode] = useState(prefill);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchShipments = async () => {
    try {
      const { data } = await api.get('/shipments');
      setShipments(Array.isArray(data) ? data : []);
    } catch {
      setShipments([]);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    if (prefill) setSelectedCode(prefill);
  }, [prefill]);

  const options = useMemo(() => {
    const list = shipments
      .map((s) => ({
        value: s.trackingID,
        label: s.trackingID,
      }))
      .filter((o) => !!o.value);
    return list;
  }, [shipments]);

  const handleTrack = async (e) => {
    e.preventDefault();
    const code = selectedCode.trim();
    if (!code) return;

    setError('');
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get(`/shipments/track/${encodeURIComponent(code)}`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  const orderStatus = result?.status || '';
  const eta = formatDate(result?.ETA);

  return (
    <div className="animate-slide-up">
      <div className="track-page">
        <div className="track-card glass-card">
          <h2 className="track-title">Track your orders easily</h2>

          <form onSubmit={handleTrack}>
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>
                Select Packing code <span style={{ color: 'var(--status-error)' }}>*</span>
              </label>
              <select
                className="input-field"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                required
              >
                <option value="">Select code</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {options.length === 0 && (
                <div className="text-dim" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  No packing codes yet. When shipments are added, they will appear here.
                </div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>
                Order Status <span style={{ color: 'var(--status-error)' }}>*</span>
              </label>
              <input className="input-field" value={orderStatus} readOnly placeholder="" />
            </div>

            <div className="input-group" style={{ marginBottom: '2rem' }}>
              <label className="input-label" style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>
                Estimated Delivery Date
              </label>
              <input className="input-field" value={eta} readOnly placeholder="" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.6rem 1.1rem' }}>
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="badge badge-error" style={{ marginTop: '1rem', display: 'inline-block' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerTrackShipment;

