# Phase 6: Instrument-Specific Cues + Editor Precision — Specification

**Created:** 2026-04-21
**Ambiguity score:** 0.14 (gate: ≤ 0.20)
**Requirements:** 10 locked

## Goal

Each sheet changes from one shared lyric-line chord string to instrument-specific cue data for piano, guitar, and percussion, with precision editing in `SheetEditor` and instrument-specific reading in `PerformanceView`.

## Background

The current code stores `lyricsLines` as `{ lyrics, chords }` in `src/types/index.ts` and `src/schemas/sheet.schema.ts`. `src/components/SheetEditor.tsx` edits one shared chord line per lyric row through a single-line `Input`, and `src/components/PerformanceView.tsx` renders the same preview line for piano, guitar, and drums. `src/lib/lyrics-utils.ts` only normalizes and syncs one chord string per lyric line. This prevents guitar and piano from carrying different cue text, does not support stacked percussion lanes, and causes unreliable caret behavior when entering multi-character chords like `Bm`.

## Requirements

1. **Instrument-specific string cues**: Each lyric line must store separate cue strings for piano and guitar instead of one shared `chords` string.
   - Current: `LyricsLine` stores one `chords` string shared by all instruments.
   - Target: Each lyric line stores independent piano and guitar cue strings aligned to the same lyric text.
   - Acceptance: Inspecting a saved sheet object shows separate piano and guitar cue values for the same lyric line, and editing one does not change the other.

2. **Independent guitar cues**: Guitar cue text must be allowed to differ from piano cue text on the same lyric line.
   - Current: Piano and guitar necessarily share the same displayed chord line because only one cue string exists.
   - Target: A user can enter different cue text for piano and guitar on one lyric line and see both preserved.
   - Acceptance: Setting piano to `Bm` and guitar to `Am` on the same lyric line keeps both values after save/render with no normalization collapse into one shared value.

3. **Fixed percussion lanes**: Percussion cues must be stored and edited as five aligned named lanes: `C`, `H`, `R`, `S`, and `B`.
   - Current: Drums only have a freeform arrangement text area and no per-line cue structure.
   - Target: Each lyric line includes five percussion cue lanes mapped to crash, hi-hat, ride, snare, and bass on the same character grid as the lyrics.
   - Acceptance: A lyric line can store five separate percussion lane strings, each with the same effective alignment grid as the lyric line.

4. **Stacked percussion hits**: Percussion must support simultaneous hits at one lyric position across multiple lanes.
   - Current: No lane-based percussion model exists, so simultaneous vertical hits cannot be represented.
   - Target: Different percussion lanes may contain hit markers at the same lyric index without overwriting one another.
   - Acceptance: A verifier can place markers in at least two percussion lanes at the same lyric position and see both preserved and rendered in aligned stacked lanes.

5. **Cue copy actions**: Users must be able to copy cue content from the current instrument to all other instruments or to one chosen target instrument for a lyric line.
   - Current: No cue-copy action exists.
   - Target: Each lyric line exposes both copy-to-all and copy-to-one behavior for the currently selected instrument's cue data.
   - Acceptance: Triggering copy-to-all duplicates the selected instrument cue into every other supported instrument on that line; triggering copy-to-one duplicates only to the chosen target.

6. **Stable cue typing**: Entering multi-character chord names must keep typing at the intended cue position instead of jumping unexpectedly.
   - Current: In the shared chord `Input`, typing `Bm` can move the caret so the second character lands at the end of the string.
   - Target: Typing multi-character cues such as `Bm` or `Am` continues at the intended insertion point in the cue row.
   - Acceptance: A verifier can click a cue position, type `Bm`, and observe both characters inserted at that location without the caret jumping to the end before the second character is entered.

7. **Linked monospace editor rows**: The lyric-line editor must use vertically linked monospace cue and lyric fields so cue position targeting is visually reliable.
   - Current: Cue input and linked lyric display are visually separated enough that first-click position targeting is hard to judge.
   - Target: Each lyric line is edited in vertically adjacent monospace rows where cue content and lyric text share the same alignment grid.
   - Acceptance: In `SheetEditor`, each editable lyric line presents cue and lyric rows together with matching monospace alignment and no detached read-only lyric block replacing the editable pairing.

8. **Distinct cue styling**: Cue rows must remain visually distinct from lyric rows without appearing disabled.
   - Current: Cue display uses generic monospace rendering and does not clearly distinguish playable cues from lyrics in performance reading.
   - Target: Cue rows have a clear visual treatment separate from lyrics while remaining active-looking and readable.
   - Acceptance: In both edit and performance views, cue rows are visually distinguishable from lyrics through typography and/or color treatment, and no disabled-state styling is used.

9. **Instrument-specific performance view**: `PerformanceView` must show cues for the selected instrument only.
   - Current: Performance view renders the same `formatPreviewLine` output regardless of selected instrument tab.
   - Target: Selecting piano, guitar, or percussion changes the displayed cue content to that instrument's own line data.
   - Acceptance: With different cue content stored per instrument, switching the selected performance instrument changes the displayed cues accordingly.

