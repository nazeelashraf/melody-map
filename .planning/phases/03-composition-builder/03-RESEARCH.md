# Phase 3 Research: Composition Builder

**Phase:** 3 — Composition Builder
**Researched:** 2026-04-20
**Confidence:** HIGH
**Scope:** Create, edit, delete, view, and reorder compositions built from existing sheets in a frontend-only React app.

## Standard Stack

- Reuse the existing stack already in the repo: React 18, TypeScript 5, React Router DOM 7, Zod 3.24, Vite 5.
- Reuse `SheetContext` and `CompositionContext`; do not introduce backend, database, or async data layers.
- Keep persistence through the existing `useLocalStorage` hook and reducer-driven contexts.

## Existing Codebase Patterns To Reuse

### State
- `src/context/SheetContext.tsx` and `src/context/CompositionContext.tsx` already use `useReducer` + action wrappers.
- Current composition shape is `Composition { id, title, sheetIds }`; this is sufficient for ordered composition membership.

### Routing
- `src/App.tsx` already routes `/` to the home view and `/composition/:id` to a composition editor placeholder.
- The composition phase should replace the placeholder editor and expose composition list access from the home route.

### UI Style
- Existing components use inline `React.CSSProperties`, rounded cards, and simple action buttons.
- `SheetList.tsx` and `SheetCard.tsx` are the closest analogs for composition list/create/rename/delete flows.
- `SheetEditor.tsx` is the closest analog for page-level editing layout with a back link, card sections, and empty states.

## Recommended Implementation Approach

### 1. Extend CompositionContext Instead Of Creating Parallel State
Add reducer actions and wrapped helpers for composition-specific editing:
- add sheet ID to composition
- remove sheet ID from composition
- reorder sheet IDs within a composition

This keeps composition ordering as the source of truth and preserves localStorage persistence automatically.

### 2. Build Composition List On The Home Route
Add a dedicated `CompositionList` component and render it from the home view alongside the existing sheet list, rather than creating a new top-level route. This matches the current route contract in `AGENTS.md`:
- `/` — home
- `/sheet/:id` — sheet editor
- `/composition/:id` — composition editor

### 3. Use Up/Down Reorder Controls As The Baseline For COMP-04
Requirement `COMP-04` explicitly allows “drag-and-drop or up/down controls.”

Recommendation: implement deterministic up/down buttons first and make them the required workflow for this phase because:
- no extra dependency is needed
- verification is simpler and faster
- it fits the current lightweight frontend-only architecture
- it avoids introducing a UI contract decision before `UI-SPEC.md` exists

If a later UI spec requires drag-and-drop, `@dnd-kit` is the best-supported React option for sortable lists. Context7 docs confirm the core pieces are `DndContext`, `SortableContext`, `useSortable`, and array reordering helpers with pointer/keyboard sensors. Do not add it unless the UI contract requires it.

### 4. Prevent Invalid Composition Membership In The Picker
The sheet picker should:
- list existing sheets from `SheetContext`
- disable or hide sheets already present in the active composition
- support empty state when there are no sheets to add

This prevents duplicate sheet IDs unless duplicates are explicitly desired later. No source artifact requires duplicates, so treat a composition as an ordered list of unique sheet references.

## Architecture Patterns

### Pattern: Vertical Slice By User Flow
Plan and implement in this order:
1. context actions for add/remove/reorder/rename/delete compositions
2. home-list UI for create/open/delete compositions
3. composition editor with picker and ordered sheet list

This keeps each slice testable from the user perspective.

### Pattern: Derive Display Data At Render Time
Store only `sheetIds` in `Composition`. In UI, join against `SheetContext.state.sheets` to render title, tempo, and counts. Do not denormalize sheet titles into composition state.

### Pattern: Empty States Everywhere
Composition UX needs explicit empty states for:
- no compositions on home view
- no sheets in current composition
- no available sheets to add in picker
- composition not found by route ID

## Don’t Hand-Roll / Don’t Do

- Do not add backend APIs, IndexedDB, or server persistence.
- Do not call `localStorage` directly inside reducers.
- Do not create a second composition data model separate from the existing `Composition` type/schema.
- Do not denormalize full `Sheet` objects into compositions; store IDs only.
- Do not introduce drag-and-drop libraries unless the missing `UI-SPEC.md` later demands it.

## Common Pitfalls

1. **Home route loses sheet management** — adding compositions must not break existing sheet list actions on `/`.
2. **Composition references deleted sheets** — editor should gracefully handle missing referenced sheet IDs and allow removal.
3. **Duplicate sheet entries** — picker should prevent adding the same sheet twice.
4. **Reorder buttons mutate wrong indexes** — reducer/helper should no-op when moving first item up or last item down.
5. **Placeholder route left in place** — `src/App.tsx` must wire the real `CompositionEditor` component.

## Files Likely In Scope

- `src/context/CompositionContext.tsx`
- `src/components/CompositionList.tsx`
- `src/components/CompositionEditor.tsx`
- `src/components/SheetPicker.tsx`
- `src/components/CompositionSheetItem.tsx`
- `src/components/SheetList.tsx`
- `src/App.tsx`

## Verification Guidance

Use repo-native checks:
- `npm run typecheck`
- `npm run build`

Manual/functional checks the eventual plans should cover:
- create a composition from home
- open `/composition/:id`
- add existing sheets to the composition
- remove a sheet
- move a sheet up/down and verify order persists after refresh
- rename and delete a composition

## Source Audit Inputs For Planning

### GOAL
- Create and manage compositions made from multiple sheets.

### REQUIREMENTS
- `COMP-01` create composition with title
- `COMP-02` add existing sheets to a composition
- `COMP-03` remove sheets from a composition
- `COMP-04` reorder sheets within a composition
- `COMP-05` view ordered list of sheets in a composition
- `COMP-06` rename a composition
- `COMP-07` delete a composition with confirmation dialog
- persistence criteria in roadmap success criteria rely on existing localStorage pattern

### RESEARCH DECISIONS FOR THIS PHASE
- Reuse current reducer/context architecture.
- Keep `Composition.sheetIds` as the only ordering source of truth.
- Implement reorder with up/down controls for this phase baseline.
- Surface compositions from the home route rather than adding a new root route.

---

*Ready for planning once UI design gate is satisfied or explicitly skipped.*
