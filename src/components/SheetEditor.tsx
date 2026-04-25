import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Minus,
  Music,
  Plus,
  Trash2,
} from 'lucide-react';
import { instrumentTypes } from '../schemas/sheet.schema';
import { useSheet, useSheetActions } from '../context/SheetContext';
import type { DrumLane, InstrumentType, LyricsLine } from '../types';
import PerformanceView from './PerformanceView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  clampTempo,
  copyLineCues,
  copyLineCuesToAll,
  createLyricsLine,
  drumLaneLabels,
  drumLaneOrder,
  formatPreviewLine,
  normalizeCueLine,
  normalizeDrumCues,
  syncLyricsLine,
  transposeLyricsLinesForInstrument,
} from '@/lib/lyrics-utils';

interface SheetEditorProps {
  sheetId: string;
}

interface CueRowInputProps {
  value: string;
  guideColumn: number;
  placeholder: string;
  ariaLabel: string;
  onChange: (value: string, selectionStart: number) => void;
  onGuideColumnChange: (selectionStart: number) => void;
  className?: string;
}

const instrumentLabels: Record<InstrumentType, string> = {
  piano: 'Piano',
  guitar: 'Guitar',
  drums: 'Percussion',
};

const instrumentDotColors: Record<InstrumentType, string> = {
  piano: 'bg-blue-500',
  guitar: 'bg-green-500',
  drums: 'bg-purple-500',
};

function shiftLineOverrides(
  overrides: Record<number, InstrumentType>,
  lineIndex: number,
  direction: 'up' | 'down',
): Record<number, InstrumentType> {
  return Object.entries(overrides).reduce<Record<number, InstrumentType>>((nextOverrides, [key, value]) => {
    const index = Number(key);

    if (direction === 'up') {
      nextOverrides[index > lineIndex ? index + 1 : index] = value;
      return nextOverrides;
    }

    if (index === lineIndex) {
      return nextOverrides;
    }

    nextOverrides[index > lineIndex ? index - 1 : index] = value;
    return nextOverrides;
  }, {});
}

