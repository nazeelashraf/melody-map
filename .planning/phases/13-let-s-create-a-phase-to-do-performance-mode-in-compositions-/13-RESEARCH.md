# Phase 13 Research — Composition Performance Mode

**Phase:** 13
**Date:** 2026-04-24
**Status:** Complete
**Discovery Level:** 1 — quick verification

## Goal

Research how to add a composition-level performance mode that reuses Melody Map's existing sheet performance patterns while rendering multiple sheets in composition order with clear visual breaks between songs.

## Existing Codebase Constraints

- `src/components/PerformanceView.tsx` already delivers the reading-first performance surface for a single `Sheet`, including instrument tabs, grouped/mono cue rendering, print-aware markup, and shell recession behavior.
- `src/components/CompositionEditor.tsx` already resolves ordered composition entries from `composition.sheetIds` against `SheetContext`, including missing-sheet detection.
- `src/context/CompositionContext.tsx` stores only `sheetIds`, so composition performance mode must read the live sheet objects from `SheetContext` at render time rather than persisting duplicated sheet snapshots.
- `src/App.tsx` currently exposes `/composition/:id` only; a dedicated performance route or equivalent navigation path is required.
- The app is frontend-only with localStorage persistence, so composition performance mode must remain purely client-side and derive all display state from current in-memory sheet/composition data.

## Research Findings

### 1. Reuse the existing sheet performance surface instead of inventing a second renderer

Phase 10 already established the visual and interaction contract for performance reading: minimal chrome, large readable cues/lyrics, instrument tabs, grouped/mono chord rendering, and print-aware sections. The safest path is to reuse those established rendering patterns for each sheet in a composition instead of introducing a second performance design system.

That means the new work should share these behaviors with single-sheet performance mode:

- reading-first typography and spacing
- piano/guitar grouped-or-mono rendering
- percussion lane rendering
- arrangement notes display per instrument
- shell recession / reduced chrome while in performance mode

### 2. Composition order should come from `composition.sheetIds` joined against live sheet state

`CompositionEditor` already uses the right data-join pattern:

1. read the target composition from `CompositionContext`
2. map `composition.sheetIds` in order
3. resolve each id against `sheetState.sheets`

The performance view should use the same pattern so it always reflects the current library state and preserves the user-defined order.

### 3. Missing sheets need explicit handling, not silent omission

Because compositions store ids only, some entries can resolve to missing sheets. `CompositionEditor` already surfaces this state. Composition performance mode should also show a visible placeholder or warning block for missing entries rather than silently skipping them, otherwise the user can lose track of why the performance order looks incomplete.

### 4. Sheet separation should be structural and visually obvious

The roadmap requires clear breaks between sheets. The best implementation shape is a per-sheet section wrapper that provides:

- a labeled boundary (`Sheet 1`, sheet title, tempo)
- generous top/bottom spacing between sections
- a divider or bordered card break that remains obvious on screen and in print
- a page-break-friendly wrapper so one sheet's content does not visually blend into the next

This should be a real structural wrapper around each rendered sheet, not just extra blank space.

### 5. Route-level composition performance mode fits current app patterns

React Router's standard dynamic route pattern (`/composition/:id/...` with `useParams`) fits the current `BrowserRouter` app structure and matches the existing `/sheet/:id` and `/composition/:id` pages. A dedicated route such as `/composition/:id/performance` is the cleanest fit because it keeps edit mode and performance mode as separate reading contexts instead of overloading `CompositionEditor` with a second large surface.[^react-router]

### 6. No new dependency is needed

This feature is composed from existing React Router, context state, and current performance rendering utilities. No external library or service is required.

## Recommended Implementation Shape

### Route + composition container layer

Add a dedicated composition performance page/component that:

- reads `compositionId` from the route
- resolves the composition from `CompositionContext`
- resolves ordered sheet entries from `SheetContext`
- provides a back-to-edit affordance to `/composition/:id`
- toggles the same body-level performance mode chrome treatment used by `PerformanceView`

### Shared performance rendering layer

Extract or reuse the sheet-performance rendering block so composition mode can render the same instrument-specific content for each sheet without duplicating formatting logic. The composition surface should keep one active instrument context across the full composition so the musician reads the whole set consistently.

### Composition section wrapper

For each ordered composition entry, render:

- section index
- sheet title
- tempo
- sheet performance content
- clear section break before the next sheet

If an entry points to a missing sheet, render a warning section in the same slot.

## Risks / Pitfalls

- **Do not duplicate sheet data into compositions.** Resolve live sheets from `SheetContext` each render.
- **Do not create a separate instrument-selection model per sheet.** Composition performance mode should keep one active instrument context across the collated view unless a source decision later says otherwise.
- **Do not silently drop missing sheets.** Preserve order and show missing placeholders.
- **Do not diverge visually from Phase 10 performance mode.** Reuse established reading-first patterns.
- **Do not bury sheet separators in subtle styling.** The boundary must remain obvious during live use and print.

## Verification Targets

- `npm run typecheck` passes after route and component wiring.
- `npm run build` passes with the new composition performance route.
- Manual verification confirms a composition renders sheets in stored order with clear breaks and missing-sheet placeholders.

## Recommendation

Plan this as two waves:

1. **Wave 1:** create the composition performance route/container and extract any shared single-sheet performance rendering needed for reuse.
2. **Wave 2:** wire composition editor navigation plus separator, missing-entry, and verification polish.

This phase is UI-facing, so a `UI-SPEC.md` should be created before planning unless the user explicitly bypasses the UI gate.

[^react-router]: React Router route parameters are defined with dynamic segments like `/composition/:id/performance` and consumed with `useParams` in component-based BrowserRouter apps.
