import React, { useState } from 'react';

// PUBLIC_INTERFACE
export default function Settings() {
  /** Simple settings page for UI preferences (non-persistent).
   *  This demonstrates consistent form styling and accessible labels.
   */
  const [density, setDensity] = useState('comfortable');
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <section aria-labelledby="settings-heading">
      <h2 id="settings-heading">Settings</h2>
      <form aria-label="User interface settings">
        <div className="form-field">
          <label htmlFor="density">Density</label>
          <select id="density" value={density} onChange={(e) => setDensity(e.target.value)}>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="reducedMotion">
            <input
              id="reducedMotion"
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
            />
            {' '}
            Reduce motion (accessibility)
          </label>
        </div>

        <button type="button" className="btn" onClick={() => alert('Settings saved (demo)')}>Save Settings</button>
      </form>
      <p className="muted" style={{ marginTop: '0.75rem' }}>
        These settings are not persisted and serve as a demonstration of consistent UI elements.
      </p>
    </section>
  );
}
