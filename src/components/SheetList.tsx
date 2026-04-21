import { useState } from 'react';
import { Library, Music, Layers, Plus, Upload } from 'lucide-react';
import { useComposition, useCompositionActions } from '../context/CompositionContext';
import CompositionCard from './CompositionCard';
import { useSheet, useSheetActions } from '../context/SheetContext';
import SheetCard from './SheetCard';
import ImportDialog from './ImportDialog';
import EmptyState from './EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function SheetList() {
  const { state } = useSheet();
  const { createSheet } = useSheetActions();
  const { state: compositionState } = useComposition();
  const { createComposition } = useCompositionActions();
  const [creatingType, setCreatingType] = useState<'sheet' | 'composition' | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [importMode, setImportMode] = useState<'sheet' | 'composition' | null>(null);

  const handleCreate = () => {
    const trimmed = newTitle.trim();
    if (trimmed) {
      if (creatingType === 'composition') {
        createComposition(trimmed);
      } else {
        createSheet(trimmed);
      }
      setNewTitle('');
      setCreatingType(null);
    }
  };

  const startCreate = (type: 'sheet' | 'composition') => {
    setCreatingType(type);
    setNewTitle('');
  };

  const cancelCreate = () => {
    setNewTitle('');
    setCreatingType(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') {
      cancelCreate();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2 flex items-center gap-2">
          <Library className="h-4 w-4" />
          Melody Map
        </p>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Song Library</h1>
            <p className="text-muted-foreground mt-1 max-w-xl leading-relaxed">
              Keep sheets ready for editing, then assemble them into reusable compositions with a fixed performance order.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setImportMode('composition')}>
              <Upload className="h-4 w-4 mr-1.5" />
              Import Composition
            </Button>
            <Button variant="outline" onClick={() => setImportMode('sheet')}>
              <Upload className="h-4 w-4 mr-1.5" />
              Import Sheet
            </Button>
            <Button variant="secondary" onClick={() => startCreate('composition')}>
              <Plus className="h-4 w-4 mr-1.5" />
              New Composition
            </Button>
            <Button onClick={() => startCreate('sheet')}>
              <Plus className="h-4 w-4 mr-1.5" />
              New Sheet
            </Button>
          </div>
        </div>
      </div>

      {creatingType && (
        <div className="mb-6 rounded-lg border bg-card p-4">
          <p className="text-sm font-semibold text-foreground mb-3">
            {creatingType === 'composition' ? 'Create a composition' : 'Create a sheet'}
          </p>
          <Input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={creatingType === 'composition' ? 'Composition title...' : 'Sheet title...'}
            autoFocus
            className="mb-3"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleCreate}
              disabled={!newTitle.trim()}
            >
              Create
            </Button>
            <Button variant="outline" onClick={cancelCreate}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <section>
          <div className="flex justify-between items-center gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                Compositions
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Ordered sets of sheets for rehearsal or performance.</p>
            </div>
            <Badge variant="secondary">{compositionState.compositions.length}</Badge>
          </div>

          {compositionState.compositions.length === 0 ? (
            <EmptyState
              title="No compositions yet"
              description="Create one to build an ordered setlist from your sheets."
              actionLabel="+ Create Composition"
              onAction={() => startCreate('composition')}
              variant="secondary"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {compositionState.compositions.map((composition) => (
                <CompositionCard key={composition.id} composition={composition} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Music className="h-5 w-5 text-muted-foreground" />
                Sheets
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Editable song sheets with lyrics, chords, and instrument notes.</p>
            </div>
            <Badge variant="secondary">{state.sheets.length}</Badge>
          </div>

          {state.sheets.length === 0 ? (
            <EmptyState
              title="No sheets yet"
              description="Create your first sheet to get started."
              actionLabel="+ Create Sheet"
              onAction={() => startCreate('sheet')}
              variant="primary"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {state.sheets.map(sheet => (
                <SheetCard key={sheet.id} sheet={sheet} />
              ))}
            </div>
          )}
        </section>
      </div>
      {importMode && (
        <ImportDialog mode={importMode} onClose={() => setImportMode(null)} />
      )}
    </div>
  );
}
