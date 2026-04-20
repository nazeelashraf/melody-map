# Melody Map

## What This Is

A frontend-only web app for creating and editing song sheets that combine lyrics with instrument arrangements for piano, guitar, and drums. Users can build individual sheets for a song, edit musical details like chords and tempo, and assemble multiple sheets into larger compositions.

## Core Value

A musician can quickly create, edit, and organize multi-instrument song sheets with lyrics — no account, no backend, just the browser.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Create a sheet for a single song with title and tempo
- [ ] Edit lyrics for a sheet with preserved verse structure
- [ ] Add and edit chord/arrangement data for piano, guitar, and drums
- [ ] Edit tempo for a sheet
- [ ] Create a composition that combines multiple sheets in order
- [ ] Add, remove, and reorder sheets within a composition
- [ ] Export any sheet as JSON
- [ ] Import a sheet from JSON with validation
- [ ] Changes persist locally in the browser between sessions

### Out of Scope

- Backend, authentication, or cloud sync — frontend-only for v1
- Real-time collaboration — single-user workflow
- Audio playback or music generation — visual arranger only
- PDF export or professional music engraving
- Multi-user or sharing features

## Context

- Purely frontend, browser-based — no server required
- Single-page application (SPA) architecture
- Local-first: all data lives in browser storage (localStorage)
- JSON import/export as the primary sharing/backup mechanism
- Initial instrument set: piano, guitar, drums — extendable architecture

### Arrangement Data Model

**Lyrics are the root.** Each lyric line has an optional chord line above it. The chord line is character-aligned with the lyric line — each character position in the chord line either holds a chord name (e.g., "C", "Am7", "Fmaj9") or a placeholder (space or `-`) indicating no chord at that position.

**How it works:**
- "Mary had a little lamb" → chord line: " C                 "
- "His fleece was white as snow" → chord line: "      F       G   C"
- Chord positions are locked to character positions — editing lyrics shifts chords automatically

**Data shape (per line):**
```json
{ "lyrics": "Mary had a little lamb", "chords": " C                 " }
```
The `chords` string is the same length as `lyrics`. Chord markers sit above their target syllable/word. No chord = space or `-` at that position.

**Instrument arrangements** (piano/guitar/drums): separate section-based text blocks, not chord-annotated — guitar chords above lyrics is separate from the guitar arrangement notation.

## Constraints

- **Frontend Only**: No backend, no server, no database. All state is client-side.
- **Persistence**: Data must survive page refreshes via browser storage.
- **Import/Export**: JSON is the only external data format — no proprietary lock-in.
- **Instrument Extensibility**: The data model should support adding more instruments later without restructuring.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Frontend-only | Simplicity, no hosting/server costs, offline-capable | — Pending |
| localStorage for persistence | Standard browser APIs, no extra dependencies | — Pending |
| JSON for import/export | Human-readable, easy to back up, version-control friendly | — Pending |
| SPA architecture | Smooth UX, no page reloads, fast transitions | — Pending |
| Lyrics-first, chords above in fixed positions | Chords stay aligned to syllables when lyrics are edited | — Pending |
| Chord alignment by character index | Each chord sits above its lyric character position; editing lyrics shifts chords | — Pending |

---

*Last updated: 2026-04-20 after clarification (chord alignment model)*

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
