import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { InstrumentType, LyricsLine, Sheet } from '@/types';
import {
  deriveGroupedChords,
  drumLaneOrder,
  formatPreviewLine,
  normalizeCueLine,
  normalizeDrumCues,
} from '@/lib/lyrics-utils';

export const instrumentLabels: Record<InstrumentType, string> = {
  piano: 'Piano',
  guitar: 'Guitar',
  drums: 'Percussion',
};

export const instrumentTabClasses: Record<InstrumentType, { active: string; inactive: string }> = {
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
          <span className={`block font-mono text-sm font-medium ${instrumentColor} min-h-[1.25rem] print-chord-label`}>
            {segment.chord}
          </span>
          <span className="block font-sans text-base whitespace-pre print-lyric-line">{segment.text}</span>
        </span>
      ))}
    </div>
  );
}

interface PerformanceSheetContentProps {
  sheet: Sheet;
  instrument: InstrumentType;
  viewFormat: 'mono' | 'grouped';
}

export function PerformanceSheetContent({
  sheet,
  instrument,
  viewFormat,
}: PerformanceSheetContentProps) {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="space-y-6">
      {sheet.lyricsLines.length > 0 ? (
        instrument === 'drums' ? (
          <div className="font-mono text-lg leading-relaxed min-w-max space-y-3 text-foreground overflow-x-auto">
            {sheet.lyricsLines.map((line, lineIndex) => {
              if (line.lyrics.length === 0) {
                return <div key={`drums-${lineIndex}`} className="h-12 print-lyric-block" />;
              }

              const normalizedDrums = normalizeDrumCues(line.cues.drums, line.lyrics.length);

              return (
                <div key={`drums-${lineIndex}`} className="space-y-0.5 mb-6 print-lyric-block">
                  {drumLaneOrder.map((lane) => (
                    <div key={lane} className="whitespace-pre text-sm font-mono print-mono-cue">
                      <span className="inline-block w-6 text-drums font-bold print-lane-label">{lane}</span>
                      {normalizedDrums[lane]}
                    </div>
                  ))}
                  <div className="whitespace-pre text-foreground text-base leading-relaxed print-lyric-line">
                    <span className="inline-block w-6 text-transparent">_</span>
                    {line.lyrics}
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewFormat === 'mono' ? (
          <pre className="font-mono text-lg leading-relaxed whitespace-pre-wrap overflow-x-auto text-foreground print-mono-cue print-lyric-block">
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
                return <div key={`grouped-${lineIndex}`} className="h-12 print-lyric-block" />;
              }
              return (
                <div key={`grouped-${lineIndex}`} className="mb-6 print-lyric-block">
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
        <>
          <div className="mt-8 border-t border-canvas-muted pt-4 print:hidden">
            <button
              type="button"
              onClick={() => setNotesOpen(!notesOpen)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-print-notes-toggle
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
          <div className="hidden print:block print-notes-block" data-print-notes-content>
            <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground print-lyric-line">
              {sheet.arrangements[instrument]}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
