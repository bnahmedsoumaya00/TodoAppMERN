import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '3rem'
        }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '0.5rem' }}>
              Welcome back, {user?.full_name || user?.username}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Let's make today productive
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-lg)',
          marginBottom: '3rem'
        }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem' }}>0</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Total Tasks</p>
              </div>
              <div style={{ 
                padding: 'var(--space-md)', 
                background: 'var(--color-primary)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem', color: 'var(--color-warning)' }}>0</h3>
                <p style={{ color: 'var(--text-secondary)' }}>In Progress</p>
              </div>
              <div style={{ 
                padding: 'var(--space-md)', 
                background: 'var(--color-warning)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <Clock size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '0.5rem', color: 'var(--color-success)' }}>0</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Completed</p>
              </div>
              <div style={{ 
                padding: 'var(--space-md)', 
                background: 'var(--color-success)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <h2 style={{ 
            fontSize: 'var(--font-size-2xl)', 
            marginBottom: 'var(--space-md)',
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎉 Authentication Complete!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Your todo list features are coming next...
          </p>
          <div style={{ 
            display: 'inline-block',
            padding: 'var(--space-lg)',
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <p style={{ fontWeight: '600', marginBottom: 'var(--space-sm)' }}>
              ✅ Database Connected
            </p>
            <p style={{ fontWeight: '600', marginBottom: 'var(--space-sm)' }}>
              ✅ Backend API Working
            </p>
            <p style={{ fontWeight: '600', marginBottom: 'var(--space-sm)' }}>
              ✅ User Registration
            </p>
            <p style={{ fontWeight: '600' }}>
              ✅ User Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;