import { Toaster } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const Toast = () => {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        className: '',
        duration: 3000,
        style: {
          background: isDark ? '#23395b' : '#ffffff',
          color: isDark ?  '#cbf7ed' : '#0f172a',
          border: isDark ? '1px solid #406e8e' : '1px solid #e2e8f0',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: isDark 
            ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
            : '0 10px 40px rgba(0, 0, 0, 0.1)',
        },

        // Success
        success: {
          duration: 2500,
          style: {
            background: isDark ? '#10b98110' : '#f0fdf4',
            color: '#10b981',
            border: '1px solid #10b981',
          },
          iconTheme: {
            primary: '#10b981',
            secondary:  isDark ? '#10b98120' : '#ffffff',
          },
        },

        // Error
        error: {
          duration: 4000,
          style: {
            background: isDark ? '#ef444410' : '#fef2f2',
            color: '#ef4444',
            border: '1px solid #ef4444',
          },
          iconTheme:  {
            primary: '#ef4444',
            secondary: isDark ? '#ef444420' : '#ffffff',
          },
        },

        // Loading
        loading: {
          style: {
            background: isDark ? '#f59e0b10' : '#fffbeb',
            color: '#f59e0b',
            border:  '1px solid #f59e0b',
          },
          iconTheme: {
            primary: '#f59e0b',
            secondary: isDark ? '#f59e0b20' :  '#ffffff',
          },
        },
      }}
    />
  );
};

export default Toast;