import { Music } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
}

const instrumentLabels: Record<InstrumentType, string> = {
  piano: 'Piano',
  guitar: 'Guitar',
  drums: 'Percussion',
};

const instrumentTabClasses: Record<InstrumentType, { active: string; inactive: string }> = {
  piano: {
    active: 'border-l-4 border-piano bg-piano-muted text-piano font-semibold',
    inactive: 'border-l-4 border-transparent bg-transparent text-muted-foreground hover:bg-canvas-muted',
  },
  guitar: {
    active: 'border-l-4 border-guitar bg-guitar-muted text-guitar font-semibold',
    inactive: 'border-l-4 border-transparent bg-transparent text-muted-foreground hover:bg-canvas-muted',
  },
  drums: {
    active: 'border-l-4 border-drums bg-drums-muted text-drums font-semibold',
    inactive: 'border-l-4 border-transparent bg-transparent text-muted-foreground hover:bg-canvas-muted',
  },
};

export default function PerformanceView({ sheet }: PerformanceViewProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">{sheet.title}</h1>
        <Badge variant="secondary" className="mt-2 text-lg">{sheet.tempo} BPM</Badge>
      </div>

      <Tabs defaultValue={instrumentTypes[0]}>
        <TabsList className="w-full justify-start mb-4 flex-wrap h-auto bg-transparent p-0 gap-1 border-b border-canvas-muted pb-2">
          {instrumentTypes.map((instrument) => (
            <TabsTrigger
              key={instrument}
              value={instrument}
              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors data-[state=active]:shadow-none ${instrumentTabClasses[instrument].inactive}`}
              data-instrument={instrument}
            >
              <Music className="h-4 w-4" />
              {instrumentLabels[instrument]}
            </TabsTrigger>
          ))}
        </TabsList>

        {instrumentTypes.map((instrument) => (
          <TabsContent key={instrument} value={instrument} className="mt-0">
            <div className="bg-canvas rounded-lg p-4 md:p-6 space-y-6">
              {sheet.lyricsLines.length > 0 ? (
                instrument === 'drums' ? (
                  <div className="space-y-4">
                      <div className="rounded-lg bg-canvas-muted/50 p-4 md:p-5 overflow-x-auto">
                      <div className="font-mono text-lg leading-relaxed min-w-max space-y-3 text-foreground">
                        {sheet.lyricsLines.map((line, lineIndex) => {
                          if (line.lyrics.length === 0) {
                            return <div key={`drums-${lineIndex}`} className="h-8" />;
                          }

                          const normalizedDrums = normalizeDrumCues(line.cues.drums, line.lyrics.length);

                          return (
                            <div key={`drums-${lineIndex}`} className="space-y-0.5">
                              {drumLaneOrder.map((lane) => (
                                <div key={lane} className="whitespace-pre">
                                  <span className="inline-block w-6 text-drums font-bold">{lane}</span>
                                  {normalizedDrums[lane]}
                                </div>
                              ))}
                              <div className="whitespace-pre text-foreground">
                                <span className="inline-block w-6 text-transparent">_</span>
                                {line.lyrics}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <pre className="rounded-lg bg-canvas-muted/50 p-6 text-xl font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-foreground">
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
                <p className="text-muted-foreground text-center py-8">No lyrics yet.</p>
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
      </Tabs>
    </div>
  );
}
