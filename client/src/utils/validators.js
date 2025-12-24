// Email validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!regex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password. length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  return { isValid:  true, error: null };
};

// Username validation
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username. length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/. test(username)) {
    return { isValid: false, error:  'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true, error:  null };
};

// Todo title validation
export const validateTodoTitle = (title) => {
  if (!title || title.trim() === '') {
    return { isValid: false, error: 'Title is required' };
  }
  
  if (title.trim().length < 3) {
    return { isValid: false, error: 'Title must be at least 3 characters' };
  }
  
  if (title.length > 255) {
    return { isValid: false, error: 'Title must be less than 255 characters' };
  }
  
  return { isValid: true, error: null };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true, error:  null };
};

// Date validation
export const validateDueDate = (dueDate) => {
  if (!dueDate) {
    return { isValid: true, error: null }; // Due date is optional
  }
  
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  if (date < today) {
    return { isValid: false, error: 'Due date cannot be in the past' };
  }
  
  return { isValid: true, error: null };
};

// Full name validation
export const validateFullName = (fullName) => {
  if (!fullName) {
    return { isValid: true, error: null }; // Full name is optional
  }
  
  if (fullName.trim().length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters' };
  }
  
  if (fullName.length > 100) {
    return { isValid: false, error:  'Full name must be less than 100 characters' };
  }
  
  return { isValid: true, error: null };
};

// Generic required field validation
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid:  true, error: null };
};

// Form validation helper
export const validateForm = (fields) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(fields).forEach((key) => {
    const validation = fields[key];
    if (!validation.isValid) {
      errors[key] = validation. error;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};