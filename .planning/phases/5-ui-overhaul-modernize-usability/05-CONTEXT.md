# Phase 5: UI Overhaul — Modernize and Improve Usability - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Overhaul the visual design, layout, and interaction patterns of Melody Map. Replace inline styles with a modern design system, restructure the app into a holy grail layout, add separate edit and performance view modes with instrument toggles, make the UI responsive for tablet and mobile, and implement dark mode. No new data model capabilities — this is about how the existing functionality is presented and interacted with.

</domain>

<decisions>
## Implementation Decisions

### Styling approach
- **D-01:** Use Tailwind CSS as the styling framework — replace all inline `style={{...}}` objects across all 9 components with Tailwind utility classes
- **D-02:** Use shadcn/ui for UI component primitives (Dialog, Sheet, Toggle, Tabs, Button, Input, Textarea, etc.) — gives accessible, well-designed components that pair with Tailwind + Lucide
- **D-03:** Use Lucide icons for navigation items, actions, instrument badges, and status indicators
- **D-04:** Use Inter as the body font (modern geometric sans-serif with excellent readability); keep monospace for chords and preview areas

### Layout structure
- **D-05:** Holy grail layout — left sidebar (sheet/composition navigation) + top bar (title, actions, view toggle) + main content area
- **D-06:** Sidebar can collapse for focus mode (especially useful in performance view)
- **D-07:** Top bar contains: app branding, view mode toggle (Edit/Performance), dark mode toggle, and contextual actions (export, import)

### View modes
- **D-08:** Two distinct view modes in the sheet editor: Edit mode and Performance mode
- **D-09:** Edit mode shows all instruments with arrangement panels, chord editing, lyrics textarea — full editing capability (current behavior, redesigned)
- **D-10:** Performance mode shows single instrument focus — each band member selects their instrument tab (Piano/Guitar/Drums) and sees only lyrics + their arrangement, large chord font, no edit controls
- **D-11:** Performance mode is optimized for reading during rehearsal/performance — bigger fonts, minimal chrome, instrument toggle prominent
- **D-12:** Instrument set stays fixed at piano/guitar/drums (extensible architecture per ARR-07, but no custom instruments in this phase)

### Responsive behavior
- **D-13:** Responsive for desktop, tablet, and mobile — sidebar collapses to hamburger menu on narrow screens, content stacks vertically on mobile, controls remain accessible
- **D-14:** This expands REQUIREMENTS.md: "Mobile-responsive layout" was Out of Scope in v1, but is now included in this phase

### Dark mode
- **D-15:** Implement VIS-01 (dark mode toggle) as part of this overhaul — user can toggle between light and dark themes
- **D-16:** Tailwind's `dark:` variants for theme switching, shadcn has built-in dark mode support
- **D-17:** Theme preference persists in localStorage (consistent with existing persistence approach)

### the agent's Discretion
- Exact spacing, padding, and border-radius values for the design system
- Color palette details beyond light/dark mode tokens
- Animation/transition specifics for view mode switching
- Sidebar content ordering and grouping
- Performance mode font sizing scale

### Folded Todos
(NONE — no matching todos found)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data model and schemas
- `src/schemas/sheet.schema.ts` — Zod schemas for Sheet and Composition (instrument types, lyrics lines structure)
- `src/types/index.ts` — TypeScript interfaces (Sheet, Composition, InstrumentType, LyricsLine)

### Existing components (pre-overhaul reference)
- `src/components/SheetList.tsx` — Library home with inline styles (to be replaced with Tailwind + shadcn)
- `src/components/SheetEditor.tsx` — Sheet editor with ~300 lines of inline styles (to be redesigned)
- `src/components/CompositionEditor.tsx` — Composition editor with inline styles (to be redesigned)
- `src/components/CompositionCard.tsx` — Composition card for library (to be redesigned)
- `src/components/SheetCard.tsx` — Sheet card for library (to be redesigned)
- `src/components/EmptyState.tsx` — Reusable empty state placeholder (to be redesigned with shadcn)
- `src/components/ConfirmDialog.tsx` — Reusable confirmation modal (to be replaced with shadcn Dialog)
- `src/components/ImportDialog.tsx` — File picker dialog with Zod validation (to be replaced with shadcn Dialog)
- `src/components/ExportButton.tsx` — JSON export button (to be redesigned)

