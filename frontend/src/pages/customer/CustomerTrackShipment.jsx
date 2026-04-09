import React, { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import { useSearchParams } from 'react-router-dom';

const statuses = [
  'Pending',
  'Received at Warehouse',
  'Processing',
  'In Transit',
  'Arrived at Port',
  'Cleared',
  'Ready for Pickup',
  'Delivered',
];

const CustomerTrackShipment = () => {
  const [searchParams] = useSearchParams();
  const prefill = (searchParams.get('id') || '').trim();

  const [trackingID, setTrackingID] = useState(prefill);
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefill) {
      setTrackingID(prefill);
      // auto track
      (async () => {
        setError('');
        setShipment(null);
        setLoading(true);
        try {
          const { data } = await api.get(`/shipments/track/${prefill}`);
          setShipment(data);
        } catch (err) {
          setError(err.response?.data?.message || 'Shipment not found');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [prefill]);

  const handleTrack = async (e) => {
    e.preventDefault();
    const id = trackingID.trim();
    if (!id) return;
    setError('');
    setShipment(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/shipments/track/${id}`);
      setShipment(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = useMemo(() => {
    if (!shipment?.status) return -1;
    return statuses.indexOf(shipment.status);
  }, [shipment?.status]);

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>Track your Shipment</h2>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g. TRK-...)"
            className="input-field"
            style={{ flex: 1, minWidth: 280 }}
            value={trackingID}
            onChange={(e) => setTrackingID(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Search size={18} />
            {loading ? 'Tracking…' : 'Track'}
          </button>
        </form>
        {error && <div className="text-sm" style={{ color: 'var(--status-error)', marginTop: '1rem' }}>{error}</div>}
      </div>

      {shipment && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
              <div className="text-sm text-dim">Tracking ID</div>
              <div className="heading-3">{shipment.trackingID}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success">{shipment.status}</span>
              <div className="text-sm text-dim" style={{ marginTop: '0.5rem' }}>{shipment.type} Freight</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                <MapPin size={18} /> Origin
              </div>
              <div style={{ fontWeight: '600', color: 'var(--dark-blue)' }}>{shipment.origin}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                <MapPin size={18} /> Destination
              </div>
              <div style={{ fontWeight: '600', color: 'var(--dark-blue)' }}>{shipment.destination}</div>
            </div>
          </div>

          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Tracking Progress</h3>
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)' }}></div>
            {statuses.map((status, index) => {
              const isCompleted = currentIndex >= 0 && index <= currentIndex;
              const isCurrent = currentIndex >= 0 && index === currentIndex;
              return (
                <div key={status} style={{ position: 'relative', marginBottom: index === statuses.length - 1 ? 0 : '1.5rem' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '-2rem',
                      top: '2px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: isCompleted ? 'var(--status-success)' : 'var(--bg-secondary)',
                      border: `2px solid ${isCompleted ? 'var(--status-success)' : 'var(--border-color)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    {isCompleted && <CheckCircle size={10} color="#000" />}
                  </div>
                  <div style={{ color: isCurrent ? 'var(--dark-blue)' : isCompleted ? 'var(--text-secondary)' : 'var(--border-color)', fontWeight: isCurrent ? 700 : 400 }}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTrackShipment;

