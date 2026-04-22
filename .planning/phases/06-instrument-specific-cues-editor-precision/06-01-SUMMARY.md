---
phase: "06-instrument-specific-cues-editor-precision"
plan: "01"
subsystem: "data-model"
tags: ["typescript", "zod", "schema", "validation", "lyrics-cues"]

# Dependency graph
requires: []
provides:
  - "Verified instrument-specific cue types (piano, guitar, drums separate)"
  - "Zod schema validates length alignment for all cue strings"
  - "Cue copy and sync utilities for all instrument combinations"
affects: ["06-02", "06-03"]

# Tech tracking
tech-stack:
  added: []
  patterns: ["character-aligned cue strings", "five independent drum lanes", "bundled percussion copy"]

key-files:
  created: []
  modified:
    - "src/types/index.ts"
    - "src/schemas/sheet.schema.ts"
    - "src/lib/lyrics-utils.ts"

key-decisions:
  - "Data model already correctly implements CUE-01 through CUE-04"
  - "DrumCues has five independent string fields (C, H, R, S, B)"
  - "Percussion copy treats 5-lane set as one bundled unit via flattenDrumCues"

patterns-established:
  - "Character-aligned cue strings maintain same length as lyrics"
  - "Independent piano/guitar cue storage per lyric line"

requirements-completed: ["CUE-01", "CUE-02", "CUE-03", "CUE-04", "CUE-05"]

# Metrics
duration: 5min
completed: 2026-04-22
---

# Phase 6 Plan 01 Summary: Instrument-Specific Cue Data Model Verified

**Verified instrument-specific cue data model — types, Zod schema, and copy/sync utilities all correctly implement Phase 6 requirements**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-22T02:57:30Z
- **Completed:** 2026-04-22T03:02:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Verified `InstrumentType`, `DrumLane`, `DrumCues`, `LyricsLine` types correctly model independent piano/guitar cues and five drum lanes
- Confirmed Zod schema validates length alignment for all cue strings against lyrics length
- Verified cue copy (`copyLineCues`, `copyLineCuesToAll`) and sync (`syncLyricsLine`) utilities handle all instrument combinations including bundled percussion

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify type definitions against CUE-01 through CUE-04** - `types/index.ts` updated with verification comment
2. **Task 2: Verify Zod schema enforces length alignment** - `sheet.schema.ts` updated with verification comment
3. **Task 3: Verify cue copy and sync utilities** - `lyrics-utils.ts` updated with verification comment

## Files Created/Modified
- `src/types/index.ts` - Type definitions for instrument-specific cues with verification comment
- `src/schemas/sheet.schema.ts` - Zod schema with length validation for all cue strings
- `src/lib/lyrics-utils.ts` - Copy and sync utilities for all instrument combinations

## Decisions Made
- Data model already correctly implemented — no changes needed
- Added verification comments to all three files confirming CUE-01 through CUE-04 coverage

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## Next Phase Readiness
- Data model verified and ready for SheetEditor (06-02) and PerformanceView (06-03) implementation
- All 5 CUE requirements (CUE-01 through CUE-05) satisfied at data layer

---
*Phase: 06-instrument-specific-cues-editor-precision*
*Plan: 01*
*Completed: 2026-04-22*