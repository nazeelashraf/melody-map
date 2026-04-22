# Requirements: Melody Map

**Defined:** 2026-04-20
**Updated:** 2026-04-22 for v1.1 milestone
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

## v1.1 Requirements (DESIGN.md Implementation)

### Design System

- [ ] **DSGN-01**: User sees a consistent warm-canvas / dark-shell visual system across the app in both supported themes
- [ ] **DSGN-02**: User can distinguish interface labels, reading text, and musical notation through the new typography system
- [ ] **DSGN-03**: User can distinguish selected elements from keyboard-focused elements through consistent dashed-selection and solid-focus treatments
- [ ] **DSGN-04**: User can distinguish piano, guitar, and drums through stable identity colors used consistently across editor and performance surfaces

### Shell and Library

- [x] **SHEL-01**: User can navigate the app within a redesigned shell that clearly separates navigation from editing and performance content
- [x] **LIB-01**: User can scan sheets and compositions from redesigned library cards with clearer hierarchy, metadata, and primary actions
- [x] **UI-01**: User can use buttons, dialogs, empty states, and action controls that share one cohesive visual language across the app
- [x] **RESP-01**: User can access navigation and core actions on mobile, tablet, and desktop through layout-appropriate shell behavior

### Sheet Canvas

- [x] **CANV-01
**: User can edit a sheet on a canvas-style surface that visually prioritizes lyrics and cues over surrounding chrome
- [x] **CANV-02
**: User can distinguish cue lanes from lyric lines at a glance while preserving their shared alignment
- [x] **CANV-03
**: User can use redesigned metadata, line controls, and arrangement panels without losing the current Phase 6 editing capabilities
- [ ] **TRACK-01**: User can identify and switch instrument contexts through visually distinct track-style controls in the editor

### Performance and Print

- [ ] **PERF-04**: User can switch to a performance surface that is optimized for reading rather than editing
- [ ] **PERF-05**: User can read instrument-specific cues and notes in performance mode with stable instrument identity styling
- [ ] **PRNT-01**: User can print a sheet or performance view that preserves readable cue and lyric hierarchy and removes non-essential chrome

### Accessibility and Polish

- [ ] **A11Y-01**: User can identify keyboard focus on interactive controls throughout the redesigned UI
- [ ] **A11Y-02**: User can distinguish important UI boundaries and states through non-text contrast that remains readable in both supported themes
- [ ] **RESP-02**: User can use redesigned editor and performance surfaces across mobile, tablet, and desktop without clipped controls or unreadable content
- [ ] **MOTN-01**: User experiences subtle transitions for navigation, dialogs, and mode changes that support orientation without heavy motion
- [ ] **MOTN-02**: User who prefers reduced motion gets reduced or replaced non-essential animations

## v2 Requirements

### Structure

- [ ] **STRUC-01**: User can add section markers (Verse, Chorus, Bridge, Intro, Outro) to lyrics
- [ ] **STRUC-02**: Section markers are visually distinct in the lyrics editor

### Instrument Cues

- [x] **CUE-01**: Each lyric line stores independent cue data for piano and guitar instead of one shared chord line
- [x] **CUE-02**: Guitar cues can differ from piano cues for the same lyric line
- [x] **CUE-03**: Percussion cues are edited as five named lanes (`C`, `H`, `R`, `S`, `B`) aligned to the lyric line
- [x] **CUE-04**: Multiple percussion hits can stack at the same lyric position across different lanes
- [x] **CUE-05**: User can copy the currently selected instrument cue line to the other instruments for a lyric line

### Editor UX

- [x] **EDIT-01**: Cue editing keeps the caret stable while entering multi-character chord names such as `Bm`
- [x] **EDIT-02**: Each lyric line is edited with vertically linked monospace cue and lyric fields so position targeting is visually reliable
- [x] **EDIT-03**: Cue rows remain visually distinct from lyrics without appearing disabled

### Performance

- [x] **PERF-01**: Performance view shows cues for the selected instrument only
- [x] **PERF-02**: Piano and guitar cues render in a distinct monospace style that is visually separated from lyrics
- [x] **PERF-03**: Performance view renders percussion as separate `C`, `H`, `R`, `S`, `B` lanes aligned to the lyric line

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
| Real-time collaboration | Significant complexity; single-user workflow only (visual motifs only in v1.1) |
| Audio playback beyond metronome | Audio APIs add large dependency; not requested |
| MIDI import | Complex parsing; JSON import covers power users |
| PDF export | Print CSS is simpler and sufficient for v1 |
| Professional music notation / tab entry grids | V1 uses text/section-based arrangements only |
| Mobile-responsive layout | Browser-based desktop tool focus for v1 (v1.1 adds responsive redesign) |
| Data model changes in v1.1 | DESIGN.md is visual-only; no cue/sheet/composition model changes |
| New instruments in v1.1 | Out of scope for this milestone |
| Audio/metronome in v1.1 | Out of scope for this milestone |

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
| CUE-01 | Phase 6 | Complete |
| CUE-02 | Phase 6 | Complete |
| CUE-03 | Phase 6 | Complete |
| CUE-04 | Phase 6 | Complete |
| CUE-05 | Phase 6 | Complete |
| EDIT-01 | Phase 6 | Complete |
| EDIT-02 | Phase 6 | Complete |
| EDIT-03 | Phase 6 | Complete |
| PERF-01 | Phase 6 | Complete |
| PERF-02 | Phase 6 | Complete |
| PERF-03 | Phase 6 | Complete |
| DSGN-01 | Phase 7 | Planned |
| DSGN-02 | Phase 7 | Planned |
| DSGN-03 | Phase 7 | Planned |
| DSGN-04 | Phase 7 | Planned |
| SHEL-01 | Phase 8 | Complete |
| LIB-01 | Phase 8 | Complete |
| UI-01 | Phase 8 | Complete |
| RESP-01 | Phase 8 | Complete |
| CANV-01 | Phase 9 | Planned |
| CANV-02 | Phase 9 | Planned |
| CANV-03 | Phase 9 | Planned |
| TRACK-01 | Phase 9 | Planned |
| PERF-04 | Phase 10 | Planned |
| PERF-05 | Phase 10 | Planned |
| PRNT-01 | Phase 10 | Planned |
| A11Y-01 | Phase 7 | Planned |
| A11Y-02 | Phase 7 | Planned |
| RESP-02 | Phase 11 | Planned |
| MOTN-01 | Phase 11 | Planned |
| MOTN-02 | Phase 11 | Planned |

**Coverage:**
- Total requirements: 64
- Mapped to phases: 64
- Unmapped: 0

---
*Requirements defined: 2026-04-20*
*Last updated: 2026-04-22 after v1.1 milestone start*
