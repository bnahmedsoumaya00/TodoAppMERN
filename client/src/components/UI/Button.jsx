import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  icon:  Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  animate = true,
  ... props 
}) => {
  
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ?  0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden'
  };

  const variants = {
    primary: {
      background: 'var(--color-accent)',
      color: 'var(--bg-primary)',
      boxShadow: 'var(--shadow-md)'
    },
    secondary: {
      background: 'var(--color-primary)',
      color: 'var(--text-primary)',
      boxShadow: 'var(--shadow-md)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-accent)',
      border: '2px solid var(--color-accent)'
    },
    danger: {
      background: 'var(--color-error)',
      color: 'var(--text-primary)',
      boxShadow: 'var(--shadow-md)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none'
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '14px 32px', fontSize: '18px' }
  };

  const buttonStyle = {
    ...baseStyles,
    ...variants[variant],
    ... sizes[size]
  };

  const handleClick = (e) => {
    if (! disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const ButtonContent = () => (
    <>
      {loading ?  (
        <>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={18} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={18} />}
        </>
      )}
    </>
  );

  if (! animate) {
    return (
      <button
        type={type}
        style={buttonStyle}
        onClick={handleClick}
        disabled={disabled || loading}
        className={`button-component ${className}`}
        {...props}
      >
        <ButtonContent />
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      style={buttonStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`button-component ${className}`}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      <ButtonContent />
    </motion.button>
  );
};

export default Button;