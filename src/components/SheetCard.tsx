import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, Pencil, Trash2, ArrowRight } from 'lucide-react';
import type { Sheet } from '../types';
import { useSheetActions } from '../context/SheetContext';
import ConfirmDialog from './ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-3 mb-2">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="text-base font-semibold"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="text-base font-semibold cursor-pointer flex-1 flex items-center gap-1.5"
            title="Click to rename"
          >
            <Pencil className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100" />
            {sheet.title}
          </span>
        )}
        <Link
          to={`/sheet/${sheet.id}`}
          className="inline-flex items-center justify-center shrink-0 h-7 gap-1.5 px-2.5 rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground text-muted-foreground"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
        <Music className="h-3.5 w-3.5" />
        {sheet.tempo} BPM
        {sheet.lyricsLines.length > 0 && (
          <span> • {sheet.lyricsLines.length} lyric lines</span>
        )}
      </div>

      <div className="flex justify-end">
        {showDeleteConfirm && (
          <ConfirmDialog
            message={`Delete "${sheet.title}"? This cannot be undone.`}
            onConfirm={() => deleteSheet(sheet.id)}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-muted-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
