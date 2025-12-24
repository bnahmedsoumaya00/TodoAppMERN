import { useState, useEffect } from 'react';
import { useTodos } from '../../context/TodoContext';
import TodoItem from './TodoItem';
import { Search, SlidersHorizontal, GripVertical } from 'lucide-react';
import { TodoItemSkeleton } from '../UI/Skeleton';
import EmptyState from '../UI/EmptyState';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';

// Add shimmer keyframes
const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('shimmer-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'shimmer-styles';
  styleSheet.textContent = shimmerStyles;
  document.head.appendChild(styleSheet);
}

// Sortable Todo Item Wrapper
const SortableTodoItem = ({ todo, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative'
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ position: 'relative' }}>
        {/* Drag Handle */}
        <div
          {... attributes}
          {...listeners}
          style={{
            position: 'absolute',
            left: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: isDragging ? 'grabbing' : 'grab',
            color: 'var(--text-muted)',
            padding: '10px',
            opacity: 0,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10,
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid transparent',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.borderColor = 'var(--border-secondary)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
          className="drag-handle"
        >
          <GripVertical size={16} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            delay: index * 0.02, 
            duration: 0.4,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          style={{
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            const handle = e.currentTarget.parentElement.querySelector('.drag-handle');
            if (handle) {
              handle.style.opacity = '0.8';
              handle.style.borderColor = 'var(--border-secondary)';
              handle.style.color = 'var(--text-secondary)';
            }
            e.currentTarget.style.transform = 'scale(1.01)';
          }}
          onMouseLeave={(e) => {
            const handle = e.currentTarget.parentElement.querySelector('.drag-handle');
            if (handle) {
              handle.style.opacity = '0';
              handle.style.borderColor = 'transparent';
              handle.style.color = 'var(--text-muted)';
            }
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <TodoItem todo={todo} />
        </motion.div>
      </div>
    </div>
  );
};

const DraggableTodoList = () => {
  const { todos, loading, fetchTodos, sortBy, setSortBy } = useTodos();
  const [localTodos, setLocalTodos] = useState(todos);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint:  {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active. id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
      filterOptions. search = value;
    }
    
    fetchTodos(filterOptions);
  };

  // Loading state
  if (loading && localTodos.length === 0) {
    return (
      <div>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            width: '100%',
            height: '48px',
            background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-hover) 50%, var(--bg-tertiary) 75%)',
            backgroundSize: '200% 100%',
            borderRadius: 'var(--radius-md)',
            animation: 'shimmer 2s infinite'
          }} />
        </div>
        {[1, 2, 3]. map((i) => (
          <TodoItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (! loading && localTodos.length === 0 && !searchTerm && activeFilter === 'all') {
    return <EmptyState type="todos" />;
  }

  // Empty search results
  if (!loading && localTodos.length === 0 && (searchTerm || activeFilter !== 'all')) {
    return (
      <div>
        {/* Search Bar */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom:  '1rem'
        }}>
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 2.875rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--border-accent)';
                e.target.style.background = 'var(--bg-secondary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-primary)';
                e.target.style.background = 'var(--bg-primary)';
                e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                e.target.style.transform = 'translateY(0)';
              }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {['all', 'active', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                style={{
                  padding: '0.625rem 1rem',
                  background: activeFilter === filter ? 'var(--bg-accent)' : 'var(--bg-tertiary)',
                  border: `1px solid ${activeFilter === filter ? 'var(--border-accent)' : 'var(--border-primary)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: activeFilter === filter ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: activeFilter === filter ? '0 2px 8px rgba(59, 130, 246, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== filter) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== filter) {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

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
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '0.875rem',
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
              e.target.style.background = 'var(--bg-secondary)';
              e.target.style.borderColor = 'var(--border-accent)';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'var(--bg-primary)';
              e.target.style.borderColor = 'var(--border-primary)';
              e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.transform = 'translateY(0)';
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ 
          display: 'inline-flex',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '4px',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          {['all', 'active', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              style={{
                padding: '0.5rem 1rem',
                background: activeFilter === filter 
                  ? 'linear-gradient(135deg, var(--bg-accent) 0%, var(--bg-accent-dark, var(--bg-accent)) 100%)' 
                  : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeFilter === filter ? 'white' : 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: activeFilter === filter ? '600' : '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                boxShadow: activeFilter === filter 
                  ? '0 2px 8px rgba(59, 130, 246, 0.4), 0 1px 3px rgba(0, 0, 0, 0.1)' 
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== filter) {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== filter) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Draggable Todo Items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localTodos.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              <div style={{ 
                paddingLeft: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {localTodos.map((todo, index) => (
                  <SortableTodoItem key={todo.id} todo={todo} index={index} />
                ))}
              </div>
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      </motion.div>
    </div>
  );
};

export default DraggableTodoList;