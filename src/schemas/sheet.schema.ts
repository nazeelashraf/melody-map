import { z } from 'zod';
import type { DrumCues, InstrumentType, LyricsLine } from '../types';

export const instrumentTypes: InstrumentType[] = ['piano', 'guitar', 'drums'];

export const drumCueLaneOrder = ['C', 'H', 'R', 'S', 'B'] as const;

const drumCuesSchema: z.ZodType<DrumCues> = z.object({
  C: z.string(),
  H: z.string(),
  R: z.string(),
  S: z.string(),
  B: z.string(),
});

export const lyricsLineSchema: z.ZodType<LyricsLine> = z.object({
  lyrics: z.string(),
  cues: z.object({
    piano: z.string(),
    guitar: z.string(),
    drums: drumCuesSchema,
  }),
}).refine(
  (data) => {
    const targetLength = data.lyrics.length;

    return data.cues.piano.length === targetLength
      && data.cues.guitar.length === targetLength
      && drumCueLaneOrder.every((lane) => data.cues.drums[lane].length === targetLength);
  },
  { message: 'All cue strings must be the same length as the lyrics string' }
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
