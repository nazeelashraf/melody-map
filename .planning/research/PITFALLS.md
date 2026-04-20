# Pitfalls Research

**Domain:** Frontend-only music arrangement editor (SPA)
**Researched:** 2026-04-20
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Unvalidated JSON Import Corrupting State

**What goes wrong:**
User imports a malformed or malicious JSON file. The app tries to use it without validation. The app crashes, or partial data gets merged into state, corrupting the sheet list.

**Why it happens:**
Skipping Zod validation on imported JSON because "the user should know better" or to save time.

**How to avoid:**
Always wrap `JSON.parse()` + field access in a Zod `.parse()` call. Return a typed result or a clear error — never an untyped exception that bubbles up.

**Warning signs:**
- Import works with valid JSON but silently fails or throws on invalid
- No user-facing error message when import fails
- App state type is `any` instead of inferred from Zod schema

**Phase to address:**
Phase 1: App foundation must include Zod schema validation for all JSON imports.

---

### Pitfall 2: localStorage Sync Race Condition

**What goes wrong:**
State updates trigger localStorage write in a useEffect. If the user closes the tab immediately after editing, or if the browser suspends the write, data is lost.

**Why it happens:**
useEffect runs after render — it's async relative to the state change. Browser can close tab before it completes.

**How to avoid:**
1. Use a debounced write (300-500ms) to batch rapid edits
2. On critical edits (save button), write synchronously before navigating away
3. Consider `beforeunload` event as a last Resort

**Warning signs:**
- User reports losing work after quick edits
- localStorage shows stale data compared to current UI

**Phase to address:**
Phase 1: App foundation must have a proper `useLocalStorage` hook with debounce.

---

### Pitfall 3: Instrument Arrangement Data Model Too Vague

**What goes wrong:**
The "arrangement" for piano/guitar/drums is left as free-form text. Works initially, but as the app grows, the unstructured data can't support useful features (transposition, part highlighting, section repeat).

**Why it happens:**
Specifying a structured data model for musical notation is complex and feels premature. Free-form text feels flexible.

**How to avoid:**
Define a clear shape for arrangement data in Phase 1, even if implementation is just textareas. Use a Zod schema to enforce structure. Design the schema to be extensible (e.g., `sections: Section[]` where `Section` can hold different content types).

**Warning signs:**
- Arrangement field is `string` with no schema constraints
- Different components interpret arrangement data differently
- No way to programmatically iterate over sections

**Phase to address:**
Phase 1: Define `SheetSchema` with instrument arrangements before any component is built.

---

### Pitfall 4: Overly Complex State Shape

**What goes wrong:**
Sheet state is a deeply nested object with arrays, optional fields, and implicit invariants. Updates require deep cloning. Bugs appear when properties are missed during updates.

**Why it happens:**
Designing state to match the UI instead of the domain. Adding fields as needed without refactoring.

**How to avoid:**
1. Keep state flat where possible: `sheets: Sheet[]` instead of nested objects
2. Use reducer actions with explicit names (`UPDATE_SHEET`, not `setSheets(...)`)
3. Co-locate Zod schema with state type — schema IS the shape definition
4. Normalize data: each entity (Sheet, Composition) gets its own slice

**Warning signs:**
- Spreading `...sheet` and manually overriding fields instead of clear action types
- State shape doesn't match Zod schema (schema is "validation only", not the source of truth)
- `as any` casts appearing in state code

**Phase to address:**
Phase 1: Architecture layer sets the pattern; enforce via code review.

---

### Pitfall 5: Forgetting Print/Export UX

**What goes wrong:**
The app works great on screen, but printing or exporting to PDF shows broken layouts, cut-off lyrics, or ugly arrangement views.

**Why it happens:**
CSS print styles are treated as an afterthought. Flexbox/Grid layouts that work on screen break on paper.

**How to avoid:**
1. Add a basic print stylesheet early (min-width media queries for arrangement panels)
2. Test print preview in browser devtools before Phase 4
3. Keep arrangement view simple — avoid deeply nested flex containers

**Warning signs:**
- No `@media print` CSS rules exist
- Arrangement panels use `flex-wrap: wrap` which page breaks unpredictably

**Phase to address:**
Phase 4: Polish — print stylesheet + browser testing.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using `any` for sheet data | Faster initial typing | Type safety lost; bugs creep in | Never — use Zod + inferred types |
| localStorage without debounce | Simpler code | Writes on every keystroke; potential data loss | Only for trivially small apps |
| One big component for sheet editor | Fewer files | Hard to test; props explode | Only for v0 prototypes |
| No schema for arrangement | "Flexibility" | Data is unstructured; no validation possible | Only if arrangement is truly free-form text |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| File API (JSON import) | Not handling FileReader error states | Wrap in try/catch; check `e.target.result` |
| Blob URL (JSON export) | Not revoking Blob URL after download | Call `URL.revokeObjectURL()` after link click |
| localStorage | Quota exceeded error unhandled | Catch `QuotaExceededError`; warn user |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Re-rendering full sheet list on every edit | UI jank when list grows | `React.memo` on SheetListItem; separate context per entity | 50+ sheets |
| Large lyrics text causing layout shift | Content jumping while typing | Set min-height on textarea | Sheets with 1000+ line lyrics |
| Synchronous localStorage on every state change | Slow typing/editing | Debounce writes (300ms) | Any rapid editing |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| `eval()` on imported JSON | Arbitrary code execution | Never eval — only parse + Zod validate |
| Storing sensitive data in localStorage | Data exposure if device shared | No auth/personal data in app state |
| No CSP headers | XSS via injected script | App is static; CSP meta tag in index.html |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|----------------|
| No save confirmation | User unsure if their edit persisted | Show "Saved" indicator or auto-save toast |
| Import silently fails | User loses the file they tried to import | Show clear error modal with specific reason |
| Deleting sheet without confirmation | Accidental data loss | Confirmation dialog; maybe undo |
| No empty state for sheet list | Blank page confuses new users | Friendly empty state with "Create your first sheet" CTA |

## "Looks Done But Isn't" Checklist

- [ ] **JSON Import:** Often missing Zod validation — verify malformed JSON shows error
- [ ] **localStorage:** Often missing initial load hydration — verify app state loads on fresh page load
- [ ] **Composition reorder:** Often missing — verify dragged sheet actually moves
- [ ] **Instrument panels:** Often missing per-instrument data isolation — verify editing piano doesn't affect guitar

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Import corruption | MEDIUM | User re-exports from backup; app should never silently corrupt |
| localStorage data loss | HIGH (user loses work) | Debounce + synchronous save on critical actions |
| Schema drift | LOW | Zod schema is source of truth; update it, regenerate types |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Unvalidated JSON | Phase 1: App foundation | Try importing a .json with missing fields — must show error |
| localStorage race | Phase 1: App foundation | Rapidly type, close tab, reopen — data must persist |
| Vague data model | Phase 1: App foundation | Schema exists before any component uses it |
| Complex state shape | Phase 1: App foundation | Code review; no spread overrides in reducer |
| Print broken | Phase 4: Polish | Browser print preview shows clean output |

## Sources

- React useEffect docs — synchronization patterns
- Zod docs — schema validation best practices
- localStorage MDN docs — quota and error handling

---
*Pitfalls research for: melody-map song arrangement editor*
*Researched: 2026-04-20*
