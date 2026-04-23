# Phase 10: Performance + Print Redesign - Context

**Gathered:** 2026-04-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Rework the existing performance mode and printed output into deliberate reading surfaces for rehearsal and paper. Phase 10 improves how one selected instrument is presented on screen and in print, preserves instrument-aware cue styling, and replaces the current broad hide-all print approach with a purposeful print layout. This phase does not change the Phase 6 cue data model or add new editing capabilities.

</domain>

<decisions>
## Implementation Decisions

### Performance Surface Chrome
- **D-01:** The performance surface keeps a minimal top frame with the sheet title, tempo, and instrument tabs visible.
- **D-02:** Performance mode includes a small sticky `Back to edit` control so the reader stays minimal without trapping the user in a full-view swap.
- **D-03:** The surrounding app shell should recede while performance mode is active; the reader becomes the dominant surface instead of sharing equal visual weight with the normal shell.
- **D-04:** Active instrument identity on the reading surface uses light accents only, not a fully tinted page. Instrument color should show up in tabs, labels, dividers, and note treatments rather than taking over the whole surface.

### Notes Handling
- **D-05:** Instrument notes live below the main cue-and-lyric reader in performance mode.
- **D-06:** On screen, the notes section is collapsible and starts collapsed by default.
- **D-07:** When shown, notes use a subtle instrument-linked callout treatment rather than a plain text block or a heavy highlighted panel.
- **D-08:** If the selected instrument has no notes, the notes section is hidden entirely.

### Reading Density
- **D-09:** The default on-screen performance reader favors large stage-reading scale over fitting more content at once.
- **D-10:** Performance mode should keep one default reading scale rather than adding a compact-density toggle.
- **D-11:** Blank lyric spacer lines keep generous breathing room so the reader preserves verse pacing and the paper-like feel from `DESIGN.md`.

### Chord Display Format
- **D-12:** Piano and guitar get an alternate grouped lead-sheet chord format in both performance mode and print.
- **D-13:** The current aligned mono cue-line view remains available as an alternate reading format; the grouped chord view does not replace it entirely.
- **D-14:** The grouped chord format applies to piano and guitar only; percussion stays in its stacked lane presentation.
- **D-15:** The grouped chord format must be derived from the existing character-aligned cue positions rather than introducing a separate chord-chart authoring model.
- **D-16:** The grouped chord format preserves the existing `lyricsLines` breaks instead of reflowing content into newly wrapped visual lines.

### Print Output
- **D-17:** Printed output primarily represents the currently selected instrument reader, not a combined multi-instrument sheet.
- **D-18:** Print keeps only the sheet title, selected instrument, and tempo as page-level metadata.
- **D-19:** Selected-instrument notes always print expanded below the main reader so paper never hides information behind a collapsed state.
- **D-20:** Print uses a purpose-built layout with print-specific typography, spacing, borders, and page-break rules rather than a generic hide-the-UI stylesheet.
- **D-21:** Print prioritizes readability over minimizing page count.

### the agent's Discretion
- Exact visual treatment for the receded shell, as long as the performance reader clearly dominates the page.
- Exact placement, size, and styling of the sticky exit control, as long as it stays visible without feeling like editor chrome.
- Exact iconography and affordance treatment for the notes disclosure and view-format toggle.
- Exact helper implementation that derives grouped chord labels from existing cue strings without changing the sheet schema.
- Exact print typography sizes, spacing scale, and page-break heuristics, as long as the result stays readability-first and purpose-built.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Definition And Constraints
- `.planning/ROADMAP.md` — Phase 10 goal, success criteria, planned artifacts, and milestone ordering.
- `.planning/REQUIREMENTS.md` — Source of `PERF-04`, `PERF-05`, and `PRNT-01`; also confirms that v1.1 is visual-only and does not change the data model.
- `.planning/PROJECT.md` — Core constraints: frontend-only app, existing instrument-specific cue model, and no cue/sheet/composition model changes in v1.1.
- `.planning/STATE.md` — Current milestone status and notes from Phases 7–9 that affect how Phase 10 should connect to the shipped redesign.

### Prior Locked Decisions
- `.planning/phases/5-ui-overhaul-modernize-usability/05-CONTEXT.md` — Locks the existence of a single-instrument, reading-first performance mode and the fixed piano/guitar/drums instrument set.
- `.planning/phases/06-instrument-specific-cues-editor-precision/06-CONTEXT.md` — Locks instrument-specific cues, percussion lane behavior, compact percussion legend expectations, and the need to preserve aligned cue rendering.

