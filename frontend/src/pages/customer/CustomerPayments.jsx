import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

const CustomerPayments = () => {
  const [shipments, setShipments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ shipmentId: '', amount: '' });
  const [checkout, setCheckout] = useState(null);

  const fetchAll = async () => {
    setError('');
    setLoading(true);
    try {
      const [shipRes, payRes] = await Promise.all([api.get('/shipments'), api.get('/payments')]);
      setShipments(Array.isArray(shipRes.data) ? shipRes.data : []);
      setPayments(Array.isArray(payRes.data) ? payRes.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (!form.shipmentId && shipments.length > 0) {
      setForm((p) => ({ ...p, shipmentId: shipments[0]._id }));
    }
  }, [shipments, form.shipmentId]);

  const shipmentOptions = useMemo(() => shipments.map((s) => ({
    id: s._id,
    label: `${s.trackingID} (${s.origin || '—'} → ${s.destination || '—'})`,
    cost: s.cost,
  })), [shipments]);

  const initialize = async (e) => {
    e.preventDefault();
    if (!form.shipmentId) return;
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setError('');
    setActionLoading(true);
    try {
      const { data } = await api.post('/payments/checkout', { shipmentId: form.shipmentId, amount });
      setCheckout(data);
      await fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setActionLoading(false);
    }
  };

  const confirm = async () => {
    if (!checkout?.paymentId) return;
    setError('');
    setActionLoading(true);
    try {
      await api.post('/payments/confirm', { paymentId: checkout.paymentId });
      setCheckout(null);
      await fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment confirmation failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
        <h2 className="heading-2">My Payments</h2>
        <button className="btn btn-secondary" onClick={fetchAll} disabled={loading} style={{ padding: '0.5rem 0.9rem' }}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && <div className="badge badge-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Initialize Payment (Mock)</h3>
          <form onSubmit={initialize}>
            <div className="input-group">
              <label className="input-label">Shipment</label>
              <select className="input-field" value={form.shipmentId} onChange={(e) => setForm((p) => ({ ...p, shipmentId: e.target.value }))}>
                {shipmentOptions.length === 0 ? (
                  <option value="">No shipments</option>
                ) : (
                  shipmentOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)
                )}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Amount</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="input-field"
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                placeholder="e.g. 50"
                required
              />
              <div className="text-dim" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                Tip: shipment cost is stored on the shipment record (if available).
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={actionLoading || shipmentOptions.length === 0}>
              {actionLoading ? 'Processing…' : 'Initialize'}
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Current Checkout</h3>
          {!checkout ? (
            <div className="text-dim">No active checkout. Initialize a payment to get a reference.</div>
          ) : (
            <div>
              <div className="badge badge-neutral" style={{ marginBottom: '1rem' }}>Reference: {checkout.reference}</div>
              <div className="text-dim" style={{ marginBottom: '1rem' }}>
                Mock checkout url: <span style={{ fontFamily: 'monospace' }}>{checkout.mockCheckoutUrl}</span>
              </div>
              <button className="btn btn-primary" onClick={confirm} disabled={actionLoading}>
                {actionLoading ? 'Confirming…' : 'Confirm Payment'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>Payment History</div>
          <div className="text-dim">{payments.length} record(s)</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Shipment</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Loading…</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No payments yet.</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{p.reference}</td>
                    <td>
                      <span className={p.status === 'Completed' ? 'badge badge-success' : 'badge badge-warning'}>{p.status}</span>
                    </td>
                    <td>{Number(p.amount || 0).toLocaleString()}</td>
                    <td>{p.shipment?.trackingID || '—'}</td>
                    <td>{p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '—'}</td>
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

export default CustomerPayments;

