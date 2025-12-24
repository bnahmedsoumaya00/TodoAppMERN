import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import TodoItem from './TodoItem';
import { Search, Filter } from 'lucide-react';
import { TodoItemSkeleton } from '../UI/Skeleton';
import EmptyState from '../UI/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

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
    padding: '0.625rem 1rem',
    background: isActive 
      ? 'linear-gradient(135deg, var(--color-accent) 0%, var(--bg-accent-dark, var(--color-accent)) 100%)'
      : 'var(--bg-tertiary)',
    color: isActive ? 'white' : 'var(--text-secondary)',
    border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border-primary)'}`,
    borderRadius: 'var(--radius-lg)',
    fontSize: '0.875rem',
    fontWeight: isActive ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive 
      ? '0 4px 12px rgba(59, 130, 246, 0.4)' 
      : '0 1px 2px rgba(0, 0, 0, 0.05)'
  });

  // Loading state with skeletons
  if (loading && todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Search skeleton */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{
              width: '100%',
              height: '48px',
              background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-hover) 50%, var(--bg-tertiary) 75%)',
              backgroundSize: '200% 100%',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              animation: 'shimmer 2s infinite'
            }} />
          </div>

          {/* Filter buttons skeleton */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                width: '80px',
                height: '40px',
                background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-hover) 50%, var(--bg-tertiary) 75%)',
                backgroundSize: '200% 100%',
                borderRadius: 'var(--radius-lg)',
                animation: 'shimmer 2s infinite'
              }} />
            ))}
          </div>
        </motion.div>

        {/* Todo items skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
            >
              <TodoItemSkeleton />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Empty state when no todos
  if (!loading && todos.length === 0 && !searchTerm && activeFilter === 'all') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              disabled
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 2.75rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                outline: 'none',
                opacity: 0.6,
                cursor: 'not-allowed'
              }}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <EmptyState 
            type="todos"
            description="Get started by creating your first task. Stay organized and productive!"
          />
        </motion.div>
      </motion.div>
    );
  }

  // Empty search results
  if (!loading && todos.length === 0 && (searchTerm || activeFilter !== 'all')) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Search */}
          <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 2.75rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--border-accent)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-primary)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Filters */}
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <Filter size={18} style={{ color: 'var(--text-muted)' }} />
            {['all', 'active', 'completed'].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange(filter)}
                style={{
                  ...filterButtonStyle(activeFilter === filter),
                  textTransform: 'capitalize'
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== filter) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'var(--border-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== filter) {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                  }
                }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <EmptyState 
            type="search"
            title={activeFilter === 'completed' ? 'No completed tasks' : 'No results found'}
            description={
              activeFilter === 'completed' 
                ? 'Complete some tasks to see them here.'
                : 'Try adjusting your search terms or filters.'
            }
            action={() => {
              setSearchTerm('');
              setActiveFilter('all');
              fetchTodos();
            }}
            actionLabel="Clear Filters"
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search and Filter Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
        style={{
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
          <Search 
            size={18} 
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search your tasks..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '0.875rem 1rem 0.875rem 2.75rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-primary)',
              fontSize: '0.9375rem',
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--border-accent)';
              e.target.style.background = 'var(--bg-secondary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-primary)';
              e.target.style.background = 'var(--bg-primary)';
              e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.transform = 'translateY(0)';
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Filter size={18} style={{ color: 'var(--text-muted)' }} />
          {[
            { key: 'all', label: `All (${todos.length})`, count: todos.length },
            { key: 'active', label: 'Active', count: todos.filter(t => !t.completed).length },
            { key: 'completed', label: 'Completed', count: todos.filter(t => t.completed).length }
          ].map(({ key, label, count }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterChange(key)}
              style={{
                ...filterButtonStyle(activeFilter === key),
                textTransform: 'capitalize',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== key) {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--border-secondary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== key) {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              {key === 'all' ? label : `${label} (${count})`}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Todo Items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            // Show skeletons while loading more
            [1, 2, 3].map((i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <TodoItemSkeleton />
              </motion.div>
            ))
          ) : (
            todos.map((todo, index) => (
              <motion.div 
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                <TodoItem todo={todo} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TodoList;