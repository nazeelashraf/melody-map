---
phase: 13
slug: let-s-create-a-phase-to-do-performance-mode-in-compositions-
status: draft
shadcn_initialized: true
preset: base-nova
created: 2026-04-25
---

# Phase 13 - UI Design Contract

> Visual and interaction contract for composition performance mode, where a composition renders as one reading-first performance surface with sheets shown in stored order.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | base-nova |
| Component library | base-ui |
| Icon library | lucide-react |
| Font | Inter for UI copy and lyric reading; JetBrains Mono for cues, tempo, instrument labels, and print metadata |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline separators |
| sm | 8px | Compact control spacing |
| md | 16px | Default element spacing |
| lg | 24px | Section padding, header spacing |
| xl | 32px | Gaps between performance regions |
| 2xl | 48px | Break between large page sections |
| 3xl | 64px | Page-level separation for stacked sheets |

Exceptions: 20px horizontal inset inside each sheet section card, 36px compact tab triggers, 28px small icon buttons when reused from existing controls

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 14px | 400 | 1.5 |
| Label | 12px | 500 | 1.33 |
| Heading | 16px | 600 | 1.25 |
| Display | 18px | 600 | 1.2 |

Notation: Use JetBrains Mono at 14px / 500 / 1.5 for chord cues, drum lanes, tempo labels, section indices, and print metadata. Keep lyric reading text in Inter; do not render cues in proportional type.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `--color-canvas` (`#f6f5f4` light / `#1c1c1e` dark) | Main performance surface, sheet reading regions |
| Secondary (30%) | `--color-canvas-muted` (`#e5e5e5` light / `#2c2c2e` dark) | Section borders, tabs well, separators, print boundary hints |
| Accent (10%) | `--color-accent` (`#5e6ad2` light / `#7170ff` dark) | Focus rings and route-entry emphasis only |
| Destructive | `--color-destructive` (theme token) | Missing-sheet warning state only |

Accent reserved for: keyboard focus rings, the entry affordance into performance mode, and selected-state hints. Keep piano, guitar, and drums on their existing identity colors (`--color-piano`, `--color-guitar`, `--color-drums`) instead of recoloring them with the accent token.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | `Performance mode` |
| Empty state heading | `No sheets in this composition yet.` |
| Empty state body | `Add sheets in the composition editor to build a performance set.` |
| Error state | `Missing sheet reference` plus `This slot is still part of the composition order, but its source sheet is no longer in the library.` |
| Destructive confirmation | Not used in this phase. Entering performance mode is navigational only and does not mutate data. |

Supporting copy:

- Header meta: `{N} sheet(s) in performance order`
- Navigation affordance: `Back to edit`
- Section eyebrow: `Sheet {index}`

---

## Interaction Contract

- Add a dedicated composition performance route at `/composition/:id/performance`; do not overload `CompositionEditor` with an inline reader mode.
- Enter composition performance mode from the composition editor header using one visible `Performance mode` action.
- Keep one active instrument context across the entire composition surface. Changing tabs updates every sheet section at once.
- Reuse the existing sheet performance reader patterns for cue rendering, grouped/mono toggle behavior, arrangement notes, and drum-lane display.
- Show piano, guitar, and percussion as top-level tabs only once at the page level; do not render per-sheet instrument tabs.
- Keep the grouped/mono toggle visible for piano and guitar, and hide it entirely for percussion.
- Render sheets strictly in `composition.sheetIds` order joined against live `SheetContext` data.
- Wrap each sheet in a structural section with a visible boundary, sheet index, sheet title, and tempo so one song never blends into the next.
- Preserve sheet order slots even when a referenced sheet is missing; replace missing content with a visible warning block instead of silently skipping it.
- Keep screen spacing generous between sections and ensure section boundaries remain obvious in print.
- Reuse the existing performance-mode shell treatment (`performance-mode-active`) so chrome recesses consistently with single-sheet performance mode.
- Print output must include the composition title, total entry count, active instrument label, and clear section boundaries between sheets.
- Empty compositions must render a dedicated empty state within the performance surface rather than redirecting away.
- Missing compositions should keep the existing not-found pattern and offer navigation back to the library.

## Accessibility Contract

- Instrument tabs must keep visible text labels (`Piano`, `Guitar`, `Percussion`) and may pair them with icons, but never icon-only triggers.
- The route-entry control to performance mode must expose visible text, not an unlabeled eye icon.
- `Back to edit` must remain a visible text link or button on screen and be hidden from print.
- Each sheet section must expose a readable heading structure: section index, sheet title, and tempo as visible text.
- Missing-sheet states must remain visible inline text, not tooltip-only or color-only warnings.
- Keyboard focus continues to use the solid accent ring defined in `src/index.css`.
- Print-specific hiding must remove non-essential chrome only; the active instrument and section labels must still print as text.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | `Button`, `Tabs`, `Badge`, existing button variants | not required |
| none | Native semantic sections, links, and print-only wrappers | not applicable |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
