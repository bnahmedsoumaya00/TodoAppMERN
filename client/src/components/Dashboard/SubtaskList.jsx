import { useState } from 'react';
import { Plus, Check, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SubtaskList = ({ parentTodoId, subtasks:  initialSubtasks, onUpdate }) => {
  const [subtasks, setSubtasks] = useState(initialSubtasks || []);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/todos', {
        title: newSubtaskTitle.trim(),
        parent_id: parentTodoId,
        priority: 'medium',
        category: 'general'
      });

      setSubtasks([...subtasks, response.data.data]);
      setNewSubtaskTitle('');
      setIsAdding(false);
      toast.success('Subtask added! ');
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Add subtask error:', error);
      toast.error('Failed to add subtask');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const response = await api.patch(`/todos/${subtaskId}/toggle`);
      setSubtasks(subtasks.map(st => 
        st.id === subtaskId ? response.data.data : st
      ));
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Toggle subtask error:', error);
      toast.error('Failed to toggle subtask');
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (! window.confirm('Delete this subtask?')) return;

    try {
      await api. delete(`/todos/${subtaskId}`);
      setSubtasks(subtasks.filter(st => st.id !== subtaskId));
      toast.success('Subtask deleted');
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Delete subtask error:', error);
      toast.error('Failed to delete subtask');
    }
  };

  const completedCount = subtasks.filter(st => st.completed).length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div style={{ marginTop: '12px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span style={{ fontWeight: '600' }}>
            Subtasks {totalCount > 0 && `(${completedCount}/${totalCount})`}
          </span>
        </button>

        {! isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            style={{
              padding: '4px 8px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--bg-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Plus size={14} />
            Add
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div style={{
          width: '100%',
          height: '4px',
          background: 'var(--bg-tertiary)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: '100%',
              background: progress === 100 ? 'var(--color-success)' : 'var(--color-accent)',
              borderRadius: '2px'
            }}
          />
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {/* Add Subtask Form */}
            {isAdding && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity:  1, y: 0 }}
                onSubmit={handleAddSubtask}
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '8px',
                  padding: '8px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-accent)'
                }}
              >
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target. value)}
                  placeholder="Subtask title..."
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '4px',
                    color:  'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !newSubtaskTitle.trim()}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--color-accent)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: loading ?  'not-allowed' : 'pointer',
                    opacity: loading || !newSubtaskTitle.trim() ? 0.5 : 1
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewSubtaskTitle('');
                  }}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-primary)',
                    borderRadius:  '4px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </motion.form>
            )}

            {/* Subtasks List */}
            {subtasks.length === 0 && ! isAdding ?  (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '13px'
              }}>
                No subtasks yet. Click "Add" to create one!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {subtasks.map((subtask, index) => (
                  <motion.div
                    key={subtask.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x:  20 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '6px',
                      border: '1px solid var(--border-primary)',
                      opacity: subtask.completed ? 0.6 : 1
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      onClick={() => handleToggleSubtask(subtask.id)}
                      style={{
                        width: '18px',
                        height: '18px',
                        minWidth: '18px',
                        borderRadius: '4px',
                        border: `2px solid ${subtask.completed ? 'var(--color-success)' : 'var(--border-primary)'}`,
                        background: subtask.completed ? 'var(--color-success)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {subtask.completed && <Check size={12} color="#ffffff" />}
                    </div>

                    {/* Title */}
                    <span style={{
                      flex: 1,
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      textDecoration: subtask.completed ?  'line-through' : 'none',
                      wordBreak: 'break-word'
                    }}>
                      {subtask.title}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      style={{
                        padding: '4px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e. currentTarget.style.background = 'var(--color-error)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubtaskList;