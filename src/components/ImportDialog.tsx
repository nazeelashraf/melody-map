import { useRef, useState } from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
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
      <DialogContent className="bg-card text-card-foreground p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileUp className="h-5 w-5 text-accent" />
            Import {mode === 'sheet' ? 'Sheet' : 'Composition'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg bg-muted/50 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/80 transition-colors w-full"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Choose File</span>
            <span className="text-sm text-muted-foreground">Select a JSON file to import</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFile}
            className="hidden"
          />
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 bg-transparent border-t-0 mx-0 mb-0 p-0 pt-4 rounded-none">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
