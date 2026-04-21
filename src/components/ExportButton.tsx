import React from 'react';
import type { Sheet, Composition } from '../types';

interface ExportButtonProps {
  data: Sheet | Composition;
  label?: string;
}

export default function ExportButton({ data, label = 'Export' }: ExportButtonProps) {
  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <button onClick={handleExport} style={buttonStyle}>
      ⬇ {label}
    </button>
  );
}

const buttonStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: '999px',
  padding: '0.45rem 0.75rem',
  backgroundColor: '#fff',
  color: '#334155',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer',
};