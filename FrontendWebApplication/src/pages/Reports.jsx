import React, { useState } from 'react';
import api from '../services/apiClient';

export default function Reports() {
  const [type, setType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [format, setFormat] = useState('json');
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setResult(null);

    if (!type) {
      setErr('Report type is required.');
      return;
    }

    try {
      setLoading(true);
      if (format === 'json') {
        const res = await api.get('/reports', { params: { type, dateRange } });
        setResult(res.data);
      } else {
        const accept = format === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const res = await api.get('/reports', {
          params: { type, dateRange },
          responseType: 'blob',
          headers: { Accept: accept }
        });
        const blob = new Blob([res.data], { type: accept });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        a.href = url;
        a.download = `report_${type}_${ts}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || 'Report generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="reports-heading">
      <h2 id="reports-heading">Reports</h2>
      <form onSubmit={onSubmit} aria-label="Generate report">
        <div className="form-field">
          <label htmlFor="type">Report Type</label>
          <input id="type" value={type} onChange={(e) => setType(e.target.value)} aria-required="true" />
        </div>
        <div className="form-field">
          <label htmlFor="dateRange">Date Range</label>
          <input id="dateRange" placeholder="e.g., 2024-01-01..2024-12-31" value={dateRange} onChange={(e) => setDateRange(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="format">Format</label>
          <select id="format" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="json">JSON</option>
            <option value="pdf">PDF</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
        {err && <div role="alert" style={{ color: 'crimson' }}>{err}</div>}
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
      </form>

      {result && (
        <div aria-live="polite" style={{ marginTop: '1rem' }}>
          <pre aria-label="Report JSON" style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}
