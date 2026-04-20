# Phase 4 Research: Import/Export + Polish

**Phase:** 4 — Import/Export + Polish
**Researched:** 2026-04-20
**Confidence:** HIGH
**Scope:** JSON import/export for sheets and compositions, Zod-validated import, error handling, reusable UI components (ConfirmDialog, EmptyState), and print stylesheet.

## Standard Stack

- Reuse the existing stack: React 18, TypeScript 5, React Router DOM 7, Zod 3.24, Vite 5.
- No new dependencies required — browser File API and Blob/URL APIs handle import/export natively.
- Reuse `SheetContext` and `CompositionContext`; no backend, no server, no database.

## Existing Codebase Patterns To Reuse

### State
- `src/context/SheetContext.tsx` — `useReducer` with `CREATE_SHEET`, `UPDATE_SHEET`, `DELETE_SHEET`, `SET_ACTIVE_SHEET` actions. Has `createSheet(title)` helper that generates a UUID, default tempo 120, empty lyricsLines, empty arrangements.
- `src/context/CompositionContext.tsx` — `useReducer` with `CREATE_COMPOSITION`, `UPDATE_COMPOSITION`, `DELETE_COMPOSITION`, `SET_ACTIVE_COMPOSITION` actions. Has `createComposition(title)` helper with UUID, empty sheetIds.

### Schemas
- `src/schemas/sheet.schema.ts` — `sheetSchema` and `compositionSchema` are Zod schemas ready for `safeParse()` on import validation. `lyricsLineSchema` has a refine check ensuring `chords.length === lyrics.length`.
- Schema types: `SheetInput`, `SheetOutput`, `CompositionInput`, `CompositionOutput` are already exported.

