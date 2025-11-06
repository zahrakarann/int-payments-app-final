import React from 'react';
import './Component.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const btnClass = `btn btn-${variant} ${size !== 'medium' ? `btn-${size}` : ''} ${
    loading ? 'btn-loading' : ''
  } ${disabled ? 'btn-disabled' : ''} ${className}`;

  return (
    <button 
      className={btnClass} 
      type={type} 
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {children}
      {loading && <span className="btn-loading-spinner"></span>}
    </button>
  );
};

export default Button;