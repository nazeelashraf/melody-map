import { useEffect, useState } from 'react';
import { Music, Edit3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { instrumentTypes } from '@/schemas/sheet.schema';
import type { InstrumentType, Sheet } from '@/types';
import { PerformanceSheetContent, instrumentLabels, instrumentTabClasses } from '@/components/performance-shared';

interface PerformanceViewProps {
  sheet: Sheet;
  onBackToEdit: () => void;
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
          <Button variant="ghost" size="sm" onClick={onBackToEdit} className="hidden md:inline-flex" data-print-hide>
            <Edit3 className="h-4 w-4 mr-1.5" />
            Back to edit
          </Button>
        </div>
      </div>

      {/* Print-only header metadata */}
      <div className="hidden print:block px-6 pt-4">
        <h1 className="print-title">{sheet.title}</h1>
        <div className="print-meta">
          <span>{sheet.tempo} BPM</span>
          <span className="print-instrument-label">{instrumentLabels[activeTab]}</span>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as InstrumentType)}
        className="flex-1 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-3">
          <TabsList className="w-auto justify-start flex-wrap h-auto bg-transparent p-0 gap-1" data-print-hide>
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
            data-print-hide
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
              <PerformanceSheetContent
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
