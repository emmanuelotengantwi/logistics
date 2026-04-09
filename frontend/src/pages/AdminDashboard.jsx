import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Users, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ shipments: 0, revenue: 0 });
    const [shipments, setShipments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/shipments');
                setShipments(data);
                
                const revenue = data.reduce((acc, curr) => acc + (curr.cost || 0), 0);
                setStats({ shipments: data.length, revenue });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="animate-slide-up">
            <h2 className="heading-2" style={{ marginBottom: '2rem' }}>Administration Overview</h2>
            
            <div className="dashboard-grid" style={{ marginBottom: '3rem' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--accent-glow)', padding: '1rem', borderRadius: '50%' }}>
                            <Package color="var(--accent-blue)" />
                        </div>
                        <div>
                            <div className="text-sm text-dim">Total Shipments</div>
                            <div className="heading-2">{stats.shipments}</div>
                        </div>
                    </div>
                </div>
                
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--status-success-bg)', padding: '1rem', borderRadius: '50%' }}>
                            <DollarSign color="var(--status-success)" />
                        </div>
                        <div>
                            <div className="text-sm text-dim">Total Revenue</div>
                            <div className="heading-2">${stats.revenue.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>Recent Shipments</h3>
            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Tracking ID</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Route</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Cost</th>
                            <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.map(s => (
                            <tr key={s._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{s.trackingID}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{s.origin} &rarr; {s.destination}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span className="badge badge-neutral">{s.status}</span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>${s.cost}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Manage</button>
                                </td>
                            </tr>
                        ))}
                        {shipments.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No shipments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
