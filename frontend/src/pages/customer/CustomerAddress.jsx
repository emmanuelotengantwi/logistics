import React, { useEffect, useMemo, useState } from 'react';
import { readJson, userScopedKey, writeJson } from '../../utils/storage';

const CustomerAddress = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const storageKey = useMemo(() => userScopedKey('customerAddress', userInfo), [userInfo]);
  const [address, setAddress] = useState(() => readJson(storageKey, {
    fullName: userInfo?.name || '',
    phone: '',
    country: '',
    city: '',
    street: '',
    notes: '',
  }));

  useEffect(() => {
    writeJson(storageKey, address);
  }, [storageKey, address]);

  const warehouseAddress = {
    name: 'AMOOKSCO Warehouse',
    line1: 'Warehouse Receiving (Use your shipping mark)',
    line2: 'Address: TBD',
    country: 'USA',
  };

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>My AMOOKSCO Address</h2>
      <div className="text-dim" style={{ marginBottom: '1.5rem' }}>
        Your shipping mark: <span style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>{userInfo.shippingMark || 'AMOOKSCO_1480'}</span>
      </div>

      <div className="dashboard-grid">
        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Warehouse Address</h3>
          <div style={{ color: 'var(--text-secondary)' }}>{warehouseAddress.name}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{warehouseAddress.line1}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{warehouseAddress.line2}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{warehouseAddress.country}</div>
          <div style={{ marginTop: '1rem' }} className="badge badge-neutral">
            Mark packages with: {userInfo.shippingMark || 'AMOOKSCO_1480'}
          </div>
        </div>

        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>My Delivery Address</h3>
          <div className="input-group">
            <label className="input-label">Full name</label>
            <input className="input-field" value={address.fullName} onChange={(e) => setAddress((p) => ({ ...p, fullName: e.target.value }))} />
          </div>
          <div className="input-group">
            <label className="input-label">Phone</label>
            <input className="input-field" value={address.phone} onChange={(e) => setAddress((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Country</label>
              <input className="input-field" value={address.country} onChange={(e) => setAddress((p) => ({ ...p, country: e.target.value }))} />
            </div>
            <div className="input-group">
              <label className="input-label">City</label>
              <input className="input-field" value={address.city} onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Street / area</label>
            <input className="input-field" value={address.street} onChange={(e) => setAddress((p) => ({ ...p, street: e.target.value }))} />
          </div>
          <div className="input-group">
            <label className="input-label">Notes</label>
            <textarea className="input-field" rows="3" value={address.notes} onChange={(e) => setAddress((p) => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="text-dim" style={{ fontSize: '0.85rem' }}>
            Saved automatically on this device.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAddress;

