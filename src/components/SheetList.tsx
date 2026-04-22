import { useState } from 'react';
import { Music, Layers, Plus, Upload } from 'lucide-react';
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
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Song Library</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-lg leading-relaxed">
              Keep sheets ready for editing, then assemble them into reusable compositions with a fixed performance order.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setImportMode('composition')}>
              <Upload className="h-4 w-4 mr-1.5" />
              Import Composition
            </Button>
            <Button variant="outline" size="sm" onClick={() => setImportMode('sheet')}>
              <Upload className="h-4 w-4 mr-1.5" />
              Import Sheet
            </Button>
            <Button variant="secondary" size="sm" onClick={() => startCreate('composition')}>
              <Layers className="h-4 w-4 mr-1" />
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Composition
            </Button>
            <Button size="sm" onClick={() => startCreate('sheet')}>
              <Music className="h-4 w-4 mr-1" />
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Sheet
            </Button>
          </div>
        </div>
      </div>

      {creatingType && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-card border border-border p-5 rounded-lg">
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
        </div>
      )}

      <div className="space-y-10">
        <section>
          <div className="flex justify-between items-center gap-4 mb-5 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                Compositions
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Ordered sets of sheets for rehearsal or performance.</p>
            </div>
            <Badge variant="secondary">{compositionState.compositions.length}</Badge>
          </div>

          {compositionState.compositions.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <div className="col-span-full">
                <EmptyState
                  title="No compositions yet"
                  description="Create one to build an ordered setlist from your sheets."
                  actionLabel="+ Create Composition"
                  onAction={() => startCreate('composition')}
                  variant="secondary"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {compositionState.compositions.map((composition) => (
                <CompositionCard key={composition.id} composition={composition} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center gap-4 mb-5 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Music className="h-5 w-5 text-muted-foreground" />
                Sheets
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Editable song sheets with lyrics, chords, and instrument notes.</p>
            </div>
            <Badge variant="secondary">{state.sheets.length}</Badge>
          </div>

          {state.sheets.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <div className="col-span-full">
                <EmptyState
                  title="No sheets yet"
                  description="Create your first sheet to get started."
                  actionLabel="+ Create Sheet"
                  onAction={() => startCreate('sheet')}
                  variant="primary"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
