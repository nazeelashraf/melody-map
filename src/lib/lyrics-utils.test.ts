import { describe, expect, it } from 'vitest';
import { deriveGroupedChords } from './lyrics-utils';

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
