import React, { useEffect, useMemo, useState } from 'react';
import { readJson, userScopedKey, writeJson } from '../../utils/storage';

const CustomerWallet = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const storageKey = useMemo(() => userScopedKey('walletTopups', userInfo), [userInfo]);

  const [topups, setTopups] = useState(() => readJson(storageKey, []));
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [note, setNote] = useState('');

  useEffect(() => {
    writeJson(storageKey, topups);
  }, [storageKey, topups]);

  const balance = useMemo(() => topups.reduce((acc, t) => acc + (Number(t.amount) || 0), 0), [topups]);

  const addTopup = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      amount: value,
      method,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    setTopups((prev) => [entry, ...prev]);
    setAmount('');
    setNote('');
  };

  const remove = (id) => setTopups((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>My Wallet</h2>

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <div className="text-dim">Current balance</div>
          <div className="heading-2" style={{ marginTop: '0.5rem' }}>{balance.toLocaleString()}</div>
          <div className="text-dim" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            Wallet is stored locally for now (per device).
          </div>
        </div>

        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Add funds</h3>
          <form onSubmit={addTopup}>
            <div className="input-group">
              <label className="input-label">Amount</label>
              <input type="number" min="1" step="0.01" className="input-field" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Method</label>
              <select className="input-field" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Note (optional)</label>
              <input className="input-field" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">Top up</button>
          </form>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>Top-ups</div>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {topups.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No top-ups yet.</td></tr>
              ) : (
                topups.map((t) => (
                  <tr key={t.id}>
                    <td>{t.createdAt ? t.createdAt.split('T')[0] : '—'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{Number(t.amount || 0).toLocaleString()}</td>
                    <td>{t.method}</td>
                    <td>{t.note || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary" onClick={() => remove(t.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                        Remove
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

export default CustomerWallet;