### Context and hooks
- `src/context/SheetContext.tsx` — Sheet state with useReducer (interface remains, UI layer changes)
- `src/context/CompositionContext.tsx` — Composition state with useReducer (interface remains, UI layer changes)
- `src/hooks/useLocalStorage.ts` — Persistence hook (will be extended for theme preference)

### Styles
- `src/styles/print.css` — Print stylesheet (should be preserved/adapted for new layout)

### Project constraints
- `.planning/PROJECT.md` — Core value, constraints, and key decisions
- `.planning/REQUIREMENTS.md` — v1 requirements (all complete), v2 requirements including VIS-01 (dark mode)
- `.planning/ROADMAP.md` — Phase 5 definition

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/context/SheetContext.tsx` and `src/context/CompositionContext.tsx` — State management stays, UI layer replaces inline styles
- `src/hooks/useLocalStorage.ts` — Can be extended or reused for theme preference persistence
- `src/schemas/sheet.schema.ts` — `instrumentTypes` array drives the three arrangement panels; will power instrument tab/toggle UI
- `ConfirmDialog.tsx`, `ImportDialog.tsx` — Logic to keep, UI to replace with shadcn Dialog primitive
- `EmptyState.tsx` — Logic to keep, UI to replace with shadcn + Tailwind styling
- `print.css` — Print styles need updating to match new layout structure

### Established Patterns
- All 9 components use inline `style={{...}}` with no shared design tokens — every component duplicates colors (#3b82f6, #111827, #6b7280, etc.), border-radius values, and font sizes
- Resources are identified by `id` (UUID) — navigation and routing uses `/sheet/:id` and `/composition/:id`
- Edit flows use local state (`useState`) for drafts, dispatching to context on blur/commit
- Modal overlays use fixed positioning with backdrop (`position: 'fixed'`, `inset: 0`, `zIndex: 50`) — shadcn Dialog handles this

### Integration Points
- New sidebar component needs to render SheetCard/CompositionCard list and navigate to editor routes
- View mode toggle (Edit/Performance) needs state — could be local state or URL param
- Dark mode toggle needs a theme provider (likely CSS class on `<html>` element via Tailwind dark mode strategy)
- Performance view is a new rendering path for SheetEditor — same data, different layout and controls
- Existing React Router routes (`/`, `/sheet/:id`, `/composition/:id`) stay the same; new layout wraps them

</code_context>

<specifics>
## Specific Ideas

- "Imagine you're a band trying to piece together chords for your instrumentalists so they can follow the chords easily. Sometimes the guitar chords may be different because they are playing in a transpose vs the piano."
- "For the same sheet, there should be toggles for guitar, piano and drums so each member can access the setup for their instrument."
- "The edit mode can help the user edit it for all instruments."
- "Needs more icons, modern design (think holy grail layout) and fonts."
- Performance view: single instrument focus — big chords, no edit chrome, optimized for reading during rehearsal

</specifics>

<deferred>
## Deferred Ideas

- Custom instruments (bass, vocals, etc.) — ARR-07 architecture supports extensibility but adding user-defined instruments changes the data model significantly; belongs in a future phase
- Section markers (Verse, Chorus, Bridge) — STRUC-01/STRUC-02 are v2 requirements, separate from this UI overhaul
- Audio playback / metronome — AUDIO-01 is a separate v2 capability

</deferred>

---

*Phase: 05-ui-overhaul-modernize-usability*
*Context gathered: 2026-04-20*