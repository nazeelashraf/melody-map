import { useEffect, useState } from 'react';
import { Music, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { instrumentTypes } from '@/schemas/sheet.schema';
import type { InstrumentType, Sheet, LyricsLine } from '@/types';
import {
  drumLaneOrder,
  formatPreviewLine,
  normalizeCueLine,
  normalizeDrumCues,
  deriveGroupedChords,
} from '@/lib/lyrics-utils';

interface PerformanceViewProps {
  sheet: Sheet;
  onBackToEdit: () => void;
}

const instrumentLabels: Record<InstrumentType, string> = {
  piano: 'Piano',
  guitar: 'Guitar',
  drums: 'Percussion',
};

const instrumentTabClasses: Record<InstrumentType, { active: string; inactive: string }> = {
  piano: {
    active: 'border-l-4 border-piano bg-piano-muted text-piano font-semibold',
    inactive: 'border-l-4 border-transparent bg-transparent text-muted-foreground hover:text-foreground',
  },
  guitar: {
    active: 'border-l-4 border-guitar bg-guitar-muted text-guitar font-semibold',
    inactive: 'border-l-4 border-transparent bg-transparent text-muted-foreground hover:text-foreground',
  },
  drums: {
    active: 'border-l-4 border-drums bg-drums-muted text-drums font-semibold',
    inactive: 'border-l-4 border-transparent bg-transparent text-muted-foreground hover:text-foreground',
  },
};

function GroupedChordLine({ line, instrument }: { line: LyricsLine; instrument: 'piano' | 'guitar' }) {
  const chords = deriveGroupedChords(line.cues[instrument], line.lyrics);
  if (chords.length === 0) {
    return <div className="font-sans text-base leading-relaxed whitespace-pre">{line.lyrics}</div>;
  }

  const segments: { chord: string; text: string }[] = [];
  let textIndex = 0;

  for (const chord of chords) {
    if (chord.lyricIndex > textIndex) {
      segments.push({ chord: '', text: line.lyrics.slice(textIndex, chord.lyricIndex) });
    }
    const nextChordIndex = chords[chords.indexOf(chord) + 1]?.lyricIndex ?? line.lyrics.length;
    segments.push({ chord: chord.chord, text: line.lyrics.slice(chord.lyricIndex, nextChordIndex) });
    textIndex = nextChordIndex;
  }

  if (textIndex < line.lyrics.length) {
    segments.push({ chord: '', text: line.lyrics.slice(textIndex) });
  }

  const instrumentColor = instrument === 'piano' ? 'text-piano' : 'text-guitar';

  return (
    <div className="leading-relaxed">
      {segments.map((segment, i) => (
        <span key={i} className="inline-block align-bottom">
          <span className={`block font-mono text-sm font-medium ${instrumentColor} min-h-[1.25rem]`}>
            {segment.chord}
          </span>
          <span className="block font-sans text-base whitespace-pre">{segment.text}</span>
        </span>
      ))}
    </div>
  );
}

function InstrumentTabContent({
  sheet,
  instrument,
  viewFormat,
}: {
  sheet: Sheet;
  instrument: InstrumentType;
  viewFormat: 'mono' | 'grouped';
}) {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="space-y-6">
      {sheet.lyricsLines.length > 0 ? (
        instrument === 'drums' ? (
          <div className="font-mono text-lg leading-relaxed min-w-max space-y-3 text-foreground overflow-x-auto">
            {sheet.lyricsLines.map((line, lineIndex) => {
              if (line.lyrics.length === 0) {
                return <div key={`drums-${lineIndex}`} className="h-12" />;
              }

              const normalizedDrums = normalizeDrumCues(line.cues.drums, line.lyrics.length);

              return (
                <div key={`drums-${lineIndex}`} className="space-y-0.5 mb-6">
                  {drumLaneOrder.map((lane) => (
                    <div key={lane} className="whitespace-pre text-sm font-mono">
                      <span className="inline-block w-6 text-drums font-bold">{lane}</span>
                      {normalizedDrums[lane]}
                    </div>
                  ))}
                  <div className="whitespace-pre text-foreground text-base leading-relaxed">
                    <span className="inline-block w-6 text-transparent">_</span>
                    {line.lyrics}
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewFormat === 'mono' ? (
          <pre className="font-mono text-lg leading-relaxed whitespace-pre-wrap overflow-x-auto text-foreground">
            {sheet.lyricsLines.map((line) => {
              if (line.lyrics.length === 0) {
                return '';
              }

              return formatPreviewLine({
                ...line,
                cues: {
                  ...line.cues,
                  [instrument]: normalizeCueLine(line.cues[instrument], line.lyrics.length),
                },
              }, instrument);
            }).join('\n')}
          </pre>
        ) : (
          <div className="space-y-6">
            {sheet.lyricsLines.map((line, lineIndex) => {
              if (line.lyrics.length === 0) {
                return <div key={`grouped-${lineIndex}`} className="h-12" />;
              }
              return (
                <div key={`grouped-${lineIndex}`} className="mb-6">
                  <GroupedChordLine line={line} instrument={instrument} />
                </div>
              );
            })}
          </div>
        )
      ) : (
        <p className="text-center py-16 text-muted-foreground">No lyrics yet.</p>
      )}

      {sheet.arrangements[instrument] && (
        <div className="mt-8 border-t border-canvas-muted pt-4">
          <button
            type="button"
            onClick={() => setNotesOpen(!notesOpen)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                instrument === 'piano' ? 'bg-piano' : instrument === 'guitar' ? 'bg-guitar' : 'bg-drums'
              }`}
            />
            {instrumentLabels[instrument]} Notes
            {notesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {notesOpen && (
            <div
              className={`mt-3 pl-3 border-l-2 ${
                instrument === 'piano' ? 'border-piano' : instrument === 'guitar' ? 'border-guitar' : 'border-drums'
              }`}
            >
              <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
                {sheet.arrangements[instrument]}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PerformanceView({ sheet, onBackToEdit }: PerformanceViewProps) {
  const [viewFormat, setViewFormat] = useState<'mono' | 'grouped'>('grouped');
  const [activeTab, setActiveTab] = useState<InstrumentType>(instrumentTypes[0]);

  useEffect(() => {
    document.body.classList.add('performance-mode-active');
    return () => document.body.classList.remove('performance-mode-active');
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-canvas-muted">
        <h1 className="text-3xl font-heading font-medium tracking-tight text-foreground">
          {sheet.title}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-muted-foreground">{sheet.tempo} BPM</span>
          <Button variant="ghost" size="sm" onClick={onBackToEdit} className="hidden md:inline-flex">
            <Edit3 className="h-4 w-4 mr-1.5" />
            Back to edit
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as InstrumentType)}
        className="flex-1 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-3">
          <TabsList className="w-auto justify-start flex-wrap h-auto bg-transparent p-0 gap-1">
            {instrumentTypes.map((instrument) => (
              <TabsTrigger
                key={instrument}
                value={instrument}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm transition-colors data-[state=active]:shadow-none ${instrumentTabClasses[instrument].inactive}`}
                data-instrument={instrument}
              >
                <Music className="h-4 w-4" />
                {instrumentLabels[instrument]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div
            className={`inline-flex rounded-md border border-canvas-muted overflow-hidden ${
              activeTab === 'drums' ? 'hidden' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setViewFormat('mono')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                viewFormat === 'mono'
                  ? 'bg-canvas-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mono
            </button>
            <button
              type="button"
              onClick={() => setViewFormat('grouped')}
              className={`px-3 py-1.5 text-sm transition-colors ${
                viewFormat === 'grouped'
                  ? 'bg-canvas-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Grouped
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {instrumentTypes.map((instrument) => (
            <TabsContent key={instrument} value={instrument} className="mt-0">
              <InstrumentTabContent
                sheet={sheet}
                instrument={instrument}
                viewFormat={viewFormat}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
