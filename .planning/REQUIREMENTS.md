# Requirements: Melody Map

**Defined:** 2026-04-20
**Core Value:** A musician can quickly create, edit, and organize multi-instrument song sheets with lyrics — no account, no backend, just the browser.

## v1 Requirements

### Sheets

- [ ] **SHEET-01**: User can create a new sheet with a title and default tempo (120 BPM)
- [ ] **SHEET-02**: User can rename a sheet's title
- [ ] **SHEET-03**: User can open an existing sheet for editing
- [ ] **SHEET-04**: User can delete a sheet with confirmation dialog
- [ ] **SHEET-05**: User can view sheet metadata: title, tempo

### Lyrics

- [ ] **LYR-01**: User can add and edit song lyrics in a sheet
- [ ] **LYR-02**: User can preserve line breaks and verse structure in lyrics (textarea with preformatted output)
- [ ] **LYR-03**: User can update lyrics without losing arrangement data

### Arrangement

- [ ] **ARR-01**: User can add chord/section markers to a sheet
- [ ] **ARR-02**: User can edit tempo (BPM) for a sheet with numeric input (20–300 range)
- [ ] **ARR-03**: User can create and edit piano arrangement content (text/section-based)
- [ ] **ARR-04**: User can create and edit guitar arrangement content (text/section-based)
- [ ] **ARR-05**: User can create and edit drum arrangement content (text/section-based)
- [ ] **ARR-06**: User can edit each instrument's arrangement independently without affecting others

### Composition

- [ ] **COMP-01**: User can create a new composition with a title
- [ ] **COMP-02**: User can add existing sheets to a composition
- [ ] **COMP-03**: User can remove sheets from a composition
- [ ] **COMP-04**: User can reorder sheets within a composition (drag-and-drop or up/down controls)
- [ ] **COMP-05**: User can view an ordered list of sheets in a composition
- [ ] **COMP-06**: User can rename a composition
- [ ] **COMP-07**: User can delete a composition with confirmation dialog

### Persistence

- [ ] **SAVE-01**: All changes persist locally in browser localStorage and survive page refresh
- [ ] **SAVE-02**: User can reopen the app and continue editing existing local sheets and compositions

### Import / Export

- [ ] **DATA-01**: User can export any sheet as JSON (downloaded as .json file)
- [ ] **DATA-02**: User can import a sheet from JSON file upload
- [ ] **DATA-03**: Imported JSON is validated against the Sheet Zod schema before loading
- [ ] **DATA-04**: Invalid JSON import shows a clear, user-friendly error message without corrupting current work
- [ ] **DATA-05**: User can export any composition as JSON
- [ ] **DATA-06**: User can import a composition from JSON file upload

## v2 Requirements

### Structure

- [ ] **STRUC-01**: User can add section markers (Verse, Chorus, Bridge, Intro, Outro) to lyrics
- [ ] **STRUC-02**: Section markers are visually distinct in the lyrics editor

### Visual

- [ ] **VIS-01**: User can toggle dark mode
- [ ] **VIS-02**: App has a print-friendly stylesheet so sheets render cleanly on paper

### Future

- [ ] **AUDIO-01**: User can play back a simple metronome click at the sheet's tempo
- [ ] **KEY-01**: User can set a key signature for a sheet and transpose chords

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend, server, database | Explicit constraint — frontend-only for v1 |
| User authentication / accounts | No multi-user scenario described |
| Real-time collaboration | Significant complexity; single-user workflow only |
| Audio playback beyond metronome | Audio APIs add large dependency; not requested |
| MIDI import | Complex parsing; JSON import covers power users |
| PDF export | Print CSS is simpler and sufficient for v1 |
| Professional music notation / tab entry grids | V1 uses text/section-based arrangements only |
| Mobile-responsive layout | Browser-based desktop tool focus for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHEET-01 | Phase 1 | Pending |
| SHEET-02 | Phase 1 | Pending |
| SHEET-03 | Phase 1 | Pending |
| SHEET-04 | Phase 1 | Pending |
| SHEET-05 | Phase 1 | Pending |
| SAVE-01 | Phase 1 | Pending |
| SAVE-02 | Phase 1 | Pending |
| LYR-01 | Phase 2 | Pending |
| LYR-02 | Phase 2 | Pending |
| LYR-03 | Phase 2 | Pending |
| ARR-01 | Phase 2 | Pending |
| ARR-02 | Phase 2 | Pending |
| ARR-03 | Phase 2 | Pending |
| ARR-04 | Phase 2 | Pending |
| ARR-05 | Phase 2 | Pending |
| ARR-06 | Phase 2 | Pending |
| COMP-01 | Phase 3 | Pending |
| COMP-02 | Phase 3 | Pending |
| COMP-03 | Phase 3 | Pending |
| COMP-04 | Phase 3 | Pending |
| COMP-05 | Phase 3 | Pending |
| COMP-06 | Phase 3 | Pending |
| COMP-07 | Phase 3 | Pending |
| DATA-01 | Phase 4 | Pending |
| DATA-02 | Phase 4 | Pending |
| DATA-03 | Phase 4 | Pending |
| DATA-04 | Phase 4 | Pending |
| DATA-05 | Phase 4 | Pending |
| DATA-06 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-20*
*Last updated: 2026-04-20 after initial definition*
