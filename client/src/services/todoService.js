import api from './api';

// Get all todos with optional filters
export const getTodos = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  
  const response = await api.get(`/todos?${params.toString()}`);
  return response.data;
};

// Get single todo
export const getTodoById = async (id) => {
  const response = await api.get(`/todos/${id}`);
  return response.data;
};

// Create new todo
export const createTodo = async (todoData) => {
  const response = await api.post('/todos', todoData);
  return response.data;
};

// Update todo
export const updateTodo = async (id, todoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  return response.data;
};

// Delete todo
export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

// Toggle todo completion
export const toggleTodo = async (id) => {
  const response = await api.patch(`/todos/${id}/toggle`);
  return response.data;
};

// Get statistics
export const getTodoStats = async () => {
  const response = await api.get('/todos/stats');
  return response.data;
};