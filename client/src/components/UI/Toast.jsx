import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        // Default options
        duration: 3000,
        style: {
          background: '#23395b',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid #2d3748',
          fontSize: '14px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.4)',
        },
        // Success
        success: {
          duration: 3000,
          style: {
            background: '#23395b',
            border: '1px solid #10b981',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        // Error
        error: {
          duration: 4000,
          style: {
            background: '#23395b',
            border: '1px solid #ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        // Loading
        loading: {
          style: {
            background: '#23395b',
            border: '1px solid #406e8e',
          },
          iconTheme: {
            primary: '#406e8e',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default Toast;