function GuideMarker({
  value,
  guideColumn,
  toneClassName,
}: {
  value: string;
  guideColumn: number;
  toneClassName: string;
}) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [leftOffset, setLeftOffset] = useState(12);

  const prefix = value.slice(0, Math.max(0, guideColumn));

  useLayoutEffect(() => {
    setLeftOffset(12 + (measureRef.current?.getBoundingClientRect().width ?? 0));
  }, [prefix]);

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute left-3 top-2 invisible whitespace-pre font-mono text-sm"
      >
        {prefix}
      </span>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-2 w-px rounded-full ${toneClassName}`}
        style={{ left: `${leftOffset}px` }}
      />
    </>
  );
}

// Phase 6: Stable caret verified — pendingSelectionRef + useLayoutEffect pattern satisfies EDIT-01
function CueRowInput({
  value,
  guideColumn,
  placeholder,
  ariaLabel,
  onChange,
  onGuideColumnChange,
  className,
}: CueRowInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingSelectionRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pendingSelectionRef.current === null || !inputRef.current) {
      return;
    }

    const nextSelection = Math.min(pendingSelectionRef.current, value.length);
    inputRef.current.setSelectionRange(nextSelection, nextSelection);
    pendingSelectionRef.current = null;
  }, [value]);

  const syncGuideColumn = (input: HTMLInputElement) => {
    onGuideColumnChange(input.selectionStart ?? 0);
  };

  return (
    <div className="relative">
      <GuideMarker value={value} guideColumn={guideColumn} toneClassName="bg-accent/20" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        aria-label={ariaLabel}
        onChange={(event) => {
          const selectionStart = event.currentTarget.selectionStart ?? event.currentTarget.value.length;
          pendingSelectionRef.current = selectionStart;
          onGuideColumnChange(selectionStart);
          onChange(event.currentTarget.value, selectionStart);
        }}
        onClick={(event) => syncGuideColumn(event.currentTarget)}
        onKeyUp={(event) => syncGuideColumn(event.currentTarget)}
        onSelect={(event) => syncGuideColumn(event.currentTarget)}
        onFocus={(event) => {
          if ((event.currentTarget.selectionStart ?? 0) === 0 && guideColumn > 0) {
            const nextSelection = Math.min(guideColumn, value.length);
            event.currentTarget.setSelectionRange(nextSelection, nextSelection);
          }
          syncGuideColumn(event.currentTarget);
        }}
        className={cn('h-9 bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-accent px-3 font-mono text-sm', className)}
      />
    </div>
  );
}

export default function SheetEditor({ sheetId }: SheetEditorProps) {
  const { state, dispatch } = useSheet();
  const { setActiveSheet } = useSheetActions();
  const [titleDraft, setTitleDraft] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'performance'>('edit');
  const [editorInstrument, setEditorInstrument] = useState<InstrumentType>('piano');
  const [lineInstrumentOverrides, setLineInstrumentOverrides] = useState<Record<number, InstrumentType>>({});
  const [lineGuideColumns, setLineGuideColumns] = useState<Record<string, number>>({});
  const [pasteDialogOpen, setPasteDialogOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [copyToMenuOpen, setCopyToMenuOpen] = useState(false);

  const sheet = useMemo(
    () => state.sheets.find(currentSheet => currentSheet.id === sheetId),
    [sheetId, state.sheets],
  );

  useEffect(() => {
    if (!sheetId) return undefined;
    setActiveSheet(sheetId);
    return () => {
      setActiveSheet(null);
    };
  }, [sheetId, setActiveSheet]);

  useEffect(() => {
    if (!sheet) return;
    setTitleDraft(sheet.title);
  }, [sheet]);

  useEffect(() => {
    if (!sheet) return;

    setLineInstrumentOverrides((previousOverrides) => {
      const nextOverrides = Object.entries(previousOverrides).reduce<Record<number, InstrumentType>>((acc, [key, value]) => {
        const index = Number(key);
        if (index < sheet.lyricsLines.length) {
          acc[index] = value;
        }
        return acc;
      }, {});

      return nextOverrides;
    });
  }, [sheet]);

  if (!sheet) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="bg-card rounded-2xl border p-8">
          <p className="text-lg font-bold text-foreground mb-2">Sheet not found</p>
          <p className="text-muted-foreground mb-4">This song sheet was removed or the URL is invalid.</p>
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold no-underline">
            Back to sheets
          </Link>
        </div>
      </div>
    );
  }

  const updateSheet = (updates: Partial<typeof sheet>) => {
    dispatch({
      type: 'UPDATE_SHEET',
      payload: { id: sheet.id, updates },
    });
  };

  const updateLyricsLines = (lyricsLines: LyricsLine[]) => {
    updateSheet({ lyricsLines });
  };

  const getLineInstrument = (lineIndex: number) => lineInstrumentOverrides[lineIndex] ?? editorInstrument;

  const getGuideKey = (lineIndex: number, instrument: InstrumentType, lane?: DrumLane) =>
    lane ? `${lineIndex}:${instrument}:${lane}` : `${lineIndex}:${instrument}`;

  const setGuideColumn = (lineIndex: number, instrument: InstrumentType, selectionStart: number, lane?: DrumLane) => {
    const nextSelection = Math.max(0, selectionStart);
    setLineGuideColumns((previousColumns) => ({
      ...previousColumns,
      [getGuideKey(lineIndex, instrument, lane)]: nextSelection,
      [getGuideKey(lineIndex, instrument)]: nextSelection,
      ...(instrument === 'drums' && !lane
        ? drumLaneOrder.reduce<Record<string, number>>((nextLaneColumns, currentLane) => {
            nextLaneColumns[getGuideKey(lineIndex, instrument, currentLane)] = nextSelection;
            return nextLaneColumns;
          }, {})
        : {}),
    }));
  };

  const getGuideColumn = (lineIndex: number, instrument: InstrumentType, lane?: DrumLane) => {
    const laneKey = lane ? getGuideKey(lineIndex, instrument, lane) : null;

    if (laneKey && lineGuideColumns[laneKey] !== undefined) {
      return lineGuideColumns[laneKey];
    }

    return lineGuideColumns[getGuideKey(lineIndex, instrument)] ?? 0;
  };

  const commitTitle = () => {
    const nextTitle = titleDraft.trim();
    if (!nextTitle || nextTitle === sheet.title) {
      setTitleDraft(sheet.title);
      return;
    }
    updateSheet({ title: nextTitle });
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      setTitleDraft(sheet.title);
      event.currentTarget.blur();
    }
  };

  const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSheet({ tempo: clampTempo(Number(event.target.value)) });
  };

  const handleLyricsChange = (lineIndex: number, nextLyrics: string) => {
    const nextLines = [...sheet.lyricsLines];
    nextLines[lineIndex] = syncLyricsLine(sheet.lyricsLines[lineIndex], nextLyrics);
    updateLyricsLines(nextLines);
  };

  const handleCueLineChange = (
    lineIndex: number,
    instrument: Extract<InstrumentType, 'piano' | 'guitar'>,
    nextValue: string,
  ) => {
    const currentLine = sheet.lyricsLines[lineIndex];
    const nextLines = [...sheet.lyricsLines];
    nextLines[lineIndex] = {
      ...currentLine,
      cues: {
        ...currentLine.cues,
        [instrument]: normalizeCueLine(nextValue, currentLine.lyrics.length),
      },
    };
    updateLyricsLines(nextLines);
  };

  const handleDrumLaneChange = (lineIndex: number, lane: DrumLane, nextValue: string) => {
    const currentLine = sheet.lyricsLines[lineIndex];
    const nextLines = [...sheet.lyricsLines];
    nextLines[lineIndex] = {
      ...currentLine,
      cues: {
        ...currentLine.cues,
        drums: {
          ...currentLine.cues.drums,
          [lane]: normalizeCueLine(nextValue, currentLine.lyrics.length),
        },
      },
    };
    updateLyricsLines(nextLines);
  };

  const handleAddLine = () => {
    updateLyricsLines([...sheet.lyricsLines, createLyricsLine()]);
  };

  const handleInsertLine = (lineIndex: number) => {
    const nextLines = [...sheet.lyricsLines];
    nextLines.splice(lineIndex + 1, 0, createLyricsLine());
    setLineInstrumentOverrides((previousOverrides) => shiftLineOverrides(previousOverrides, lineIndex, 'up'));
    updateLyricsLines(nextLines);
  };

  const handleInsertLineAbove = (lineIndex: number) => {
    const nextLines = [...sheet.lyricsLines];
    nextLines.splice(lineIndex, 0, createLyricsLine());
    setLineInstrumentOverrides((previousOverrides) => shiftLineOverrides(previousOverrides, lineIndex - 1, 'up'));
    updateLyricsLines(nextLines);
  };

  const handlePasteLyrics = () => {
    const lines = pasteText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) return;

    const newLyricsLines = lines.map((lyrics) => {
      const newLine = createLyricsLine(lyrics);
      return syncLyricsLine(newLine, lyrics);
    });

    updateLyricsLines([...sheet.lyricsLines, ...newLyricsLines]);
    setPasteText('');
    setPasteDialogOpen(false);
  };

  const handleDeleteLine = (lineIndex: number) => {
    setLineInstrumentOverrides((previousOverrides) => shiftLineOverrides(previousOverrides, lineIndex, 'down'));
    updateLyricsLines(sheet.lyricsLines.filter((_, index) => index !== lineIndex));
  };

  const handleArrangementChange = (instrument: InstrumentType, value: string) => {
    updateSheet({
      arrangements: {
        ...sheet.arrangements,
        [instrument]: value,
      },
    });
  };

  const handleLineInstrumentChange = (lineIndex: number, instrument: InstrumentType) => {
    setLineInstrumentOverrides((previousOverrides) => {
      if (previousOverrides[lineIndex] === instrument) {
        const next = { ...previousOverrides };
        delete next[lineIndex];
        return next;
      }
      return { ...previousOverrides, [lineIndex]: instrument };
    });
  };

  const handleCopyLine = (lineIndex: number, target: InstrumentType | 'all') => {
    const source = getLineInstrument(lineIndex);
    // Prevent copying between chorded and percussion instruments
    if (target !== 'all') {
      const sourceIsChorded = source === 'piano' || source === 'guitar';
      const targetIsChorded = target === 'piano' || target === 'guitar';
      if (sourceIsChorded !== targetIsChorded) return;
    }
    const nextLines = [...sheet.lyricsLines];
    nextLines[lineIndex] = target === 'all'
      ? copyLineCuesToAll(nextLines[lineIndex], source)
      : copyLineCues(nextLines[lineIndex], source, target);
    updateLyricsLines(nextLines);
  };

  const canTransposeInstrument = editorInstrument === 'piano' || editorInstrument === 'guitar';

  const handleTransposeStep = (step: number) => {
    if (!canTransposeInstrument || sheet.lyricsLines.length === 0) return;
    updateLyricsLines(
      transposeLyricsLinesForInstrument(sheet.lyricsLines, editorInstrument, step),
    );
  };

  const handleCopyTo = (target: InstrumentType) => {
    if (target === editorInstrument || sheet.lyricsLines.length === 0) return;
    // Prevent copying from chorded instruments to percussion
    if ((editorInstrument === 'piano' || editorInstrument === 'guitar') && target === 'drums') return;
    const nextLines = sheet.lyricsLines.map((line) =>
      copyLineCues(line, editorInstrument, target),
    );
    updateLyricsLines(nextLines);
  };

  const copyToTargets: InstrumentType[] = (() => {
    if (editorInstrument === 'piano') return ['guitar'];
    if (editorInstrument === 'guitar') return ['piano'];
    return ['piano', 'guitar'];
  })();

  const previewInstrument = editorInstrument === 'drums' ? 'piano' : editorInstrument;
  const previewLines = sheet.lyricsLines.length > 0
    ? sheet.lyricsLines.map((line) => formatPreviewLine(line, previewInstrument)).join('\n')
    : '';

  if (viewMode === 'performance') {
    return <PerformanceView sheet={sheet} onBackToEdit={() => setViewMode('edit')} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-canvas-muted">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground no-underline shrink-0"
          >
            <ArrowLeft className="h-3 w-3" />
            Sheets
          </Link>
          <span className="text-lg font-semibold text-foreground truncate">
            {sheet.title || 'Untitled Sheet'}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const json = JSON.stringify(sheet, null, 2);
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${sheet.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.json`;
              a.click();
              setTimeout(() => URL.revokeObjectURL(url), 100);
            }}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline ml-1.5">Export</span>
          </Button>
          <ToggleGroup
            value={[viewMode]}
            onValueChange={(value) => {
              if (value.length > 0 && (value[0] === 'edit' || value[0] === 'performance')) setViewMode(value[0]);
            }}
            className="flex-shrink-0"
          >
            <ToggleGroupItem value="edit" aria-label="Edit mode">
              <Edit3 className="h-4 w-4 mr-1.5" />
              Edit
            </ToggleGroupItem>
            <ToggleGroupItem value="performance" aria-label="Performance mode">
              <Eye className="h-4 w-4 mr-1.5" />
              Performance
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </header>

      {/* Metadata bar */}
      <div className="flex items-center gap-4 flex-wrap pb-4">
        <Input
          type="text"
          value={titleDraft}
          onChange={event => setTitleDraft(event.target.value)}
          onBlur={commitTitle}
          onKeyDown={handleTitleKeyDown}
          className="flex-1 min-w-0 bg-transparent border-0 border-b border-border px-0 text-sm focus-visible:ring-0"
          placeholder="Untitled Sheet"
        />
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">BPM</span>
          <Input
            type="number"
            min={20}
            max={300}
            value={sheet.tempo}
            onChange={handleTempoChange}
            className="w-20"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {sheet.lyricsLines.length} lines
        </span>
      </div>

      {/* Canvas — Cues */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 mb-4">
          <div className="flex gap-1" role="tablist" aria-label="Instrument editing context">
            {instrumentTypes.map((instrument) => {
              const isActive = editorInstrument === instrument;
              return (
                <button
                  key={instrument}
                  type="button"
                  role="tab"
                  aria-pressed={isActive}
                  aria-label={`Edit ${instrumentLabels[instrument]} cues`}
                  onClick={() => setEditorInstrument(instrument)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                      const currentIndex = instrumentTypes.indexOf(instrument);
                      const nextIndex = event.key === 'ArrowRight'
                        ? (currentIndex + 1) % instrumentTypes.length
                        : (currentIndex - 1 + instrumentTypes.length) % instrumentTypes.length;
                      setEditorInstrument(instrumentTypes[nextIndex]);
                    }
                  }}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium transition-colors border-l-4',
                    isActive && instrument === 'piano' && 'border-piano bg-piano-muted text-foreground',
                    isActive && instrument === 'guitar' && 'border-guitar bg-guitar-muted text-foreground',
                    isActive && instrument === 'drums' && 'border-drums bg-drums-muted text-foreground',
                    !isActive && 'border-transparent text-muted-foreground hover:bg-canvas-muted',
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {instrumentLabels[instrument]}
                    {isActive && <Edit3 className="h-3.5 w-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {canTransposeInstrument && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  title="Transpose down 1 semitone"
                  aria-label="Transpose down 1 semitone"
                  onClick={() => handleTransposeStep(-1)}
                >
                  <Minus className="h-4 w-4 mr-1.5" />
                  Down
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  title="Transpose up 1 semitone"
                  aria-label="Transpose up 1 semitone"
                  onClick={() => handleTransposeStep(1)}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Up
                </Button>
              </>
            )}

            {copyToTargets.length === 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyTo(copyToTargets[0])}
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy to {instrumentLabels[copyToTargets[0]]}
              </Button>
            ) : (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCopyToMenuOpen((prev) => !prev)}
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy to
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
                {copyToMenuOpen && (
                  <div className="absolute right-0 mt-1 w-36 rounded-md border border-border bg-popover shadow-lg z-50 overflow-hidden">
                    {copyToTargets.map((target) => (
                      <button
                        key={target}
                        type="button"
                        className="w-full px-3 py-1.5 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
                        onClick={() => {
                          handleCopyTo(target);
                          setCopyToMenuOpen(false);
                        }}
                      >
                        {instrumentLabels[target]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button variant="outline" size="sm" onClick={() => setPasteDialogOpen(true)}>
              <FileText className="h-4 w-4 mr-1.5" />
              Paste lyrics
            </Button>
            <Button size="sm" onClick={handleAddLine}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add line
            </Button>
          </div>
        </div>

        {sheet.lyricsLines.length === 0 ? (
          <div className="text-center py-8 rounded-lg border border-dashed border-canvas-muted bg-canvas-muted/50">
            <p className="text-base font-bold text-foreground mb-1">No lyric lines yet</p>
            <p className="text-sm text-muted-foreground">Add a line, type lyrics, and place instrument-specific cues directly above the text.</p>
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-canvas-muted">
            {sheet.lyricsLines.map((line, lineIndex) => {
              const activeInstrument = getLineInstrument(lineIndex);
              const isBlankLine = line.lyrics.length === 0;

              return (
                <article key={`${sheet.id}-${lineIndex}`} className="py-3 group relative">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Line {lineIndex + 1}
                      </span>
                      <div
                        className={cn(
                          'flex gap-1 rounded-full p-0.5 transition-all',
                          lineInstrumentOverrides[lineIndex] && lineInstrumentOverrides[lineIndex] !== editorInstrument && 'ring-1 ring-accent/30',
                        )}
                        title={lineInstrumentOverrides[lineIndex] ? `Line uses ${instrumentLabels[lineInstrumentOverrides[lineIndex]]} instead of global ${instrumentLabels[editorInstrument]}` : `Following global ${instrumentLabels[editorInstrument]}`}
                      >
                        {instrumentTypes.map((instrument) => {
                          const isActive = activeInstrument === instrument;
                          return (
                            <button
                              key={instrument}
                              type="button"
                              onClick={() => handleLineInstrumentChange(lineIndex, instrument)}
                              className={cn(
                                'text-[10px] px-2 py-0.5 rounded-full transition-colors',
                                isActive && instrument === 'piano' && 'bg-piano text-white',
                                isActive && instrument === 'guitar' && 'bg-guitar text-white',
                                isActive && instrument === 'drums' && 'bg-drums text-white',
                                !isActive && 'bg-transparent text-muted-foreground border border-border hover:bg-canvas-muted',
                              )}
                              aria-label={`Set line ${lineIndex + 1} to ${instrumentLabels[instrument]}`}
                            >
                              {instrumentLabels[instrument]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Copy cues to all instruments"
                        aria-label="Copy cues to all instruments"
                        onClick={() => handleCopyLine(lineIndex, 'all')}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Copy cues to piano"
                        aria-label="Copy cues to piano"
                        onClick={() => handleCopyLine(lineIndex, 'piano')}
                      >
                        <Music className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Copy cues to guitar"
                        aria-label="Copy cues to guitar"
                        onClick={() => handleCopyLine(lineIndex, 'guitar')}
                      >
                        <Music className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Insert line above"
                        aria-label="Insert line above"
                        onClick={() => handleInsertLineAbove(lineIndex)}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Insert line below"
                        aria-label="Insert line below"
                        onClick={() => handleInsertLine(lineIndex)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        title="Remove line"
                        aria-label="Remove line"
                        onClick={() => handleDeleteLine(lineIndex)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0">
                    {!isBlankLine && activeInstrument !== 'drums' && (
                      <div className={activeInstrument === 'piano' ? 'bg-piano-muted border-l-2 border-piano' : 'bg-guitar-muted border-l-2 border-guitar'}>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 pt-1 block">
                          {instrumentLabels[activeInstrument]} cues
                        </span>
                        <CueRowInput
                          value={line.cues[activeInstrument]}
                          placeholder={activeInstrument === 'piano' ? 'Bm      G      D' : 'Am      F      C'}
                          guideColumn={getGuideColumn(lineIndex, activeInstrument)}
                          ariaLabel={`${instrumentLabels[activeInstrument]} cue line ${lineIndex + 1}`}
                          onGuideColumnChange={(selectionStart) => setGuideColumn(lineIndex, activeInstrument, selectionStart)}
                          onChange={(value, selectionStart) => {
                            setGuideColumn(lineIndex, activeInstrument, selectionStart);
                            handleCueLineChange(lineIndex, activeInstrument, value);
                          }}
                          className="focus-visible:ring-accent"
                        />
                      </div>
                    )}

                    {!isBlankLine && activeInstrument === 'drums' && (
                      <div className="bg-drums-muted/30 py-2">
                        {drumLaneOrder.map((lane, laneIndex) => (
                          <div
                            key={lane}
                            className={cn(
                              'grid grid-cols-[auto,1fr] items-center gap-2 py-0.5',
                              laneIndex < drumLaneOrder.length - 1 && 'border-b border-drums/10',
                            )}
                          >
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider text-drums w-12 text-right"
                              title={drumLaneLabels[lane]}
                            >
                              {lane}
                            </span>
                            <CueRowInput
                              value={line.cues.drums[lane]}
                              placeholder="x   x x   x"
                              guideColumn={getGuideColumn(lineIndex, 'drums', lane)}
                              ariaLabel={`Percussion ${lane} lane ${lineIndex + 1}`}
                              onGuideColumnChange={(selectionStart) => setGuideColumn(lineIndex, 'drums', selectionStart, lane)}
                              onChange={(value, selectionStart) => {
                                setGuideColumn(lineIndex, 'drums', selectionStart, lane);
                                handleDrumLaneChange(lineIndex, lane, value);
                              }}
                              className="focus-visible:ring-drums"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="relative px-3">
                      {!isBlankLine && (
                        <GuideMarker
                          value={line.lyrics}
                          guideColumn={getGuideColumn(lineIndex, activeInstrument)}
                          toneClassName="bg-foreground/10"
                        />
                      )}
                      <Input
                        type="text"
                        value={line.lyrics}
                        placeholder="Type the lyric text for this row"
                        spellCheck={false}
                        onChange={(event) => handleLyricsChange(lineIndex, event.currentTarget.value)}
                        onClick={(event) => setGuideColumn(lineIndex, activeInstrument, event.currentTarget.selectionStart ?? 0)}
                        onKeyUp={(event) => setGuideColumn(lineIndex, activeInstrument, event.currentTarget.selectionStart ?? 0)}
                        onSelect={(event) => setGuideColumn(lineIndex, activeInstrument, event.currentTarget.selectionStart ?? 0)}
                        onFocus={(event) => {
                          const guideColumn = getGuideColumn(lineIndex, activeInstrument);
                          if ((event.currentTarget.selectionStart ?? 0) === 0 && guideColumn > 0) {
                            const nextSelection = Math.min(guideColumn, line.lyrics.length);
                            event.currentTarget.setSelectionRange(nextSelection, nextSelection);
                          }
                          setGuideColumn(lineIndex, activeInstrument, event.currentTarget.selectionStart ?? 0);
                        }}
                        className="h-9 w-full bg-transparent border-0 border-b border-border/50 focus-visible:border-accent focus-visible:ring-0 px-0 font-mono text-sm caret-accent"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {sheet.lyricsLines.length > 0 && (
          <div className="pt-4 mt-4 space-y-3">
            <div className="flex justify-between items-baseline gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Current Preview</h3>
              <span className="text-xs text-muted-foreground">
                {editorInstrument === 'drums'
                  ? 'Percussion preview stays stacked in performance mode.'
                  : `Previewing ${instrumentLabels[previewInstrument]} cues with linked lyric spacing.`}
              </span>
            </div>

            {editorInstrument === 'drums' ? (
              <div className="rounded-lg bg-canvas-muted/50 text-foreground p-4 font-mono text-sm overflow-x-auto space-y-1">
                {sheet.lyricsLines.map((line, lineIndex) => {
                  if (line.lyrics.length === 0) {
                    return <div key={`preview-${lineIndex}`} className="h-4" />;
                  }

                  const normalizedDrums = normalizeDrumCues(line.cues.drums, line.lyrics.length);

                  return (
                    <div key={`preview-${lineIndex}`} className="space-y-0.5">
                      {drumLaneOrder.map((lane) => (
                        <div key={lane} className="whitespace-pre">{`${lane} ${normalizedDrums[lane]}`}</div>
                      ))}
                      <div className="whitespace-pre">{`  ${line.lyrics}`}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <pre className="bg-canvas-muted/50 text-foreground rounded-lg p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                {previewLines}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Arrangements */}
      <section className="border-t pt-4 mt-6">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-foreground">Arrangements</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {instrumentTypes.map((instrument) => (
            <label key={instrument} className="grid gap-1">
              <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${instrumentDotColors[instrument]}`} />
                {instrumentLabels[instrument]}
              </span>
              <Textarea
                value={sheet.arrangements[instrument]}
                onChange={(event) => handleArrangementChange(instrument, event.target.value)}
                rows={10}
                placeholder={`Verse: sparse voicings
Chorus: open chords`}
                className="bg-canvas-muted/50"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Paste Lyrics Dialog */}
      <Dialog open={pasteDialogOpen} onOpenChange={setPasteDialogOpen}>
        <DialogContent className="bg-card text-card-foreground sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Paste Lyrics
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Paste your song lyrics below. Each line will become a separate lyric row. Empty lines will be skipped.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={pasteText}
            onChange={(event) => setPasteText(event.target.value)}
            rows={12}
                placeholder={`Verse 1:
Amazing grace, how sweet the sound
That saved a wretch like me

Chorus:
I once was lost, but now am found`}
            className="bg-canvas-muted/50 font-mono text-sm"
          />
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setPasteText(''); setPasteDialogOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={handlePasteLyrics} disabled={!pasteText.trim()}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add {pasteText.split('\n').filter(line => line.trim().length > 0).length} line(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
