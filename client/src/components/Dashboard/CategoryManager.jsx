import { useState } from 'react';
import { useCategories } from '../../context/CategoryContext';
import { Plus, Edit2, Trash2, Save, X, Folder, Briefcase, User, ShoppingCart, Heart } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ICON_OPTIONS = [
  { value: 'folder', label: 'Folder', icon: Folder },
  { value: 'briefcase', label: 'Work', icon: Briefcase },
  { value: 'user', label: 'Personal', icon:  User },
  { value: 'shopping-cart', label: 'Shopping', icon: ShoppingCart },
  { value: 'heart', label: 'Health', icon: Heart }
];

const COLOR_OPTIONS = [
  '#8ea8c3', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'
];

const CategoryManager = ({ isOpen, onClose }) => {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#8ea8c3',
    icon:  'folder'
  });

  const customCategories = categories.filter(cat => ! cat.isDefault);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      await createCategory(formData);
      toast.success('Category created successfully! ');
      setFormData({ name: '', color: '#8ea8c3', icon:  'folder' });
      setIsCreating(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create category');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateCategory(id, formData);
      toast.success('Category updated successfully!');
      setEditingId(null);
      setFormData({ name: '', color: '#8ea8c3', icon: 'folder' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update category');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete category "${name}"?  Todos will be moved to General. `)) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully!');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to delete category');
      }
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', color: '#8ea8c3', icon: 'folder' });
  };

  const IconComponent = ICON_OPTIONS.find(opt => opt.value === formData.icon)?.icon || Folder;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Categories"
      size="md"
    >
      <div>
        {/* Default Categories */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight:  '600', 
            color: 'var(--text-secondary)',
            marginBottom: '12px' 
          }}>
            Default Categories
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {categories.filter(cat => cat.isDefault).map((category) => {
              const Icon = ICON_OPTIONS.find(opt => opt.value === category.icon)?.icon || Folder;
              return (
                <div
                  key={category.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--bg-tertiary)',
                    borderRadius:  '8px',
                    border: '1px solid var(--border-primary)'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: category.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <Icon size={16} />
                  </div>
                  <span style={{ 
                    flex: 1, 
                    color: 'var(--text-primary)',
                    fontWeight: '500'
                  }}>
                    {category. name}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic'
                  }}>
                    Built-in
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Categories */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: 'var(--text-secondary)'
            }}>
              Custom Categories
            </h3>
            {! isCreating && (
              <Button
                size="sm"
                variant="primary"
                icon={Plus}
                onClick={() => setIsCreating(true)}
              >
                Add New
              </Button>
            )}
          </div>

          {/* Create Form */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height:  'auto' }}
                exit={{ opacity: 0, height:  0 }}
                style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: '2px solid var(--color-accent)'
                }}
              >
                <Input
                  label="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                />

                {/* Icon Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Icon
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {ICON_OPTIONS.map((option) => {
                      const Icon = option. icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: option.value })}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '8px',
                            border: formData.icon === option.value 
                              ? '2px solid var(--color-accent)' 
                              : '1px solid var(--border-primary)',
                            background: formData.icon === option. value 
                              ? 'var(--color-accent)' 
                              : 'var(--bg-primary)',
                            color: formData.icon === option.value 
                              ? 'var(--bg-primary)' 
                              : 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Icon size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display:  'block',
                    marginBottom: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: formData.color === color 
                            ? '3px solid var(--text-primary)' 
                            : '2px solid transparent',
                          background: color,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: formData.color === color ?  '0 0 0 2px var(--bg-secondary)' : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Preview
                  </label>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    border:  '1px solid var(--border-primary)'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background:  formData.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color:  '#ffffff'
                    }}>
                      <IconComponent size={16} />
                    </div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                      {formData.name || 'Category Name'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Save}
                    onClick={handleCreate}
                  >
                    Create
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={() => {
                      setIsCreating(false);
                      setFormData({ name: '', color: '#8ea8c3', icon:  'folder' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Custom Categories List */}
          {customCategories.length === 0 && ! isCreating ?  (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: 'var(--text-muted)',
              fontSize: '14px'
            }}>
              No custom categories yet. Click "Add New" to create one!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {customCategories.map((category) => {
                const isEditing = editingId === category. id;
                const Icon = ICON_OPTIONS.find(opt => opt.value === (isEditing ? formData.icon : category.icon))?.icon || Folder;

                if (isEditing) {
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity:  1 }}
                      style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: '8px',
                        padding: '16px',
                        border:  '2px solid var(--color-accent)'
                      }}
                    >
                      <Input
                        label="Category Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter category name"
                        required
                      />

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          color: 'var(--text-secondary)',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          Icon
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {ICON_OPTIONS.map((option) => {
                            const OptionIcon = option.icon;
                            return (
                              <button
                                key={option. value}
                                type="button"
                                onClick={() => setFormData({ ...formData, icon: option.value })}
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '8px',
                                  border:  formData.icon === option.value 
                                    ? '2px solid var(--color-accent)' 
                                    :  '1px solid var(--border-primary)',
                                  background: formData.icon === option. value 
                                    ? 'var(--color-accent)' 
                                    : 'var(--bg-primary)',
                                  color: formData.icon === option.value 
                                    ? 'var(--bg-primary)' 
                                    : 'var(--text-secondary)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems:  'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <OptionIcon size={20} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          color: 'var(--text-secondary)',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          Color
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setFormData({ ...formData, color })}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: formData. color === color 
                                  ? '3px solid var(--text-primary)' 
                                  : '2px solid transparent',
                                background: color,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow:  formData.color === color ? '0 0 0 2px var(--bg-secondary)' : 'none'
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Save}
                          onClick={() => handleUpdate(category.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={X}
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x:  20 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height:  '32px',
                      borderRadius: '8px',
                      background: category.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ 
                      flex: 1, 
                      color: 'var(--text-primary)',
                      fontWeight: '500'
                    }}>
                      {category.name}
                    </span>
                    <div style={{ display: 'flex', gap:  '4px' }}>
                      <button
                        onClick={() => startEdit(category)}
                        style={{
                          padding: '6px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-primary)';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(category. id, category.name)}
                        style={{
                          padding: '6px',
                          background: 'transparent',
                          border:  'none',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-error)';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CategoryManager;