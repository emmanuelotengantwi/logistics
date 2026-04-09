import React, { useEffect, useMemo, useState } from 'react';
import { readJson, userScopedKey, writeJson } from '../../utils/storage';

const CustomerPackingList = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const storageKey = useMemo(() => userScopedKey('packingList', userInfo), [userInfo]);

  const [items, setItems] = useState(() => readJson(storageKey, []));
  const [form, setForm] = useState({ description: '', qty: 1, value: '', notes: '' });

  useEffect(() => {
    writeJson(storageKey, items);
  }, [storageKey, items]);

  const addItem = (e) => {
    e.preventDefault();
    const description = form.description.trim();
    if (!description) return;
    const next = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      description,
      qty: Number(form.qty) || 1,
      value: form.value ? Number(form.value) : null,
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [next, ...prev]);
    setForm({ description: '', qty: 1, value: '', notes: '' });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const totals = useMemo(() => {
    const totalQty = items.reduce((acc, i) => acc + (Number(i.qty) || 0), 0);
    const totalValue = items.reduce((acc, i) => acc + (Number(i.value) || 0), 0);
    return { totalQty, totalValue };
  }, [items]);

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>My Packing List</h2>
      <div className="text-dim" style={{ marginBottom: '1.5rem' }}>Create a personal packing list (saved on this device).</div>

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Add item</h3>
          <form onSubmit={addItem}>
            <div className="input-group">
              <label className="input-label">Description</label>
              <input className="input-field" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Qty</label>
                <input type="number" min="1" className="input-field" value={form.qty} onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Estimated value (optional)</label>
                <input type="number" min="0" step="0.01" className="input-field" value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Notes (optional)</label>
              <textarea rows="3" className="input-field" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
        </div>

        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Summary</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="badge badge-neutral">Items: {items.length}</div>
            <div className="badge badge-neutral">Total qty: {totals.totalQty}</div>
            <div className="badge badge-neutral">Total value: {totals.totalValue.toLocaleString()}</div>
          </div>
          <div className="text-dim" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            Tip: Use this list to track what you expect to receive at the warehouse.
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>Items</div>
          <div className="text-dim">{items.length} item(s)</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Value</th>
                <th>Notes</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No items yet.</td></tr>
              ) : (
                items.map((i) => (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 600, color: 'var(--dark-blue)' }}>{i.description}</td>
                    <td>{i.qty}</td>
                    <td>{i.value == null ? '—' : Number(i.value).toLocaleString()}</td>
                    <td>{i.notes || '—'}</td>
                    <td>{i.createdAt ? i.createdAt.split('T')[0] : '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary" onClick={() => removeItem(i.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
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

export default CustomerPackingList;

