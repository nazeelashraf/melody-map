import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Sheet } from '../types';
import { useSheetActions } from '../context/SheetContext';
import ConfirmDialog from './ConfirmDialog';

interface SheetCardProps {
  sheet: Sheet;
}

export default function SheetCard({ sheet }: SheetCardProps) {
  const { renameSheet, deleteSheet } = useSheetActions();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(sheet.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditTitle(sheet.title);
  }, [sheet.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== sheet.title) {
      renameSheet(sheet.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') {
      setEditTitle(sheet.title);
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
            {sheet.title}
          </span>
        )}
        <Link
          to={`/sheet/${sheet.id}`}
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
        {sheet.tempo} BPM
        {sheet.lyricsLines.length > 0 && (
          <span> • {sheet.lyricsLines.length} lyric lines</span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {showDeleteConfirm && (
          <ConfirmDialog
            message={`Delete "${sheet.title}"? This cannot be undone.`}
            onConfirm={() => deleteSheet(sheet.id)}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
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
      </div>
    </div>
  );
}