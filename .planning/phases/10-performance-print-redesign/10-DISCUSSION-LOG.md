# Phase 10: Performance + Print Redesign - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `10-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-04-23T00:58:11-03:00
**Phase:** 10-performance-print-redesign
**Areas discussed:** Performance framing, Notes placement, Print strategy, Reading density, Chord display format

---

## Performance framing

### What stays visible at the top of the reading surface?

| Option | Description | Selected |
|--------|-------------|----------|
| Title, tempo, tabs | Keeps orientation and fast instrument switching, while staying much cleaner than an editor header. | ✓ |
| Title and tempo only | Calmest header, but instrument switching would need to move elsewhere or become less visible. | |
| Full control bar | Include edit/back/export actions in the performance surface, which adds convenience but also brings back more chrome. | |

**User's choice:** Title, tempo, tabs
**Notes:** The performance reader should keep orientation and switching visible without reverting to editor-style chrome.

### How should someone get back to editing?

| Option | Description | Selected |
|--------|-------------|----------|
| Small sticky exit | Add a minimal but always-available `Back to edit` control so performance stays reading-first without trapping the user. | ✓ |
| Header-only exit | Keep the exit control only at the top of the page. Cleaner, but easy to lose on long sheets. | |
| No in-view exit | Rely on app navigation or browser actions instead, which keeps chrome minimal but risks confusion. | |

**User's choice:** Small sticky exit
**Notes:** Current code fully swaps `SheetEditor` to `PerformanceView`, so in-view exit needs to be explicit in the redesign.

### How immersive should performance mode feel inside the shell?

| Option | Description | Selected |
|--------|-------------|----------|
| Shell recedes | Let the reading surface dominate and visually tone down surrounding app chrome. | ✓ |
| Keep normal shell | Leave the existing sidebar and top bar presentation mostly unchanged. | |
| Near full-screen reader | Hide almost all surrounding shell chrome until exit. | |

**User's choice:** Shell recedes
**Notes:** The app shell can remain mounted, but it should visually step back so the reading surface becomes primary.

### How visible should instrument color be on the reader itself?

| Option | Description | Selected |
|--------|-------------|----------|
| Light accents only | Keep the page mostly neutral and use instrument color on tabs, labels, small dividers, and note headers. | ✓ |
| Tint the whole reader | Give the main cue/lyric surface a stronger instrument-tinted background. | |
| Header only | Confine instrument color to the top controls and keep the rest fully neutral. | |

**User's choice:** Light accents only
**Notes:** Instrument identity should stay stable without overpowering long reading sessions.

---

## Notes placement

### Where should instrument notes live in performance mode?

| Option | Description | Selected |
|--------|-------------|----------|
| Collapsible notes below | Keep cues and lyrics primary, with notes available right after the reading surface when needed. | ✓ |
| Sticky side note panel | Keep notes visible beside the reader, but add more persistent chrome and work worse on narrow screens. | |
| Inline between lines | Attach notes near lyric sections, which can help context but risks breaking reading flow. | |

**User's choice:** Collapsible notes below
**Notes:** The main reader remains primary; notes are secondary but available.

### When notes exist, how should that section start?

| Option | Description | Selected |
|--------|-------------|----------|
| Collapsed by default | Keeps the reading surface focused on cues and lyrics first, with notes available on demand. | ✓ |
| Expanded by default | Shows all note content immediately, which helps visibility but adds more vertical noise. | |
| Remember last state | Useful for repeat users, but adds more UI state complexity. | |

**User's choice:** Collapsed by default
**Notes:** Screen reading should start as cleanly as possible.

### How should the notes block be styled?

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle instrument callout | A restrained card with small instrument-colored accents keeps it connected to the active part without overpowering the page. | ✓ |
| Plain text block | Most minimal, but easier to miss and less clearly separated from lyrics. | |
| Strong highlighted panel | Makes notes obvious, but risks competing with the main reading surface. | |

**User's choice:** Subtle instrument callout
**Notes:** Notes should feel intentionally related to the selected instrument without becoming the main visual anchor.

### What happens when the selected instrument has no notes?

| Option | Description | Selected |
|--------|-------------|----------|
| Hide it entirely | Keeps empty chrome off the reader and matches the reading-first goal. | ✓ |
| Show a small empty hint | Makes it explicit that notes are supported, but still adds non-essential UI. | |
| Show disabled notes section | Preserves layout consistency, but wastes space on a minimal surface. | |

**User's choice:** Hide it entirely
**Notes:** Empty note chrome should not stay on the screen.

---

## Print strategy

### What should a printed sheet primarily represent?

| Option | Description | Selected |
|--------|-------------|----------|
| Selected instrument reader | Print mirrors the active performance instrument: that instrument's cues/notes plus shared lyric structure. | ✓ |
| Full multi-instrument sheet | Print all instruments together on one document. | |
| Lyrics-first sheet | Print mostly lyrics with lighter cue support. | |

**User's choice:** Selected instrument reader
**Notes:** Print should behave like a player handout, not a dense editor export.

### What metadata should stay on the printed page?

| Option | Description | Selected |
|--------|-------------|----------|
| Title, instrument, tempo | Enough context to identify the sheet and player part without bringing back app chrome. | ✓ |
| Title only | Cleanest page, but weaker if pages get separated. | |
| Full header info | Include more app metadata and labels, which feels less like a purposeful handout. | |

**User's choice:** Title, instrument, tempo
**Notes:** Keep only the metadata needed to identify the part on paper.

### How should print handle notes?

| Option | Description | Selected |
|--------|-------------|----------|
| Always expand below reader | Screen notes can stay collapsible, but print should output them fully so no hidden content is lost on paper. | ✓ |
| Omit notes from print | Keeps paper cleaner, but drops potentially important performance information. | |
| Separate notes page | Keeps the main page cleaner, but splits related material across pages. | |

