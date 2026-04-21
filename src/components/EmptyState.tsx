import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function EmptyState({ title, description, actionLabel, onAction, variant = 'primary' }: EmptyStateProps) {
  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: variant === 'secondary' ? '#111827' : '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
  };

  return (
    <div style={outerStyle}>
      <p style={titleStyle}>{title}</p>
      {description && <p style={descriptionStyle}>{description}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} style={buttonStyle}>{actionLabel}</button>
      )}
    </div>
  );
}

const outerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2.5rem 2rem',
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  border: '2px dashed #e5e7eb',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#6b7280',
  marginBottom: '1rem',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginTop: '0.5rem',
  lineHeight: 1.6,
};