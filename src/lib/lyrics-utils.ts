// Phase 6: Cue utilities verified for CUE-05 (copy), EDIT-01 (sync on lyric change)
import type { DrumCues, DrumLane, InstrumentType, LyricsLine } from '../types';

export const drumLaneOrder: DrumLane[] = ['C', 'H', 'R', 'S', 'B'];

export const drumLaneLabels: Record<DrumLane, string> = {
  C: 'Crash',
  H: 'Hi-hat',
  R: 'Ride',
  S: 'Snare',
  B: 'Bass',
};

export function createEmptyDrumCues(targetLength: number): DrumCues {
  return {
    C: ''.padEnd(targetLength, ' '),
    H: ''.padEnd(targetLength, ' '),
    R: ''.padEnd(targetLength, ' '),
    S: ''.padEnd(targetLength, ' '),
    B: ''.padEnd(targetLength, ' '),
  };
}

export function createLyricsLine(lyrics = ''): LyricsLine {
  return {
    lyrics,
    cues: {
      piano: ''.padEnd(lyrics.length, ' '),
      guitar: ''.padEnd(lyrics.length, ' '),
      drums: createEmptyDrumCues(lyrics.length),
    },
  };
}

export function clampTempo(value: number): number {
  if (Number.isNaN(value)) return 20;
  return Math.min(300, Math.max(20, value));
}

export function normalizeCueLine(rawValue: string, targetLength: number): string {
  if (rawValue.length >= targetLength) {
    return rawValue.slice(0, targetLength);
  }
  return rawValue.padEnd(targetLength, ' ');
}

export function normalizeDrumCues(rawValue: Partial<DrumCues>, targetLength: number): DrumCues {
  return {
    C: normalizeCueLine(rawValue.C ?? '', targetLength),
    H: normalizeCueLine(rawValue.H ?? '', targetLength),
    R: normalizeCueLine(rawValue.R ?? '', targetLength),
    S: normalizeCueLine(rawValue.S ?? '', targetLength),
    B: normalizeCueLine(rawValue.B ?? '', targetLength),
  };
}

export function splitLyricsText(value: string): string[] {
  return value === '' ? [] : value.split('\n');
}

export function syncCueLineToLyrics(previousLyrics: string, nextLyrics: string, previousCueLine: string): string {
  const normalizedPreviousCueLine = normalizeCueLine(previousCueLine, previousLyrics.length);

  let prefixLength = 0;
  while (
    prefixLength < previousLyrics.length &&
    prefixLength < nextLyrics.length &&
    previousLyrics[prefixLength] === nextLyrics[prefixLength]
  ) {
    prefixLength += 1;
  }

  let suffixLength = 0;
  while (
    suffixLength < previousLyrics.length - prefixLength &&
    suffixLength < nextLyrics.length - prefixLength &&
    previousLyrics[previousLyrics.length - 1 - suffixLength] === nextLyrics[nextLyrics.length - 1 - suffixLength]
  ) {
    suffixLength += 1;
  }

  const previousMiddleLength = previousLyrics.length - prefixLength - suffixLength;
  const nextMiddleLength = nextLyrics.length - prefixLength - suffixLength;
  const previousMiddleCueLine = normalizedPreviousCueLine.slice(prefixLength, prefixLength + previousMiddleLength);

  let nextMiddleCueLine = '';
  if (previousMiddleLength === nextMiddleLength) {
    nextMiddleCueLine = previousMiddleCueLine;
  } else if (nextMiddleLength > previousMiddleLength) {
    nextMiddleCueLine = previousMiddleCueLine + ' '.repeat(nextMiddleLength - previousMiddleLength);
  } else {
    nextMiddleCueLine = previousMiddleCueLine.slice(0, nextMiddleLength);
  }

  return [
    normalizedPreviousCueLine.slice(0, prefixLength),
    nextMiddleCueLine,
    normalizedPreviousCueLine.slice(previousLyrics.length - suffixLength),
  ].join('');
}