**User's choice:** Always expand below reader
**Notes:** Print cannot rely on collapsed UI state.

### How should page styling behave in print?

| Option | Description | Selected |
|--------|-------------|----------|
| Purpose-built print layout | Use print-specific typography, spacing, borders, and page-break rules instead of just hiding chrome. | ✓ |
| Light adaptation of screen view | Keep the screen layout mostly intact and just simplify it for paper. | |
| Bare content dump | Hide UI and let browser defaults handle the rest. | |

**User's choice:** Purpose-built print layout
**Notes:** This directly replaces the current broad hide-all print stylesheet.

### For print, which bias matters more?

| Option | Description | Selected |
|--------|-------------|----------|
| Readability first | Use generous spacing and strong hierarchy even if it increases page count. | ✓ |
| Balanced | Aim for decent readability without expanding page count too aggressively. | |
| Fewer pages first | Compress spacing to save paper, even if the page feels denser. | |

**User's choice:** Readability first
**Notes:** Paper output should optimize for musicians reading it, not for minimizing sheets.

---

## Reading density

### What should the default on-screen density favor?

| Option | Description | Selected |
|--------|-------------|----------|
| Large stage reading | Bigger type, more spacing, and calmer pacing even if fewer lines fit on screen. | ✓ |
| Balanced | A middle ground between readability and fitting more material at once. | |
| Compact | Fit more lines on screen, but with a denser reading surface. | |

**User's choice:** Large stage reading
**Notes:** The performance reader is optimized for rehearsal/performance distance, not for compact browsing.

### Should performance mode offer a denser alternative?

| Option | Description | Selected |
|--------|-------------|----------|
| One default scale | Keep the reader calm and predictable. | ✓ |
| Optional compact toggle | Fit more content on screen, but add another piece of performance chrome and another state to tune. | |
| Auto-density by screen size | Adapt silently by viewport, but give users less explicit control. | |

**User's choice:** One default scale
**Notes:** Phase 10 should make one excellent reader rather than splitting attention across multiple density modes.

### How should blank lyric spacer lines behave?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep generous spacing | Preserves verse breathing room and the editorial reading-surface idea from `DESIGN.md`. | ✓ |
| Slightly tighten them | Save some vertical space while still preserving structure. | |
| Collapse them heavily | Fit more content, but weaken section breathing room. | |

**User's choice:** Keep generous spacing
**Notes:** Visual breathing room is part of the intended reading feel.

---

## Chord display format

### Where should the grouped chord-chart format show up?

| Option | Description | Selected |
|--------|-------------|----------|
| Performance + print | Use the lead-sheet style on both reading surfaces so screen and paper feel consistent. | ✓ |
| Print only | Keep the current on-screen cue reader, but print in the grouped chord-chart style. | |
| Performance only | Use the grouped style on screen, while print stays more conventional. | |

**User's choice:** Performance + print
**Notes:** The user wants a consistent reader system across screen and paper.

### How should this relate to the current mono cue-line view?

| Option | Description | Selected |
|--------|-------------|----------|
| Alternate format toggle | Keep the current aligned cue view available, and add the grouped chord-chart layout as another reading format. | ✓ |
| Replace it entirely | Make the grouped chord-chart layout the main piano/guitar reader in Phase 10. | |
| Print grouped, screen current | Avoid another on-screen toggle and only switch formats on paper. | |

**User's choice:** Alternate format toggle
**Notes:** The new chart view is additive, not a replacement.

### Which instruments should use the grouped format?

| Option | Description | Selected |
|--------|-------------|----------|
| Piano + guitar only | Use the grouped chord-chart look for piano/guitar, while percussion stays in its stacked lane format. | ✓ |
| Try to adapt drums too | Force all instruments into one presentation style. | |
| Guitar only | Use the grouped format for one instrument only. | |

**User's choice:** Piano + guitar only
**Notes:** Percussion keeps the existing lane-based presentation model.

### How should the grouped view build from current data?

| Option | Description | Selected |
|--------|-------------|----------|
| Derive from current cue positions | Use the existing piano/guitar cue strings and render visible chord changes above the lyric text in a cleaner lead-sheet layout. | ✓ |
| Manual chart text | Add a separate text-style chord chart for this format. | |
| Auto-summarize loosely | Compress cues into broader phrases automatically, which is more interpretive and less reliable. | |

**User's choice:** Derive from current cue positions
**Notes:** No new data model or separate authoring surface should be introduced in Phase 10.

### How should line breaking work in the grouped view?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep existing lyric lines | Respect the current `lyricsLines` structure and restyle each line into the chord-chart look. | ✓ |
| Wrap into new visual lines | Reflow lyrics for prettier chord-chart blocks, but drift from the edited alignment. | |
| Mix both automatically | Add more complexity and unpredictability. | |

**User's choice:** Keep existing lyric lines
**Notes:** The grouped chord style should be a presentational derivative of the current sheet, not a reflowed chart editor.

**Additional reference note:** The user shared an image showing grouped chord labels above lyrics in a lead-sheet style with inline section text like `[Verse 1]`. That image was used as a presentation reference only, not as approval for a new section-marker data model.

---

## the agent's Discretion

- Exact styling and placement of the sticky exit control.
- Exact visual treatment for shell recession around the performance reader.
- Exact toggle UI for switching between aligned cue view and grouped chord-chart view.
- Exact print page-break heuristics and typography values.

## Deferred Ideas

- Separate manual chord-chart authoring model.
- Applying grouped chord-chart presentation to percussion.
- Structured section-marker feature/data model.