### UI Style
- All components use inline `React.CSSProperties` — no CSS files exist yet.
- Consistent design language: blue primary (#3b82f6, #2563eb), dark text (#111827, #0f172a), gray secondary (#6b7280, #64748b), rounded corners (8-18px border-radius), white panel backgrounds with subtle shadows.
- Delete confirmations exist as inline state in `SheetCard.tsx` (lines 14, 109-139) and `CompositionCard.tsx` (lines 14, 104-152) — each component manages its own `showDeleteConfirm` state with inline Yes/No buttons.

### Empty States
- `SheetList.tsx` already has inline empty states for compositions (lines 161-188) and sheets (lines 209-236) — dashed border, centered text, CTA button.
- `SheetEditor.tsx` has inline empty state for "Sheet not found" (lines 152-163) and "No lyric lines yet" (lines 308-312).
- `CompositionEditor.tsx` has inline empty states for "No sheets in composition" (lines 151-155), "No sheets in library" (lines 208-214), and "All sheets already included" (lines 216-219).

## Recommended Implementation Approach

### 1. JSON Export — Browser Download API

Export uses the `Blob` + `URL.createObjectURL` + invisible `<a>` click pattern:

```typescript
function exportToJson(data: Sheet | Composition, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

This is a well-established browser pattern — no libraries needed.

### 2. JSON Import — File Input + FileReader + Zod Validation

Import uses `<input type="file" accept=".json">` + `FileReader.readAsText()`:

```typescript
const reader = new FileReader();
reader.onload = (event) => {
  try {
    const raw = JSON.parse(event.target?.result as string);
    const result = sheetSchema.safeParse(raw);
    if (result.success) {
      dispatch({ type: 'CREATE_SHEET', payload: result.data });
    } else {
      // Show Zod error message
    }
  } catch {
    // Show JSON parse error
  }
};
reader.readAsText(file);
```

Key validation rules from existing schemas:
- `sheetSchema`: id (UUID), title (1-200 chars), tempo (int 20-300), lyricsLines (array with chords.length === lyrics.length), arrangements (piano/guitar/drums strings)
- `compositionSchema`: id (UUID), title (1-200 chars), sheetIds (array of UUIDs)

### 3. Import Conflict Resolution — Assign New ID

Imported sheets and compositions should get a new `crypto.randomUUID()` ID to prevent collisions with existing data. The original ID in the imported JSON is validated (must be UUID format per schema) but replaced with a fresh ID before dispatching the CREATE action. This means:
- User can import the same file multiple times (creates duplicates with different IDs)
- No risk of overwriting existing data
- Composition `sheetIds` that reference sheets not in the current library are preserved — the composition editor already handles "missing sheet" display gracefully.

### 4. ConfirmDialog — Reusable Modal Component

Create a small modal component with:
- `message: string` — what the user is confirming
- `confirmLabel?: string` — button text (default "Delete")
- `onConfirm: () => void` — action on confirm
- `onCancel: () => void` — action on cancel
- Uses a fixed overlay + centered card, matching existing inline confirmation style but in a proper modal so it can be reused across SheetCard, CompositionCard, and future delete actions.

### 5. EmptyState — Reusable Placeholder Component

Create a component with:
- `title: string` — headline (e.g., "No sheets yet")
- `description?: string` — supporting text
- `actionLabel?: string` — CTA button text
- `onAction?: () => void` — CTA button handler
- `icon?: ReactNode` — optional visual element
- Matches the existing inline empty state style (dashed border, centered, CTA button).

### 6. Print Stylesheet

Create `src/styles/print.css` with `@media print` rules:
- Hide navigation, action buttons, input fields, and UI chrome
- Show sheet content: title, tempo, lyrics+chords preview, arrangement text
- Ensure monospace font for chord-aligned content
- Remove background gradients and shadows
- Add page breaks between sections

Import in `src/main.tsx` as a side-effect import: `import './styles/print.css'`.

### 7. Placement of Export/Import Controls

**Export buttons:**
- Sheet export: In `SheetEditor.tsx` header area, next to the "Sheets" back link
- Composition export: In `CompositionEditor.tsx` header area, next to the "Library" back link

**Import buttons:**
- Sheet import: In `SheetList.tsx` header area, alongside existing "+ New Sheet" button
- Composition import: In `SheetList.tsx` header area, alongside existing "+ New Composition" button

## Architecture Patterns

### Pattern: Validate-Then-Create on Import
1. Read file → parse JSON → validate with Zod `safeParse()`
2. If valid: assign new UUID, dispatch CREATE action
3. If invalid: display Zod error message (formatted), do NOT touch existing state

### Pattern: Separate Export From State
Export serializes the current in-memory entity directly — no intermediate storage, no localStorage round-trip. The Zod schema guarantees the shape is correct since it was validated on hydration.

### Pattern: Reusable UI Components With Narrow Interfaces
ConfirmDialog and EmptyState accept props only — no context dependencies, no side effects. They can be tested in isolation.

## Don't Hand-Roll / Don't Do

- Do NOT add file-system APIs, backend endpoints, or server-side processing.
- Do NOT use `localStorage` for import/export — use browser File API.
- Do NOT add new npm dependencies for file handling — browser APIs are sufficient.
- Do NOT validate imported JSON with manual checks — use existing Zod schemas exclusively.
- Do NOT modify Zod schemas for import/export — they are the source of truth.
- Do NOT create a new data model for "imported entity" — imported data becomes a regular Sheet or Composition.

## Common Pitfalls

1. **Import overwrites existing data** — Always assign a new UUID on import, never use the imported ID directly.
2. **Chord-length mismatch on imported sheet** — Zod's refine check on `lyricsLineSchema` catches this, but the error message must be user-friendly (not raw Zod path).
3. **Imported composition references non-existent sheets** — The composition editor already handles this gracefully (shows "Missing sheet"), but the import dialog should warn about it.
4. **Print stylesheet hides too much** — Test that sheet content (lyrics, chords, arrangements) remains visible when printing; only hide chrome.
5. **FileReader async error handling** — `FileReader.onerror` must be handled; `JSON.parse` in `onload` must be wrapped in try/catch.
6. **URL.revokeObjectURL timing** — Revoke after the download starts, not before. Use a short setTimeout or revoke in the click handler.

## Files Likely In Scope

- `src/components/ExportButton.tsx` — NEW
- `src/components/ImportDialog.tsx` — NEW
- `src/components/ConfirmDialog.tsx` — NEW
- `src/components/EmptyState.tsx` — NEW
- `src/styles/print.css` — NEW
- `src/components/SheetEditor.tsx` — MODIFIED (add export button)
- `src/components/CompositionEditor.tsx` — MODIFIED (add export button)
- `src/components/SheetList.tsx` — MODIFIED (add import buttons, refactor empty states)
- `src/components/SheetCard.tsx` — MODIFIED (refactor delete confirm to use ConfirmDialog)
- `src/components/CompositionCard.tsx` — MODIFIED (refactor delete confirm to use ConfirmDialog)
- `src/main.tsx` — MODIFIED (import print.css)

## Verification Guidance

Use repo-native checks:
- `npm run typecheck`
- `npm run build`

Manual/functional checks the plans should cover:
- Export a sheet → .json file downloads
- Import a valid sheet .json → new sheet appears in list
- Import a malformed .json → error message shown, no state corruption
- Export a composition → .json file downloads
- Import a valid composition .json → new composition appears
- Empty list shows friendly CTA
- Delete action shows confirmation dialog
- Print preview shows readable sheet content without UI chrome

## Source Audit Inputs For Planning

### GOAL
- JSON import/export for sheets and compositions, UX polish, print styles

### REQUIREMENTS
- `DATA-01` export sheet as JSON
- `DATA-02` import sheet from JSON
- `DATA-03` imported JSON validated against Sheet Zod schema
- `DATA-04` invalid JSON import shows clear error, preserves existing state
- `DATA-05` export composition as JSON
- `DATA-06` import composition from JSON

### ROADMAP SUCCESS CRITERIA (not covered by DATA-XX IDs)
- Empty states with friendly CTA
- Delete actions show confirmation dialog
- Print stylesheet for readable sheet output

---

*Ready for planning.*
