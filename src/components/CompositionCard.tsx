import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Composition } from '../types';
import { useCompositionActions } from '../context/CompositionContext';

interface CompositionCardProps {
  composition: Composition;
}

export default function CompositionCard({ composition }: CompositionCardProps) {
  const { renameComposition, deleteComposition } = useCompositionActions();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(composition.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditTitle(composition.title);
  }, [composition.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== composition.title) {
      renameComposition(composition.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') handleRename();
    if (event.key === 'Escape') {
      setEditTitle(composition.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        {isEditing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              padding: '2px 6px',
              width: '100%',
            }}
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              flex: 1,
            }}
            title="Click to rename"
          >
            {composition.title}
          </span>
        )}
        <Link
          to={`/composition/${composition.id}`}
          style={{
            fontSize: '0.875rem',
            color: '#3b82f6',
            textDecoration: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          Open →
        </Link>
      </div>

      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
        {composition.sheetIds.length} {composition.sheetIds.length === 1 ? 'sheet' : 'sheets'} in order
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {showDeleteConfirm ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#ef4444' }}>Delete?</span>
            <button
              onClick={() => deleteComposition(composition.id)}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                backgroundColor: '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
