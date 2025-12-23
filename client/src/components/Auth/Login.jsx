import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      toast.success(`Welcome back!`, { duration: 2000 });
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.error || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#0F0A1E',
    border: '1px solid #2d3748',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#8ea8c3',
    fontSize: '14px',
    fontWeight: '500'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    background: '#cbf7ed',
    color: '#161925',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #161925, #23395b)',
      padding: '2rem'
    }}>
      <div 
        className="animate-fade-in"
        style={{
          maxWidth: '400px',
          width: '100%',
          background: '#23395b',
          border: '1px solid #2d3748',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #406e8e, #cbf7ed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#8ea8c3' }}>
            Login to your account
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              <Mail size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              <Lock size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8ea8c3',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-hover"
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              'Logging in...'
            ) : (
              <>
                <LogIn size={20} />
                Login
              </>
            )}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #2d3748'
        }}>
          <p style={{ color: '#8ea8c3', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#cbf7ed', 
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;