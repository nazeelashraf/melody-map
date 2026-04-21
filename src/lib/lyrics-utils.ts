import type { LyricsLine } from '../types';

export function createLyricsLine(lyrics = ''): LyricsLine {
  return { lyrics, chords: ''.padEnd(lyrics.length, ' ') };
}

export function clampTempo(value: number): number {
  if (Number.isNaN(value)) return 20;
  return Math.min(300, Math.max(20, value));
}

export function normalizeChordLine(rawValue: string, targetLength: number): string {
  if (rawValue.length >= targetLength) {
    return rawValue.slice(0, targetLength);
  }
  return rawValue.padEnd(targetLength, ' ');
}

export function splitLyricsText(value: string): string[] {
  return value === '' ? [] : value.split('\n');
}

export function syncChordsToLyrics(previousLyrics: string, nextLyrics: string, previousChords: string): string {
  const normalizedPreviousChords = normalizeChordLine(previousChords, previousLyrics.length);

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
  const previousMiddleChords = normalizedPreviousChords.slice(prefixLength, prefixLength + previousMiddleLength);

  let nextMiddleChords = '';
  if (previousMiddleLength === nextMiddleLength) {
    nextMiddleChords = previousMiddleChords;
  } else if (nextMiddleLength > previousMiddleLength) {
    nextMiddleChords = previousMiddleChords + ' '.repeat(nextMiddleLength - previousMiddleLength);
  } else {
    nextMiddleChords = previousMiddleChords.slice(0, nextMiddleLength);
  }

  return [
    normalizedPreviousChords.slice(0, prefixLength),
    nextMiddleChords,
    normalizedPreviousChords.slice(previousLyrics.length - suffixLength),
  ].join('');
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
      return {
        lyrics,
        chords: syncChordsToLyrics(previousLine.lyrics, lyrics, previousLine.chords),
      };
    });

  return [
    ...previousLines.slice(0, prefixLength),
    ...nextMiddleLines,
    ...previousLines.slice(previousLines.length - suffixLength),
  ];
}

export function formatPreviewLine(line: LyricsLine): string {
  if (line.lyrics.length === 0) {
    return '';
  }
  return `${normalizeChordLine(line.chords, line.lyrics.length)}\n${line.lyrics}`;
}
