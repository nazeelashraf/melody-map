import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Trash2, ArrowRight } from 'lucide-react';
import type { Composition } from '../types';
import { useCompositionActions } from '../context/CompositionContext';
import ConfirmDialog from './ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
            className="text-base font-semibold cursor-pointer flex-1"
            title="Click to rename"
          >
            {composition.title}
          </span>
        )}
        <Link
          to={`/composition/${composition.id}`}
          className="inline-flex items-center justify-center shrink-0 h-7 gap-1.5 px-2.5 rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground text-muted-foreground"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
        <Layers className="h-3.5 w-3.5" />
        <Badge variant="secondary">{composition.sheetIds.length}</Badge>
        <span>{composition.sheetIds.length === 1 ? 'sheet' : 'sheets'} in order</span>
      </div>

      <div className="flex justify-end">
        {showDeleteConfirm && (
          <ConfirmDialog
            message={`Delete "${composition.title}"? This cannot be undone.`}
            onConfirm={() => deleteComposition(composition.id)}
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
