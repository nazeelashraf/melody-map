import { describe, expect, it } from 'vitest';
import {
  createEmptyDrumCues,
  deriveGroupedChords,
  transposeChordToken,
  transposeCueLinePreservingColumns,
  transposeLyricsLinesForInstrument,
} from './lyrics-utils';

describe('transposeChordToken', () => {
  it('transposes a recognized root by semitones', () => {
    expect(transposeChordToken('A', 2)).toBe('B');
  });

  it('preserves the token suffix while transposing the root', () => {
    expect(transposeChordToken('Bm', 1)).toBe('Cm');
  });

  it('returns unknown roots unchanged', () => {
    expect(transposeChordToken('Hsus4', 3)).toBe('Hsus4');
  });
});

describe('transposeCueLinePreservingColumns', () => {
  it('keeps chord start columns fixed after transposition', () => {
    const result = transposeCueLinePreservingColumns('A   Bm', 1);

    expect(result).toBe('A#  Cm');
    expect(deriveGroupedChords(result, 'abcdef')).toEqual([
      { chord: 'A#', lyricIndex: 0 },
      { chord: 'Cm', lyricIndex: 4 },
    ]);
  });
});

describe('transposeLyricsLinesForInstrument', () => {
  it('pads lyrics when a transposed chord grows at the line end', () => {
    const result = transposeLyricsLinesForInstrument(
      [
        {
          lyrics: 'hello',
          cues: {
            piano: '   Am',
            guitar: '     ',
            drums: createEmptyDrumCues(5),
          },
        },
      ],
      'piano',
      1,
    );

    expect(result).toEqual([
      {
        lyrics: 'hello ',
        cues: {
          piano: '   A#m',
          guitar: '      ',
          drums: createEmptyDrumCues(6),
        },
      },
    ]);
  });

  it('updates only the selected chorded instrument while other cues only gain padding when needed', () => {
    const result = transposeLyricsLinesForInstrument(
      [
        {
          lyrics: 'abcdef',
          cues: {
            piano: 'A     ',
            guitar: 'Bm    ',
            drums: {
              C: 'x     ',
              H: '  x   ',
              R: '      ',
              S: '   x  ',
              B: 'x x   ',
            },
          },
        },
      ],
      'guitar',
      1,
    );

    expect(result).toEqual([
      {
        lyrics: 'abcdef',
        cues: {
          piano: 'A     ',
          guitar: 'Cm    ',
          drums: {
            C: 'x     ',
            H: '  x   ',
            R: '      ',
            S: '   x  ',
            B: 'x x   ',
          },
        },
      },
    ]);
  });
});

describe('deriveGroupedChords', () => {
  it('extracts multiple chords with spaces between', () => {
    const result = deriveGroupedChords('Bm    G    D ', 'Amazing grace how sweet');
    expect(result).toEqual([
      { chord: 'Bm', lyricIndex: 0 },
      { chord: 'G', lyricIndex: 6 },
      { chord: 'D', lyricIndex: 11 },
    ]);
  });

  it('extracts chord at offset position', () => {
    const result = deriveGroupedChords('    Am', 'Hello world');
    expect(result).toEqual([{ chord: 'Am', lyricIndex: 4 }]);
  });

  it('returns empty array for all-space cue', () => {
    const result = deriveGroupedChords('          ', 'No chords');
    expect(result).toEqual([]);
  });

  it('extracts single chord at start', () => {
    const result = deriveGroupedChords('C#m7', 'Short');
    expect(result).toEqual([{ chord: 'C#m7', lyricIndex: 0 }]);
  });

  it('extracts multiple short chords', () => {
    const result = deriveGroupedChords('  B  Am G   ', 'Something here');
    expect(result).toEqual([
      { chord: 'B', lyricIndex: 2 },
      { chord: 'Am', lyricIndex: 5 },
      { chord: 'G', lyricIndex: 8 },
    ]);
  });
});
