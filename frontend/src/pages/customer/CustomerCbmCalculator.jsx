import React, { useMemo, useState } from 'react';

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
};

const CustomerCbmCalculator = () => {
  const [lengthM, setLengthM] = useState('');
  const [widthM, setWidthM] = useState('');
  const [heightM, setHeightM] = useState('');
  const [ratePerCbm, setRatePerCbm] = useState('255');

  const [submitted, setSubmitted] = useState(false);

  const computed = useMemo(() => {
    const l = toNumber(lengthM);
    const w = toNumber(widthM);
    const h = toNumber(heightM);
    const rate = toNumber(ratePerCbm);

    const okDims = [l, w, h].every((n) => Number.isFinite(n) && n > 0);
    const okRate = Number.isFinite(rate) && rate >= 0;
    if (!okDims || !okRate) return { cbm: 0, cost: 0, valid: false };

    const cbm = l * w * h;
    const cost = cbm * rate;
    return { cbm, cost, valid: true };
  }, [heightM, lengthM, ratePerCbm, widthM]);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="animate-slide-up">
      <div className="calc-page">
        <div className="calc-card glass-card">
          <h2 className="calc-title">CBM Shipping Calculator</h2>

          <form onSubmit={onSubmit}>
            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--dark-blue)', fontWeight: 700 }}>Length (m):</label>
              <input className="input-field" type="number" min="0" step="0.01" value={lengthM} onChange={(e) => setLengthM(e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--dark-blue)', fontWeight: 700 }}>Width (m):</label>
              <input className="input-field" type="number" min="0" step="0.01" value={widthM} onChange={(e) => setWidthM(e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--dark-blue)', fontWeight: 700 }}>Height (m):</label>
              <input className="input-field" type="number" min="0" step="0.01" value={heightM} onChange={(e) => setHeightM(e.target.value)} />
            </div>

            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label className="input-label" style={{ color: 'var(--dark-blue)', fontWeight: 700 }}>Rate per CBM ($):</label>
              <input className="input-field" type="number" min="0" step="0.01" value={ratePerCbm} onChange={(e) => setRatePerCbm(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Calculate
            </button>
          </form>

          {submitted && (
            <div style={{ marginTop: '1.5rem' }}>
              {!computed.valid ? (
                <div className="badge badge-error">Enter valid dimensions and rate.</div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div className="badge badge-neutral">CBM: {computed.cbm.toFixed(4)} m³</div>
                  <div className="badge badge-success">Estimated cost: ${computed.cost.toFixed(2)}</div>
                </div>
              )}

              <div className="text-dim" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                Formula: CBM = L × W × H
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCbmCalculator;

