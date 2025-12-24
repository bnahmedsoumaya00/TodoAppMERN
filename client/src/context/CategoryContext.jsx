import { createContext, useContext, useState, useEffect } from 'react';
import {
  getCategories as getCategoriesService,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService
} from '../services/categoryService';

const CategoryContext = createContext(null);

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoryProvider');
  }
  return context;
};

// Default categories
const DEFAULT_CATEGORIES = [
  { id: 'general', name: 'General', color: '#8ea8c3', icon: 'folder', isDefault: true },
  { id: 'work', name: 'Work', color: '#3b82f6', icon: 'briefcase', isDefault: true },
  { id: 'personal', name: 'Personal', color: '#10b981', icon: 'user', isDefault: true },
  { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: 'shopping-cart', isDefault: true },
  { id: 'health', name: 'Health', color: '#ef4444', icon:  'heart', isDefault: true }
];

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategoriesService();
      
      // Merge custom categories with default ones
      const customCategories = response.data || [];
      setCategories([...DEFAULT_CATEGORIES, ...customCategories]);
    } catch (err) {
      console.error('Fetch categories error:', err);
      setError(err.response?.data?.error || 'Failed to fetch categories');
      // Keep default categories on error
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  // Create category
  const createCategory = async (categoryData) => {
    try {
      setError(null);
      const response = await createCategoryService(categoryData);
      setCategories([... categories, response.data]);
      return response;
    } catch (err) {
      setError(err.response?.data?. error || 'Failed to create category');
      throw err;
    }
  };

  // Update category
  const updateCategory = async (id, categoryData) => {
    try {
      setError(null);
      const response = await updateCategoryService(id, categoryData);
      setCategories(categories.map(cat => 
        cat.id === id ?  response.data : cat
      ));
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update category');
      throw err;
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      setError(null);
      await deleteCategoryService(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      setError(err. response?.data?.error || 'Failed to delete category');
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  const value = {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};