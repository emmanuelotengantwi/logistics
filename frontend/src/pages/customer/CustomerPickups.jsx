import React, { useEffect, useMemo, useState } from 'react';
import { readJson, userScopedKey, writeJson } from '../../utils/storage';

const CustomerPickups = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const storageKey = useMemo(() => userScopedKey('pickups', userInfo), [userInfo]);

  const [items, setItems] = useState(() => readJson(storageKey, []));
  const [form, setForm] = useState({ address: '', date: '', instructions: '' });

  useEffect(() => {
    writeJson(storageKey, items);
  }, [storageKey, items]);

  const submit = (e) => {
    e.preventDefault();
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      address: form.address.trim(),
      date: form.date,
      instructions: form.instructions.trim(),
      status: 'Requested',
      createdAt: new Date().toISOString(),
    };
    if (!entry.address || !entry.date) return;
    setItems((prev) => [entry, ...prev]);
    setForm({ address: '', date: '', instructions: '' });
  };

  const cancel = (id) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Canceled' } : p)));

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Pick-ups</h2>
      <div className="text-dim" style={{ marginBottom: '1.5rem' }}>Request a pickup (saved on this device).</div>

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>New pickup request</h3>
          <form onSubmit={submit}>
            <div className="input-group">
              <label className="input-label">Pickup address</label>
              <input className="input-field" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} required />
            </div>
            <div className="input-group">
              <label className="input-label">Preferred date</label>
              <input type="date" className="input-field" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
            </div>
            <div className="input-group">
              <label className="input-label">Instructions (optional)</label>
              <textarea rows="3" className="input-field" value={form.instructions} onChange={(e) => setForm((p) => ({ ...p, instructions: e.target.value }))} />
            </div>
            <button className="btn btn-primary" type="submit">Request pickup</button>
          </form>
        </div>

        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>My pickup status</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="badge badge-neutral">Total: {items.length}</div>
            <div className="badge badge-warning">Requested: {items.filter((p) => p.status === 'Requested').length}</div>
            <div className="badge badge-error">Canceled: {items.filter((p) => p.status === 'Canceled').length}</div>
          </div>
          <div className="text-dim" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            If you need backend storage, we can connect this to an API endpoint.
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>Requests</div>
          <div className="text-dim">{items.length} record(s)</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Date</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No pickup requests yet.</td></tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{p.address}</td>
                    <td>{p.date}</td>
                    <td>
                      <span className={p.status === 'Requested' ? 'badge badge-warning' : 'badge badge-error'}>{p.status}</span>
                    </td>
                    <td>{p.createdAt ? p.createdAt.split('T')[0] : '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      {p.status === 'Requested' && (
                        <button className="btn btn-secondary" onClick={() => cancel(p.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                          Cancel
                        </button>
                      )}
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

export default CustomerPickups;

