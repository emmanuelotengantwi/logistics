import React, { useState } from 'react';
import { Search, Package, MapPin, Calendar, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const statuses = [
    'Pending', 'Received at Warehouse', 'Processing', 'In Transit',
    'Arrived at Port', 'Cleared', 'Ready for Pickup', 'Delivered'
];

const PublicTracking = () => {
    const [trackingID, setTrackingID] = useState('');
    const [shipment, setShipment] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        setError('');
        setShipment(null);
        setLoading(true);
        try {
            const { data } = await api.get(`/shipments/track/${trackingID}`);
            setShipment(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Shipment not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 className="heading-1">AMOOKSCO</h1>
                <Link to="/login" className="btn btn-secondary">Client Portal</Link>
            </div>

            <div className="glass-card animate-slide-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>Track Your Cargo</h2>
                <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                    <input 
                        type="text" 
                        placeholder="Enter Tracking ID (e.g. TRK-...)" 
                        className="input-field" 
                        style={{ flex: 1 }}
                        value={trackingID}
                        onChange={(e) => setTrackingID(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Search size={20} />
                        {loading ? 'Tracking...' : 'Track'}
                    </button>
                </form>
                {error && <div className="text-sm" style={{ color: 'var(--status-error)', marginTop: '1rem' }}>{error}</div>}
            </div>

            {shipment && (
                <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                        <div>
                            <div className="text-sm text-dim">Tracking ID</div>
                            <div className="heading-3">{shipment.trackingID}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="badge badge-success">{shipment.status}</span>
                            <div className="text-sm text-dim" style={{ marginTop: '0.5rem' }}>{shipment.type} Freight</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                <MapPin size={18} /> Origin
                            </div>
                            <div style={{ fontWeight: '500', fontSize: '1.1rem' }}>{shipment.origin}</div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                <MapPin size={18} /> Destination
                            </div>
                            <div style={{ fontWeight: '500', fontSize: '1.1rem' }}>{shipment.destination}</div>
                        </div>
                    </div>

                    <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>Tracking Progress</h3>
                    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                        <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)' }}></div>
                        {statuses.map((status, index) => {
                            const currentIndex = statuses.indexOf(shipment.status);
                            const isCompleted = index <= currentIndex;
                            const isCurrent = index === currentIndex;
                            
                            return (
                                <div key={status} style={{ position: 'relative', marginBottom: index === statuses.length - 1 ? 0 : '2rem' }}>
                                    <div style={{ 
                                        position: 'absolute', left: '-2rem', top: '2px', 
                                        width: '16px', height: '16px', borderRadius: '50%', 
                                        background: isCompleted ? 'var(--status-success)' : 'var(--bg-secondary)',
                                        border: `2px solid ${isCompleted ? 'var(--status-success)' : 'var(--border-color)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
                                    }}>
                                        {isCompleted && <CheckCircle size={10} color="#000" />}
                                    </div>
                                    <div style={{ color: isCurrent ? '#fff' : isCompleted ? 'var(--text-secondary)' : 'var(--border-color)', fontWeight: isCurrent ? '600' : '400' }}>
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

export default PublicTracking;
