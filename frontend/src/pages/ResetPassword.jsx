import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 4) {
      setError('Password is too short');
      return;
    }
    if (newPassword !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { email: email.trim(), newPassword });
      setSuccess(data?.message || 'Password reset successful');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 0 }}></div>

      <div className="animate-slide-up" style={{ width: '100%', maxWidth: '450px', background: '#fff', borderRadius: '12px', padding: '3rem 2.5rem', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/"><img src="/amooksco.jpeg" alt="Logo" style={{ height: '70px', borderRadius: '50%', marginBottom: '1rem' }} /></Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-blue)' }}>Reset Password</h2>
        </div>

        {error && <div className="badge badge-error" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="badge badge-success" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--dark-blue)', fontWeight: 600 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={{ width: '100%', paddingRight: '2.5rem' }} required />
              <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: 'var(--dark-blue)', fontWeight: 600 }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" style={{ width: '100%', paddingRight: '2.5rem' }} required />
              <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label" style={{ color: 'var(--dark-blue)', fontWeight: 600 }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" style={{ width: '100%', paddingRight: '2.5rem' }} required />
              <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px' }} disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>

          <div style={{ textAlign: 'left', marginTop: '1.5rem', fontSize: '0.95rem' }}>
            <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '700' }}>Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
