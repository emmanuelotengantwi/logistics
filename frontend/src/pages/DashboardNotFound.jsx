import React from 'react';
import { Link } from 'react-router-dom';

const DashboardNotFound = () => {
  return (
    <div className="glass-card">
      <h2 className="heading-2" style={{ marginBottom: '0.75rem' }}>Page not found</h2>
      <div className="text-dim" style={{ marginBottom: '1.5rem' }}>
        The page you’re looking for doesn’t exist.
      </div>
      <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
    </div>
  );
};

export default DashboardNotFound;

