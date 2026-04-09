import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { Package, Ship, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

	const CustomerDashboard = () => {
	    const [shipments, setShipments] = useState([]);
	    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

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

	    const displayShipments = shipments;

	    const metrics = useMemo(() => {
	        const total = displayShipments.length;
	        const inTransitStatuses = new Set(['In Transit', 'Processing', 'Arrived at Port', 'Cleared']);
	        const completedStatuses = new Set(['Delivered', 'Ready for Pickup']);

	        const inTransit = displayShipments.filter((s) => inTransitStatuses.has(s.status)).length;
	        const completed = displayShipments.filter((s) => completedStatuses.has(s.status)).length;

	        return { total, inTransit, completed };
	    }, [displayShipments]);

	    return (
	        <div className="animate-slide-up">
            {/* Hero Alert */}
            <div style={{ background: '#fff', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <span role="img" aria-label="wave" style={{ fontSize: '1.2rem' }}>👋</span>
                <span style={{ fontSize: '1.1rem' }}>
                    <strong style={{ color: 'var(--dark-blue)', fontWeight: 700 }}>Hi {userInfo.name?.split(' ')[0] || 'Emmanuel'},</strong> your shipping mark is <span style={{ color: 'var(--text-secondary)' }}>{userInfo.shippingMark || 'AMOOKSCO_1480'}</span>
                </span>
            </div>

	            {/* Metric Cards */}
	            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
	                <div className="metric-card white">
	                    <div>
	                        <div className="metric-title" style={{ color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Total SHIPMENTS</div>
	                        <div className="metric-value">{metrics.total}</div>
	                    </div>
	                    <div style={{ padding: '0.75rem', border: '2px solid var(--dark-blue)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
	                        <Package size={36} color="var(--dark-blue)" strokeWidth={1.5} />
	                    </div>
	                </div>

	                <div className="metric-card orange">
	                    <div>
	                        <div className="metric-title" style={{ color: '#fff' }}>Goods in Transit</div>
	                        <div className="metric-value">{metrics.inTransit}</div>
	                    </div>
	                    <div style={{ paddingBottom: '0.25rem' }}>
	                        <Ship size={54} color="#fff" strokeWidth={1.2} />
	                    </div>
	                </div>

	                <div className="metric-card dark">
	                    <div>
	                        <div className="metric-title" style={{ color: '#fff' }}>Completed SHIPMENTS</div>
	                        <div className="metric-value">{metrics.completed}</div>
	                    </div>
	                    <div style={{ padding: '0.75rem', border: '2px solid #ffffff', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
	                        <CheckCircle size={36} color="#fff" strokeWidth={1.5} />
	                    </div>
                </div>
            </div>

            {/* Data Table Container */}
	            <div className="data-table-container">
	                <div className="data-table-header">
	                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--dark-blue)' }}>Recent Shipment</h3>
	                    <Link to="/dashboard/shipments" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500, textDecoration: 'none' }}>
	                        <span>View All</span> <ArrowRight size={16} />
	                    </Link>
	                </div>
                
	                <div style={{ overflowX: 'auto' }}>
	                    <table className="data-table">
	                        <thead>
	                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Picture</th>
                                <th>Tracking #</th>
                                <th>CTN</th>
                                <th>CBM</th>
                                <th>Weight</th>
                                <th>Receive date</th>
                            </tr>
	                        </thead>
	                        <tbody>
	                            {displayShipments.length === 0 ? (
	                                <tr>
	                                    <td colSpan="8" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>
	                                        No shipments yet.
	                                    </td>
	                                </tr>
	                            ) : (
	                                displayShipments.map((shipment, index) => (
	                                    <tr key={shipment._id || shipment.id}>
	                                        <td>{index + 1}</td>
	                                        <td>
	                                            <div style={{ color: 'var(--text-secondary)' }}>{shipment.item || shipment.type || 'N/A'}</div>
	                                        </td>
	                                        <td>
	                                            <div style={{ width: '40px', height: '30px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
	                                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #e2e8f0, #cbd5e1)' }}></div>
	                                            </div>
	                                        </td>
	                                        <td>{shipment.tracking || shipment.trackingID || 'N/A'}</td>
	                                        <td>{shipment.ctn || '1'}</td>
	                                        <td>{shipment.cbm || '0.02'}</td>
	                                        <td>{shipment.weight || '2'}</td>
	                                        <td>{shipment.date || (shipment.createdAt ? new Date(shipment.createdAt).toISOString().split('T')[0] : '—')}</td>
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

export default CustomerDashboard;
