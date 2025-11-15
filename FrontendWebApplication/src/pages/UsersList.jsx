import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/apiClient';

export default function UsersList() {
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
    if (value === '' || value === null || typeof value === 'undefined') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // Reset to page 1 for any non-page change
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErr(null);
    api.get('/users', { params: { page, pageSize, sort, filter } })
      .then((res) => {
        if (!ignore) setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch((e) => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, [page, pageSize, sort, filter, searchParams]);

  return (
    <section aria-labelledby="users-heading">
      <h2 id="users-heading">Users</h2>

      <div className="filters" role="region" aria-label="Filters">
        <label>
          Search:
          <input
            value={filter}
            onChange={(e) => updateParam('filter', e.target.value)}
            aria-label="Filter users"
          />
        </label>
        <label>
          Sort:
          <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} aria-label="Sort users">
            <option value="">None</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="status">Status</option>
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
          <table className="table" aria-label="Users table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Roles</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{Array.isArray(u.roles) ? u.roles.join(', ') : ''}</td>
                  <td>{u.status || ''}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="5">No users found.</td></tr>
              )}
            </tbody>
          </table>

          <div className="pagination" role="navigation" aria-label="Pagination">
            <button className="btn btn-secondary" onClick={() => updateParam('page', String(Math.max(1, page - 1)))} disabled={page <= 1} aria-label="Previous page">Previous</button>
            <span aria-live="polite">Page {page}</span>
            <button className="btn btn-secondary" onClick={() => updateParam('page', String(page + 1))} aria-label="Next page">Next</button>
          </div>
        </div>
      )}
    </section>
  );
}
