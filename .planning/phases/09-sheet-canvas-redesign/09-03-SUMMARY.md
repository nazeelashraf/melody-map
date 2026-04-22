# Plan 09-03 Summary — Track-Style Instrument Controls + PerformanceView

## What Changed

### `src/components/SheetEditor.tsx`
1. **Task 1 — Track-style global instrument headers**:
   - Replaced the shadcn `ToggleGroup` global instrument toggle with a horizontal strip of track-header-style `<button>` elements.
   - Each track has a colored left border (`border-l-4`) and muted background when active:
     - Piano: `border-piano bg-piano-muted`
     - Guitar: `border-guitar bg-guitar-muted`
     - Drums: `border-drums bg-drums-muted`
   - Active track shows an `Edit3` icon next to the label.
   - Inactive tracks have transparent background with hover tint.
   - Keyboard navigation: left/right arrows cycle through instruments when focused.
   - ARIA: `role="tab"`, `aria-pressed`, `aria-label` on each button.

2. **Task 2 — Track-style per-line instrument pills**:
   - Replaced the hidden per-line `ToggleGroup` with a compact horizontal pill row.
   - Active pill: filled with instrument color + white text (`bg-piano text-white`, etc.).
   - Inactive pill: `bg-transparent text-muted-foreground border border-border hover:bg-canvas-muted`.
   - Size: `text-[10px] px-2 py-0.5 rounded-full`.
   - Override indicator: when a line differs from the global instrument, the pill row gets `ring-1 ring-accent/30`.
   - Re-clicking an active pill now **clears the override** (updated `handleLineInstrumentChange`).

### `src/components/PerformanceView.tsx`
1. **Task 3 — Track-style instrument tabs**:
   - Restyled `TabsList` with `bg-transparent p-0 gap-1 border-b border-canvas-muted pb-2`.
   - Each `TabsTrigger` has `data-instrument` attribute for CSS targeting.
   - Added custom CSS in `src/index.css` for active tab instrument colors:
     - Piano: `border-piano bg-piano-muted text-piano font-semibold`
     - Guitar: `border-guitar bg-guitar-muted text-guitar font-semibold`
     - Drums: `border-drums bg-drums-muted text-drums font-semibold`
   - Removed heavy card container from `TabsContent` — now uses `bg-canvas rounded-lg p-4 md:p-6`.
   - Performance content uses `bg-canvas-muted/30` instead of `bg-muted/35`.
   - Drum lane labels render as `text-drums font-bold`.
   - Arrangement notes section reduced: `pt-4 border-t border-canvas-muted` with compact heading.

### `src/index.css`
- Added CSS rules for `[data-instrument="..."][data-state="active"]` targeting PerformanceView tabs with instrument identity colors.

## Verification
- `npm run typecheck` — PASSED (no errors)
- `npm run build` — PASSED (production build successful, 2037 modules)

## Deviations
- **PerformanceView tabs**: Used custom CSS in `index.css` instead of Tailwind utility classes because shadcn `TabsTrigger` applies built-in `data-[state=active]` styles that override utility classes. The `data-instrument` attribute + CSS rule approach is more reliable.
- **Eye icon**: Removed from active tab label because shadcn `TabsTrigger` does not support children-as-function pattern; styling is handled purely via CSS.
