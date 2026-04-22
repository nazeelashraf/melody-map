import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AlertDialog open onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-card text-card-foreground sm:max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-accent/10 text-accent">
            <AlertTriangle className="h-6 w-6" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-semibold text-foreground">
            Confirm Action
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 bg-transparent border-t-0 mx-0 mb-0 p-0 pt-4 rounded-none">
          <AlertDialogCancel autoFocus onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
