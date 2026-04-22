import { Inbox, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function EmptyState({ title, description, actionLabel, onAction, variant = 'primary' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center animate-in fade-in duration-500">
      <Inbox className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <p className="text-xl font-semibold text-foreground">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant={variant === 'secondary' ? 'outline' : 'default'}
          className="mt-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
