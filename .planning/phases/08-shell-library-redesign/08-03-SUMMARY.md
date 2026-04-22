---
phase: 08-shell-library-redesign
plan: 03
subsystem: ui
tags: [react, tailwindcss, lucide-react, shadcn, design-tokens]

requires:
  - phase: 08-shell-library-redesign
    plan: 01
    provides: AppLayout with warm-canvas/dark-shell zoning, Sidebar, TopBar
  - phase: 08-shell-library-redesign
    plan: 02
    provides: ConfirmDialog, ImportDialog, EmptyState shared primitives

provides:
  - Redesigned SheetCard with instrument identity hints, metadata icons, and accent actions
  - Redesigned CompositionCard with sheet count, title preview, and order visualization
  - Redesigned SheetList with cohesive header, grouped action bar, and responsive grid

affects:
  - Phase 9 — Sheet Canvas Redesign
  - Phase 10 — Performance + Print Redesign

tech-stack:
  added: []
  patterns:
    - Card-based visual language with bg-card, border-border, shadow-sm hover:shadow-md
    - Instrument color tokens (text-piano, text-guitar, text-drums) for identity hints
    - Grouped action bar with outline imports and accent creates
    - Responsive grid with 1→2→3→4 column breakpoints

key-files:
  created: []
  modified:
    - src/components/SheetCard.tsx
    - src/components/CompositionCard.tsx
    - src/components/SheetList.tsx

key-decisions:
  - "Used text-piano/text-guitar/text-drums color tokens for instrument labels alongside colored dots for scannability"
  - "Added useSheet() hook inside CompositionCard to resolve sheet titles for mini preview (acceptable since both contexts are always mounted under AppLayout)"
  - "Kept ArrowRight removed in favor of text 'Open' button with bg-accent for clearer primary action affordance"

patterns-established:
  - "Card container pattern: bg-card border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-border/80"
  - "Title row pattern: flex with accent icon + text-lg font-semibold + group-hover pencil icon"
  - "Bottom action bar pattern: right-aligned ghost delete + accent open button"
  - "Instrument hint pattern: colored dot + label using instrument-specific color tokens, only shown for non-empty arrangements"

requirements-completed: [LIB-01, UI-01, RESP-01]

duration: 18min
completed: 2026-04-22
---

# Phase 8 Plan 3: Library Components Redesign Summary

**Redesigned library cards and list view with instrument identity hints, sheet order visualization, and a responsive grid using Phase 7 design tokens**

## Performance

- **Duration:** 18 min
- **Started:** 2026-04-22T04:50:00Z
- **Completed:** 2026-04-22T05:08:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- SheetCard now displays title with Music icon, tempo/lines metadata with Clock and AlignLeft icons, and colored instrument dots for non-empty arrangements
- CompositionCard now shows sheet count, a mini preview of first 2–3 sheet titles, and a subtle dot sequence visualizing sheet order
- SheetList page has a cleaner "Song Library" header, grouped import/create action buttons with icons, card-styled create form with animation, and a responsive grid with increased spacing

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign SheetCard with clearer hierarchy and instrument identity** — `b2943e1` (feat)
2. **Task 2: Redesign CompositionCard with sheet count and preview** — `083ba4f` (feat)
3. **Task 3: Redesign SheetList page layout with cohesive header and responsive grid** — `cd39a88` (feat)

**Plan metadata:** `TBD` (docs: complete plan)

## Files Created/Modified

- `src/components/SheetCard.tsx` — Redesigned card with instrument identity hints, metadata icons, accent open button, and ghost delete with destructive hover
- `src/components/CompositionCard.tsx` — Redesigned card with sheet count, title preview, order dot visualization, and consistent action styling
- `src/components/SheetList.tsx` — Redesigned library page with cleaner header, grouped action bar, card-styled create form, and responsive grid

## Decisions Made

- **Used text-piano/text-guitar/text-drums color tokens for instrument labels** alongside colored dots so users can scan instrument coverage at a glance. The tokens were already defined in `index.css` but unused in components until now.
- **Added `useSheet()` hook inside CompositionCard** to resolve sheet titles for the mini preview. Both SheetProvider and CompositionProvider are always mounted under AppLayout, so this cross-context read is safe and doesn't require prop changes.
- **Replaced ArrowRight icon with "Open" text button** using `bg-accent` styling. This makes the primary action more scannable and consistent with the design system's emphasis on clear labels over icon-only actions.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

None.

## Threat Flags

None - no new trust boundaries, network endpoints, or auth paths introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Library redesign is complete and consistent with the shell redesign from Plans 1 and 2
- Ready for Phase 9 — Sheet Canvas Redesign
- Ready for Phase 10 — Performance + Print Redesign

## Self-Check: PASSED

- [x] `src/components/SheetCard.tsx` exists and compiles
- [x] `src/components/CompositionCard.tsx` exists and compiles
- [x] `src/components/SheetList.tsx` exists and compiles
- [x] Commit `b2943e1` exists
- [x] Commit `083ba4f` exists
- [x] Commit `cd39a88` exists

---
*Phase: 08-shell-library-redesign*
*Completed: 2026-04-22*
