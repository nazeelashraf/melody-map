---
phase: 12-before-phase-11-can-be-phase-12-out-of-order-i-need-to-allow
plan: 01
subsystem: ui
tags: [typescript, vitest, cue-transposition, lyrics-alignment]

requires: []

provides:
  - transposeChordToken utility for sharp-based semitone shifting
  - transposeCueLinePreservingColumns utility for fixed-column token rewriting
  - transposeLyricsLinesForInstrument utility for schema-safe line expansion

affects:
  - src/components/SheetEditor.tsx

tech-stack:
  added: []
  patterns:
    - fixed-column cue reconstruction from token start indices
    - schema-safe padding of lyrics and all cue fields when transposed chords grow
    - focused Vitest coverage for transposition helpers

key-files:
  created: []
  modified:
    - src/lib/lyrics-utils.ts
    - src/lib/lyrics-utils.test.ts

requirements-completed: [TRNS-01, TRNS-02, TRNS-03]

metrics:
  completed: 2026-04-24
---

# Phase 12 Plan 01 Summary

Implemented the transposition utility layer needed for in-place cue rewriting.

## Accomplishments

- Added `transposeChordToken` with the requested sharp-only semitone lookup
- Added `transposeCueLinePreservingColumns` so chord starts remain anchored to their original lyric columns
- Added `transposeLyricsLinesForInstrument` to expand `lyrics`, the non-selected cue line, and all drum lanes when a transposed chord grows
- Added focused tests for recognized roots, suffix preservation, unknown-token passthrough, fixed-column output, and overflow padding

## Verification

- `npx vitest run src/lib/lyrics-utils.test.ts`

## Files Modified

- `src/lib/lyrics-utils.ts`
- `src/lib/lyrics-utils.test.ts`

---
*Phase: 12-before-phase-11-can-be-phase-12-out-of-order-i-need-to-allow*
*Completed: 2026-04-24*
