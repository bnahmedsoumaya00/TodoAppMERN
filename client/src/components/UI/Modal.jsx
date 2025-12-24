import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style. overflow = 'unset';
    }
    
    return () => {
      document.body. style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px',
    full: '95vw'
  };

  const overlayStyle = {
    position:  'fixed',
    top:  0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent:  'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease'
  };

  const modalStyle = {
    background: '#23395b',
    borderRadius: '16px',
    width: '100%',
    maxWidth: sizes[size],
    maxHeight:  '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '1px solid #2d3748',
    animation: 'slideUp 0.3s ease'
  };

  const headerStyle = {
    padding: '24px',
    borderBottom: '1px solid #2d3748',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#cbf7ed',
    margin: 0
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#8ea8c3',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s ease'
  };

  const bodyStyle = {
    padding: '24px',
    overflowY: 'auto',
    flex: 1
  };

  const footerStyle = {
    padding: '20px 24px',
    borderTop:  '1px solid #2d3748',
    display: 'flex',
    gap: '12px',
    justifyContent:  'flex-end'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={headerStyle}>
            {title && <h2 style={titleStyle}>{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={closeButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2d3748';
                  e.currentTarget.style.color = '#cbf7ed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e. currentTarget.style.color = '#8ea8c3';
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div style={bodyStyle}>{children}</div>

        {/* Footer */}
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform:  translateY(20px);
          }
          to {
            opacity: 1;
            transform:  translateY(0);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document. body);
};

export default Modal;