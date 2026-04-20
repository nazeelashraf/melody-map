# Project Research Summary

**Project:** Melody Map
**Domain:** Frontend-only multi-instrument song arrangement editor
**Researched:** 2026-04-20
**Confidence:** HIGH

## Executive Summary

Melody Map is a browser-based SPA for creating song sheets that combine lyrics with piano, guitar, and drum arrangements, and assembling multiple sheets into compositions. The app is purely frontend — all data lives in the browser via localStorage, and JSON import/export is the primary sharing mechanism.

The recommended stack is React 18 + TypeScript + Vite + Zod. This is a well-understood, highly productive combination with excellent tooling. The main complexity is in the arrangement data model — the scope of what "arrangement" means for each instrument must be defined early to avoid refactoring later. Zod schemas should be the source of truth for all data shapes, and all JSON imports must be validated before touching app state.

## Key Findings

### Recommended Stack

**React 18 + TypeScript + Vite + Zod** is the recommended stack.

- React's component model maps well to the editor UI (sheet editor, instrument panels, composition list)
- TypeScript strict mode prevents data model bugs — critical for a data-centric app
- Vite provides fast HMR essential for a good editing UX
- Zod validates all JSON imports and provides static type inference from schemas

Supporting libraries: React Router DOM for SPA navigation, uuid for entity IDs, lodash for cloneDeep/debounce helpers.

### Expected Features

**Must have (table stakes):**
- Create/edit/delete sheets with title and tempo
- Edit lyrics with line-break preservation
- Edit chords/arrangement data per instrument (piano, guitar, drums)
- Local persistence (survives refresh) via localStorage
- JSON export (download) and JSON import (upload with Zod validation)
- Create/edit/delete compositions from multiple sheets
- Reorder sheets within a composition

**Should have (competitive):**
- Section markers (verse, chorus, bridge)
- Print-friendly CSS
- Dark mode

**Defer (v2+):**
- Audio playback
- MIDI import
- Collaborative editing
- Cloud sync

### Architecture Approach

Single-page React app with React Context + useReducer for state management per domain (SheetContext, CompositionContext). localStorage persistence via a custom `useLocalStorage` hook with debounced writes. Zod schemas define all data shapes — the schema IS the source of truth, not separate TypeScript types.

Key architectural decisions:
1. Each domain entity (Sheet, Composition) has its own context/reducer — avoid a single monolithic state object
2. Import pipeline: FileReader → JSON.parse → Zod validation → dispatch(ADD_SHEET)
3. Export pipeline: serialize from context state → create Blob → trigger download via anchor click
4. Instrument arrangement: section-based text blocks per instrument, not full notation — keeps v1 buildable

### Critical Pitfalls

1. **Unvalidated JSON import corrupting state** — Prevent with Zod validation on all imports
2. **localStorage race condition / data loss** — Prevent with debounced writes + synchronous save on critical actions
3. **Vague instrument data model** — Define Zod schema for arrangements before building components
4. **Overly complex nested state** — Keep flat; one reducer per entity domain
5. **No print styles** — Add @media print CSS early to avoid broken printouts

## Implications for Roadmap

### Phase 1: App Foundation
**Rationale:** Everything else depends on having a solid data model and persistence layer. No point building editors on a shaky foundation.
**Delivers:** Vite+React project scaffold, Zod schemas (Sheet, Composition, Instrument), localStorage persistence hook, basic routing (sheet list / sheet editor / composition editor)
**Avoids:** Pitfalls 1, 2, 3, 4

### Phase 2: Sheet Editor
**Rationale:** The core differentiator — editing lyrics and instrument arrangements. Must be complete before composition builder can be meaningful.
**Delivers:** Sheet editor UI with lyrics textarea, tempo input, chord input, piano/guitar/drums instrument panels, create/edit/delete sheet actions
**Implements:** SheetContext, SheetEditor components, instrument panels

### Phase 3: Composition Builder
**Rationale:** Compositions are built from sheets. Once sheet editing is solid, building the composition flow is straightforward.
**Delivers:** Composition list view, composition editor (add/remove/reorder sheets), view composition as ordered list of sheets
**Implements:** CompositionContext, CompositionEditor, drag-and-drop reorder

### Phase 4: Import/Export + Polish
**Rationale:** JSON import/export is a core constraint. Polish covers print styles and UX improvements discovered during earlier phases.
**Delivers:** JSON export (download .json), JSON import (file picker + Zod validation + error modal), print stylesheet, empty states, confirmation dialogs, dark mode (if time)
**Avoids:** Pitfall 5

### Phase Ordering Rationale

- **Phase 1 before everything** — foundation must be solid
- **Phase 2 before Phase 3** — can't build compositions without sheets to compose
- **Phase 4 last** — import/export is a constraint; polish is earned after core features work

### Research Flags

- **Phase 1:** Needs Zod schema design session — the arrangement shape is the biggest scope variable
- **Phase 2:** Instrument panel UI layout needs design thinking — how to show 3 instruments side-by-side without clutter
- **Phase 3:** Drag-and-drop reorder — well-documented pattern, minimal research needed
- **Phase 4:** Print CSS — browser print preview testing required, no additional research

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Well-established React + Vite + TypeScript + Zod stack |
| Features | HIGH | Domain is simple enough that features are clear |
| Architecture | HIGH | Reducer + Context + localStorage is a proven pattern |
| Pitfalls | MEDIUM | General web app pitfalls; domain-specific pitfalls are inferred |

**Overall confidence:** HIGH

### Gaps to Address

- **Arrangement data model:** The exact shape of piano/guitar/drums data (free text vs. structured sections) needs a quick decision before Phase 1 starts. A 10-minute design session resolves this.
- **UI layout for instrument panels:** Not researched — may need a sketch or wireframe before Phase 2 component work.

## Sources

### Primary (HIGH confidence)
- /websites/react_dev — React hooks, useState, useReducer, useEffect patterns
- /websites/vite_dev — Vite project setup, TypeScript config
- /websites/zod_dev — Zod schema validation, JSON parsing

### Secondary (MEDIUM confidence)
- Flat (flat.io) — music notation competitor analysis
- Ultimate Guitar — chord/tab site feature analysis

---
*Research completed: 2026-04-20*
*Ready for roadmap: yes*
