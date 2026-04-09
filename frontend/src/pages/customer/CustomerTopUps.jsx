import React, { useMemo, useState } from 'react';
import { readJson, userScopedKey } from '../../utils/storage';
import { Link } from 'react-router-dom';

const toCsv = (rows) => {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const header = ['date', 'amount', 'method', 'note'];
  const lines = [header.map(escape).join(',')];
  for (const row of rows) {
    lines.push([row.date, row.amount, row.method, row.note].map(escape).join(','));
  }
  return lines.join('\n');
};

const CustomerTopUps = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const storageKey = useMemo(() => userScopedKey('walletTopups', userInfo), [userInfo]);
  const [topups] = useState(() => readJson(storageKey, []));

  const exportCsv = () => {
    const rows = topups.map((t) => ({
      date: t.createdAt ? t.createdAt.split('T')[0] : '',
      amount: Number(t.amount || 0),
      method: t.method || '',
      note: t.note || '',
    }));

    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'topups.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const total = topups.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
        <h2 className="heading-2">Top-Up history</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/dashboard/wallet" className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem' }}>Go to Wallet</Link>
          <button className="btn btn-primary" onClick={exportCsv} disabled={topups.length === 0} style={{ padding: '0.5rem 0.9rem' }}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div className="text-dim">Total top-ups</div>
        <div className="heading-2" style={{ marginTop: '0.5rem' }}>{total.toLocaleString()}</div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>History</div>
          <div className="text-dim">{topups.length} record(s)</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {topups.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No top-ups found.</td></tr>
              ) : (
                topups.map((t) => (
                  <tr key={t.id}>
                    <td>{t.createdAt ? t.createdAt.split('T')[0] : '—'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{Number(t.amount || 0).toLocaleString()}</td>
                    <td>{t.method || '—'}</td>
                    <td>{t.note || '—'}</td>
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

export default CustomerTopUps;

