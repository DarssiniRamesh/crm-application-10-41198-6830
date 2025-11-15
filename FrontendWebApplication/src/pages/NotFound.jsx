import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section aria-labelledby="notfound-heading">
      <h2 id="notfound-heading">Page not found</h2>
      <p>The requested page could not be found.</p>
      <Link className="btn" to="/users">Go to Home</Link>
    </section>
  );
}
