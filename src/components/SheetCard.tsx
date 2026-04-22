import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, Pencil, Trash2, Clock, AlignLeft } from 'lucide-react';
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

  const hasPiano = sheet.arrangements.piano.trim().length > 0;
  const hasGuitar = sheet.arrangements.guitar.trim().length > 0;
  const hasDrums = sheet.arrangements.drums.trim().length > 0;

  return (
    <div className="bg-card border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-border/80 rounded-lg flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="text-lg font-semibold h-auto py-1"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 cursor-pointer flex-1 min-w-0"
            title="Click to rename"
          >
            <Music className="h-5 w-5 text-accent shrink-0" />
            <span className="text-lg font-semibold text-foreground truncate">
              {sheet.title}
            </span>
            <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {sheet.tempo} BPM
        </span>
        <span className="text-muted-foreground/60">•</span>
        <span className="flex items-center gap-1">
          <AlignLeft className="h-3.5 w-3.5" />
          {sheet.lyricsLines.length} {sheet.lyricsLines.length === 1 ? 'line' : 'lines'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {hasPiano && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-piano">
            <span className="h-2 w-2 rounded-full bg-piano" />
            Piano
          </span>
        )}
        {hasGuitar && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-guitar">
            <span className="h-2 w-2 rounded-full bg-guitar" />
            Guitar
          </span>
        )}
        {hasDrums && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-drums">
            <span className="h-2 w-2 rounded-full bg-drums" />
            Drums
          </span>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 mt-auto pt-1">
        {showDeleteConfirm && (
          <ConfirmDialog
            message={`Delete "${sheet.title}"? This cannot be undone.`}
            onConfirm={() => deleteSheet(sheet.id)}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Link
          to={`/sheet/${sheet.id}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 h-8 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:bg-accent-hover transition-colors focus-visible:ring-2 focus-visible:ring-focus"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