export function syncLyricsLine(previousLine: LyricsLine, nextLyrics: string): LyricsLine {
  return {
    lyrics: nextLyrics,
    cues: {
      piano: syncCueLineToLyrics(previousLine.lyrics, nextLyrics, previousLine.cues.piano),
      guitar: syncCueLineToLyrics(previousLine.lyrics, nextLyrics, previousLine.cues.guitar),
      drums: drumLaneOrder.reduce<DrumCues>((nextDrumCues, lane) => {
        nextDrumCues[lane] = syncCueLineToLyrics(previousLine.lyrics, nextLyrics, previousLine.cues.drums[lane]);
        return nextDrumCues;
      }, createEmptyDrumCues(nextLyrics.length)),
    },
  };
}

export function syncLyricsLines(previousLines: LyricsLine[], nextLyricsText: string): LyricsLine[] {
  const nextLyricsLines = splitLyricsText(nextLyricsText);

  let prefixLength = 0;
  while (
    prefixLength < previousLines.length &&
    prefixLength < nextLyricsLines.length &&
    previousLines[prefixLength].lyrics === nextLyricsLines[prefixLength]
  ) {
    prefixLength += 1;
  }

  let suffixLength = 0;
  while (
    suffixLength < previousLines.length - prefixLength &&
    suffixLength < nextLyricsLines.length - prefixLength &&
    previousLines[previousLines.length - 1 - suffixLength].lyrics ===
      nextLyricsLines[nextLyricsLines.length - 1 - suffixLength]
  ) {
    suffixLength += 1;
  }

  const previousMiddleLines = previousLines.slice(prefixLength, previousLines.length - suffixLength);
  const nextMiddleLines = nextLyricsLines
    .slice(prefixLength, nextLyricsLines.length - suffixLength)
    .map((lyrics, index) => {
      const previousLine = previousMiddleLines[index];
      if (!previousLine) {
        return createLyricsLine(lyrics);
      }
      return syncLyricsLine(previousLine, lyrics);
    });

  return [
    ...previousLines.slice(0, prefixLength),
    ...nextMiddleLines,
    ...previousLines.slice(previousLines.length - suffixLength),
  ];
}

export function flattenDrumCues(drumCues: DrumCues, targetLength: number): string {
  return Array.from({ length: targetLength }, (_, index) => {
    const visibleHit = drumLaneOrder
      .map((lane) => normalizeCueLine(drumCues[lane], targetLength)[index] ?? ' ')
      .find((character) => character !== ' ');

    return visibleHit ?? ' ';
  }).join('');
}

export function copyLineCues(line: LyricsLine, source: InstrumentType, target: InstrumentType): LyricsLine {
  if (source === target) {
    return line;
  }

  const targetLength = line.lyrics.length;

  if (source === 'drums') {
    const flattenedDrums = flattenDrumCues(line.cues.drums, targetLength);
    return {
      ...line,
      cues: {
        ...line.cues,
        [target]: target === 'drums' ? line.cues.drums : flattenedDrums,
      },
    };
  }

  const sourceCueLine = normalizeCueLine(line.cues[source], targetLength);

  if (target === 'drums') {
    return {
      ...line,
      cues: {
        ...line.cues,
        drums: drumLaneOrder.reduce<DrumCues>((nextDrumCues, lane) => {
          nextDrumCues[lane] = sourceCueLine;
          return nextDrumCues;
        }, createEmptyDrumCues(targetLength)),
      },
    };
  }

  return {
    ...line,
    cues: {
      ...line.cues,
      [target]: sourceCueLine,
    },
  };
}

export function copyLineCuesToAll(line: LyricsLine, source: InstrumentType): LyricsLine {
  const targets: InstrumentType[] = ['piano', 'guitar', 'drums'];

  return targets.reduce((nextLine, target) => copyLineCues(nextLine, source, target), line);
}

export function formatPreviewLine(line: LyricsLine, instrument: Exclude<InstrumentType, 'drums'>): string {
  if (line.lyrics.length === 0) {
    return '';
  }
  return `${normalizeCueLine(line.cues[instrument], line.lyrics.length)}\n${line.lyrics}`;
}
