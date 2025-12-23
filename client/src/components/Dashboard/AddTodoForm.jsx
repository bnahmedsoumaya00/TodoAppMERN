import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddTodoForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    due_date: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { createTodo } = useTodos();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createTodo(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'general',
        due_date: ''
      });
      setIsOpen(false);
      
      toast.success('Todo created successfully!', {
        icon: '✅',
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create todo';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: '12px 24px',
    background: '#cbf7ed',
    color: '#161925',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#0F0A1E',
    border: '1px solid #2d3748',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: '#8ea8c3',
    fontSize: '14px',
    fontWeight: '500'
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="button-hover hover-glow"
        style={buttonStyle}
      >
        <Plus size={20} />
        Add New Todo
      </button>
    );
  }

  return (
    <div 
      className="animate-scale-in"
      style={{
        background: '#23395b',
        border: '1px solid #2d3748',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          fontSize: '20px',
          color: '#cbf7ed',
          margin: 0
        }}>
          Create New Todo
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#8ea8c3',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          color: '#ef4444',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter todo title"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description (optional)"
            rows="3"
            style={{
              ...inputStyle,
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={labelStyle}>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., work, personal"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              flex: 1,
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Create Todo'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              padding: '12px 24px',
              background: '#2d3748',
              color: '#8ea8c3',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTodoForm;