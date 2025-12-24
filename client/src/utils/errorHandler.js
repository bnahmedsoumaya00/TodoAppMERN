import toast from 'react-hot-toast';

// Parse API error response
export const parseApiError = (error) => {
  // Network error
  if (! error.response) {
    return {
      message: 'Network error. Please check your internet connection.',
      type: 'network',
      status: null
    };
  }

  const { status, data } = error.response;

  // Server error
  if (status >= 500) {
    return {
      message: 'Server error. Please try again later.',
      type: 'server',
      status
    };
  }

  // Authentication error
  if (status === 401) {
    return {
      message: data?. error || 'Authentication failed. Please login again.',
      type: 'auth',
      status
    };
  }

  // Authorization error
  if (status === 403) {
    return {
      message: data?.error || 'You do not have permission to perform this action.',
      type: 'forbidden',
      status
    };
  }

  // Not found
  if (status === 404) {
    return {
      message: data?.error || 'Resource not found.',
      type: 'notFound',
      status
    };
  }

  // Validation error
  if (status === 400) {
    // Handle array of validation errors
    if (data?.details && Array.isArray(data. details)) {
      return {
        message: data.details.join(', '),
        type: 'validation',
        status,
        details: data.details
      };
    }

    return {
      message: data?.error || 'Invalid request.  Please check your input.',
      type: 'validation',
      status
    };
  }

  // Generic client error
  return {
    message: data?.error || 'An error occurred. Please try again.',
    type: 'client',
    status
  };
};

// Show error toast
export const showErrorToast = (error) => {
  const parsedError = parseApiError(error);
  
  toast. error(parsedError.message, {
    duration: 4000,
    position: 'top-right',
    icon: '❌'
  });

  return parsedError;
};

// Show success toast
export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    icon: '✅',
    ... options
  });
};

// Handle form errors
export const handleFormError = (error, setError) => {
  const parsedError = parseApiError(error);
  
  if (parsedError.type === 'validation' && parsedError.details) {
    // Set multiple field errors if available
    const errorObj = {};
    parsedError. details.forEach((detail) => {
      // Try to extract field name from error message
      const match = detail.match(/^(\w+):/);
      if (match) {
        const field = match[1];
        errorObj[field] = detail. replace(/^\w+:\s*/, '');
      }
    });
    
    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
    } else {
      setError({ general: parsedError.message });
    }
  } else {
    setError({ general: parsedError.message });
  }

  return parsedError;
};

// Retry logic for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};

// Check if error is auth-related
export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403;
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors;
  }

  if (Array.isArray(errors)) {
    return errors. join(', ');
  }

  if (typeof errors === 'object') {
    return Object.values(errors).join(', ');
  }

  return 'Validation failed';
};