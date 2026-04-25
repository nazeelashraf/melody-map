---
phase: 12-before-phase-11-can-be-phase-12-out-of-order-i-need-to-allow
plan: 02
subsystem: ui
tags: [react, typescript, sheet-editor, transpose-controls]

requires:
  - phase: 12-01
    provides: transposition helpers for fixed-column cue rewriting

provides:
  - editor transpose controls for piano and guitar
  - in-place batch transposition through existing sheet update flow
  - percussion-specific messaging that blocks transpose actions for drums

affects:
  - src/components/SheetEditor.tsx

tech-stack:
  added: []
  patterns:
    - local semitone selection state reset after apply
    - guarded batch updates for chorded instruments only

key-files:
  created: []
  modified:
    - src/components/SheetEditor.tsx

requirements-completed: [TRNS-01, TRNS-04]

metrics:
  completed: 2026-04-24
---

# Phase 12 Plan 02 Summary

Wired Phase 12 into the normal sheet editing flow.

## Accomplishments

- Added a compact `Transpose` semitone selector with values `-11` through `11`
- Added `Apply to Piano` / `Apply to Guitar` action text based on the current editor instrument
- Hid transpose actions for percussion and replaced them with `Percussion cues are not transposed.` helper text
- Applied transposition through `updateLyricsLines(transposeLyricsLinesForInstrument(...))` and reset the selector to `0` after each apply

## Verification

- `npm run typecheck`
- `npx vitest run src/lib/lyrics-utils.test.ts`

## Files Modified

- `src/components/SheetEditor.tsx`

---
*Phase: 12-before-phase-11-can-be-phase-12-out-of-order-i-need-to-allow*
*Completed: 2026-04-24*
