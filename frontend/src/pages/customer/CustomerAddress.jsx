import React, { useEffect, useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { readJson, userScopedKey, writeJson } from '../../utils/storage';

const normalizeState = (raw) => {
  return {
    destinationCountry: raw?.destinationCountry || 'Ghana',
    shippingMode: raw?.shippingMode || 'Sea',
  };
};

const CustomerAddress = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const storageKey = useMemo(() => userScopedKey('customerAddress', userInfo), [userInfo]);
  const [state, setState] = useState(() => normalizeState(readJson(storageKey, null)));
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    writeJson(storageKey, state);
  }, [storageKey, state]);

  const clientName = String(userInfo?.name || 'Client Name').trim().replace(/\s+/g, ' ');
  const shippingMark = `AMOOKSCO-${clientName}`;

  const destinationCountries = ['Ghana', 'Nigeria', 'Liberia', 'Sierra Leone'];
  const shippingModes = ['Sea', 'Air'];

	  const addressCards = useMemo(() => {
	    const seaPhones = '17612045049 / 13250714180';
	    const seaWarehouseLine = '佛山市南海区里水镇洲村深坑工业区自编23号 里德仓';
	    const seaReceiver = `收件人 AMOOKSCO - ${clientName}`;

	    const commonLines = [`唛头: ${shippingMark}`, `(电话): ${seaPhones}`];

	    if (state.shippingMode === 'Air') {
	      const airPhone = '13236479501';
	      const airMark = `唛头 AMOOKSCO-${clientName}`;
	      const airTel = `(电话): ${airPhone}`;

	      return [
	        {
	          key: 'air-normal',
	          title: 'Aircargo normal goods address',
	          rateLabel: 'Air address rate',
	          rateValue: '$0.00',
	          lines: [
	            `广东省广州市越秀区广园西路101号通通商贸城AB110档 麦克专线 Acc002 (${clientName}) ${airPhone}`,
	            airMark,
	            airTel,
	          ],
	        },
	        {
	          key: 'air-battery',
	          title: 'Aircargo battery goods address',
	          rateLabel: 'Air address rate',
	          rateValue: '$0.00',
	          lines: [
	            `广东省广州市越秀区广园西路101号通通商贸城AB103档 (${clientName}):${airPhone}`,
	            airMark,
	            airTel,
	          ],
	        },
	      ];
	    }

	    return [
	      {
	        key: 'sea',
	        title: 'Sea Address',
	        rateLabel: 'Sea address rate',
	        rateValue: '$239',
	        lines: [
	          `AMOOKSCO - ${clientName} ${seaPhones}`,
	          seaWarehouseLine,
	          seaReceiver,
	          '',
	          ...commonLines,
	        ],
	      },
	    ];
	  }, [clientName, shippingMark, state.shippingMode]);

  const noteText = useMemo(() => {
	    const minCbm = '0.02';
	    const rates =
	      state.shippingMode === 'Sea'
	        ? ['Sea Address Rate: $239']
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
            If you are shipping a package to us without using the exact format shown on your address, your package could experience{' '}
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
      </div>
    </div>
  );
};

export default CustomerAddress;
