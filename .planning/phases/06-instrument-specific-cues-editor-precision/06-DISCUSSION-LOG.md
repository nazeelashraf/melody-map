# Phase 6: Instrument-Specific Cues + Editor Precision - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-21T00:00:00Z
**Phase:** 06-instrument-specific-cues-editor-precision
**Areas discussed:** Editor workflow, Percussion display, Copy action UX, Cue interaction model

---

## Editor workflow

### Per-line editing organization

| Option | Description | Selected |
|--------|-------------|----------|
| One instrument at a time | Pick piano, guitar, or percussion, then edit only that instrument's cues for every lyric line | |
| Show all instruments | Render piano, guitar, and percussion cue editors together for each lyric line | |
| String + percussion split | Show piano/guitar together, but keep percussion in a separate editing mode | |
| Freeform | One instrument at a time per line, but any line can be switched to another instrument while editing | ✓ |

**User's choice:** One instrument at a time per line, with line cue editing switchable to another instrument at any point.
**Notes:** This refines the original option set into a line-local instrument editing model rather than a fully global one.

### Non-selected instrument visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Nothing extra | Only show the active instrument editor plus the lyric row | ✓ |
| Read-only summaries | Show compact non-editable previews of the other instruments on the same line | |
| Quick switch chips | Show mini instrument chips with cue snippets for fast switching | |

**User's choice:** Nothing extra.
**Notes:** Non-selected instruments should not clutter the line while editing.

### Instrument switch placement

| Option | Description | Selected |
|--------|-------------|----------|
| Section-level toggle | One toggle above the lyric-line list controls which instrument is being edited | |
| Per-line toggle | Each lyric line has its own instrument switcher | |
| Both | Global toggle plus optional line-level override | ✓ |

**User's choice:** Both.
**Notes:** The final context interprets this as a broader control plus per-line override.

---

## Percussion display

### Performance lane labeling

| Option | Description | Selected |
|--------|-------------|----------|
| Letters only | Show `C H R S B` as compact lane labels | |
| Letters + legend | Show compact letters in the lanes and a small legend explaining them | ✓ |
| Full names | Render crash, hi-hat, ride, snare, bass in full | |

**User's choice:** Letters + legend.
**Notes:** Compact reading wins, but lane meaning must remain obvious.

### Edit-view grouping

| Option | Description | Selected |
|--------|-------------|----------|
| Single percussion block | When percussion is active for a line, show all 5 lanes stacked together above the lyric row | ✓ |
| One lane at a time | Edit one percussion lane at a time like piano/guitar cues | |
| Collapsible lanes | Show one lane, expand the rest on demand | |

**User's choice:** Single percussion block.
**Notes:** Percussion should be edited as one coherent pattern rather than five isolated mini-editors.

### Blank spacer lines

| Option | Description | Selected |
|--------|-------------|----------|
| Keep blank spacer | No percussion lanes for blank lyric spacer lines | |
| Allow percussion only | Blank lyric lines can still carry percussion lanes | |
| Match current line rules | Treat blank spacer lines as non-editable spacing rows | ✓ |

**User's choice:** Match current line rules.
**Notes:** Preserves verse-spacing semantics from the current lyric model.

---

## Copy action UX

### Copy action placement

| Option | Description | Selected |
|--------|-------------|----------|
| Line action row | Place copy actions near Insert/Remove and other line controls | ✓ |
| Inside cue editor | Show copy actions within the active instrument cue block | |
| Both | Expose copy actions in line controls and inside the cue editor | |

**User's choice:** Line action row.
**Notes:** Keeps copy actions aligned with other line-scoped operations.

### Percussion copy scope

| Option | Description | Selected |
|--------|-------------|----------|
| All 5 lanes together | Treat percussion as one bundled cue set for copy operations | ✓ |
| Current lane only | Copy only the currently focused percussion lane | |
| Ask each time | Prompt whether to copy one lane or all lanes | |

**User's choice:** All 5 lanes together.
**Notes:** Percussion is treated as one instrument bundle in copy flows.

### Copy-to-one target selection

| Option | Description | Selected |
|--------|-------------|----------|
| Inline target buttons | Show direct target choices like piano/guitar/percussion | ✓ |
| Small menu | Open a menu or popover to choose the target | |
| Cycle action | Repeated clicks cycle through targets | |

**User's choice:** Inline target buttons.
**Notes:** Avoids extra click depth and keeps the action explicit.

---

## Cue interaction model

### Piano/guitar editing feel

| Option | Description | Selected |
|--------|-------------|----------|
| Tight text rows | Monospace text inputs aligned directly with the lyric row, closer together than today | ✓ |
| True cell grid | Each character position behaves like an editable grid cell | |
| Hybrid row editor | Mostly text rows, but with some grid-like snapping or helpers | |

**User's choice:** Tight text rows.
**Notes:** The phase should improve precision without turning the editor into a full spreadsheet/grid tool.

### Initial cue positioning

| Option | Description | Selected |
|--------|-------------|----------|
| Click in cue row | Directly click the aligned cue row where the chord or beat should begin | |
| Click lyric mirrors cue | Clicking the lyric row also places the cue caret at that character position | |
| Both | Allow either cue-row or lyric-row click to place the active cue position | ✓ |

**User's choice:** Both.
**Notes:** This is meant to reduce first-click uncertainty when aligning cues to lyrics.

### Extra helper level

| Option | Description | Selected |
|--------|-------------|----------|
| No extra helper | Just precise aligned rows and stable caret behavior | |
| Subtle position guide | Add a light visual guide/highlight so cue and lyric positions are easier to track | ✓ |
| Rich editing helpers | Add stronger helpers like rulers, beat markers, or snapping | |

**User's choice:** Subtle position guide.
**Notes:** The helper should improve orientation without adding heavyweight editing chrome.

---

## the agent's Discretion

- Exact design of the subtle position guide/highlight
- Exact layout and icon treatment of line action controls
- Exact placement of the broader instrument switch within the editing section
- Exact legend placement and styling for percussion in performance view

## Deferred Ideas

- PDF import remains deferred to a later phase/backlog item
- Custom instruments or customizable percussion lanes remain out of scope for Phase 6
