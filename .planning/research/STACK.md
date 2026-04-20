# Stack Research

**Domain:** Frontend-only music arrangement editor (single-page web app)
**Researched:** 2026-04-20
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|----------------|
| React | 18.x | UI rendering | Component model fits arrangement editor well; hooks for state; vast ecosystem |
| TypeScript | 5.x | Type safety | Prevents data model bugs; excellent IDE support; strict mode catches errors early |
| Vite | 5.x | Build tool | Fast HMR essential for editor UX; native ESM; minimal config; React plugin is solid |
| Zod | 3.24.x | Schema validation | TypeScript-first; used for JSON import/export validation; static type inference |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React Router DOM | 7.x | SPA routing | When separating sheet list from editor views |
| @chakra-ui/react or radix-ui | latest | UI primitives | Accessible components without fighting default styles |
| uuid | 9.x | ID generation | For sheet/composition entity IDs |
| lodash | 4.x | Utilities | Debounce, cloneDeep for state management helpers |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint + TypeScript plugin | Code quality | Enable strict TypeScript rules |
| Prettier | Formatting | Single config, no debates |
| Vite built-in HMR | DX | Instant feedback during editing |

## Installation

```bash
npm create vite@latest melody-map -- --template react-ts
cd melody-map
npm install
npm install react-router-dom zod uuid lodash @radix-ui/react-dialog @radix-ui/react-tabs
npm install -D @types/uuid @types/lodash
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|------------------------|
| React | Solid.js | If bundle size is critical — Solid has smaller footprint but smaller ecosystem |
| React | Vue | If team knows Vue — same reasoning |
| Vite | CRA | CRA is effectively deprecated; Vite is faster and modern |
| Zod | Yup | Zod has better TypeScript inference and is actively maintained |
| localStorage | IndexedDB | IndexedDB better for large/complex objects; localStorage is simpler for this scope |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Prop drilling for shared state | Maintenance nightmare at scale | React Context or Zustand |
| any type | Defeats TypeScript purpose | z.unknown then narrow with Zod |
| Class components | Outdated patterns | Functional + hooks |
| Class-based state management | verbose | useReducer + Context |

## Stack Patterns by Variant

**If composition/complexity grows:**
- Add Zustand for global state (lighter than Redux, simpler than Context for many slices)
- Add React Query only if async data needs arise

**If need for offline/PWA:**
- Use Workbox for service worker
- Consider IndexedDB via Dexie.js instead of localStorage for larger datasets

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| React 18.x | Vite 5.x | Native ESM, no special config needed |
| React 18.x | React Router DOM 7.x | Supports React 18 |
| Zod 3.24.x | TypeScript 5.x | Full inference support |
| Vite 5.x | TypeScript 5.x | `vite.config.ts` uses esbuild for TS transpilation |

## Sources

- /websites/react_dev — React hooks, useState, useReducer, useEffect patterns
- /websites/vite_dev — Vite project setup, TypeScript config, build options
- /websites/zod_dev — Zod JSON validation, schema parsing for import/export

---
*Stack research for: melody-map song arrangement editor*
*Researched: 2026-04-20*
