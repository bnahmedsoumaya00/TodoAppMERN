import { useAuth } from '../../context/AuthContext';
import { TodoProvider, useTodos } from '../../context/TodoContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AddTodoForm from './AddTodoForm';
import TodoList from './TodoList';

const DashboardContent = () => {
  const { user, logout } = useAuth();
  const { stats } = useTodos();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!', { duration: 2000 });
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#161925', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Welcome back, {user?.full_name || user?.username}! 👋
            </h1>
            <p style={{ color: '#8ea8c3' }}>
              Let's make today productive
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: '#2d3748',
              color: '#8ea8c3',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
         <div 
            className="animate-stagger-1 hover-lift"
            style={{
            background: '#23395b',
            border: '1px solid #2d3748',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stats.total}</h3>
                <p style={{ color: '#8ea8c3' }}>Total Tasks</p>
              </div>
              <div style={{ 
                padding: '12px', 
                background: '#406e8e',
                borderRadius: '10px'
              }}>
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          <div 
            className="animate-stagger-2 hover-lift"
            style={{
            background: '#23395b',
            border: '1px solid #2d3748',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#f59e0b' }}>{stats.active}</h3>
                <p style={{ color: '#8ea8c3' }}>Active</p>
              </div>
              <div style={{ 
                padding: '12px', 
                background: '#f59e0b',
                borderRadius: '10px'
              }}>
                <Clock size={24} />
              </div>
            </div>
          </div>

          <div 
            className="animate-stagger-3 hover-lift"
            style={{
            background: '#23395b',
            border: '1px solid #2d3748',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#10b981' }}>{stats.completed}</h3>
                <p style={{ color: '#8ea8c3' }}>Completed</p>
              </div>
              <div style={{ 
                padding: '12px', 
                background: '#10b981',
                borderRadius: '10px'
              }}>
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          <div 
            className="animate-stagger-4 hover-lift"
            style={{
            background: '#23395b',
            border: '1px solid #2d3748',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ef4444' }}>{stats.overdue}</h3>
                <p style={{ color: '#8ea8c3' }}>Overdue</p>
              </div>
              <div style={{ 
                padding: '12px', 
                background: '#ef4444',
                borderRadius: '10px'
              }}>
                <AlertCircle size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Add Todo Form */}
        <AddTodoForm />

        {/* Todo List */}
        <TodoList />
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <TodoProvider>
      <DashboardContent />
    </TodoProvider>
  );
};

export default Dashboard;