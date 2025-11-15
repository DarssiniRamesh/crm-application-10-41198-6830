import React, { useState } from 'react';
import api from '../services/apiClient';

export default function ComplaintCreate() {
  const [form, setForm] = useState({
    type: '',
    severity: '',
    description: '',
    requestorId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!form.type || !form.description || !form.requestorId) {
      setErr('Type, Description, and Requestor ID are required.');
      return;
    }

    const payload = {
      type: form.type,
      severity: form.severity || undefined,
      description: form.description,
      requestor: { id: form.requestorId },
      status: 'NEW'
    };

    try {
      setSubmitting(true);
      const res = await api.post('/complaints', payload);
      setMsg(`Complaint created: ${res?.data?.id || 'success'}`);
      setForm({
        type: '',
        severity: '',
        description: '',
        requestorId: ''
      });
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || 'Failed to create complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="complaint-create-heading">
      <h2 id="complaint-create-heading">Create Complaint</h2>
      <form onSubmit={onSubmit} aria-label="Create complaint form">
        <div className="form-field">
          <label htmlFor="type">Type</label>
          <input id="type" name="type" value={form.type} onChange={onChange} aria-required="true" />
        </div>
        <div className="form-field">
          <label htmlFor="severity">Severity</label>
          <select id="severity" name="severity" value={form.severity} onChange={onChange}>
            <option value="">Select...</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={onChange} aria-required="true" rows="4" />
        </div>
        <div className="form-field">
          <label htmlFor="requestorId">Requestor ID</label>
          <input id="requestorId" name="requestorId" value={form.requestorId} onChange={onChange} aria-required="true" />
        </div>

        {err && <div role="alert" style={{ color: 'crimson' }}>{err}</div>}
        {msg && <div role="status" style={{ color: 'green' }}>{msg}</div>}

        <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Complaint'}</button>
      </form>
    </section>
  );
}
