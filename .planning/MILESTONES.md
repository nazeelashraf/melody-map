# Milestones: Melody Map

## v1.0 — Melody Map v1.0

**Status:** ✓ Complete
**Completed:** 2026-04-22
**Phases:** 1–6
**Summary:** Core app foundation, sheet editor with lyrics and instrument arrangements, composition builder, import/export, UI overhaul with Tailwind/shadcn, and instrument-specific cue model.

---

## v1.1 — DESIGN.md Implementation

**Status:** In Progress
**Started:** 2026-04-22
**Phases:** 7–11
**Summary:** Full visual overhaul implementing the Melody Map design system. Rebuilds app shell, library, sheet editor, performance view, and print output around warm-canvas/dark-shell split, typography roles, focus/selection language, and instrument identity colors. Preserves existing dark-mode toggle, current cue data model, and Phase 6 editing capabilities.

**Key Decisions:**
- Preserve dark-mode toggle (both themes share new shell/canvas language)
- Adapt chord-chip language to current instrument-specific cue model
- Collaboration motifs are visual-only (no multi-user features)
- Subtle motion only, with reduced-motion support
