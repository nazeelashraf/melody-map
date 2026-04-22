import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  Copy,
  Edit3,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';
import { instrumentTypes } from '../schemas/sheet.schema';
import { useSheet, useSheetActions } from '../context/SheetContext';
import type { DrumLane, InstrumentType, LyricsLine } from '../types';
import ExportButton from './ExportButton';
import PerformanceView from './PerformanceView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
}

const instrumentLabels: Record<InstrumentType, string> = {
  piano: 'Piano',
  guitar: 'Guitar',
  drums: 'Percussion',
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
      <GuideMarker value={value} guideColumn={guideColumn} toneClassName="bg-primary/25" />
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
        className="h-10 rounded-xl border-primary/25 bg-primary/5 px-3 font-mono text-sm"
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
    setLineInstrumentOverrides((previousOverrides) => ({
      ...previousOverrides,
      [lineIndex]: instrument,
    }));
  };

  const handleCopyLine = (lineIndex: number, target: InstrumentType | 'all') => {
    const source = getLineInstrument(lineIndex);
    const nextLines = [...sheet.lyricsLines];
    nextLines[lineIndex] = target === 'all'
      ? copyLineCuesToAll(nextLines[lineIndex], source)
      : copyLineCues(nextLines[lineIndex], source, target);
    updateLyricsLines(nextLines);
  };

  const previewInstrument = editorInstrument === 'drums' ? 'piano' : editorInstrument;
  const previewLines = sheet.lyricsLines.length > 0
    ? sheet.lyricsLines.map((line) => formatPreviewLine(line, previewInstrument)).join('\n')
    : '';

  if (viewMode === 'performance') {
    return <PerformanceView sheet={sheet} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Sheets
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap mt-2">
          <div className="flex-1 min-w-0">
            <Input
              type="text"
              value={titleDraft}
              onChange={event => setTitleDraft(event.target.value)}
              onBlur={commitTitle}
              onKeyDown={handleTitleKeyDown}
              className="text-2xl font-bold border-0 px-0 h-auto focus-visible:ring-0"
            />
            <div className="flex gap-2 mt-2">
              <ExportButton data={sheet} label="Export sheet" />
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Edit one instrument at a time, keep cues vertically locked to the lyric text, and copy a line's cue pattern where needed.
            </p>
          </div>

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
      </div>

      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <h2 className="text-base font-semibold text-foreground">Sheet Details</h2>
          <Badge variant="secondary">{sheet.lyricsLines.length} lines</Badge>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-foreground">Title</span>
            <Input
              type="text"
              value={titleDraft}
              onChange={event => setTitleDraft(event.target.value)}
              onBlur={commitTitle}
              onKeyDown={handleTitleKeyDown}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-foreground">Tempo</span>
            <Input
              type="number"
              min={20}
              max={300}
              value={sheet.tempo}
              onChange={handleTempoChange}
            />
          </label>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Instrument Cues</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Pick an instrument for the section, then fine-tune any line with its own override. Clicking the lyric row also updates the cue guide.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ToggleGroup
              value={[editorInstrument]}
              onValueChange={(value) => {
                const nextInstrument = value[0];
                if (nextInstrument === 'piano' || nextInstrument === 'guitar' || nextInstrument === 'drums') {
                  setEditorInstrument(nextInstrument);
                }
              }}
            >
              {instrumentTypes.map((instrument) => (
                <ToggleGroupItem key={instrument} value={instrument} aria-label={`Edit ${instrumentLabels[instrument]} cues`}>
                  {instrumentLabels[instrument]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button onClick={handleAddLine}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add line
            </Button>
          </div>
        </div>

        {sheet.lyricsLines.length === 0 ? (
          <div className="text-center py-8 rounded-lg border border-dashed bg-muted/50">
            <p className="text-base font-bold text-foreground mb-1">No lyric lines yet</p>
            <p className="text-sm text-muted-foreground">Add a line, type lyrics, and place instrument-specific cues directly above the text.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sheet.lyricsLines.map((line, lineIndex) => {
              const activeInstrument = getLineInstrument(lineIndex);
              const isBlankLine = line.lyrics.length === 0;

              return (
                <article key={`${sheet.id}-${lineIndex}`} className="rounded-xl border bg-muted/40 p-4 space-y-3">
                  <div className="flex justify-between items-start gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">Line {lineIndex + 1}</Badge>
                      <ToggleGroup
                        value={[activeInstrument]}
                        onValueChange={(value) => {
                          const nextInstrument = value[0];
                          if (nextInstrument === 'piano' || nextInstrument === 'guitar' || nextInstrument === 'drums') {
                            handleLineInstrumentChange(lineIndex, nextInstrument);
                          }
                        }}
                      >
                        {instrumentTypes.map((instrument) => (
                          <ToggleGroupItem key={instrument} value={instrument} size="sm">
                            {instrumentLabels[instrument]}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>

                    // Phase 6: CUE-05 copy-to-all and copy-to-one verified per lyric line
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button variant="ghost" size="sm" onClick={() => handleCopyLine(lineIndex, 'all')}>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy to all
                      </Button>
                      {instrumentTypes.filter((instrument) => instrument !== activeInstrument).map((instrument) => (
                        <Button
                          key={instrument}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLine(lineIndex, instrument)}
                        >
                          {`To ${instrumentLabels[instrument]}`}
                        </Button>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => handleInsertLine(lineIndex)}>
                        <ChevronDown className="h-3.5 w-3.5 mr-1" />
                        Insert
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteLine(lineIndex)} className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {!isBlankLine && activeInstrument !== 'drums' && (
                      <label className="grid gap-1.5">
                        // Phase 6: EDIT-02 (linked monospace alignment via guideColumn) and EDIT-03 (distinct active styling) verified
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary/90">
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
                        />
                      </label>
                    )}

                    {!isBlankLine && activeInstrument === 'drums' && (
                      <div className="grid gap-2 rounded-xl border border-primary/15 bg-card/80 p-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs font-semibold uppercase tracking-wide text-primary/90">
                            Percussion lanes
                          </span>
                          <span className="text-xs text-muted-foreground">C crash, H hi-hat, R ride, S snare, B bass</span>
                        </div>
                        {drumLaneOrder.map((lane) => (
                          <label key={lane} className="grid grid-cols-[auto,1fr] items-center gap-2">
                            <span className="text-xs font-semibold text-muted-foreground w-14">{`${lane} ${drumLaneLabels[lane]}`}</span>
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
                            />
                          </label>
                        ))}
                      </div>
                    )}

                    <label className="grid gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lyrics</span>
                      <div className="relative">
                        {!isBlankLine && (
                          <GuideMarker
                            value={line.lyrics}
                            guideColumn={getGuideColumn(lineIndex, activeInstrument)}
                            toneClassName="bg-foreground/15"
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
                          className="h-10 rounded-xl border-border/80 bg-background px-3 font-mono text-sm"
                        />
                      </div>
                    </label>

                    {isBlankLine && (
                      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
                        Blank spacer line preserved. Cue rows stay hidden here so verse spacing remains clean.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {sheet.lyricsLines.length > 0 && (
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between items-baseline gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Current Preview</h3>
              <span className="text-xs text-muted-foreground">
                {editorInstrument === 'drums'
                  ? 'Percussion preview stays stacked in performance mode.'
                  : `Previewing ${instrumentLabels[previewInstrument]} cues with linked lyric spacing.`}
              </span>
            </div>

            {editorInstrument === 'drums' ? (
              <div className="rounded-xl bg-foreground text-background dark:bg-background dark:text-foreground p-4 font-mono text-sm overflow-x-auto space-y-1">
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
              <pre className="bg-foreground text-background dark:bg-background dark:text-foreground rounded-xl p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                {previewLines}
              </pre>
            )}
          </div>
        )}
      </section>

      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-foreground">Arrangements</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Keep notes, sections, or cues for piano, guitar, and drums independently.</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {instrumentTypes.map((instrument) => (
            <label key={instrument} className="grid gap-1">
              <span className="text-sm font-semibold text-foreground">{instrumentLabels[instrument]} arrangement</span>
              <Textarea
                value={sheet.arrangements[instrument]}
                onChange={(event) => handleArrangementChange(instrument, event.target.value)}
                rows={10}
                placeholder="Verse: sparse voicings\nChorus: open chords"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
