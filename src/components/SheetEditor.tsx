import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronDown, Edit3, Eye } from 'lucide-react';
import { instrumentTypes } from '../schemas/sheet.schema';
import { useSheet, useSheetActions } from '../context/SheetContext';
import type { InstrumentType, LyricsLine } from '../types';
import ExportButton from './ExportButton';
import PerformanceView from './PerformanceView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  createLyricsLine,
  clampTempo,
  normalizeChordLine,
  syncLyricsLines,
  formatPreviewLine,
} from '@/lib/lyrics-utils';

interface SheetEditorProps {
  sheetId: string;
}

export default function SheetEditor({ sheetId }: SheetEditorProps) {
  const { state, dispatch } = useSheet();
  const { setActiveSheet } = useSheetActions();
  const [titleDraft, setTitleDraft] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'performance'>('edit');

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

  const lyricsText = sheet.lyricsLines.map((line) => line.lyrics).join('\n');
  const lyricsPreview = sheet.lyricsLines.map(formatPreviewLine).join('\n');

  const updateLyricsLines = (lyricsLines: LyricsLine[]) => {
    updateSheet({ lyricsLines });
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

  const handleLyricsTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateLyricsLines(syncLyricsLines(sheet.lyricsLines, event.target.value));
  };

  const handleChordChange = (lineIndex: number, nextChords: string) => {
    const currentLine = sheet.lyricsLines[lineIndex];
    const nextLines = [...sheet.lyricsLines];
    nextLines[lineIndex] = {
      ...currentLine,
      chords: normalizeChordLine(nextChords, currentLine.lyrics.length),
    };
    updateLyricsLines(nextLines);
  };

  const handleAddLine = () => {
    updateLyricsLines([...sheet.lyricsLines, createLyricsLine()]);
  };

  const handleInsertLine = (lineIndex: number) => {
    const nextLines = [...sheet.lyricsLines];
    nextLines.splice(lineIndex + 1, 0, createLyricsLine());
    updateLyricsLines(nextLines);
  };

  const handleDeleteLine = (lineIndex: number) => {
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

  // Performance mode
  if (viewMode === 'performance') {
    return <PerformanceView sheet={sheet} />;
  }

  // Edit mode
  return (
    <div className="space-y-6">
      {/* Header */}
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
              Edit lyrics, place chord text above each character position, and keep separate arrangements per instrument.
            </p>
          </div>

          {/* View mode toggle */}
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

      {/* Sheet Details */}
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

      {/* Lyrics And Chords */}
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Lyrics And Chords</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Type lyrics in the textarea, preserve verse breaks with blank lines, and keep chord markers aligned per lyric row.</p>
          </div>
          <Button onClick={handleAddLine}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add line
          </Button>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-foreground">Lyrics</span>
          <Textarea
            value={lyricsText}
            onChange={handleLyricsTextChange}
            rows={Math.max(6, sheet.lyricsLines.length + 2)}
            placeholder="Type one lyric line per row. Leave a blank line between verses."
          />
        </label>

        {sheet.lyricsLines.length === 0 ? (
          <div className="text-center py-8 rounded-lg border border-dashed bg-muted/50">
            <p className="text-base font-bold text-foreground mb-1">No lyric lines yet</p>
            <p className="text-sm text-muted-foreground">Start typing in the lyrics textarea, then place chord text above each generated line.</p>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {sheet.lyricsLines.map((line, lineIndex) => (
              <article key={`${sheet.id}-${lineIndex}`} className="rounded-lg border bg-muted/50 p-3 space-y-2">
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <Badge variant="outline">Line {lineIndex + 1}</Badge>
                  <div className="flex gap-1.5 flex-wrap">
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
                {line.lyrics.length > 0 ? (
                  <>
                    <label className="grid gap-1">
                      <span className="text-sm font-semibold text-foreground">Chords</span>
                      <Input
                        type="text"
                        value={line.chords}
                        onChange={event => handleChordChange(lineIndex, event.target.value)}
                        spellCheck={false}
                        className="font-mono"
                        placeholder="Am   F     C"
                      />
                    </label>
                    <div className="grid gap-1">
                      <span className="text-sm font-semibold text-foreground">Linked lyric line</span>
                      <div className="rounded-lg border bg-card p-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                        {line.lyrics}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 text-primary text-sm font-semibold">
                    Blank line preserved for verse spacing.
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {sheet.lyricsLines.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between items-baseline gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Rendered Preview</h3>
              <span className="text-xs text-muted-foreground">Line breaks and chord spacing stay visible in monospace output.</span>
            </div>
            <pre className="bg-foreground text-background dark:bg-background dark:text-foreground rounded-lg p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              {lyricsPreview}
            </pre>
          </div>
        )}
      </section>

      {/* Arrangements */}
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-foreground">Arrangements</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Keep notes, sections, or cues for piano, guitar, and drums independently.</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {instrumentTypes.map((instrument) => (
            <label key={instrument} className="grid gap-1">
              <span className="text-sm font-semibold text-foreground">{instrument.charAt(0).toUpperCase() + instrument.slice(1)} arrangement</span>
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
