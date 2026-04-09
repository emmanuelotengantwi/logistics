import React, { useMemo, useState } from 'react';

const CustomerCbmCalculator = () => {
  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [qty, setQty] = useState(1);

  const result = useMemo(() => {
    const l = Number(lengthCm);
    const w = Number(widthCm);
    const h = Number(heightCm);
    const q = Number(qty) || 1;
    if (![l, w, h].every((n) => Number.isFinite(n) && n > 0)) return { cbm: 0, total: 0 };
    const cbm = (l * w * h) / 1_000_000;
    return { cbm, total: cbm * q };
  }, [lengthCm, widthCm, heightCm, qty]);

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>CBM Calculator</h2>
      <div className="text-dim" style={{ marginBottom: '1.5rem' }}>Enter dimensions in centimeters to calculate volume in cubic meters (m³).</div>

      <div className="dashboard-grid">
        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Dimensions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Length (cm)</label>
              <input type="number" min="0" step="0.01" className="input-field" value={lengthCm} onChange={(e) => setLengthCm(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Width (cm)</label>
              <input type="number" min="0" step="0.01" className="input-field" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Height (cm)</label>
              <input type="number" min="0" step="0.01" className="input-field" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Quantity</label>
            <input type="number" min="1" step="1" className="input-field" value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>
        </div>

        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Result</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div className="badge badge-neutral">CBM per carton: {result.cbm.toFixed(4)} m³</div>
            <div className="badge badge-success">Total CBM: {result.total.toFixed(4)} m³</div>
          </div>
          <div className="text-dim" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            Formula: (L × W × H) / 1,000,000
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCbmCalculator;

