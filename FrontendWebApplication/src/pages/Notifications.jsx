import React, { useState } from 'react';
import api from '../services/apiClient';

export default function Notifications() {
  const [form, setForm] = useState({
    type: 'email',
    recipient: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [result, setResult] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setResult(null);

    if (!form.type || !form.recipient || !form.message) {
      setErr('Type, Recipient, and Message are required.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        type: form.type,
        recipient: form.recipient,
        message: form.message,
        status: 'REQUESTED'
      };
      const res = await api.post('/notifications', payload);
      setResult(res.data);
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="notifications-heading">
      <h2 id="notifications-heading">Notifications</h2>
      <form onSubmit={onSubmit} aria-label="Send notification">
        <div className="form-field">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={form.type} onChange={onChange} aria-required="true">
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="recipient">Recipient</label>
          <input id="recipient" name="recipient" value={form.recipient} onChange={onChange} aria-required="true" />
        </div>
        <div className="form-field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" value={form.message} onChange={onChange} aria-required="true" rows="4" />
        </div>
        {err && <div role="alert" style={{ color: 'crimson' }}>{err}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
      </form>

      {result && (
        <div aria-live="polite" style={{ marginTop: '1rem' }}>
          <pre aria-label="Notification result" style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}
