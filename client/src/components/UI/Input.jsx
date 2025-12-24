import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  fullWidth = true,
  helperText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' :  type;

  const containerStyle = {
    width: fullWidth ? '100%' : 'auto',
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom:  '8px',
    color: error ? '#ef4444' : '#8ea8c3',
    fontSize: '14px',
    fontWeight: '500'
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: Icon ? '12px 16px 12px 45px' : '12px 16px',
    paddingRight: type === 'password' ? '45px' : '16px',
    background: '#0F0A1E',
    border: `1px solid ${error ? '#ef4444' : isFocused ? '#cbf7ed' : '#2d3748'}`,
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ?  'not-allowed' : 'text'
  };

  const iconStyle = {
    position: 'absolute',
    left: '12px',
    color: error ? '#ef4444' : '#8ea8c3',
    pointerEvents: 'none'
  };

  const togglePasswordStyle = {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#8ea8c3',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center'
  };

  const errorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '6px',
    color: '#ef4444',
    fontSize: '13px'
  };

  const helperStyle = {
    marginTop: '6px',
    color: '#8ea8c3',
    fontSize: '13px'
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#ef4444' }}> *</span>}
        </label>
      )}
      
      <div style={inputWrapperStyle}>
        {Icon && <Icon size={20} style={iconStyle} />}
        
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={togglePasswordStyle}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <div style={errorStyle}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {helperText && ! error && (
        <div style={helperStyle}>{helperText}</div>
      )}
    </div>
  );
};

export default Input;