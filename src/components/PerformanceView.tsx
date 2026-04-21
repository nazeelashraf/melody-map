import { Music } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { instrumentTypes } from '@/schemas/sheet.schema';
import type { Sheet } from '@/types';
import { formatPreviewLine } from '@/lib/lyrics-utils';

interface PerformanceViewProps {
  sheet: Sheet;
}

export default function PerformanceView({ sheet }: PerformanceViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">{sheet.title}</h1>
        <Badge variant="secondary" className="mt-2 text-lg">{sheet.tempo} BPM</Badge>
      </div>

      {/* Instrument tabs */}
      <Tabs defaultValue={instrumentTypes[0]}>
        <TabsList className="w-full justify-start mb-4">
          {instrumentTypes.map((instrument) => (
            <TabsTrigger key={instrument} value={instrument} className="flex items-center gap-1.5">
              <Music className="h-4 w-4" />
              {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {instrumentTypes.map((instrument) => (
          <TabsContent key={instrument} value={instrument} className="mt-0">
            <div className="bg-card rounded-xl p-6 md:p-8">
              {/* Chord chart */}
              {sheet.lyricsLines.length > 0 ? (
                <pre className="text-xl font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto text-foreground">
                  {sheet.lyricsLines.map(formatPreviewLine).join('\n')}
                </pre>
              ) : (
                <p className="text-muted-foreground text-center py-8">No lyrics yet.</p>
              )}

              {/* Arrangement notes */}
              {sheet.arrangements[instrument] && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {instrument} Notes
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
