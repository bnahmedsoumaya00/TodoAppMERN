import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { useCategories } from '../../context/CategoryContext';
import { 
  Plus, X, Calendar, Flag, FolderOpen, FileText, 
  Repeat, Upload, Paperclip, ChevronDown, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';
import Input from '../UI/Input';
import DateTimePicker from '../UI/DateTimePicker';
import { motion, AnimatePresence } from 'framer-motion';

const AddTodoForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    due_date: null,
    is_recurring: false,
    recurrence_pattern: 'daily',
    recurrence_interval: 1,
    recurrence_end_date: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const { createTodo } = useTodos();
  const { categories } = useCategories();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createTodo(formData);
      
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'general',
        due_date: null,
        is_recurring: false,
        recurrence_pattern: 'daily',
        recurrence_interval: 1,
        recurrence_end_date: null
      });
      setAttachments([]);
      setIsOpen(false);
      
      toast.success('Task created');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create task';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (! isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-secondary)',
          fontSize:  '0.9375rem',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all var(--transition-base)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style. background = 'var(--bg-tertiary)';
          e.currentTarget.style.borderColor = 'var(--border-accent)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget. style.background = 'var(--bg-secondary)';
          e.currentTarget.style.borderColor = 'var(--border-primary)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        <Plus size={18} strokeWidth={2} />
        New Task
      </button>
    );
  }

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const recurrenceOptions = [
    { value: 'daily', label:  'Daily' },
    { value: 'weekly', label:  'Weekly' },
    { value: 'monthly', label:  'Monthly' },
    { value: 'yearly', label:  'Yearly' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height:  'auto' }}
        exit={{ opacity: 0, height:  0 }}
        transition={{ duration: 0.2 }}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent:  'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ 
            fontSize: '1rem',
            color: 'var(--text-primary)',
            margin: 0,
            fontWeight: '600'
          }}>
            Create Task
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '32px',
              height: '32px',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-base)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget. style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget. style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom:  '1rem' }}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task title"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'all var(--transition-base)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-primary)'}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'all var(--transition-base)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-primary)'}
            />
          </div>

          {/* Priority */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem'
            }}>
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: option. value })}
                  style={{
                    padding: '0.625rem',
                    background: formData.priority === option.value ?  'var(--bg-hover)' : 'var(--bg-tertiary)',
                    border: `1px solid ${formData.priority === option.value ? 'var(--border-accent)' : 'var(--border-primary)'}`,
                    borderRadius: 'var(--radius-sm)',
                    color: formData.priority === option.value ?  'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: '500',
                    transition: 'all var(--transition-base)'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Due Date */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns:  window.innerWidth < 640 ? '1fr' : '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            {/* Category */}
            <div style={{ position: 'relative' }}>
              <select
                name="category"
                value={formData. category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 2. 5rem 0.75rem 1rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  transition: 'all var(--transition-base)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--border-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-primary)'}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name. toLowerCase()}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={16} 
                style={{
                  position:  'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none'
                }}
              />
            </div>

            {/* Due Date */}
            <DateTimePicker
              value={formData.due_date}
              onChange={(date) => setFormData({ ...formData, due_date: date })}
              showTime={true}
            />
          </div>

          {/* Recurring */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-base)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
            >
              <input
                type="checkbox"
                checked={formData.is_recurring}
                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  accentColor: 'var(--color-accent)'
                }}
              />
              <Repeat size={16} color="var(--text-muted)" />
              <span style={{ 
                flex: 1, 
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Recurring task
              </span>
            </label>

            <AnimatePresence>
              {formData.is_recurring && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: '0.75rem',
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns:  '2fr 1fr',
                    gap: '0.75rem'
                  }}>
                    <select
                      name="recurrence_pattern"
                      value={formData.recurrence_pattern}
                      onChange={handleChange}
                      style={{
                        padding: '0.625rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: '0.8125rem',
                        outline:  'none'
                      }}
                    >
                      {recurrenceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      name="recurrence_interval"
                      value={formData.recurrence_interval}
                      onChange={handleChange}
                      min="1"
                      max="30"
                      style={{
                        padding: '0.625rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius:  'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: '0.8125rem',
                        outline:  'none'
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Attachments */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: 'var(--bg-tertiary)',
              border: '1px dashed var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all var(--transition-base)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-secondary)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            >
              <Upload size={16} />
              Attach files
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </label>

            {attachments.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display:  'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <Paperclip size={14} color="var(--text-muted)" />
                    <span style={{ 
                      flex: 1, 
                      fontSize: '0.8125rem',
                      color:  'var(--text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      style={{
                        padding: '0.25rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '0.75rem',
              background: 'var(--color-error)15',
              border: '1px solid var(--color-error)50',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize:  '0.875rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem'
          }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding:  '0.75rem',
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--bg-primary)',
                fontSize: '0.875rem',
                fontWeight:  '600',
                cursor: loading ? 'not-allowed' :  'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                if (! loading) e.currentTarget.style.background = 'var(--color-accent-light)';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = 'var(--color-accent)';
              }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                e. currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style. color = 'var(--text-muted)';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTodoForm;