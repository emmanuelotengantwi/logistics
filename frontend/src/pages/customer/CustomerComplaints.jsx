import React, { useEffect, useMemo, useState } from 'react';
import { readJson, userScopedKey, writeJson } from '../../utils/storage';

const CustomerComplaints = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const storageKey = useMemo(() => userScopedKey('complaints', userInfo), [userInfo]);

  const [items, setItems] = useState(() => readJson(storageKey, []));
  const [form, setForm] = useState({ subject: '', message: '', trackingID: '' });

  useEffect(() => {
    writeJson(storageKey, items);
  }, [storageKey, items]);

  const submit = (e) => {
    e.preventDefault();
    const subject = form.subject.trim();
    const message = form.message.trim();
    if (!subject || !message) return;
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      subject,
      message,
      trackingID: form.trackingID.trim(),
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [entry, ...prev]);
    setForm({ subject: '', message: '', trackingID: '' });
  };

  const close = (id) => setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Closed' } : c)));

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Lodge a Complaint</h2>
      <div className="text-dim" style={{ marginBottom: '1.5rem' }}>Submit an issue (saved on this device).</div>

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>New complaint</h3>
          <form onSubmit={submit}>
            <div className="input-group">
              <label className="input-label">Subject</label>
              <input className="input-field" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} required />
            </div>
            <div className="input-group">
              <label className="input-label">Tracking ID (optional)</label>
              <input className="input-field" value={form.trackingID} onChange={(e) => setForm((p) => ({ ...p, trackingID: e.target.value }))} />
            </div>
            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea rows="4" className="input-field" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required />
            </div>
            <button className="btn btn-primary" type="submit">Submit</button>
          </form>
        </div>

        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Status</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="badge badge-neutral">Total: {items.length}</div>
            <div className="badge badge-warning">Open: {items.filter((c) => c.status === 'Open').length}</div>
            <div className="badge badge-success">Closed: {items.filter((c) => c.status === 'Closed').length}</div>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>My complaints</div>
          <div className="text-dim">{items.length} record(s)</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Tracking ID</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No complaints yet.</td></tr>
              ) : (
                items.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{c.subject}</td>
                    <td>{c.trackingID || '—'}</td>
                    <td>
                      <span className={c.status === 'Closed' ? 'badge badge-success' : 'badge badge-warning'}>{c.status}</span>
                    </td>
                    <td>{c.createdAt ? c.createdAt.split('T')[0] : '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      {c.status !== 'Closed' && (
                        <button className="btn btn-secondary" onClick={() => close(c.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                          Close
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

export default CustomerComplaints;

