import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

const addDays = (isoDate, days) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const CustomerInvoices = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appliedFrom, setAppliedFrom] = useState('');
  const [appliedTo, setAppliedTo] = useState('');

  const fetchInvoices = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/payments');
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load invoices');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const invoices = useMemo(() => {
    const from = appliedFrom ? new Date(appliedFrom) : null;
    const to = appliedTo ? new Date(appliedTo) : null;
    const toEnd = to ? new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1) : null;

    return payments
      .filter((p) => p.status === 'Completed')
      .map((p) => {
        const invoiceDate = formatDate(p.createdAt);
        return {
          id: p._id,
          invoiceNo: p.reference || `INV-${String(p._id || '').slice(-6).toUpperCase()}`,
          packingCode: p.shipment?.trackingID || '—',
          totalUsd: Number(p.amount || 0),
          payment: 'Paid',
          status: 'Invoiced',
          invoiceDate,
          dueDate: addDays(invoiceDate, 7),
          trackingID: p.shipment?.trackingID || '—',
          reference: p.reference || '',
        };
      })
      .filter((inv) => {
        if (!from && !toEnd) return true;
        if (!inv.invoiceDate) return false;
        const d = new Date(inv.invoiceDate);
        if (Number.isNaN(d.getTime())) return false;
        if (from && d < from) return false;
        if (toEnd && d > toEnd) return false;
        return true;
      })
      .sort((a, b) => (b.invoiceDate || '').localeCompare(a.invoiceDate || ''));
  }, [payments, appliedFrom, appliedTo]);

  const printInvoice = (invoice) => {
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;

    w.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNo}</title>
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
            <div class="row"><div><strong>Invoice #</strong></div><div>${invoice.invoiceNo}</div></div>
            <div class="row"><div><strong>Date</strong></div><div>${invoice.invoiceDate || ''}</div></div>
            <div class="row"><div><strong>Due Date</strong></div><div>${invoice.dueDate || ''}</div></div>
            <div class="row"><div><strong>Billed To</strong></div><div>${(userInfo.name || 'Customer')}</div></div>
            <div class="row"><div><strong>Shipping Mark</strong></div><div>${(userInfo.shippingMark || 'AMOOKSCO_1480')}</div></div>
          </div>

          <div class="box">
            <h2>Details</h2>
            <table>
              <thead>
                <tr><th>Description</th><th>Packing code</th><th>Total (USD)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Shipment service</td>
                  <td>${invoice.packingCode}</td>
                  <td>${Number(invoice.totalUsd || 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div class="row" style="margin-top: 14px;"><div><strong>Total</strong></div><div><strong>${Number(invoice.totalUsd || 0).toLocaleString()}</strong></div></div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  const handleLoad = async () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    await fetchInvoices();
  };

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '1rem' }}>View Invoice list</h2>

      {error && <div className="badge badge-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">From date</label>
            <input className="input-field" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">To date</label>
            <input className="input-field" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Load data</label>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleLoad}
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', background: '#22c55e' }}
            >
              {loading ? 'Loading…' : 'Load'}
            </button>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table data-table-blue">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice #</th>
                <th>Packing code</th>
                <th>Total(USD)</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Loading…</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="9" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No invoices found.</td></tr>
              ) : (
                invoices.map((inv, idx) => (
                  <tr key={inv.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{inv.invoiceNo}</td>
                    <td>{inv.packingCode}</td>
                    <td style={{ fontWeight: 700 }}>${inv.totalUsd.toFixed(2)}</td>
                    <td style={{ color: '#16a34a', fontWeight: 700 }}>{inv.payment}</td>
                    <td>{inv.status}</td>
                    <td>{inv.invoiceDate || '—'}</td>
                    <td>{inv.dueDate || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => printInvoice(inv)}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: '#22c55e' }}
                      >
                        ✓ Print
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

