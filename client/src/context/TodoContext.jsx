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

// Sorting functions
const sortingFunctions = {
  'priority-high': (a, b) => {
    const priorityOrder = { high: 3, medium: 2, low:  1 };
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  },
  'priority-low': (a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return (priorityOrder[a.priority] || 0) - (priorityOrder[b. priority] || 0);
  },
  'date-newest': (a, b) => new Date(b.created_at) - new Date(a.created_at),
  'date-oldest': (a, b) => new Date(a.created_at) - new Date(b.created_at),
  'due-date':  (a, b) => {
    if (! a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date) - new Date(b.due_date);
  },
  'alphabetical':  (a, b) => a.title.localeCompare(b. title),
  'completed':  (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0, overdue: 0 });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('priority-high'); // Default sort

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
      setStatsLoading(true);
      const response = await getTodoStatsService();
      setStats(response. data);
    } catch (err) {
      console.error('Fetch stats error:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Sort todos
  const sortTodos = (todosToSort, sortType) => {
    const sortFunction = sortingFunctions[sortType];
    if (!sortFunction) return todosToSort;
    
    return [...todosToSort].sort(sortFunction);
  };

  // Get sorted todos
  const getSortedTodos = () => {
    return sortTodos(todos, sortBy);
  };

  // Create todo with optimistic update
  const createTodo = async (todoData) => {
    try {
      setError(null);
      
      const tempTodo = {
        id: Date.now(),
        ...todoData,
        completed: false,
        created_at: new Date().toISOString(),
        __optimistic: true
      };
      setTodos([tempTodo, ...todos]);
      
      const response = await createTodoService(todoData);
      
      setTodos(prevTodos => 
        prevTodos.map(t => t.__optimistic ? response.data : t)
      );
      
      await fetchStats();
      return response;
    } catch (err) {
      setTodos(prevTodos => prevTodos.filter(t => ! t.__optimistic));
      setError(err.response?.data?. error || 'Failed to create todo');
      throw err;
    }
  };

  // Update todo with optimistic update
  const updateTodo = async (id, todoData) => {
    try {
      setError(null);
      const originalTodos = [... todos];
      
      setTodos(todos.map(todo => 
        todo.id === id ? { ... todo, ...todoData } : todo
      ));
      
      const response = await updateTodoService(id, todoData);
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
      
      await fetchStats();
      return response;
    } catch (err) {
      setTodos(originalTodos);
      setError(err.response?.data?.error || 'Failed to update todo');
      throw err;
    }
  };

  // Delete todo with optimistic update
  const deleteTodo = async (id) => {
    try {
      setError(null);
      const originalTodos = [...todos];
      
      setTodos(todos.filter(todo => todo.id !== id));
      await deleteTodoService(id);
      await fetchStats();
    } catch (err) {
      setTodos(originalTodos);
      setError(err.response?.data?.error || 'Failed to delete todo');
      throw err;
    }
  };

  // Toggle todo completion with optimistic update
  const toggleTodo = async (id) => {
    try {
      setError(null);
      const originalTodos = [...todos];
      
      setTodos(todos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed, completed_at: ! todo.completed ? new Date().toISOString() : null }
          : todo
      ));
      
      const response = await toggleTodoService(id);
      setTodos(todos.map(todo => todo.id === id ?  response.data : todo));
      
      await fetchStats();
    } catch (err) {
      setTodos(originalTodos);
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
    todos:  getSortedTodos(),
    rawTodos: todos,
    stats,
    loading,
    statsLoading,
    error,
    filters,
    sortBy,
    setSortBy,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    fetchStats,
    sortTodos
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};