import { Inbox } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 p-8 text-center">
      <Inbox className="h-10 w-10 text-muted-foreground/50 mb-3" />
      <p className="text-lg font-semibold text-muted-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant={variant === 'secondary' ? 'secondary' : 'default'}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
