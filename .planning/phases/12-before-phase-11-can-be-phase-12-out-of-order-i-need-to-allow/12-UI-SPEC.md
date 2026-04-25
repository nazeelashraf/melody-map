---
phase: 12
slug: before-phase-11-can-be-phase-12-out-of-order-i-need-to-allow
status: draft
shadcn_initialized: true
preset: base-nova
created: 2026-04-24
---

# Phase 12 - UI Design Contract

> Visual and interaction contract for the Phase 12 chord transposition controls in `SheetEditor`.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | base-nova |
| Component library | base-ui |
| Icon library | lucide-react |
| Font | Inter for UI copy; JetBrains Mono for cues, lyric rows, previews, and transpose-sensitive text |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding |
| sm | 8px | Compact element spacing |
| md | 16px | Default element spacing |
| lg | 24px | Section padding |
| xl | 32px | Layout gaps |
| 2xl | 48px | Major section breaks |
| 3xl | 64px | Page-level spacing |

Exceptions: 28px icon action buttons, 36px form controls, 12px inline left/right row padding inside cue and lyric lanes

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 14px | 400 | 1.5 |
| Label | 12px | 500 | 1.33 |
| Heading | 16px | 600 | 1.25 |
| Display | 18px | 600 | 1.2 |

Notation: Use JetBrains Mono at 14px / 500 / 1.5 for cue lines, lyric rows, preview blocks, and transposed chord text. Do not render cue content in proportional type.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `--color-canvas` (`#f6f5f4` light / `#1c1c1e` dark) | Editor canvas, input surfaces, preview surfaces |
| Secondary (30%) | `--color-canvas-muted` (`#e5e5e5` light / `#2c2c2e` dark) | Toolbar wells, muted panels, row separators |
| Accent (10%) | `--color-accent` (`#5e6ad2` light / `#7170ff` dark) | Focus rings, transpose affordance emphasis, selection indicators |
| Destructive | `--color-destructive` (theme token) | Remove-line actions only |

Accent reserved for: keyboard focus rings, the transpose block affordance, guide markers, and selected-state hints. Keep piano, guitar, and drums on their existing identity colors (`--color-piano`, `--color-guitar`, `--color-drums`) rather than recoloring them with the accent token.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | `Apply to Piano` / `Apply to Guitar` |
| Empty state heading | `No lyric lines yet` |
| Empty state body | `Add a line, type lyrics, and place instrument-specific cues directly above the text.` |
| Error state | `Unrecognized chord tokens stay unchanged. Edit the cue text manually if you need a different spelling.` |
| Destructive confirmation | Not used in this phase. Transpose applies immediately and is reversible by applying the opposite semitone step. |

Secondary helper copy: `Percussion cues are not transposed.`

---

## Interaction Contract

- Place one transpose control block in the cue toolbar area, below the instrument context tabs and above the lyric-line editor list.
- Show transpose controls only when the active editor instrument is `piano` or `guitar`.
- Use a compact native select with semitone options from `-11` through `+11`, including `0 semitones` as the default.
- Keep the apply button instrument-specific: `Apply to Piano` or `Apply to Guitar`.
- Disable the apply button while the select value is `0`.
- When the active instrument is `drums`, replace the control row with helper text only; do not show disabled transpose inputs for percussion.
- The control row must wrap cleanly on narrow screens inside the existing muted toolbar panel. Do not introduce horizontal scrolling for the transpose controls.
- Applying transpose rewrites all cue rows for the selected chorded instrument in place and resets the select back to `0 semitones`.
- If a transposed chord grows in width, preserve its original start column and pad lyrics plus aligned cue fields rather than truncating the chord.
- Do not add a confirmation modal, toast, or persistent transpose offset state in this phase.

## Accessibility Contract

- The semitone select must have an explicit accessible name: `Transpose {Instrument} cues by semitones`.
- The apply button must expose the target instrument in visible copy, not icon-only UI.
- Keyboard focus continues to use the solid accent ring already defined in `src/index.css`.
- Helper copy for percussion must remain visible text, not tooltip-only messaging.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | `Button`, `Input`, `Textarea`, `ToggleGroup`, `Dialog` | not required |
| none | Native `<select>` plus existing project components only | not applicable |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
