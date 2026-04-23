---
phase: 10-performance-print-redesign
plan: 03
subsystem: ui
tags: [css, print, tailwind, typography, page-break]

requires:
  - phase: 10-performance-print-redesign
    plan: 02
    provides: "PerformanceView with activeTab state, grouped chords, collapsible notes"

provides:
  - Purposeful print stylesheet with selective hiding and readable typography
  - Print-only header metadata (title, tempo, active instrument) in PerformanceView
  - Page-break rules preventing cue+lyric blocks from splitting across pages
  - Print-only expanded notes section alongside screen-only collapsible notes
  - Print typography classes (print-title, print-lyric-line, print-chord-label, print-mono-cue, print-lane-label)

affects:
  - PerformanceView print rendering
  - Sheet editor print preview
  - Any future components using data-print-hide or print-* classes

tech-stack:
  added: []
  patterns:
    - "Selective print hiding via data-print-hide attribute instead of broad element selectors"
    - "Dual screen/print content blocks using Tailwind print: variants"
    - "Page-break-inside: avoid on lyric blocks for readable print output"

key-files:
  created: []
  modified:
    - src/styles/print.css
    - src/components/PerformanceView.tsx

key-decisions:
  - "Used data-print-hide attribute selector in CSS instead of broad button/input/textarea/a selectors to avoid hiding meaningful text like links"
  - "Placed print-only header as sibling to Tabs (not inside scrollable content) so it appears at top of printed page"
  - "Split notes into two blocks: screen-only collapsible with print:hidden, and print-only always-expanded with data-print-notes-content"
  - "Leveraged existing activeTab controlled state to show active instrument name in print header without adding new state"

patterns-established:
  - "Print classes: prefix component classes with print- for print-specific styling"
  - "Print attributes: use data-print-hide, data-print-notes-toggle, data-print-notes-content for print-aware elements"
  - "Tailwind print variants: use hidden print:block and print:hidden for conditional visibility"

requirements-completed:
  - PRNT-01

duration: 3min
completed: 2026-04-23
---

# Phase 10 Plan 03: Purposeful Print Stylesheet Summary

**Purposeful print layout with selective hiding, readable typography, page-break rules, and expanded instrument notes for clean paper output**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-23T04:54:28Z
- **Completed:** 2026-04-23T04:57:45Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Replaced broad hide-all print.css with purposeful @page margins, print typography classes, and cross-browser page-break rules
- Added print-only header metadata block to PerformanceView showing sheet title, tempo BPM, and active instrument name
- Wrapped all lyric/cue line blocks in `print-lyric-block` class to prevent page breaks mid-block
- Split notes section into screen-only collapsible (with `data-print-notes-toggle` and `print:hidden`) and print-only always-expanded (with `data-print-notes-content` and `print-notes-block`)
- Applied print typography classes (`print-chord-label`, `print-lyric-line`, `print-mono-cue`, `print-lane-label`) to all content elements
- Hidden interactive controls (Back to edit, view format toggle, tab list) via `data-print-hide` attribute

## Task Commits

1. **Task 1: Create purposeful print stylesheet** - `927909f` (feat)
2. **Task 2: Add print classes and print-only elements to PerformanceView** - `927909f` (feat)

**Plan metadata:** `927909f` (docs: complete plan)

## Files Created/Modified

- `src/styles/print.css` - Replaced broad hide-all approach with purposeful @page margins, selective hiding via data-print-hide, print typography classes, and page-break rules
- `src/components/PerformanceView.tsx` - Added print-only header metadata, print classes on lyric/cue blocks, dual screen/print notes sections, and data-print-hide on interactive controls

## Decisions Made

- **Selective hiding over broad selectors:** The old CSS used `button, input, textarea, a { display: none !important; }` which could hide meaningful text. The new approach only hides elements explicitly marked with `data-print-hide` or `.no-print`, plus shell chrome via `[data-sidebar]` and `[data-topbar]`.
- **Print-only header placement:** Placed the `hidden print:block` header as a sibling to the `Tabs` component (not inside the scrollable content area) so it renders at the very top of the printed page.
- **Dual notes blocks:** Instead of trying to override collapsible behavior with CSS alone, created separate DOM branches for screen and print notes. This is more robust and avoids CSS specificity battles.
- **Leveraged existing activeTab state:** The print header shows the active instrument name using the already-existing `activeTab` state from Plan 10-02. No new state was needed.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Print stylesheet is complete and purposeful
- PerformanceView renders cleanly on paper with readable typography
- Ready for Phase 11 — Responsive + Motion Polish

---

*Phase: 10-performance-print-redesign*
*Completed: 2026-04-23*
