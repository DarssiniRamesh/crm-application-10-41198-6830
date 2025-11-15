import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/apiClient';

export default function Case360() {
  const { caseId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErr(null);
    api.get(`/case360/${encodeURIComponent(caseId)}`)
      .then((res) => { if (!ignore) setData(res.data); })
      .catch((e) => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, [caseId]);

  return (
    <section aria-labelledby="case360-heading">
      <h2 id="case360-heading">Case 360</h2>
      {loading && <p>Loading...</p>}
      {err && <div role="alert" style={{ color: 'crimson' }}>{err}</div>}
      {data && (
        <div>
          <p><strong>Case ID:</strong> {data.caseId}</p>
          <p><strong>Summary:</strong> {data.summary}</p>
          <p><strong>Status:</strong> {data.lifecycleStatus}</p>
          <div>
            <strong>Related Solutions:</strong>
            <ul>
              {(data.relatedSolutions || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <strong>Interaction History:</strong>
            <ul>
              {(data.interactionHistory || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
