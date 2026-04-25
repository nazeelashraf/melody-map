# Melody Map

## What This Is

A frontend-only web app for creating and editing song sheets that combine lyrics with instrument arrangements for piano, guitar, and drums. Users can build individual sheets for a song, edit musical details like chords and tempo, and assemble multiple sheets into larger compositions.

## Core Value

A musician can quickly create, edit, and organize multi-instrument song sheets with lyrics — no account, no backend, just the browser.

## Requirements

### Validated

- [x] Create a sheet for a single song with title and tempo
- [x] Edit lyrics for a sheet with preserved verse structure
- [x] Add and edit instrument-specific cue markers above aligned lyric positions
- [x] Add and edit arrangement notes for piano, guitar, and drums
- [x] Edit tempo for a sheet
- [x] Create and rename compositions that combine multiple sheets in order
- [x] Add, remove, and reorder sheets within a composition
- [x] Changes persist locally in the browser between sessions
- [x] Export any sheet or composition as JSON
- [x] Import sheets and compositions from JSON with Zod validation
- [x] Delete actions show a confirmation dialog
- [x] Print stylesheet hides UI chrome and shows readable content
- [x] Toggle dark mode with persistence across sessions

### Active

- Redesign the visual system around a warm-canvas / dark-shell split with semantic tokens
- Implement typography hierarchy: Inter Variable for UI, monospace for notation
- Establish instrument identity colors (stable pastel mapping for piano, guitar, drums)
- Redesign focus and selection states (dashed violet selection, solid violet focus)
- Rebuild app shell, library, sheet editor, performance view, and print output to match DESIGN.md
- Preserve existing dark-mode toggle while both themes share the new design language
- Preserve Phase 6 instrument-specific cue editing capabilities
- Add in-place semitone transposition for piano and guitar cue lines without breaking lyric alignment

### Out of Scope

- Backend, authentication, or cloud sync — frontend-only for v1
- Real-time collaboration — single-user workflow (collaboration motifs are visual-only)
- Audio playback or music generation — visual arranger only
- PDF export or professional music engraving
- Multi-user or sharing features
- Data model changes to cues, sheets, or compositions
- New instruments beyond piano, guitar, and drums
- Audio/metronome, key-signature, and section-marker feature work

## Context

- Purely frontend, browser-based — no server required
- Single-page application (SPA) architecture
- Local-first: all data lives in browser storage (localStorage)
- JSON import/export as the primary sharing/backup mechanism
- Initial instrument set: piano, guitar, drums — extendable architecture

### Arrangement Data Model

**Lyrics are the root.** Each lyric line has instrument-specific cue lines above it. Piano and guitar use character-aligned monospace cue strings. Percussion uses multiple character-aligned lanes for hit markers.

**How it works:**
- Piano and guitar each keep their own cue line aligned to the lyric text
- Percussion keeps multiple named lanes (`C`, `H`, `R`, `S`, `B`) aligned to the same lyric positions so simultaneous hits can stack vertically
- Cue positions are locked to character positions — editing lyrics shifts instrument cues automatically

**Target data shape (per line):**
```json
{
  "lyrics": "Mary had a little lamb",
  "cues": {
    "piano": " C                 ",
    "guitar": " Am                ",
    "percussion": {
      "crash": "                   ",
      "hihat": "x x x x x x x x x ",
      "ride": "                   ",
      "snare": "    o       o      ",
      "bass": "o       o          "
    }
  }
}
```
Each cue string is the same length as `lyrics`. Piano/guitar cues sit above their target syllable/word. Percussion lanes share that same character grid.

**Instrument arrangements** (piano/guitar/percussion): separate section-based text blocks remain available for longer notes and sections beyond per-line cues.

## Constraints

- **Frontend Only**: No backend, no server, no database. All state is client-side.
- **Persistence**: Data must survive page refreshes via browser storage.
- **Import/Export**: JSON is the only external data format — no proprietary lock-in.
- **Instrument Extensibility**: The data model should support adding more instruments later without restructuring.
- **Compatibility**: Phase 6 intentionally breaks existing v1 sheet data; migration is out of scope.
- **Design System**: All v1.1 visual changes must use the semantic token system defined in DESIGN.md.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Frontend-only | Simplicity, no hosting/server costs, offline-capable | Implemented with React + Vite SPA |
| localStorage for persistence | Standard browser APIs, no extra dependencies | Validated in Phases 1-3 with debounced hook |
| JSON for import/export | Human-readable, easy to back up, version-control friendly | Implemented in Phase 4 with Blob+FileReader and Zod validation |
| SPA architecture | Smooth UX, no page reloads, fast transitions | Implemented with React Router |
| Lyrics-first, cues above in fixed positions | Cues stay aligned to syllables when lyrics are edited | Implemented in Phase 2 editor, refined in Phase 6 |
| Cue alignment by character index | Each cue sits above its lyric character position; editing lyrics shifts cues | Implemented in Phase 2 editor, refined in Phase 6 |
| Composition order stored as `sheetIds` | Keep sheet membership and ordering minimal, persistent, and easy to render | Implemented in Phase 3 composition editor |
| Instrument-specific line cues | Guitar and piano may need different displayed cues; percussion needs stacked beat lanes | Implemented in Phase 6 |
| No Phase 6 migration | Faster redesign with less compatibility code | Existing v1 sheet data may break; migration explicitly deferred |
| Preserve dark-mode toggle in v1.1 | Already shipped and validated | Both themes share warm-canvas/dark-shell language |
| Adapt DESIGN.md to cues (not chord chips) | Phase 6 cue model is already delivered | Visual language adapts to cue rows/lanes |
| Visual-only collaboration | DESIGN.md references collaboration motifs | No real-time or multi-user features |
| Subtle motion only | User preference for smooth but not flashy | Short transitions, reduced-motion support |

---

*Last updated: 2026-04-22 after v1.1 milestone start*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
