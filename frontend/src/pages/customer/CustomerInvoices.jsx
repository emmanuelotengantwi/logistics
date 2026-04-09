import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

const CustomerInvoices = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInvoices = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/payments');
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const invoices = useMemo(() => payments
    .filter((p) => p.status === 'Completed')
    .map((p) => ({
      id: p._id,
      reference: p.reference,
      amount: Number(p.amount || 0),
      trackingID: p.shipment?.trackingID || '—',
      date: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '—',
    })), [payments]);

  const printInvoice = (invoice) => {
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.reference}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            .muted { color: #475569; }
            .row { display:flex; justify-content: space-between; margin-top: 12px; }
            .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 16px; }
            h1 { margin: 0 0 8px; font-size: 22px; }
            h2 { margin: 0; font-size: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <h1>AMOOKSCO Logistics</h1>
          <div class="muted">Customer invoice</div>

          <div class="box">
            <div class="row"><div><strong>Invoice Ref</strong></div><div>${invoice.reference}</div></div>
            <div class="row"><div><strong>Date</strong></div><div>${invoice.date}</div></div>
            <div class="row"><div><strong>Billed To</strong></div><div>${(userInfo.name || 'Customer')}</div></div>
            <div class="row"><div><strong>Shipping Mark</strong></div><div>${(userInfo.shippingMark || 'AMOOKSCO_1480')}</div></div>
          </div>

          <div class="box">
            <h2>Details</h2>
            <table>
              <thead>
                <tr><th>Description</th><th>Tracking ID</th><th>Amount</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Shipment service</td>
                  <td>${invoice.trackingID}</td>
                  <td>${invoice.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div class="row" style="margin-top: 14px;"><div><strong>Total</strong></div><div><strong>${invoice.amount.toLocaleString()}</strong></div></div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
        <h2 className="heading-2">My Invoices</h2>
        <button className="btn btn-secondary" onClick={fetchInvoices} disabled={loading} style={{ padding: '0.5rem 0.9rem' }}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && <div className="badge badge-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>Completed Payments (Invoices)</div>
          <div className="text-dim">{invoices.length} invoice(s)</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Tracking ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Loading…</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No invoices yet. Confirm a payment to generate one.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{inv.reference}</td>
                    <td>{inv.trackingID}</td>
                    <td>{inv.date}</td>
                    <td>{inv.amount.toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-primary" onClick={() => printInvoice(inv)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                        Print
                      </button>
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

export default CustomerInvoices;

