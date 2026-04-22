// Phase 6: Instrument-specific cues model verified against 06-SPEC.md requirements CUE-01 through CUE-04
export type InstrumentType = 'piano' | 'guitar' | 'drums';

export type DrumLane = 'C' | 'H' | 'R' | 'S' | 'B';

export interface DrumCues {
  C: string;
  H: string;
  R: string;
  S: string;
  B: string;
}

export interface LyricsLine {
  lyrics: string;
  cues: {
    piano: string;
    guitar: string;
    drums: DrumCues;
  };
}

export interface Sheet {
  id: string;
  title: string;
  tempo: number;
  lyricsLines: LyricsLine[];
  arrangements: {
    piano: string;
    guitar: string;
    drums: string;
  };
}

export interface Composition {
  id: string;
  title: string;
  sheetIds: string[];
}
