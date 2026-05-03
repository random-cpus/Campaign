import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle, Mail, Lock, LogIn } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      // Appwrite error messages handle karo
      const msg: string = err?.message ?? '';
      if (msg.includes('Invalid credentials')) {
        setError('Email ya password galat hai. Dobara check karein.');
      } else if (msg.includes('Too many')) {
        setError('Bahut zyada attempts. Kuch der baad try karein.');
      } else {
        setError('Login fail hua. Network ya server problem ho sakti hai.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', padding: '1rem',
            background: 'rgba(79, 70, 229, 0.12)', borderRadius: '20px',
            marginBottom: '1.5rem', border: '1px solid rgba(79, 70, 229, 0.25)'
          }}>
            <Shield size={40} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Resilience Media — Campaign Manager
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="login-email">
              <Mail size={14} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="input-group" style={{ marginTop: '1.25rem' }}>
            <label htmlFor="login-password">
              <Lock size={14} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '2rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            disabled={loading}
          >
            {loading
              ? <div className="loader" style={{ width: '20px', height: '20px' }} />
              : <><LogIn size={18} /> Sign In</>
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Secured by Appwrite Authentication
        </p>
      </div>
    </div>
  );
};
