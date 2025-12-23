import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import TodoItem from './TodoItem';
import { Search, Filter } from 'lucide-react';

const TodoList = () => {
  const { todos, loading, fetchTodos } = useTodos();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    const filterOptions = {};
    
    if (filter === 'active') {
      filterOptions.status = 'active';
    } else if (filter === 'completed') {
      filterOptions.status = 'completed';
    }
    
    if (searchTerm) {
      filterOptions.search = searchTerm;
    }
    
    fetchTodos(filterOptions);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const filterOptions = {};
    
    if (activeFilter !== 'all') {
      filterOptions.status = activeFilter;
    }
    
    if (value) {
      filterOptions.search = value;
    }
    
    fetchTodos(filterOptions);
  };

  const filterButtonStyle = (isActive) => ({
    padding: '8px 16px',
    background: isActive ? '#cbf7ed' : '#2d3748',
    color: isActive ? '#161925' : '#8ea8c3',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  if (loading && todos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#8ea8c3'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #2d3748',
          borderTop: '3px solid #cbf7ed',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Loading todos...
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div 
        className="animate-slide-in-right"
        style={{
          background: '#23395b',
          border: '1px solid #2d3748',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <Search 
            size={20} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8ea8c3'
            }}
          />
          <input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              background: '#0F0A1E',
              border: '1px solid #2d3748',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={16} style={{ color: '#8ea8c3' }} />
          <button
            onClick={() => handleFilterChange('all')}
            style={filterButtonStyle(activeFilter === 'all')}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('active')}
            style={filterButtonStyle(activeFilter === 'active')}
          >
            Active
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            style={filterButtonStyle(activeFilter === 'completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Todo Items */}
      {todos.length === 0 ? (
        <div style={{
          background: '#23395b',
          border: '1px solid #2d3748',
          borderRadius: '12px',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#cbf7ed' }}>
            No todos yet
          </h3>
          <p style={{ color: '#8ea8c3', fontSize: '14px' }}>
            Create your first todo to get started!
          </p>
        </div>
      ) : (
        <div>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;