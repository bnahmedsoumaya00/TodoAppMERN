import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name
      });
      
      console.log('Registration response:', response);
      
      // Show success message
      toast.success('Registration successful! Please login.', {
        duration: 4000,
      });
      
      // Small delay before redirect
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      console.error('Full registration error:', err);
      
      // Better error handling
      let errorMessage = 'Registration failed';
      
      if (err.error) {
        errorMessage = err.error;
      } else if (err.details && Array.isArray(err.details)) {
        errorMessage = err.details.join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    paddingRight: '45px',
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

  const eyeButtonStyle = {
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
          maxWidth: '450px',
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
            Create Account
          </h1>
          <p style={{ color: '#8ea8c3' }}>
            Join us to manage your tasks
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
          {/* Username */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              <User size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              style={{...inputStyle, paddingRight: '16px'}}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              <Mail size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{...inputStyle, paddingRight: '16px'}}
            />
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              <User size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Full Name (Optional)
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={{...inputStyle, paddingRight: '16px'}}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              <Lock size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeButtonStyle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Min 8 characters, uppercase, lowercase, and number
            </p>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              <Lock size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={eyeButtonStyle}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
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
              'Creating account...'
            ) : (
              <>
                <UserPlus size={20} />
                Register
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
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#cbf7ed', 
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;