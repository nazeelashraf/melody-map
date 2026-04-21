import React, { useState } from 'react';
import { useComposition, useCompositionActions } from '../context/CompositionContext';
import CompositionCard from './CompositionCard';
import { useSheet, useSheetActions } from '../context/SheetContext';
import SheetCard from './SheetCard';
import ImportDialog from './ImportDialog';
import EmptyState from './EmptyState';

export default function SheetList() {
  const { state } = useSheet();
  const { createSheet } = useSheetActions();
  const { state: compositionState } = useComposition();
  const { createComposition } = useCompositionActions();
  const [creatingType, setCreatingType] = useState<'sheet' | 'composition' | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [importMode, setImportMode] = useState<'sheet' | 'composition' | null>(null);

  const handleCreate = () => {
    const trimmed = newTitle.trim();
    if (trimmed) {
      if (creatingType === 'composition') {
        createComposition(trimmed);
      } else {
        createSheet(trimmed);
      }
      setNewTitle('');
      setCreatingType(null);
    }
  };

  const startCreate = (type: 'sheet' | 'composition') => {
    setCreatingType(type);
    setNewTitle('');
  };

  const cancelCreate = () => {
    setNewTitle('');
    setCreatingType(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') {
      cancelCreate();
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1120px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3b82f6' }}>
          Melody Map
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Song Library</h1>
            <p style={{ margin: '0.75rem 0 0', color: '#6b7280', maxWidth: '640px', lineHeight: 1.6 }}>
              Keep sheets ready for editing, then assemble them into reusable compositions with a fixed performance order.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setImportMode('composition')}
              style={{
                padding: '10px 16px',
                backgroundColor: 'transparent',
                color: '#111827',
                border: '1px solid #111827',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ⬆ Import Composition
            </button>
            <button
              onClick={() => setImportMode('sheet')}
              style={{
                padding: '10px 16px',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ⬆ Import Sheet
            </button>
            <button
              onClick={() => startCreate('composition')}
              style={{
                padding: '10px 16px',
                backgroundColor: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + New Composition
            </button>
            <button
              onClick={() => startCreate('sheet')}
              style={{
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + New Sheet
            </button>
          </div>
        </div>
      </div>

      {creatingType && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#fff' }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
            {creatingType === 'composition' ? 'Create a composition' : 'Create a sheet'}
          </p>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={creatingType === 'composition' ? 'Composition title...' : 'Sheet title...'}
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              marginBottom: '0.75rem',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleCreate}
              disabled={!newTitle.trim()}
              style={{
                padding: '6px 12px',
                backgroundColor: newTitle.trim() ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                cursor: newTitle.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Create
            </button>
            <button
              onClick={cancelCreate}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '2rem' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Compositions</h2>
              <p style={{ margin: '0.35rem 0 0', color: '#6b7280' }}>Ordered sets of sheets for rehearsal or performance.</p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', backgroundColor: '#e5e7eb', borderRadius: '999px', padding: '0.35rem 0.7rem' }}>
              {compositionState.compositions.length}
            </span>
          </div>

          {compositionState.compositions.length === 0 ? (
            <EmptyState
              title="No compositions yet"
              description="Create one to build an ordered setlist from your sheets."
              actionLabel="+ Create Composition"
              onAction={() => startCreate('composition')}
              variant="secondary"
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {compositionState.compositions.map((composition) => (
                <CompositionCard key={composition.id} composition={composition} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Sheets</h2>
              <p style={{ margin: '0.35rem 0 0', color: '#6b7280' }}>Editable song sheets with lyrics, chords, and instrument notes.</p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', backgroundColor: '#dbeafe', borderRadius: '999px', padding: '0.35rem 0.7rem' }}>
              {state.sheets.length}
            </span>
          </div>

          {state.sheets.length === 0 ? (
            <EmptyState
              title="No sheets yet"
              description="Create your first sheet to get started."
              actionLabel="+ Create Sheet"
              onAction={() => startCreate('sheet')}
              variant="primary"
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {state.sheets.map(sheet => (
                <SheetCard key={sheet.id} sheet={sheet} />
              ))}
            </div>
          )}
        </section>
      </div>
      {importMode && (
        <ImportDialog mode={importMode} onClose={() => setImportMode(null)} />
      )}
    </div>
  );
}
