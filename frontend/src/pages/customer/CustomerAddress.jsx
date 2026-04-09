import React, { useEffect, useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { readJson, userScopedKey, writeJson } from '../../utils/storage';

const normalizeState = (raw, userInfo) => {
  const legacyLooksLikeDelivery =
    raw &&
    typeof raw === 'object' &&
    ('fullName' in raw || 'phone' in raw || 'street' in raw || 'city' in raw || 'country' in raw);

  const delivery = legacyLooksLikeDelivery
    ? {
        fullName: raw.fullName || userInfo?.name || '',
        phone: raw.phone || '',
        country: raw.country || '',
        city: raw.city || '',
        street: raw.street || '',
        notes: raw.notes || '',
      }
    : {
        fullName: raw?.delivery?.fullName || userInfo?.name || '',
        phone: raw?.delivery?.phone || '',
        country: raw?.delivery?.country || '',
        city: raw?.delivery?.city || '',
        street: raw?.delivery?.street || '',
        notes: raw?.delivery?.notes || '',
      };

  return {
    destinationCountry: raw?.destinationCountry || 'Ghana',
    shippingMode: raw?.shippingMode || 'Sea',
    delivery,
  };
};

const CustomerAddress = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const storageKey = useMemo(() => userScopedKey('customerAddress', userInfo), [userInfo]);
  const [state, setState] = useState(() => normalizeState(readJson(storageKey, null), userInfo));
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    writeJson(storageKey, state);
  }, [storageKey, state]);

  const shippingMark = userInfo.shippingMark || 'AMOOKSCO_1480';

  const destinationCountries = ['Ghana', 'Nigeria', 'Liberia', 'Sierra Leone'];
  const shippingModes = ['Sea', 'Air'];

  const addressCards = useMemo(() => {
    // NOTE: Replace with your real warehouse addresses when available.
    const commonLines = [
      `Shipping Mark: [${shippingMark}]`,
      'Receiver: AMOOKSCO Logistics',
      'Phone: +86 000 0000 0000',
      'Country: China',
    ];

    if (state.shippingMode === 'Air') {
      return [
        {
          key: 'air',
          title: 'Air Address (China)',
          rateLabel: 'Air address rate',
          rateValue: '$0.00',
          lines: [
            ...commonLines,
            'Province/City: Guangdong / Guangzhou',
            'Address: (Add your warehouse street address here)',
            'Postal Code: (TBD)',
          ],
        },
      ];
    }

    return [
      {
        key: 'foshan',
        title: 'FOSHAN/GUANGZHOU Sea Address',
        rateLabel: 'Sea address rate',
        rateValue: '$239',
        lines: [
          ...commonLines,
          'Province/City: Guangdong / Foshan',
          'Address: (Add your Foshan/Guangzhou warehouse street address here)',
          'Postal Code: (TBD)',
        ],
      },
      {
        key: 'yiwu',
        title: 'YIWU Sea Address',
        rateLabel: 'Sea address rate',
        rateValue: '$260',
        lines: [
          ...commonLines,
          'Province/City: Zhejiang / Yiwu',
          'Address: (Add your Yiwu warehouse street address here)',
          'Postal Code: (TBD)',
        ],
      },
    ];
  }, [shippingMark, state.shippingMode]);

  const noteText = useMemo(() => {
    const minCbm = '0.02';
    const rates =
      state.shippingMode === 'Sea'
        ? ['FOSHAN/GUANGZHOU Sea Address Rate: $239', 'YIWU Sea Address Rate: $260']
        : ['Air Address Rate: $0.00'];

    return {
      minCbm,
      rates,
    };
  }, [state.shippingMode]);

  const copyText = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(''), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <h2 className="heading-2" style={{ textAlign: 'center' }}>My Amooksco Address</h2>
      </div>

      <div className="notice-card">
        <div style={{ lineHeight: 1.7 }}>
          <div style={{ marginBottom: '0.75rem', color: 'var(--dark-blue)', fontWeight: 600 }}>
            Please note that your SHIPPING MARK or UNIQUE SHIPPING MARK is{' '}
            <span className="shipping-mark">[{shippingMark}]</span>.
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            If you are shipping a package to us without using the exact format shown on your VITE ADDRESS, your package could experience{' '}
            <span style={{ color: 'var(--status-error)', fontWeight: 700 }}>delayed processing OR loss</span>. We kindly ask that you take a moment to ensure your address is in the same format as displayed.
          </div>
          <div style={{ marginTop: '0.75rem', color: 'var(--dark-blue)' }}>Min. CBM {noteText.minCbm}</div>
          <div style={{ marginTop: '1rem', color: 'var(--dark-blue)' }}>
            {noteText.rates.map((r) => (
              <div key={r}>{r}</div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>Thank you!</div>
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: 900, margin: '0 auto 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label" style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>Select a Destination Country</label>
            <select
              className="input-field"
              value={state.destinationCountry}
              onChange={(e) => setState((p) => ({ ...p, destinationCountry: e.target.value }))}
            >
              {destinationCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label" style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>Select a Shipping Mode</label>
            <select
              className="input-field"
              value={state.shippingMode}
              onChange={(e) => setState((p) => ({ ...p, shippingMode: e.target.value }))}
            >
              {shippingModes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {addressCards.map((card) => {
          const text = card.lines.join('\n');
          const copied = copiedKey === card.key;
          return (
            <div key={card.key} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
                <h3 className="heading-3">{card.title}</h3>
                <span className="badge badge-neutral">{card.rateLabel}: {card.rateValue}</span>
              </div>

              <div className="address-block">
                {card.lines.map((l) => (
                  <div key={l}>
                    {l.includes(`[${shippingMark}]`) ? (
                      <>
                        {l.replace(`[${shippingMark}]`, '')}
                        <span className="shipping-mark">[{shippingMark}]</span>
                      </>
                    ) : (
                      l
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => copyText(card.key, text)}
                  style={{ padding: '0.6rem 0.9rem' }}
                >
                  <Copy size={16} /> {copied ? 'Copied' : 'Copy'}
                </button>
                <div className="text-dim" style={{ fontSize: '0.85rem' }}>
                  Destination: {state.destinationCountry} • Mode: {state.shippingMode}
                </div>
              </div>
            </div>
          );
        })}

        <div className="glass-card">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>My Delivery Address</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Full name</label>
              <input className="input-field" value={state.delivery.fullName} onChange={(e) => setState((p) => ({ ...p, delivery: { ...p.delivery, fullName: e.target.value } }))} />
            </div>
            <div className="input-group">
              <label className="input-label">Phone</label>
              <input className="input-field" value={state.delivery.phone} onChange={(e) => setState((p) => ({ ...p, delivery: { ...p.delivery, phone: e.target.value } }))} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Country</label>
              <input className="input-field" value={state.delivery.country} onChange={(e) => setState((p) => ({ ...p, delivery: { ...p.delivery, country: e.target.value } }))} />
            </div>
            <div className="input-group">
              <label className="input-label">City</label>
              <input className="input-field" value={state.delivery.city} onChange={(e) => setState((p) => ({ ...p, delivery: { ...p.delivery, city: e.target.value } }))} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Street / area</label>
            <input className="input-field" value={state.delivery.street} onChange={(e) => setState((p) => ({ ...p, delivery: { ...p.delivery, street: e.target.value } }))} />
          </div>
          <div className="input-group">
            <label className="input-label">Notes</label>
            <textarea className="input-field" rows="3" value={state.delivery.notes} onChange={(e) => setState((p) => ({ ...p, delivery: { ...p.delivery, notes: e.target.value } }))} />
          </div>
          <div className="text-dim" style={{ fontSize: '0.85rem' }}>Saved automatically on this device.</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAddress;
