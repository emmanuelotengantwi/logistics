import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

const formatMoney = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n.toLocaleString() : '0';
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toISOString().split('T')[0];
};

const CustomerPayments = () => {
  const [shipments, setShipments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState('');
  const [amount, setAmount] = useState('');
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
      setShipments([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const paymentsByShipmentId = useMemo(() => {
    const map = new Map();
    for (const p of payments) {
      const id = p?.shipment?._id;
      if (!id) continue;
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(p);
    }
    return map;
  }, [payments]);

  const attentionRows = useMemo(() => {
    const rows = [];

    for (const s of shipments) {
      const shipmentPayments = paymentsByShipmentId.get(s._id) || [];
      const hasCompleted = shipmentPayments.some((p) => p.status === 'Completed');
      const hasPending = shipmentPayments.some((p) => p.status === 'Pending');
      const cost = Number(s.cost || 0);

      // "Payment needed" heuristic:
      // - cost exists
      // - and not fully completed
      // - pending payments still require attention
      const needsPayment = cost > 0 && !hasCompleted;
      const needsAttention = needsPayment || hasPending;
      if (!needsAttention) continue;

      rows.push({
        shipmentId: s._id,
        trackingID: s.trackingID,
        status: hasPending ? 'Pending' : 'Outstanding',
        amountDue: cost,
        createdAt: s.createdAt,
        canPay: !hasCompleted,
      });
    }

    // Also show pending payments that might not have shipment populated
    for (const p of payments) {
      if (p.status !== 'Pending') continue;
      if (p.shipment?._id) continue;
      rows.push({
        shipmentId: '',
        trackingID: p.shipment?.trackingID || '—',
        status: 'Pending',
        amountDue: Number(p.amount || 0),
        createdAt: p.createdAt,
        canPay: false,
      });
    }

    return rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }, [shipments, payments, paymentsByShipmentId]);

  const openPayModal = (shipmentId) => {
    setError('');
    setCheckout(null);
    setSelectedShipmentId(shipmentId);
    const s = shipments.find((x) => x._id === shipmentId);
    setAmount(s?.cost ? String(s.cost) : '');
    setIsModalOpen(true);
  };

  const closePayModal = () => {
    if (actionLoading) return;
    setIsModalOpen(false);
    setSelectedShipmentId('');
    setAmount('');
    setCheckout(null);
  };

  const initializePayment = async () => {
    if (!selectedShipmentId) return;
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter a valid amount');
      return;
    }

    setError('');
    setActionLoading(true);
    try {
      const { data } = await api.post('/payments/checkout', { shipmentId: selectedShipmentId, amount: value });
      setCheckout(data);
      await fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmPayment = async () => {
    if (!checkout?.paymentId) return;
    setError('');
    setActionLoading(true);
    try {
      await api.post('/payments/confirm', { paymentId: checkout.paymentId });
      setCheckout(null);
      closePayModal();
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
        <h2 className="heading-2">Outstanding payment</h2>
        <button className="btn btn-secondary" onClick={fetchAll} disabled={loading} style={{ padding: '0.5rem 0.9rem' }}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && <div className="badge badge-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="glass-card" style={{ minHeight: 260 }}>
        {loading ? (
          <div className="text-dim">Loading…</div>
        ) : attentionRows.length === 0 ? (
          <div className="text-dim">No transactions require your attention at the moment.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tracking #</th>
                  <th>Status</th>
                  <th>Amount Due</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {attentionRows.map((r) => (
                  <tr key={`${r.trackingID}-${r.shipmentId}-${r.createdAt || ''}`}>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{r.trackingID}</td>
                    <td>
                      <span className={r.status === 'Pending' ? 'badge badge-warning' : 'badge badge-error'}>
                        {r.status}
                      </span>
                    </td>
                    <td>{formatMoney(r.amountDue)}</td>
                    <td>{formatDate(r.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      {r.canPay && r.shipmentId ? (
                        <button className="btn btn-primary" onClick={() => openPayModal(r.shipmentId)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                          Pay
                        </button>
                      ) : (
                        <span className="text-dim">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" role="presentation" onMouseDown={closePayModal}>
          <div className="modal-card" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Make payment</h3>

            <div className="input-group">
              <label className="input-label">Amount</label>
              <input
                className="input-field"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {!checkout ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" type="button" onClick={closePayModal} disabled={actionLoading} style={{ padding: '0.6rem 0.9rem' }}>
                  Cancel
                </button>
                <button className="btn btn-primary" type="button" onClick={initializePayment} disabled={actionLoading} style={{ padding: '0.6rem 0.9rem' }}>
                  {actionLoading ? 'Processing…' : 'Pay'}
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '1rem' }}>
                <div className="badge badge-neutral" style={{ marginBottom: '1rem' }}>Reference: {checkout.reference}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button className="btn btn-secondary" type="button" onClick={closePayModal} disabled={actionLoading} style={{ padding: '0.6rem 0.9rem' }}>
                    Close
                  </button>
                  <button className="btn btn-primary" type="button" onClick={confirmPayment} disabled={actionLoading} style={{ padding: '0.6rem 0.9rem' }}>
                    {actionLoading ? 'Confirming…' : 'Confirm payment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPayments;

