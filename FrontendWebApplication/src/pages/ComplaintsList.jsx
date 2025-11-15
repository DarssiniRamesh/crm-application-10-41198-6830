import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/apiClient';

export default function ComplaintsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 20);
  const sort = searchParams.get('sort') || '';
  const filter = searchParams.get('filter') || '';

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key); else next.set(key, value);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErr(null);
    api.get('/complaints', { params: { page, pageSize, sort, filter } })
      .then((res) => { if (!ignore) setItems(Array.isArray(res.data) ? res.data : []); })
      .catch((e) => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, [page, pageSize, sort, filter, searchParams]);

  return (
    <section aria-labelledby="complaints-heading">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 id="complaints-heading">Complaints</h2>
        <Link to="/complaints/new" className="btn">Create Complaint</Link>
      </div>

      <div className="filters" role="region" aria-label="Filters">
        <label>
          Search:
          <input value={filter} onChange={(e) => updateParam('filter', e.target.value)} aria-label="Filter complaints" />
        </label>
        <label>
          Sort:
          <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} aria-label="Sort complaints">
            <option value="">None</option>
            <option value="createdAt">Created At</option>
            <option value="status">Status</option>
            <option value="severity">Severity</option>
          </select>
        </label>
        <label>
          Page size:
          <select value={String(pageSize)} onChange={(e) => updateParam('pageSize', e.target.value)} aria-label="Page size">
            {[10, 20, 50].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {err && <div role="alert" style={{ color: 'crimson' }}>{err}</div>}
      {loading ? <p>Loading...</p> : (
        <div role="region" aria-live="polite">
          <table className="table" aria-label="Complaints table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Requestor</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.type}</td>
                  <td>{t.severity || ''}</td>
                  <td>{t.description}</td>
                  <td>{t.status}</td>
                  <td>{t.requestor?.username || t.requestor?.email || ''}</td>
                  <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}</td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="7">No complaints found.</td></tr>}
            </tbody>
          </table>

          <div className="pagination" role="navigation" aria-label="Pagination">
            <button className="btn btn-secondary" onClick={() => updateParam('page', String(Math.max(1, page - 1)))} disabled={page <= 1}>Previous</button>
            <span>Page {page}</span>
            <button className="btn btn-secondary" onClick={() => updateParam('page', String(page + 1))}>Next</button>
          </div>
        </div>
      )}
    </section>
  );
}
