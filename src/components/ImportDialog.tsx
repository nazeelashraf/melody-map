import React, { useRef, useState } from 'react';
import { useSheet } from '../context/SheetContext';
import { useComposition } from '../context/CompositionContext';
import { sheetSchema, compositionSchema } from '../schemas/sheet.schema';

interface ImportDialogProps {
  mode: 'sheet' | 'composition';
  onClose: () => void;
}

export default function ImportDialog({ mode, onClose }: ImportDialogProps) {
  const { dispatch: sheetDispatch } = useSheet();
  const { dispatch: compositionDispatch } = useComposition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string);
        if (mode === 'sheet') {
          const result = sheetSchema.safeParse(raw);
          if (!result.success) {
            setError(`Invalid data: ${result.error.issues[0]?.message ?? 'Validation failed'}`);
            return;
          }
          const imported = { ...result.data, id: crypto.randomUUID() };
          sheetDispatch({ type: 'CREATE_SHEET', payload: imported });
        } else {
          const result = compositionSchema.safeParse(raw);
          if (!result.success) {
            setError(`Invalid data: ${result.error.issues[0]?.message ?? 'Validation failed'}`);
            return;
          }
          const imported = { ...result.data, id: crypto.randomUUID() };
          compositionDispatch({ type: 'CREATE_COMPOSITION', payload: imported });
        }
        onClose();
      } catch (parseError) {
        setError(`Invalid JSON file: ${parseError instanceof Error ? parseError.message : 'Parse error'}`);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>Import {mode === 'sheet' ? 'Sheet' : 'Composition'}</h2>
        <button onClick={() => fileInputRef.current?.click()} style={fileButtonStyle}>
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        {error && <p style={errorStyle}>{error}</p>}
        <div style={actionRowStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
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
  maxWidth: '28rem',
  width: '90%',
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 1rem',
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#111827',
};

const fileButtonStyle: React.CSSProperties = {
  padding: '0.6rem 1rem',
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const errorStyle: React.CSSProperties = {
  color: '#dc2626',
  fontSize: '0.875rem',
  marginTop: '0.75rem',
};

const actionRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '1rem',
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