# Architecture Research

**Domain:** Frontend-only music arrangement editor (SPA)
**Researched:** 2026-04-20
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ SheetList│  │ SheetView│  │CompEditor│  │ExportDial│     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │             │             │              │
├───────┴─────────────┴─────────────┴─────────────┴──────────────┤
│                    State / Context Layer                      │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │ SheetContext     │  │ CompositionCtx  │                     │
│  │ (useReducer)     │  │ (useReducer)    │                     │
│  └────────┬────────┘  └────────┬────────┘                     │
│           │                      │                             │
├───────────┴──────────────────────┴──────────────────────────────┤
│                     Persistence Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  localStorage sync via useEffect                         │  │
│  │  Zod validation for JSON import                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| AppShell | Layout, routing, global nav | React Router + layout component |
| SheetList | Show all sheets, create new | Flat list with delete actions |
| SheetEditor | Edit lyrics, chords, tempo, instruments | Tabbed or split-pane view |
| CompositionEditor | Add/remove/reorder sheets | Drag-and-drop list |
| ImportDialog | File picker, validate JSON, show errors | Modal with Zod parse result |
| ExportButton | Serialize to JSON, trigger download | Button with Blob URL |
| InstrumentPanel | Edit per-instrument arrangement data | Textarea or structured form per instrument |

## Recommended Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/               # Primitive components (Button, Input, Modal)
│   ├── SheetEditor/      # Sheet editing components
│   ├── CompositionEditor/# Composition management components
│   └── ImportExport/     # JSON import/export components
├── context/              # React Context providers
│   ├── SheetContext.tsx  # Sheet state + reducer
│   └── CompositionContext.tsx
├── hooks/                # Custom hooks
│   ├── useLocalStorage.ts
│   └── useSheetExport.ts
├── schemas/              # Zod schemas for validation
│   └── sheet.schema.ts   # Sheet + Composition Zod schemas
├── types/                # TypeScript type definitions
│   └── index.ts          # Core domain types (Sheet, Composition, Instrument)
├── utils/                # Pure utility functions
│   └── json.ts           # JSON parse/stringify with error handling
├── App.tsx
└── main.tsx
```

### Structure Rationale

- **components/ui:** Atomic, reusable, no domain knowledge
- **components/{domain}:** Feature-specific, know about sheets/compositions
- **context/:** Single source of truth per domain; useReducer handles complexity
- **schemas/:** Zod schemas co-located with types; single source of truth for shape
- **hooks/:** Extract reuseable logic (persistence, export) away from components

## Architectural Patterns

### Pattern 1: Reducer + Context for Global State

**What:** Centralized state per domain using `useReducer` + `React.createContext`
**When to use:** When state has multiple related sub-fields or complex updates
**Trade-offs:** More upfront than useState; pays off as complexity grows

```typescript
// SheetContext.tsx
type SheetState = { sheets: Sheet[] };
type SheetAction =
  | { type: 'ADD_SHEET'; payload: Sheet }
  | { type: 'UPDATE_SHEET'; payload: Sheet }
  | { type: 'DELETE_SHEET'; payload: string };

function sheetsReducer(state: SheetState, action: SheetAction): SheetState {
  switch (action.type) {
    case 'ADD_SHEET': return { ...state, sheets: [...state.sheets, action.payload] };
    case 'UPDATE_SHEET': return {
      ...state,
      sheets: state.sheets.map(s => s.id === action.payload.id ? action.payload : s)
    };
    case 'DELETE_SHEET': return {
      ...state,
      sheets: state.sheets.filter(s => s.id !== action.payload)
    };
  }
}
```

### Pattern 2: localStorage Sync via useEffect

**What:** Persist state to localStorage on every change; hydrate on mount
**When to use:** For any state that must survive refresh
**Trade-offs:** Simple but synchronous; fine for small data (<5MB)

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### Pattern 3: Zod-Secured JSON Import/Export

**What:** Validate all incoming JSON against Zod schema before accepting it as app state
**When to use:** Any external data import (file upload, drag-drop)
**Trade-offs:** Zod adds bundle size; worth it for data integrity

```typescript
import { z } from 'zod';

const SheetSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  tempo: z.number().min(20).max(300),
  lyrics: z.string(),
  arrangements: z.record(z.string(), z.string()), // instrument -> content
});

function importSheet(jsonString: string): Sheet | null {
  try {
    const data = JSON.parse(jsonString);
    return SheetSchema.parse(data);
  } catch (e) {
    console.error('Invalid sheet JSON', e);
    return null;
  }
}
```

## Data Flow

### Sheet Edit Flow

```
[User types in InstrumentPanel]
    ↓
[onChange handler dispatches UPDATE_SHEET action]
    ↓
[SheetContext reducer updates sheets array]
    ↓
[Component re-renders with new sheet data]
    ↓
[useEffect detects change, syncs to localStorage]
```

### Import Flow

```
[User selects JSON file]
    ↓
[FileReader reads as text]
    ↓
[Zod schema validates JSON structure]
    ↓
[If valid: dispatch ADD_SHEET; If invalid: show error message]
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|-------------------------|
| 0-100 sheets | localStorage fine; no optimizations needed |
| 100-1000 sheets | Consider virtualized list for sheet list view |
| 1000+ sheets | Consider IndexedDB via Dexie.js; paginate sheet list |

### Scaling Priorities

1. **First bottleneck:** localStorage storage limit (~5MB) — mitigate with JSON compression or moving to IndexedDB
2. **Second bottleneck:** Large sheet (many sections) rendering — React.memo on list items

## Anti-Patterns

### Anti-Pattern 1: Prop Drilling

**What people do:** Passing state through 5+ component layers via props
**Why it's wrong:** Changing one intermediate component breaks everything
**Do this instead:** Use Context at the nearest shared ancestor

### Anti-Pattern 2: localStorage in Reducer

**What people do:** Calling localStorage.setItem() inside the reducer
**Why it's wrong:** Reducers must be pure functions; side effects belong in useEffect
**Do this instead:** useEffect on the state value

### Anti-Pattern 3: No Schema for Import

**What people do:** Accepting any JSON as valid sheet data
**Why it's wrong:** Malformed data corrupts app state silently
**Do this instead:** Always validate with Zod before accepting imported data

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| None for v1 | N/A | Fully offline-capable |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| UI Components ↔ Context | useContext hook | Only components that need state should subscribe |
| ImportExport ↔ SheetContext | dispatch(ADD_SHEET) | Import module doesn't need to know about storage |

## Sources

- React docs (react.dev) — useReducer, useEffect, Context patterns
- Zod docs (zod.dev) — JSON validation patterns
- Vite docs — project structure and build config

---
*Architecture research for: melody-map song arrangement editor*
*Researched: 2026-04-20*
