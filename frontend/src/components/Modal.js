import React from 'react';
import './Component.css';

const Modal = ({ 
  show, 
  onClose, 
  children, 
  title,
  size = 'medium',
  showCloseButton = true 
}) => {
  if (!show) return null;

  const sizeClass = `modal-${size}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${sizeClass}`} onClick={e => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button className="modal-close" onClick={onClose}>×</button>
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;