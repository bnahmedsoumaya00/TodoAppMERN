import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { Edit2, Trash2, Check, X, Calendar, Flag } from 'lucide-react';
import toast from 'react-hot-toast';

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    category: todo.category,
    due_date: todo.due_date || ''
  });

  const { updateTodo, deleteTodo, toggleTodo } = useTodos();

  const handleToggle = async () => {
    try {
      await toggleTodo(todo.id);
      toast.success(
        todo.completed ? 'Marked as active' : 'Marked as completed!',
        { duration: 2000 }
      );
    } catch (err) {
      console.error('Toggle error:', err);
      toast.error('Failed to update todo');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todo.id);
        toast.success('Todo deleted successfully!');
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Failed to delete todo');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTodo(todo.id, editData);
      setIsEditing(false);
      toast.success('Todo updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update todo');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '#ef4444' };
      case 'medium':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '#f59e0b' };
      case 'low':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '#10b981' };
      default:
        return { bg: 'rgba(142, 168, 195, 0.1)', color: '#8ea8c3', border: '#8ea8c3' };
    }
  };

  const priorityStyle = getPriorityColor(todo.priority);

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    background: '#0F0A1E',
    border: '1px solid #2d3748',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none'
  };

  if (isEditing) {
    return (
      <div style={{
        background: '#23395b',
        border: '1px solid #406e8e',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px'
      }}>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            style={{ ...inputStyle, marginBottom: '12px', fontSize: '16px' }}
            required
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            rows="2"
            style={{ ...inputStyle, marginBottom: '12px', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              style={{ ...inputStyle, flex: 1 }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={editData.due_date}
              onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px'
              }}
            >
              <Check size={16} />
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                padding: '8px 16px',
                background: '#2d3748',
                color: '#8ea8c3',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px'
              }}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div 
      className="animate-fade-in hover-lift card-hover"
      style={{
        background: '#23395b',
        border: `1px solid ${todo.completed ? '#10b981' : '#2d3748'}`,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        opacity: todo.completed ? 0.8 : 1
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          style={{
            width: '24px',
            height: '24px',
            minWidth: '24px',
            borderRadius: '6px',
            border: `2px solid ${todo.completed ? '#10b981' : '#2d3748'}`,
            background: todo.completed ? '#10b981' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '2px'
          }}
        >
          {todo.completed && <Check size={16} color="white" />}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '6px',
            color: todo.completed ? '#6b7280' : '#ffffff',
            textDecoration: todo.completed ? 'line-through' : 'none'
          }}>
            {todo.title}
          </h3>

          {todo.description && (
            <p style={{
              fontSize: '14px',
              color: todo.completed ? '#6b7280' : '#8ea8c3',
              marginBottom: '10px',
              lineHeight: '1.5'
            }}>
              {todo.description}
            </p>
          )}

          {/* Meta info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {/* Priority badge */}
            <span style={{
              padding: '4px 10px',
              background: priorityStyle.bg,
              color: priorityStyle.color,
              border: `1px solid ${priorityStyle.border}`,
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Flag size={12} />
              {todo.priority}
            </span>

            {/* Category */}
            {todo.category && (
              <span style={{
                padding: '4px 10px',
                background: 'rgba(64, 110, 142, 0.2)',
                color: '#8ea8c3',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {todo.category}
              </span>
            )}

            {/* Due date */}
            {todo.due_date && (
              <span style={{
                padding: '4px 10px',
                background: 'rgba(203, 247, 237, 0.1)',
                color: '#cbf7ed',
                borderRadius: '12px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Calendar size={12} />
                {new Date(todo.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: '6px',
              background: 'rgba(64, 110, 142, 0.2)',
              border: 'none',
              borderRadius: '6px',
              color: '#8ea8c3',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '6px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: 'none',
              borderRadius: '6px',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;