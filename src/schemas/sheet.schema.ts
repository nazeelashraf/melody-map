import { z } from 'zod';
import type { InstrumentType, LyricsLine } from '../types';

export const instrumentTypes: InstrumentType[] = ['piano', 'guitar', 'drums'];

export const lyricsLineSchema: z.ZodType<LyricsLine> = z.object({
  lyrics: z.string(),
  chords: z.string(),
}).refine(
  (data) => data.chords.length === data.lyrics.length,
  { message: "Chords string must be same length as lyrics string" }
);

export const sheetSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  tempo: z.number().int().min(20).max(300),
  lyricsLines: z.array(lyricsLineSchema),
  arrangements: z.object({
    piano: z.string(),
    guitar: z.string(),
    drums: z.string(),
  }),
});

export const compositionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  sheetIds: z.array(z.string().uuid()),
});

export type SheetInput = z.input<typeof sheetSchema>;
export type SheetOutput = z.output<typeof sheetSchema>;
export type CompositionInput = z.input<typeof compositionSchema>;
export type CompositionOutput = z.output<typeof compositionSchema>;
