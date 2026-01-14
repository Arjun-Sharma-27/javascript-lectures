import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

let toastContainer = null;
const toastRoots = new Map();

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const titles = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
  };

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <div className="toast-content">
        <div className="toast-title">{titles[type]}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

export const showToast = (message, type = 'info') => {
  const container = createToastContainer();
  const toastId = Date.now().toString();

  const removeToast = () => {
    const toastElement = document.getElementById(`toast-${toastId}`);
    if (toastElement) {
      toastElement.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        const root = toastRoots.get(toastId);
        if (root) {
          root.unmount();
          toastRoots.delete(toastId);
        }
        if (toastElement.parentNode) {
          toastElement.remove();
        }
      }, 300);
    }
  };

  const toastElement = document.createElement('div');
  toastElement.id = `toast-${toastId}`;
  container.appendChild(toastElement);

  const root = createRoot(toastElement);
  toastRoots.set(toastId, root);
  root.render(<Toast message={message} type={type} onClose={removeToast} />);
};
