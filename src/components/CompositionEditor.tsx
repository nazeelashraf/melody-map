import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import { useComposition, useCompositionActions } from '../context/CompositionContext';
import { useSheet } from '../context/SheetContext';
import type { Composition } from '../types';
import ExportButton from './ExportButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface CompositionEditorProps {
  compositionId: string;
}

export default function CompositionEditor({ compositionId }: CompositionEditorProps) {
  const { state, dispatch } = useComposition();
  const { setActiveComposition } = useCompositionActions();
  const { state: sheetState } = useSheet();
  const [titleDraft, setTitleDraft] = useState('');

  const composition = useMemo(
    () => state.compositions.find((currentComposition) => currentComposition.id === compositionId),
    [compositionId, state.compositions],
  );

  useEffect(() => {
    if (!compositionId) return undefined;
    setActiveComposition(compositionId);
    return () => {
      setActiveComposition(null);
    };
  }, [compositionId, setActiveComposition]);

  useEffect(() => {
    if (!composition) return;
    setTitleDraft(composition.title);
  }, [composition]);

  if (!composition) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="bg-card rounded-2xl border p-8">
          <p className="text-lg font-bold text-foreground mb-2">Composition not found</p>
          <p className="text-muted-foreground mb-4">This composition was removed or the URL is invalid.</p>
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold no-underline">
            Back to library
          </Link>
        </div>
      </div>
    );
  }

  const updateComposition = (updates: Partial<Composition>) => {
    dispatch({
      type: 'UPDATE_COMPOSITION',
      payload: { id: composition.id, updates },
    });
  };

  const compositionEntries = composition.sheetIds.map((sheetId, index) => ({
    index,
    sheetId,
    sheet: sheetState.sheets.find((sheet) => sheet.id === sheetId),
  }));

  const selectedSheetIds = new Set(composition.sheetIds);
  const availableSheets = sheetState.sheets.filter((sheet) => !selectedSheetIds.has(sheet.id));
  const missingSheetCount = compositionEntries.filter((entry) => !entry.sheet).length;

  const commitTitle = () => {
    const nextTitle = titleDraft.trim();
    if (!nextTitle || nextTitle === composition.title) {
      setTitleDraft(composition.title);
      return;
    }
    updateComposition({ title: nextTitle });
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      setTitleDraft(composition.title);
      event.currentTarget.blur();
    }
  };

  const addSheet = (sheetId: string) => {
    updateComposition({ sheetIds: [...composition.sheetIds, sheetId] });
  };

  const removeSheet = (indexToRemove: number) => {
    updateComposition({
      sheetIds: composition.sheetIds.filter((_, index) => index !== indexToRemove),
    });
  };

  const moveSheet = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= composition.sheetIds.length) return;
    const nextSheetIds = [...composition.sheetIds];
    const [movedSheetId] = nextSheetIds.splice(fromIndex, 1);
    nextSheetIds.splice(toIndex, 0, movedSheetId);
    updateComposition({ sheetIds: nextSheetIds });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Library
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap mt-2">
          <div className="flex-1 min-w-0">
            <Input
              type="text"
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={commitTitle}
              onKeyDown={handleTitleKeyDown}
              placeholder="Sunday morning set"
              className="text-2xl font-bold border-0 px-0 h-auto focus-visible:ring-0"
            />
            <div className="flex gap-2 mt-2">
              <ExportButton data={composition} label="Export composition" />
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Build an ordered setlist from your saved sheets, then adjust the sequence as the arrangement changes.
            </p>
          </div>
        </div>
      </div>

      {/* Composition Details */}
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <h2 className="text-base font-semibold text-foreground">Composition Details</h2>
          <div className="flex gap-1.5 flex-wrap">
            <Badge variant="secondary">{composition.sheetIds.length} entries</Badge>
            {missingSheetCount > 0 && <Badge variant="destructive">{missingSheetCount} missing</Badge>}
          </div>
        </div>
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-foreground">Title</span>
          <Input
            type="text"
            value={titleDraft}
            onChange={(event) => setTitleDraft(event.target.value)}
            onBlur={commitTitle}
            onKeyDown={handleTitleKeyDown}
            placeholder="Sunday morning set"
          />
        </label>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 items-start">
        {/* Set Order */}
        <section className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h2 className="text-base font-semibold text-foreground">Set Order</h2>
            <Badge variant="secondary">{compositionEntries.length} slots</Badge>
          </div>

          {compositionEntries.length === 0 ? (
            <div className="text-center py-6 rounded-lg border border-dashed bg-muted/50">
              <p className="font-semibold text-foreground mb-1">No sheets in this composition yet.</p>
              <p className="text-sm text-muted-foreground">Add sheets from the library panel to start building the order.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {compositionEntries.map((entry) => (
                <div key={`${entry.sheetId}-${entry.index}`} className="flex justify-between gap-3 p-3 rounded-lg border bg-muted/50 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="min-w-[1.75rem] h-[1.75rem] flex items-center justify-center font-bold">
                        {entry.index + 1}
                      </Badge>
                      <p className="font-semibold text-foreground truncate">{entry.sheet?.title ?? 'Missing sheet'}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {entry.sheet
                        ? `${entry.sheet.tempo} BPM • ${entry.sheet.lyricsLines.length} lyric lines`
                        : 'This sheet no longer exists in the library.'}
                    </p>
                    {entry.sheet && (
                      <Link to={`/sheet/${entry.sheet.id}`} className="inline-block mt-1 text-sm text-primary no-underline hover:underline">
                        Open sheet
                      </Link>
                    )}
                  </div>

                  <div className="grid gap-1 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSheet(entry.index, entry.index - 1)}
                      disabled={entry.index === 0}
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSheet(entry.index, entry.index + 1)}
                      disabled={entry.index === compositionEntries.length - 1}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSheet(entry.index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Library Sheets */}
        <section className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h2 className="text-base font-semibold text-foreground">Library Sheets</h2>
            <Badge variant="secondary">{availableSheets.length} available</Badge>
          </div>

          {sheetState.sheets.length === 0 ? (
            <div className="text-center py-6 rounded-lg border border-dashed bg-muted/50">
              <p className="font-semibold text-foreground mb-1">No sheets in the library.</p>
              <p className="text-sm text-muted-foreground mb-3">Create a sheet first, then return here to add it to the composition.</p>
              <Link to="/" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold no-underline text-sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Go to library
              </Link>
            </div>
          ) : availableSheets.length === 0 ? (
            <div className="text-center py-6 rounded-lg border border-dashed bg-muted/50">
              <p className="font-semibold text-foreground mb-1">All sheets are already included.</p>
              <p className="text-sm text-muted-foreground">Remove one from the order if you want to swap it out.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableSheets.map((sheet) => (
                <div key={sheet.id} className="flex justify-between gap-3 p-3 rounded-lg border bg-muted/50 items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{sheet.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{sheet.tempo} BPM • {sheet.lyricsLines.length} lyric lines</p>
                    <Link to={`/sheet/${sheet.id}`} className="inline-block mt-1 text-sm text-primary no-underline hover:underline">
                      Open sheet
                    </Link>
                  </div>
                  <Button size="sm" onClick={() => addSheet(sheet.id)}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
