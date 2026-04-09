import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Truck } from 'lucide-react';

const CustomerDashboard = () => {
    const [shipments, setShipments] = useState([]);
    
    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const { data } = await api.get('/shipments');
                setShipments(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchShipments();
    }, []);

    return (
        <div className="animate-slide-up">
            <h2 className="heading-2" style={{ marginBottom: '2rem' }}>My Shipments</h2>
            
            <div className="dashboard-grid">
                {shipments.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                        <Package size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
                        <h3 className="heading-3">No shipments yet</h3>
                        <p className="text-dim text-sm" style={{ marginTop: '0.5rem' }}>You don't have any active shipments.</p>
                    </div>
                ) : (
                    shipments.map(shipment => (
                        <div key={shipment._id} className="glass-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span className="badge badge-neutral">{shipment.type}</span>
                                <span className="badge badge-warning">{shipment.status}</span>
                            </div>
                            <div className="text-sm text-dim">Tracking ID</div>
                            <div className="heading-3" style={{ marginBottom: '1rem' }}>{shipment.trackingID}</div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div className="text-dim text-sm">Origin</div>
                                    <div style={{ fontWeight: '500' }}>{shipment.origin}</div>
                                </div>
                                <Truck size={20} color="var(--accent-blue)" />
                                <div style={{ textAlign: 'right' }}>
                                    <div className="text-dim text-sm">Destination</div>
                                    <div style={{ fontWeight: '500' }}>{shipment.destination}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
