import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

const CustomerInvoicesReport = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/payments');
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const report = useMemo(() => {
    const completed = payments.filter((p) => p.status === 'Completed');
    const byMonth = new Map();
    for (const p of completed) {
      const d = p.createdAt ? new Date(p.createdAt) : null;
      const key = d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` : 'Unknown';
      byMonth.set(key, (byMonth.get(key) || 0) + Number(p.amount || 0));
    }
    const rows = Array.from(byMonth.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));
    const grandTotal = rows.reduce((acc, r) => acc + r.total, 0);
    return { rows, grandTotal, count: completed.length };
  }, [payments]);

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
        <h2 className="heading-2">Invoices Report</h2>
        <button className="btn btn-secondary" onClick={fetchData} disabled={loading} style={{ padding: '0.5rem 0.9rem' }}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && <div className="badge badge-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <div className="text-dim">Completed invoices</div>
          <div className="heading-2" style={{ marginTop: '0.5rem' }}>{report.count}</div>
        </div>
        <div className="glass-card">
          <div className="text-dim">Grand total</div>
          <div className="heading-2" style={{ marginTop: '0.5rem' }}>{report.grandTotal.toLocaleString()}</div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>Monthly totals</div>
          <div className="text-dim">{report.rows.length} month(s)</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="2" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Loading…</td></tr>
              ) : report.rows.length === 0 ? (
                <tr><td colSpan="2" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No completed invoices yet.</td></tr>
              ) : (
                report.rows.map((r) => (
                  <tr key={r.month}>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{r.month}</td>
                    <td>{r.total.toLocaleString()}</td>
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

export default CustomerInvoicesReport;

