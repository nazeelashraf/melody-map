export type InstrumentType = 'piano' | 'guitar' | 'drums';

export interface LyricsLine {
  lyrics: string;
  chords: string;
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
