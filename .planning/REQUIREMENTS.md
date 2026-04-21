# Requirements: Melody Map

**Defined:** 2026-04-20
**Core Value:** A musician can quickly create, edit, and organize multi-instrument song sheets with lyrics — no account, no backend, just the browser.

## v1 Requirements

### Sheets

- [x] **SHEET-01**: User can create a new sheet with a title and default tempo (120 BPM)
- [x] **SHEET-02**: User can rename a sheet's title
- [x] **SHEET-03**: User can open an existing sheet for editing
- [x] **SHEET-04**: User can delete a sheet with confirmation dialog
- [x] **SHEET-05**: User can view sheet metadata: title, tempo

### Lyrics

- [x] **LYR-01**: User can add and edit song lyrics in a sheet
- [x] **LYR-02**: User can preserve line breaks and verse structure in lyrics (textarea with preformatted output)
- [x] **LYR-03**: User can update lyrics without losing arrangement data
- [x] **LYR-04**: Editing lyric text automatically shifts chord markers to stay character-aligned

### Arrangement

- [x] **ARR-01**: User can add chord markers above specific character positions in each lyric line (character-aligned, same length as lyric line)
- [x] **ARR-02**: User can edit tempo (BPM) for a sheet with numeric input (20–300 range)
- [x] **ARR-03**: User can edit chord markers after editing lyric text (chords shift to stay aligned)
- [x] **ARR-04**: User can create and edit piano arrangement content (section-based text)
- [x] **ARR-05**: User can create and edit guitar arrangement content (section-based text)
- [x] **ARR-06**: User can create and edit drum arrangement content (section-based text)
- [x] **ARR-07**: User can edit each instrument's arrangement independently without affecting others
- [x] **ARR-08**: Chord line for a lyric line renders visually above the lyric line in correct character positions

### Composition

- [x] **COMP-01**: User can create a new composition with a title
- [x] **COMP-02**: User can add existing sheets to a composition
- [x] **COMP-03**: User can remove sheets from a composition
- [x] **COMP-04**: User can reorder sheets within a composition (drag-and-drop or up/down controls)
- [x] **COMP-05**: User can view an ordered list of sheets in a composition
- [x] **COMP-06**: User can rename a composition
- [x] **COMP-07**: User can delete a composition with confirmation dialog

### Persistence

- [x] **SAVE-01**: All changes persist locally in browser localStorage and survive page refresh
- [x] **SAVE-02**: User can reopen the app and continue editing existing local sheets and compositions

### Import / Export

- [x] **DATA-01**: User can export any sheet as JSON (downloaded as .json file)
- [x] **DATA-02**: User can import a sheet from JSON file upload
- [x] **DATA-03**: Imported JSON is validated against the Sheet Zod schema before loading
- [x] **DATA-04**: Invalid JSON import shows a clear, user-friendly error message without corrupting current work
- [x] **DATA-05**: User can export any composition as JSON
- [x] **DATA-06**: User can import a composition from JSON file upload

## v2 Requirements

### Structure

- [ ] **STRUC-01**: User can add section markers (Verse, Chorus, Bridge, Intro, Outro) to lyrics
- [ ] **STRUC-02**: Section markers are visually distinct in the lyrics editor

### Instrument Cues

- [ ] **CUE-01**: Each lyric line stores independent cue data for piano and guitar instead of one shared chord line
- [ ] **CUE-02**: Guitar cues can differ from piano cues for the same lyric line
- [ ] **CUE-03**: Percussion cues are edited as five named lanes (`C`, `H`, `R`, `S`, `B`) aligned to the lyric line
- [ ] **CUE-04**: Multiple percussion hits can stack at the same lyric position across different lanes
- [ ] **CUE-05**: User can copy the currently selected instrument cue line to the other instruments for a lyric line

### Editor UX

- [ ] **EDIT-01**: Cue editing keeps the caret stable while entering multi-character chord names such as `Bm`
- [ ] **EDIT-02**: Each lyric line is edited with vertically linked monospace cue and lyric fields so position targeting is visually reliable
- [ ] **EDIT-03**: Cue rows remain visually distinct from lyrics without appearing disabled

### Performance

- [ ] **PERF-01**: Performance view shows cues for the selected instrument only
- [ ] **PERF-02**: Piano and guitar cues render in a distinct monospace style that is visually separated from lyrics
- [ ] **PERF-03**: Performance view renders percussion as separate `C`, `H`, `R`, `S`, `B` lanes aligned to the lyric line

### Visual

- [x] **VIS-01**: User can toggle dark mode
- [x] **VIS-02**: App has a print-friendly stylesheet so sheets render cleanly on paper

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
| SHEET-01 | Phase 1 | Complete |
| SHEET-02 | Phase 1 | Complete |
| SHEET-03 | Phase 1 | Complete |
| SHEET-04 | Phase 1 | Complete |
| SHEET-05 | Phase 1 | Complete |
| SAVE-01 | Phase 1 | Complete |
| SAVE-02 | Phase 1 | Complete |
| LYR-01 | Phase 2 | Complete |
| LYR-02 | Phase 2 | Complete |
| LYR-03 | Phase 2 | Complete |
| LYR-04 | Phase 2 | Complete |
| ARR-01 | Phase 2 | Complete |
| ARR-02 | Phase 2 | Complete |
| ARR-03 | Phase 2 | Complete |
| ARR-04 | Phase 2 | Complete |
| ARR-05 | Phase 2 | Complete |
| ARR-06 | Phase 2 | Complete |
| ARR-07 | Phase 2 | Complete |
| ARR-08 | Phase 2 | Complete |
| COMP-01 | Phase 3 | Complete |
| COMP-02 | Phase 3 | Complete |
| COMP-03 | Phase 3 | Complete |
| COMP-04 | Phase 3 | Complete |
| COMP-05 | Phase 3 | Complete |
| COMP-06 | Phase 3 | Complete |
| COMP-07 | Phase 3 | Complete |
| DATA-01 | Phase 4 | Complete |
| DATA-02 | Phase 4 | Complete |
| DATA-03 | Phase 4 | Complete |
| DATA-04 | Phase 4 | Complete |
| DATA-05 | Phase 4 | Complete |
| DATA-06 | Phase 4 | Complete |
| VIS-01 | Phase 5 | Complete |
| VIS-02 | Phase 4 | Complete |
| CUE-01 | Phase 6 | Planned |
| CUE-02 | Phase 6 | Planned |
| CUE-03 | Phase 6 | Planned |
| CUE-04 | Phase 6 | Planned |
| CUE-05 | Phase 6 | Planned |
| EDIT-01 | Phase 6 | Planned |
| EDIT-02 | Phase 6 | Planned |
| EDIT-03 | Phase 6 | Planned |
| PERF-01 | Phase 6 | Planned |
| PERF-02 | Phase 6 | Planned |
| PERF-03 | Phase 6 | Planned |

**Coverage:**
- Total requirements: 49
- Mapped to phases: 45
- Unmapped: 4

---
*Requirements defined: 2026-04-20*
*Last updated: 2026-04-21 after Phase 6 requirements definition*
