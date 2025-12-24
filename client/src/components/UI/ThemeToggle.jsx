import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  const containerStyle = {
    position: 'relative',
    width: '60px',
    height: '32px',
    background: isDark ? '#2d3748' : '#cbd5e1',
    borderRadius: '16px',
    cursor: 'pointer',
    padding: '4px',
    transition: 'background 0.3s ease'
  };

  const handleStyle = {
    width: '24px',
    height: '24px',
    background: isDark ? '#cbf7ed' : '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDark ? '#161925' : '#ffffff'
  };

  return (
    <div 
      onClick={toggleTheme} 
      style={containerStyle}
      role="button"
      aria-label="Toggle theme"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleTheme();
        }
      }}
    >
      <motion.div
        style={handleStyle}
        initial={false}
        animate={{
          x: isDark ? 28 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </motion. div>
    </div>
  );
};

export default ThemeToggle;