import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = '#cbf7ed',
  fullScreen = false,
  text = 'Loading...'
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom:  0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(22, 25, 37, 0.95)',
        zIndex: 9999,
        gap: '16px'
      }}>
        <Loader2 
          size={sizes. xl} 
          color={color}
          style={{ animation: 'spin 1s linear infinite' }}
        />
        {text && (
          <p style={{ color:  '#8ea8c3', fontSize: '16px' }}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display:  'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <Loader2 
        size={sizes[size]} 
        color={color}
        style={{ animation:  'spin 1s linear infinite' }}
      />
      {text && (
        <span style={{ color: '#8ea8c3', fontSize: '14px' }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;