10. **Percussion performance lanes**: `PerformanceView` must render percussion as separate aligned `C`, `H`, `R`, `S`, `B` lanes rather than a single shared chord row.
   - Current: Drums share the same preview rendering path as piano and guitar.
   - Target: Percussion performance output shows five named stacked lanes aligned to the lyric line.
   - Acceptance: Selecting percussion in performance view renders five labeled aligned lanes for a lyric line, and hit markers remain readable relative to the lyric text.

## Boundaries

**In scope:**
- Replace the shared lyric-line cue data model with instrument-specific cue data for piano, guitar, and percussion
- Update `SheetEditor` to edit instrument-specific cue rows with linked monospace cue/lyric alignment
- Update cue normalization/sync utilities to preserve alignment when lyrics change
- Update `PerformanceView` to render selected-instrument cues, including stacked percussion lanes
- Add per-line copy-to-all and copy-to-one cue actions
- Update sheet JSON validation/export/import to use the new Phase 6 sheet schema only

**Out of scope:**
- Backward compatibility or migration for old v1 sheet data — explicitly excluded because Phase 6 allows breaking the old schema
- PDF import — deferred to backlog because a stable machine-readable cue source is not yet locked
- Custom percussion lanes or user-defined instruments — excluded because this phase locks a fixed five-lane percussion model only
- Composition-specific cue editing workflows — excluded because the minimum acceptable scope is sheet editing and performance rendering only
- Metronome, key signature, transposition, or section-marker features — separate v2 work outside this phase

## Constraints

- Existing v1 sheet data compatibility is not required; the new schema may reject old saved/imported sheet payloads.
- Percussion lane support is fixed to `C`, `H`, `R`, `S`, `B` in this phase; no aliases or customization are required.
- JSON compatibility is new-schema-only for Phase 6; import/export does not need to accept the old shared-`chords` sheet format.
- The locked UX scope is `SheetEditor` plus `PerformanceView`; no broader composition editing redesign is required.

## Acceptance Criteria

- [ ] A sheet line can persist different cue data for piano and guitar without either overwriting the other.
- [ ] A sheet line can persist five separate percussion lanes (`C`, `H`, `R`, `S`, `B`) with simultaneous hits at the same lyric position.
- [ ] `SheetEditor` presents vertically linked monospace cue and lyric editing rows for each lyric line.
- [ ] Typing `Bm` at a chosen cue position keeps the caret at the intended location without jumping before the second character is entered.
- [ ] A per-line copy action supports both copy-to-all and copy-to-one behavior.
- [ ] `PerformanceView` changes displayed cue content when switching between piano, guitar, and percussion.
- [ ] `PerformanceView` renders percussion as five aligned labeled lanes instead of a shared chord row.
- [ ] Phase 6 sheet import/export validates only the new instrument-specific cue schema.

## Ambiguity Report

| Dimension           | Score | Min   | Status | Notes                                                           |
|---------------------|-------|-------|--------|-----------------------------------------------------------------|
| Goal Clarity        | 0.90  | 0.75  | ✓      | Locked around instrument-specific cue model and sheet-focused UX |
| Boundary Clarity    | 0.86  | 0.70  | ✓      | Scope excludes migration, PDF import, custom lanes, compositions |
| Constraint Clarity  | 0.78  | 0.65  | ✓      | New-schema-only JSON, fixed 5 percussion lanes, no compatibility |
| Acceptance Criteria | 0.80  | 0.70  | ✓      | Pass/fail checks cover data, editing, copy actions, rendering    |
| **Ambiguity**       | 0.14  | ≤0.20 | ✓      | Gate passed after round 2                                        |

Status: ✓ = met minimum, ⚠ = below minimum (planner treats as assumption)

## Interview Log

| Round | Perspective            | Question summary                                            | Decision locked                                                           |
|-------|------------------------|-------------------------------------------------------------|---------------------------------------------------------------------------|
| 1     | Researcher             | How should old sheets be handled in Phase 6?                | Old sheets may break; no migration or fallback required                   |
| 1     | Researcher             | What percussion behavior must be guaranteed?                | Fixed five-lane percussion model only                                     |
| 1     | Researcher             | What should copy behavior do?                               | Support both copy-to-all and copy-to-one                                  |
| 2     | Researcher + Simplifier| What is the smallest acceptable implementation scope?       | Limit required UX scope to `SheetEditor` and `PerformanceView`            |
| 2     | Researcher + Simplifier| What JSON compatibility rule is required?                   | New schema only; old schema may fail validation                           |
| 2     | Researcher + Simplifier| What caret behavior must a verifier prove?                  | Verifier only needs to prove stable typing for multi-character chord entry |

---

*Phase: 06-instrument-specific-cues-editor-precision*
*Spec created: 2026-04-21*
*Next step: /gsd-discuss-phase 6 — implementation decisions (how to build what's specified above)*
