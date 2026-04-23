import { useEffect } from 'react';
import { Music, Edit3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { instrumentTypes } from '@/schemas/sheet.schema';
import type { InstrumentType, Sheet } from '@/types';
import {
  drumLaneOrder,
  formatPreviewLine,
  normalizeCueLine,
  normalizeDrumCues,
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

export default function PerformanceView({ sheet, onBackToEdit }: PerformanceViewProps) {
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

      <Tabs defaultValue={instrumentTypes[0]} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start flex-wrap h-auto bg-transparent p-0 gap-1 px-6 py-3">
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

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {instrumentTypes.map((instrument) => (
            <TabsContent key={instrument} value={instrument} className="mt-0">
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
                  ) : (
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
                  )
                ) : (
                  <p className="text-center py-16 text-muted-foreground">No lyrics yet.</p>
                )}

                {sheet.arrangements[instrument] && (
                  <div className="pt-4 border-t border-canvas-muted">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      {instrumentLabels[instrument]} Notes
                    </h3>
                    <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
                      {sheet.arrangements[instrument]}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
