import React, { useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from '../../utils/storage';

const ConfigureRates = () => {
  const storageKey = useMemo(() => 'adminRates', []);
  const [rates, setRates] = useState(() => readJson(storageKey, { ratePerCbm: 150, minCharge: 50 }));

  useEffect(() => {
    writeJson(storageKey, rates);
  }, [storageKey, rates]);

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Configure Rates</h2>
      <div className="text-dim" style={{ marginBottom: '1.5rem' }}>Saved locally for now.</div>

      <div className="glass-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Rate per CBM</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field"
              value={rates.ratePerCbm}
              onChange={(e) => setRates((p) => ({ ...p, ratePerCbm: Number(e.target.value) }))}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Minimum charge</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field"
              value={rates.minCharge}
              onChange={(e) => setRates((p) => ({ ...p, minCharge: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div className="text-dim" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
          Note: Backend currently uses fixed mock values in `backend/controllers/shipmentController.js`.
        </div>
      </div>
    </div>
  );
};

export default ConfigureRates;

