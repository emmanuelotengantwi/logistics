import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

const CustomerShipments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appliedFrom, setAppliedFrom] = useState('');
  const [appliedTo, setAppliedTo] = useState('');

  const [search, setSearch] = useState(() => (searchParams.get('q') || '').trim());
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const staticGoods = useMemo(
    () => ([
      {
        id: 'static-4',
        item: 'Electric Gloves, Bluetooth',
        pictureUrl: 'https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=120&q=60',
        tracking: 'YT7594480935810',
        ctn: 1,
        cbm: 0.02,
        weight: 2,
        receiveDate: '2026-01-03',
      },
      {
        id: 'static-3',
        item: 'Package',
        pictureUrl: 'https://images.unsplash.com/photo-1524638067-feba7e8c2aa4?auto=format&fit=crop&w=120&q=60',
        tracking: 'JT3148269849516',
        ctn: 1,
        cbm: 0.02,
        weight: 1.5,
        receiveDate: '2025-12-31',
      },
      {
        id: 'static-2',
        item: 'Bluetooth Headphones',
        pictureUrl: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=120&q=60',
        tracking: '78970184169226',
        ctn: 1,
        cbm: 0.02,
        weight: 2,
        receiveDate: '2025-12-30',
      },
      {
        id: 'static-1',
        item: 'N/A',
        pictureUrl: 'https://images.unsplash.com/photo-1524638067-feba7e8c2aa4?auto=format&fit=crop&w=120&q=60',
        tracking: '773397554606910',
        ctn: 1,
        cbm: 0.04,
        weight: 3,
        receiveDate: '2025-12-29',
      },
    ]),
    [],
  );

  const fetchShipments = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get('/shipments');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load shipments');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const goodsRows = useMemo(() => {
    const fromApi = Array.isArray(items) && items.length > 0;
    if (!fromApi) return staticGoods;

    return items
      .map((s) => {
        const firstItem = Array.isArray(s.items) && s.items.length > 0 ? s.items[0] : null;
        const itemName = firstItem?.description || s.type || 'N/A';
        const ctn = Array.isArray(s.items) && s.items.length > 0 ? s.items.length : 1;
        const cbm = Number(s.totalCBM ?? firstItem?.cbm ?? 0.02);
        const weight = Number(s.totalWeight ?? firstItem?.weight ?? 2);
        const receiveDate = s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : '';

        return {
          id: s._id,
          item: itemName,
          pictureUrl: '',
          tracking: s.trackingID,
          ctn,
          cbm: Number.isFinite(cbm) ? cbm : 0,
          weight: Number.isFinite(weight) ? weight : 0,
          receiveDate,
        };
      })
      .sort((a, b) => (b.receiveDate || '').localeCompare(a.receiveDate || ''));
  }, [items, staticGoods]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const from = appliedFrom ? new Date(appliedFrom) : null;
    const to = appliedTo ? new Date(appliedTo) : null;
    const toEnd = to ? new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1) : null;

    return goodsRows.filter((r) => {
      if (from || toEnd) {
        const d = r.receiveDate ? new Date(r.receiveDate) : null;
        if (!d || Number.isNaN(d.getTime())) return false;
        if (from && d < from) return false;
        if (toEnd && d > toEnd) return false;
      }

      if (!q) return true;
      const blob = [r.item, r.tracking].filter(Boolean).join(' ').toLowerCase();
      return blob.includes(q);
    });
  }, [goodsRows, search, appliedFrom, appliedTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageClamped = Math.min(Math.max(page, 1), totalPages);
  const paged = useMemo(() => {
    const start = (pageClamped - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageClamped, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, appliedFrom, appliedTo, search]);

  const handleLoad = async () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    await fetchShipments();
  };

  return (
    <div className="animate-slide-up">
      <h2 className="heading-2" style={{ marginBottom: '1rem' }}>View all shipment received</h2>

      {error && <div className="badge badge-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">From date</label>
            <input className="input-field" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">To date</label>
            <input className="input-field" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Load data</label>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleLoad}
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', background: '#22c55e' }}
            >
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-header" style={{ gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="text-dim">Show entries</div>
              <select
                className="input-field"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                style={{ padding: '0.45rem 0.65rem' }}
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="text-dim">
              Showing {filtered.length === 0 ? 0 : ((pageClamped - 1) * pageSize + 1)} to {Math.min(pageClamped * pageSize, filtered.length)} of {filtered.length} entries
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="text-dim">Search:</div>
            <input
              className="input-field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.55rem 0.75rem', width: 240 }}
              placeholder=""
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table data-table-green">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Picture</th>
                <th>Tracking #</th>
                <th>CTN</th>
                <th>CBM</th>
                <th>Weight</th>
                <th>Receive date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Loading...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan="8" style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No records found.</td></tr>
              ) : (
                paged.map((r, idx) => (
                  <tr key={r.id}>
                    <td>{(pageClamped - 1) * pageSize + idx + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--dark-blue)' }}>{r.item}</td>
                    <td>
                      {r.pictureUrl ? (
                        <img
                          src={r.pictureUrl}
                          alt=""
                          style={{ width: 34, height: 24, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div style={{ width: 34, height: 24, borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)', background: 'linear-gradient(45deg, #e2e8f0, #cbd5e1)' }} />
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.tracking}</td>
                    <td>{r.ctn}</td>
                    <td>{Number(r.cbm || 0).toFixed(2)}</td>
                    <td>{Number(r.weight || 0)}</td>
                    <td>{r.receiveDate || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem' }}>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageClamped === 1}
            style={{ padding: '0.45rem 0.75rem' }}
          >
            Previous
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="badge badge-neutral" style={{ borderRadius: 12, padding: '0.35rem 0.6rem' }}>
              {pageClamped}
            </div>
            <div className="text-dim">/ {totalPages}</div>
          </div>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageClamped === totalPages}
            style={{ padding: '0.45rem 0.75rem' }}
          >
            Next
          </button>
        </div>

        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <Link to="/dashboard/track" className="text-dim" style={{ textDecoration: 'none' }}>
            Track a shipment →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerShipments;

