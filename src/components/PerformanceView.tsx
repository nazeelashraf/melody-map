import { Music } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { instrumentTypes } from '@/schemas/sheet.schema';
import type { InstrumentType, Sheet } from '@/types';
import {
  drumLaneLabels,
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

export default function PerformanceView({ sheet }: PerformanceViewProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">{sheet.title}</h1>
        <Badge variant="secondary" className="mt-2 text-lg">{sheet.tempo} BPM</Badge>
      </div>

      <Tabs defaultValue={instrumentTypes[0]}>
        <TabsList className="w-full justify-start mb-4 flex-wrap h-auto">
          {instrumentTypes.map((instrument) => (
            <TabsTrigger key={instrument} value={instrument} className="flex items-center gap-1.5">
              <Music className="h-4 w-4" />
              {instrumentLabels[instrument]}
            </TabsTrigger>
          ))}
        </TabsList>

        // Phase 6: PERF-01 verified — instrument tabs show instrument-specific cue data (piano/guitar use line.cues[instrument])
        {instrumentTypes.map((instrument) => (
          <TabsContent key={instrument} value={instrument} className="mt-0">
            <div className="bg-card rounded-xl p-6 md:p-8 space-y-6">
              {sheet.lyricsLines.length > 0 ? (
                instrument === 'drums' ? (
                  // Phase 6: PERF-03 verified — percussion renders as 5 labeled lanes with compact letters and visible legend (D-05)
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {drumLaneOrder.map((lane) => (
                        <span key={lane} className="rounded-full bg-muted px-2.5 py-1 font-medium">
                          {lane} {drumLaneLabels[lane]}
                        </span>
                      ))}
                    </div>

                    <div className="rounded-xl bg-muted/35 p-4 md:p-5 overflow-x-auto">
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
                                  <span className="inline-block w-6 text-primary/80">{lane}</span>
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
                  // Phase 6: PERF-02 verified — cue line rendered above lyrics in distinct monospace style
                  <pre className="rounded-xl bg-muted/35 p-6 text-xl font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-foreground">
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
                <div className="pt-6 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
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
