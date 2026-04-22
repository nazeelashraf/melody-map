import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Trash2, Pencil } from 'lucide-react';
import type { Composition } from '../types';
import { useCompositionActions } from '../context/CompositionContext';
import { useSheet } from '../context/SheetContext';
import ConfirmDialog from './ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CompositionCardProps {
  composition: Composition;
}

export default function CompositionCard({ composition }: CompositionCardProps) {
  const { renameComposition, deleteComposition } = useCompositionActions();
  const { state: sheetState } = useSheet();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(composition.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sheetTitles = useMemo(() => {
    return composition.sheetIds
      .map(id => sheetState.sheets.find(s => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined)
      .map(s => s.title);
  }, [composition.sheetIds, sheetState.sheets]);

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

  const previewTitles = sheetTitles.slice(0, 3);
  const remainingCount = sheetTitles.length - previewTitles.length;

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
            <Layers className="h-5 w-5 text-accent shrink-0" />
            <span className="text-lg font-semibold text-foreground truncate">
              {composition.title}
            </span>
            <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        )}
      </div>

      <div className="text-sm font-medium text-foreground">
        {composition.sheetIds.length} {composition.sheetIds.length === 1 ? 'sheet' : 'sheets'}
      </div>

      {previewTitles.length > 0 && (
        <div className="text-xs text-muted-foreground truncate">
          {previewTitles.join(' • ')}
          {remainingCount > 0 && (
            <span className="text-muted-foreground/70"> • +{remainingCount} more</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        {composition.sheetIds.map((_, index) => (
          <span
            key={index}
            className="h-1 w-1 rounded-full bg-muted-foreground/50"
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 mt-auto pt-1">
        {showDeleteConfirm && (
          <ConfirmDialog
            message={`Delete "${composition.title}"? This cannot be undone.`}
            onConfirm={() => deleteComposition(composition.id)}
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
          to={`/composition/${composition.id}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 h-8 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:bg-accent-hover transition-colors focus-visible:ring-2 focus-visible:ring-focus"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