### Design Contract
- `DESIGN.md` — Visual language for warm-canvas reading surfaces, dark-shell recession, typography roles, instrument identity colors, and reading-surface spacing philosophy.

### Current Implementation Touchpoints
- `src/components/PerformanceView.tsx` — Current performance reader with track-style tabs, mono cue rendering, percussion lane rendering, and notes block; primary redesign entry point.
- `src/components/SheetEditor.tsx` — Current edit/performance switch; performance mode fully replaces the editor surface today.
- `src/components/layout/AppLayout.tsx` — Current shell that always renders sidebar and top bar; needed for shell-recession behavior.
- `src/lib/lyrics-utils.ts` — Current cue helpers (`formatPreviewLine`, `normalizeCueLine`, `normalizeDrumCues`, `drumLaneOrder`) that the grouped chord format must build from.
- `src/styles/print.css` — Current broad hide-all print stylesheet that Phase 10 replaces.
- `src/index.css` — Semantic tokens, instrument colors, focus/selection language, and active instrument tab styling already in force.
- `src/main.tsx` — Global entry point that loads print styles.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/PerformanceView.tsx` — Already contains per-instrument render branches, tabs, and a notes section; this is the natural home for the redesigned reader and alternate chord format.
- `src/lib/lyrics-utils.ts` — Already normalizes cue strings and drum lanes; new grouped chord rendering should derive from these aligned strings or adjacent helpers rather than inventing a second source of truth.
- `src/index.css` — Already exposes semantic canvas/shell/accent/instrument tokens plus global focus and selection rules that Phase 10 should reuse.
- `src/components/ui/tabs.tsx`, `src/components/ui/button.tsx`, and `src/components/ui/badge.tsx` — Existing shadcn primitives already support the current performance controls and should continue to anchor the reader UI.

### Established Patterns
- Performance mode is a branch inside `SheetEditor`, not a separate route.
- Piano and guitar currently render from aligned cue strings into a single mono `pre` block; percussion already renders as stacked compact lanes with lane letters.
- The app already uses stable instrument identity colors across the editor and performance tabs.
- Print styling is global CSS imported from `src/main.tsx`, so purposeful print output will require component-level print hooks plus stylesheet changes.
- `SheetEditor` currently returns `PerformanceView` directly when `viewMode === 'performance'`, so exit behavior must be explicitly reintroduced inside the performance experience.

### Integration Points
- `src/components/PerformanceView.tsx` — Add the reading-first header, sticky exit affordance, grouped chord-chart renderer, density treatment, and notes disclosure.
- `src/components/SheetEditor.tsx` — Keep the edit/performance mode handoff coherent and pass any state needed for returning from performance mode.
- `src/components/layout/AppLayout.tsx` — Apply a receded-shell treatment when the sheet is in performance mode.
- `src/styles/print.css` plus print-specific classes/data attributes in performance components — replace the current hide-all approach with intentional print rules.
- `src/lib/lyrics-utils.ts` or a nearby helper module — derive grouped piano/guitar chord labels from existing cue positions without schema changes.

</code_context>

<specifics>
## Specific Ideas

- The user wants an alternate grouped lead-sheet chord display like the shared reference image: visible chord changes presented above the lyric text in a cleaner chord-chart style.
- That grouped format should appear in both performance mode and print for piano and guitar, while percussion keeps its stacked lane reader.
- Screen and print should feel like the same reading system rather than two unrelated presentations.
- The grouped chord view must be derived from the current cue positions and keep the current `lyricsLines` structure intact.
- The reference image includes bracketed section text like `[Verse 1]`, but Phase 10 should not introduce a new structured section-marker data model just to support that presentation.

</specifics>

<deferred>
## Deferred Ideas

- Separate manual chord-chart authoring model — out of scope for Phase 10; the grouped chord view is derived from existing cue data only.
- Applying the grouped chord-chart format to percussion — deferred; percussion remains lane-based in this phase.
- Structured section-marker feature/data model — still separate future work outside Phase 10.

</deferred>

---

*Phase: 10-performance-print-redesign*
*Context gathered: 2026-04-23*
