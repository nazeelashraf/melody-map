# Phase 6: Instrument-Specific Cues + Editor Precision - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the shared lyric-line chord model with instrument-specific cue data for piano, guitar, and percussion, improve cue editing precision in `SheetEditor`, and update `PerformanceView` so each player reads only their own cues.

</domain>

<spec_lock>
## Requirements (locked via SPEC.md)

**10 requirements are locked.** See `06-SPEC.md` for full requirements, boundaries, and acceptance criteria.

Downstream agents MUST read `06-SPEC.md` before planning or implementing. Requirements are not duplicated here.

**In scope (from SPEC.md):**
- Replace the shared lyric-line cue data model with instrument-specific cue data for piano, guitar, and percussion
- Update `SheetEditor` to edit instrument-specific cue rows with linked monospace cue/lyric alignment
- Update cue normalization/sync utilities to preserve alignment when lyrics change
- Update `PerformanceView` to render selected-instrument cues, including stacked percussion lanes
- Add per-line copy-to-all and copy-to-one cue actions
- Update sheet JSON validation/export/import to use the new Phase 6 sheet schema only

**Out of scope (from SPEC.md):**
- Backward compatibility or migration for old v1 sheet data — explicitly excluded because Phase 6 allows breaking the old schema
- PDF import — deferred to backlog because a stable machine-readable cue source is not yet locked
- Custom percussion lanes or user-defined instruments — excluded because this phase locks a fixed five-lane percussion model only
- Composition-specific cue editing workflows — excluded because the minimum acceptable scope is sheet editing and performance rendering only
- Metronome, key signature, transposition, or section-marker features — separate v2 work outside this phase

</spec_lock>

<decisions>
## Implementation Decisions

### Editor workflow
- **D-01:** `SheetEditor` edits one instrument at a time for a lyric line, not all instruments simultaneously.
- **D-02:** Instrument switching should exist in two places: a broader section-level control and a per-line override so the user can quickly change the active editor for one line.
- **D-03:** Non-selected instruments should not remain visible as read-only summaries inside the lyric-line row while editing.

### Percussion presentation
- **D-04:** When percussion is the active instrument in edit view, the line shows one stacked percussion block containing all 5 lanes together.
- **D-05:** In performance view, percussion lanes use compact lane letters (`C`, `H`, `R`, `S`, `B`) plus a visible legend explaining them.
- **D-06:** Blank spacer lines stay non-editable spacing rows for percussion, matching the current lyric-line blank-line behavior.

### Copy action UX
- **D-07:** Copy actions live in the lyric-line action row with the other line-level controls.
- **D-08:** For percussion, copy operations treat the full 5-lane cue set as one bundled unit.
- **D-09:** Copy-to-one uses inline target buttons rather than menus or cycling behavior.

### Cue interaction model
- **D-10:** Piano and guitar cue editing should feel like tight aligned text rows, not a true per-cell grid.
- **D-11:** Initial cue positioning should support both direct clicking in the cue row and clicking the lyric row to mirror the caret position.
- **D-12:** The editor should include a subtle position guide/highlight to help the user track lyric/cue alignment without introducing heavy grid or ruler UI.

### the agent's Discretion
- Exact visual treatment for the subtle position guide, provided it remains lightweight
- Exact icon choice and spacing for line action row controls
- Whether the broader instrument switch is placed at the section header or another clearly global spot within the cue editing section
- Exact legend placement for percussion in performance view, provided it stays visible and compact

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Locked requirements
- `.planning/phases/06-instrument-specific-cues-editor-precision/06-SPEC.md` — Locked Phase 6 requirements, constraints, and acceptance criteria; must be read before planning

### Project planning
- `.planning/PROJECT.md` — Project constraints, active Phase 6 scope, and the approved compatibility break
- `.planning/REQUIREMENTS.md` — Source of `CUE-*`, `EDIT-*`, and `PERF-*` requirements for Phase 6
- `.planning/ROADMAP.md` — Phase 6 goal, success criteria, and delivered-artifact targets
- `.planning/STATE.md` — Current project status and session notes for Phase 6

### Prior implementation context
- `.planning/phases/5-ui-overhaul-modernize-usability/05-CONTEXT.md` — Phase 5 UI stack and interaction decisions that remain in force (Tailwind, shadcn/ui, Lucide, existing performance mode)

### Current code touchpoints
- `src/types/index.ts` — Current `InstrumentType`, `LyricsLine`, and `Sheet` types that still use shared `chords`
- `src/schemas/sheet.schema.ts` — Current Zod schema and instrument list that Phase 6 will revise
- `src/lib/lyrics-utils.ts` — Current shared-cue normalization and lyric sync logic that must be generalized
- `src/components/SheetEditor.tsx` — Current single-input cue editor and line actions that Phase 6 will replace
- `src/components/PerformanceView.tsx` — Current shared preview rendering path for all instrument tabs
- `src/context/SheetContext.tsx` — Current sheet creation and persistence entry point for the sheet shape

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/context/SheetContext.tsx` — Existing reducer and localStorage persistence flow can keep the same update pattern while the sheet shape changes.
- `src/components/SheetEditor.tsx` — Already has line-level actions, edit/performance mode toggle, and a clear lyric-line rendering loop to extend.
- `src/components/PerformanceView.tsx` — Already has instrument tabs and a dedicated reading-focused route inside the sheet flow.
- `src/lib/lyrics-utils.ts` — Existing lyric-sync algorithm provides the starting point for per-instrument cue synchronization.
- `src/components/ui/*` (shadcn/ui) — Existing Input, Textarea, Button, ToggleGroup, Tabs, and Badge primitives should be reused rather than introducing a new UI toolkit.

### Established Patterns
- Sheet editing uses local component state for transient drafts and reducer dispatches for persisted updates.
- Lyrics remain the root structure: line ordering and blank verse spacers are preserved through `lyricsLines`.
- Instrument selection already exists in performance mode via tabs, so instrument-focused reading is an established interaction pattern.
- The current cue model is string-length aligned to `lyrics`, and downstream utilities assume exact same-length strings.

### Integration Points
- `src/types/index.ts` and `src/schemas/sheet.schema.ts` must change together so persistence and validation stay consistent.
- `src/lib/lyrics-utils.ts` is the core place to adapt lyric edits so all instrument cues remain aligned when lyrics change.
- `src/components/SheetEditor.tsx` is the primary UI integration point for per-line instrument switching, cue entry, copy actions, and position guides.
- `src/components/PerformanceView.tsx` must branch rendering by instrument instead of calling one shared preview formatter.
- `src/context/SheetContext.tsx` and JSON import/export flows depend on the schema shape, so Phase 6 planning must account for schema-only validation against the new format.

</code_context>

<specifics>
## Specific Ideas

- The active editing target is line-local: at any point, a single lyric line can be switched to a different instrument editor without showing all instruments at once.
- Percussion should read as a stacked block in edit mode and as compact labeled lanes with a legend in performance mode.
- Cue editing should feel tighter and more reliable than the current detached cue-input plus lyric-display layout.
- Click behavior should allow the user to place the active cue position from either the cue row or the matching lyric row.

</specifics>

<deferred>
## Deferred Ideas

- PDF import for cue-bearing song sheets — already deferred to backlog until a stable machine-readable source format exists.
- Custom percussion lanes or user-defined instruments — future phase if instrument extensibility becomes a user-facing capability.
- Composition-specific cue editing behavior — separate phase if compositions later need cue-aware editing beyond sheet consumption.

</deferred>

---

*Phase: 06-instrument-specific-cues-editor-precision*
*Context gathered: 2026-04-21*
