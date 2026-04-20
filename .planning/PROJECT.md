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
- Local-first: all data lives in browser storage (localStorage or IndexedDB)
- JSON import/export as the primary sharing/backup mechanism
- Initial instrument set: piano, guitar, drums — extendable architecture

## Constraints

- **Frontend Only**: No backend, no server, no database. All state is client-side.
- **Persistence**: Data must survive page refreshes via browser storage.
- **Import/Export**: JSON is the only external data format — no proprietary lock-in.
- **Instrument Extensibility**: The data model should support adding more instruments later without restructuring.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Frontend-only | Simplicity, no hosting/server costs, offline-capable | — Pending |
| localStorage/IndexedDB for persistence | Standard browser APIs, no extra dependencies | — Pending |
| JSON for import/export | Human-readable, easy to back up, version-control friendly | — Pending |
| SPA architecture | Smooth UX, no page reloads, fast transitions | — Pending |

---

*Last updated: 2026-04-20 after initialization*
