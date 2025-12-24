import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { Edit2, Trash2, Check, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import SubtaskList from './SubtaskList';
import { motion } from 'framer-motion';

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    category: todo.category,
    due_date: todo.due_date || ''
  });
  const [showSubtasks, setShowSubtasks] = useState(false);

  const { updateTodo, deleteTodo, toggleTodo, fetchTodos } = useTodos();

  const handleToggle = async () => {
    try {
      await toggleTodo(todo.id);
      toast.success(todo.completed ? 'Marked as active' : 'Marked as completed');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    const hasSubtasks = todo.subtask_count && todo.subtask_count > 0;
    const confirmMessage = hasSubtasks 
      ? `Delete "${todo.title}" and its ${todo.subtask_count} subtask(s)?`
      : `Delete "${todo.title}"?`;
      
    if (window.confirm(confirmMessage)) {
      try {
        await deleteTodo(todo.id);
        toast.success('Task deleted');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTodo(todo.id, editData);
      setIsEditing(false);
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':  return 'var(--priority-high)';
      case 'medium': return 'var(--priority-medium)';
      case 'low': return 'var(--priority-low)';
      default: return 'var(--text-muted)';
    }
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
        style={{
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15), 0 3px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <motion.input
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Task title..."
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: '500',
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--border-accent)';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-primary)';
              e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.transform = 'translateY(0)';
            }}
          />

          <motion.textarea
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Add a description (optional)..."
            rows="3"
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-secondary)',
              fontSize: '0.9375rem',
              lineHeight: '1.5',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--border-accent)';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-primary)';
              e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.05)';
              e.target.style.transform = 'translateY(0)';
            }}
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}
          >
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--bg-accent-dark, var(--color-accent)) 100%)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-secondary)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cancel
            </button>
          </motion.div>
        </form>
      </motion.div>
    );
  }

  const hasSubtasks = todo.subtask_count && todo.subtask_count > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
      style={{
        background: todo.completed 
          ? 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)'
          : 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(255, 255, 255, 0.02) 100%)',
        border: `1px solid ${todo.completed ? 'var(--border-primary)' : 'var(--border-primary)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem',
        marginBottom: '1rem',
        opacity: todo.completed ? 0.7 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={{
        borderColor: 'var(--border-secondary)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05)',
        y: -2
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        {/* Checkbox */}
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '24px',
            height: '24px',
            minWidth: '24px',
            marginTop: '2px',
            borderRadius: '6px',
            border: `2px solid ${todo.completed ? 'var(--color-accent)' : 'var(--border-secondary)'}`,
            background: todo.completed 
              ? 'linear-gradient(135deg, var(--color-accent) 0%, var(--bg-accent-dark, var(--color-accent)) 100%)' 
              : 'var(--bg-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: todo.completed 
              ? '0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)' 
              : '0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (!todo.completed) {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.background = 'var(--bg-tertiary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!todo.completed) {
              e.currentTarget.style.borderColor = 'var(--border-secondary)';
              e.currentTarget.style.background = 'var(--bg-primary)';
            }
          }}
        >
          {todo.completed && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Check size={14} color="white" strokeWidth={3} />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <motion.div 
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: todo.completed ? 'line-through' : 'none',
              marginBottom: '0.5rem',
              wordBreak: 'break-word',
              lineHeight: '1.4',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {todo.title}
          </motion.div>

          {/* Description */}
          {todo.description && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.75rem',
                lineHeight: '1.5',
                background: 'var(--bg-tertiary)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)'
              }}
            >
              {todo.description}
            </motion.div>
          )}

          {/* Meta Info */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '0.75rem'
          }}>
            {/* Priority */}
            <motion.span 
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.375rem 0.75rem',
                background: `linear-gradient(135deg, ${getPriorityColor(todo.priority)}20, ${getPriorityColor(todo.priority)}10)`,
                border: `1px solid ${getPriorityColor(todo.priority)}40`,
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.75rem',
                color: getPriorityColor(todo.priority),
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: `0 2px 8px ${getPriorityColor(todo.priority)}20`
              }}
            >
              {todo.priority}
            </motion.span>

            {/* Category */}
            <span style={{
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              textTransform: 'capitalize',
              fontWeight: '500',
              padding: '0.25rem 0.5rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)'
            }}>
              {todo.category}
            </span>

            {/* Due Date */}
            {todo.due_date && (
              <motion.span 
                whileHover={{ scale: 1.05 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  padding: '0.375rem 0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-primary)',
                  fontWeight: '500'
                }}
              >
                <Calendar size={14} />
                {new Date(todo.due_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </motion.span>
            )}

            {/* Subtasks Count */}
            {hasSubtasks && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSubtasks(!showSubtasks)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  background: showSubtasks ? 'var(--bg-accent)' : 'var(--bg-tertiary)',
                  border: `1px solid ${showSubtasks ? 'var(--border-accent)' : 'var(--border-primary)'}`,
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.75rem',
                  color: showSubtasks ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontWeight: '600',
                  boxShadow: showSubtasks ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                <motion.div
                  animate={{ rotate: showSubtasks ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {showSubtasks ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </motion.div>
                {todo.completed_subtasks}/{todo.subtask_count} subtasks
              </motion.button>
            )}
          </div>

          {/* Subtasks */}
          {showSubtasks && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
              style={{ 
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <SubtaskList 
                parentTodoId={todo.id}
                subtasks={todo.subtasks || []}
                onUpdate={fetchTodos}
              />
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-accent)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'var(--border-accent)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-primary)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <Edit2 size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-error)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'var(--color-error)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-primary)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;