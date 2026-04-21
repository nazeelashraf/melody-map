import React from 'react';

interface ConfirmDialogProps {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <p style={messageStyle}>{message}</p>
        <div style={buttonRowStyle}>
          <button onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
          <button onClick={onConfirm} style={confirmButtonStyle}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 50,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '18px',
  padding: '1.5rem',
  maxWidth: '24rem',
  width: '90%',
  boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
};

const messageStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#111827',
  fontWeight: 600,
  marginBottom: '1.25rem',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '0.55rem 1rem',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: '999px',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const confirmButtonStyle: React.CSSProperties = {
  padding: '0.55rem 1rem',
  backgroundColor: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: '999px',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
};