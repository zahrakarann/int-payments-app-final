import React from 'react';
import './Component.css';

const Input = ({ 
  label, 
  error, 
  success,
  type = "text", 
  options, 
  icon,
  required = false,
  className = '',
  ...props 
}) => {
  const inputClass = `input-group ${className}`;
  const labelClass = `input-label ${required ? 'required' : ''}`;

  return (
    <div className={inputClass}>
      {label && <label className={labelClass}>{label}</label>}

      <div className={icon ? 'input-with-icon' : ''}>
        {icon && <span className="input-icon">{icon}</span>}
        
        {type === 'select' ? (
          <select {...props} className={error ? 'input-error' : success ? 'input-success' : ''}>
            {options && options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea {...props} className={error ? 'input-error' : success ? 'input-success' : ''} />
        ) : (
          <input 
            type={type} 
            {...props} 
            className={error ? 'input-error' : success ? 'input-success' : ''} 
          />
        )}
      </div>

      {error && <span className="error-text">⚠️ {error}</span>}
      {success && !error && <span className="success-text">✓ {success}</span>}
    </div>
  );
};

export default Input;