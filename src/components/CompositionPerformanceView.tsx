import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Music } from 'lucide-react';
import { useComposition, useCompositionActions } from '@/context/CompositionContext';
import { useSheet } from '@/context/SheetContext';
import { instrumentTypes } from '@/schemas/sheet.schema';
import type { InstrumentType } from '@/types';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PerformanceSheetContent,
  instrumentLabels,
  instrumentTabClasses,
} from '@/components/performance-shared';

interface CompositionPerformanceViewProps {
  compositionId: string;
}

export default function CompositionPerformanceView({
  compositionId,
}: CompositionPerformanceViewProps) {
  const { state } = useComposition();
  const { setActiveComposition } = useCompositionActions();
  const { state: sheetState } = useSheet();
  const [viewFormat, setViewFormat] = useState<'mono' | 'grouped'>('grouped');
  const [activeTab, setActiveTab] = useState<InstrumentType>(instrumentTypes[0]);

  const composition = useMemo(
    () => state.compositions.find((currentComposition) => currentComposition.id === compositionId),
    [compositionId, state.compositions],
  );

  const compositionEntries = useMemo(
    () => composition?.sheetIds.map((sheetId, index) => ({
      index,
      sheetId,
      sheet: sheetState.sheets.find((sheet) => sheet.id === sheetId),
    })) ?? [],
    [composition?.sheetIds, sheetState.sheets],
  );

  useEffect(() => {
    if (!compositionId) return undefined;
    setActiveComposition(compositionId);
    return () => {
      setActiveComposition(null);
    };
  }, [compositionId, setActiveComposition]);

  useEffect(() => {
    document.body.classList.add('performance-mode-active');
    return () => document.body.classList.remove('performance-mode-active');
  }, []);

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-canvas-muted">
        <div className="min-w-0">
          <Link
            to={`/composition/${composition.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline print:hidden"
            data-print-hide
          >
            <ArrowLeft className="h-4 w-4" />
            Back to edit
          </Link>
          <h1 className="text-3xl font-heading font-medium tracking-tight text-foreground mt-2">
            {composition.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {compositionEntries.length} {compositionEntries.length === 1 ? 'sheet' : 'sheets'} in performance order
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden" data-print-hide>
          <Link
            to={`/composition/${composition.id}`}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to edit
          </Link>
        </div>
      </div>

      <div className="hidden print:block px-6 pt-4">
        <h1 className="print-title">{composition.title}</h1>
        <div className="print-meta">
          <span>{compositionEntries.length} entries</span>
          <span className="print-instrument-label">{instrumentLabels[activeTab]}</span>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as InstrumentType)}
        className="flex-1 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-3 gap-3 flex-wrap">
          <TabsList className="w-auto justify-start flex-wrap h-auto bg-transparent p-0 gap-1" data-print-hide>
            {instrumentTypes.map((instrument) => (
              <TabsTrigger
                key={instrument}
                value={instrument}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm transition-colors data-[state=active]:shadow-none',
                  instrumentTabClasses[instrument].inactive,
                )}
                data-instrument={instrument}
              >
                <Music className="h-4 w-4" />
                {instrumentLabels[instrument]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div
            className={cn(
              'inline-flex rounded-md border border-canvas-muted overflow-hidden',
              activeTab === 'drums' && 'hidden',
            )}
            data-print-hide
          >
            <button
              type="button"
              onClick={() => setViewFormat('mono')}
              className={cn(
                'px-3 py-1.5 text-sm transition-colors',
                viewFormat === 'mono'
                  ? 'bg-canvas-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Mono
            </button>
            <button
              type="button"
              onClick={() => setViewFormat('grouped')}
              className={cn(
                'px-3 py-1.5 text-sm transition-colors',
                viewFormat === 'grouped'
                  ? 'bg-canvas-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Grouped
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {instrumentTypes.map((instrument) => (
            <TabsContent key={instrument} value={instrument} className="mt-0">
              {compositionEntries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-canvas-muted bg-card/40 px-6 py-12 text-center">
                  <p className="font-semibold text-foreground">No sheets in this composition yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add sheets in the composition editor to build a performance set.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {compositionEntries.map((entry) => (
                    <section
                      key={`${entry.sheetId}-${entry.index}`}
                      className="rounded-3xl border border-canvas-muted bg-card/60 px-5 py-6 shadow-sm print:rounded-none print:border-x-0 print:border-t-0 print:border-b print:px-0 print:py-5 print-sheet-section"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-canvas-muted pb-4 mb-6 print:mb-4 print:pb-3">
                        <div className="min-w-0">
                          <p className="text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground mb-2">
                            Sheet {entry.index + 1}
                          </p>
                          <h2 className="text-2xl font-heading font-medium text-foreground truncate print-title">
                            {entry.sheet?.title ?? 'Missing sheet'}
                          </h2>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-mono text-muted-foreground">
                            {entry.sheet ? `${entry.sheet.tempo} BPM` : 'Unavailable'}
                          </p>
                        </div>
                      </div>

                      {entry.sheet ? (
                        <PerformanceSheetContent
                          sheet={entry.sheet}
                          instrument={instrument}
                          viewFormat={viewFormat}
                        />
                      ) : (
                        <div className="rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 px-5 py-6 text-destructive print:border print:border-black print:bg-transparent">
                          <div className="flex items-center gap-2 font-semibold">
                            <AlertTriangle className="h-4 w-4" />
                            Missing sheet reference
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-foreground">
                            This slot is still part of the composition order, but its source sheet is no longer in the library.
                          </p>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
