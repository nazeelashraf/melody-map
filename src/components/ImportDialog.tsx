import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useSheet } from '../context/SheetContext';
import { useComposition } from '../context/CompositionContext';
import { sheetSchema, compositionSchema } from '../schemas/sheet.schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImportDialogProps {
  mode: 'sheet' | 'composition';
  onClose: () => void;
}

export default function ImportDialog({ mode, onClose }: ImportDialogProps) {
  const { dispatch: sheetDispatch } = useSheet();
  const { dispatch: compositionDispatch } = useComposition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string);
        if (mode === 'sheet') {
          const result = sheetSchema.safeParse(raw);
          if (!result.success) {
            setError(`Invalid data: ${result.error.issues[0]?.message ?? 'Validation failed'}`);
            return;
          }
          const imported = { ...result.data, id: crypto.randomUUID() };
          sheetDispatch({ type: 'CREATE_SHEET', payload: imported });
        } else {
          const result = compositionSchema.safeParse(raw);
          if (!result.success) {
            setError(`Invalid data: ${result.error.issues[0]?.message ?? 'Validation failed'}`);
            return;
          }
          const imported = { ...result.data, id: crypto.randomUUID() };
          compositionDispatch({ type: 'CREATE_COMPOSITION', payload: imported });
        }
        onClose();
      } catch (parseError) {
        setError(`Invalid JSON file: ${parseError instanceof Error ? parseError.message : 'Parse error'}`);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import {mode === 'sheet' ? 'Sheet' : 'Composition'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Button onClick={() => fileInputRef.current?.click()} variant="default">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFile}
            className="hidden"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
