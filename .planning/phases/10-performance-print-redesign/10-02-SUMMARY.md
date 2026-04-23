---
phase: 10-performance-print-redesign
plan: 02
subsystem: ui
tags: [react, typescript, vitest, tailwindcss, shadcn]

requires:
  - phase: 10-01
    provides: PerformanceView component with reading-first layout, instrument tabs, and mono cue-line rendering

provides:
  - deriveGroupedChords utility for extracting chord labels and lyric positions from cue lines
  - GroupedChordLine renderer showing chords above lyric segments in lead-sheet format
  - Mono/Grouped view format toggle in PerformanceView header
  - Collapsible instrument-linked notes section with colored dot and left border

affects:
  - PerformanceView rendering behavior
  - Print stylesheet (grouped format may affect print layout)

tech-stack:
  added: [vitest]
  patterns: [TDD for utility functions, helper components co-located with main component]

key-files:
  created:
    - src/lib/lyrics-utils.test.ts
    - vitest.config.ts
  modified:
    - src/lib/lyrics-utils.ts
    - src/components/PerformanceView.tsx
    - package.json

key-decisions:
  - "Installed vitest to enable TDD test execution (was not present in project)"
  - "Extracted InstrumentTabContent sub-component to allow useState hooks per tab without violating Rules of Hooks"
  - "Used controlled Tabs (activeTab state) to conditionally hide view format toggle for percussion"

patterns-established:
  - "TDD workflow: RED (failing test commit) → GREEN (implementation commit) for utility functions"
  - "Co-located helper components inside main component file for tightly coupled rendering logic"

requirements-completed: [PERF-05]

metrics:
  duration: 12min
  completed: 2026-04-23
---

# Phase 10 Plan 02: Grouped Chord Format + Notes Summary

**Grouped lead-sheet chord renderer with mono/grouped view toggle and collapsible instrument-linked notes in PerformanceView**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-23T01:44:00Z
- **Completed:** 2026-04-23T01:50:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- `deriveGroupedChords` utility extracts chord names and lyric positions from cue lines using `normalizeCueLine`
- PerformanceView defaults to grouped chord format with chords rendered above lyric segments
- Users can toggle between mono cue-line view and grouped chord view via segmented control
- Notes section is now a collapsible disclosure with instrument-colored dot and left border
- Notes are completely hidden when an instrument has no arrangement content
- Percussion tab preserves stacked lane view and hides the format toggle

## Task Commits

Each task was committed atomically:

1. **Task 1: Add grouped chord derivation utility**
   - RED: `be3e402` — test(10-02): add failing test for deriveGroupedChords
   - GREEN: `751e683` — feat(10-02): implement deriveGroupedChords utility

2. **Task 2: Implement grouped chord renderer, view toggle, and notes section**
   - `fa051e4` — feat(10-02): grouped chord renderer, view toggle, and notes section

**Plan metadata:** (to be committed with SUMMARY.md)

## Files Created/Modified

- `src/lib/lyrics-utils.ts` — Added `GroupedChord` interface and `deriveGroupedChords` function
- `src/lib/lyrics-utils.test.ts` — 5 test cases for chord extraction (multi-chord, offset, empty, single, short chords)
- `src/components/PerformanceView.tsx` — Added `GroupedChordLine`, view format toggle, collapsible notes, `InstrumentTabContent` sub-component
- `package.json` — Added `test` script for vitest
- `vitest.config.ts` — Vitest configuration with node environment and path aliases

## Decisions Made

- **Installed vitest** because the project had no test runner. Necessary to execute the TDD task.
- **Extracted `InstrumentTabContent` sub-component** to allow per-tab `notesOpen` state without violating React Rules of Hooks (cannot call hooks inside `.map()` callbacks).
- **Used controlled Tabs pattern** (`activeTab` state + `onValueChange`) to conditionally hide the view format toggle when percussion is active.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed vitest test runner**
- **Found during:** Task 1 (TDD test execution)
- **Issue:** Project had no test framework installed; `npm test` and `npx vitest` were unavailable
- **Fix:** Ran `npm install -D vitest`, added `test` script to `package.json`, created `vitest.config.ts`
- **Files modified:** `package.json`, `vitest.config.ts`
- **Verification:** Tests run and pass via `npx vitest run src/lib/lyrics-utils.test.ts`
- **Committed in:** `be3e402` (RED phase commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minimal — test infrastructure was implicitly required by the TDD task. No scope creep.

## Issues Encountered

- None beyond the missing vitest dependency, which was resolved immediately.

## TDD Gate Compliance

✅ RED gate: `test(10-02): add failing test for deriveGroupedChords` commit exists (`be3e402`)
✅ GREEN gate: `feat(10-02): implement deriveGroupedChords` commit exists after RED (`751e683`)
✅ Tests pass: 5/5 tests passing in `src/lib/lyrics-utils.test.ts`

## Known Stubs

None — all functionality is fully implemented.

## Threat Flags

None — no new security-relevant surface introduced. `deriveGroupedChords` operates on client-side data only; `GroupedChordLine` handles empty chords safely with no infinite loops.

## Next Phase Readiness

- PerformanceView now supports both mono and grouped formats
- Print stylesheet may need updates to preserve grouped format readability
- Ready for Phase 10 Plan 03 (Print stylesheet redesign)

---
*Phase: 10-performance-print-redesign*
*Completed: 2026-04-23*
