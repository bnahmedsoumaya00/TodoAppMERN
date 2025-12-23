import { createContext, useContext, useState, useEffect } from 'react';
import {
  getTodos as getTodosService,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
  toggleTodo as toggleTodoService,
  getTodoStats as getTodoStatsService
} from '../services/todoService';

const TodoContext = createContext(null);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0, overdue: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Fetch todos
  const fetchTodos = async (filterOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTodosService(filterOptions);
      setTodos(response.data);
      setFilters(filterOptions);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch todos');
      console.error('Fetch todos error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await getTodoStatsService();
      setStats(response.data);
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  // Create todo
  const createTodo = async (todoData) => {
    try {
      setError(null);
      const response = await createTodoService(todoData);
      setTodos([response.data, ...todos]);
      await fetchStats();
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create todo');
      throw err;
    }
  };

  // Update todo
  const updateTodo = async (id, todoData) => {
    try {
      setError(null);
      const response = await updateTodoService(id, todoData);
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
      await fetchStats();
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update todo');
      throw err;
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      setError(null);
      await deleteTodoService(id);
      setTodos(todos.filter(todo => todo.id !== id));
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete todo');
      throw err;
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    try {
      setError(null);
      const response = await toggleTodoService(id);
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to toggle todo');
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, []);

  const value = {
    todos,
    stats,
    loading,
    error,
    filters,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    fetchStats
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};