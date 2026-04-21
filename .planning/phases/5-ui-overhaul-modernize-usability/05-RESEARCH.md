# Phase 5: UI Overhaul — Research

**Researched:** 2026-04-20
**Discovery Level:** 1 (Quick Verification — confirming Tailwind v4 + shadcn/ui setup patterns)

## Standard Stack

| Concern | Choice | Version | Why |
|---------|--------|---------|-----|
| Styling framework | Tailwind CSS | v4 (latest) | D-01: Replace all inline styles. Tailwind v4 uses `@tailwindcss/vite` plugin (not PostCSS). Dark mode via CSS class strategy. |
| UI primitives | shadcn/ui | latest | D-02: Accessible, well-designed components that pair with Tailwind + Radix. Copied into project (not npm dep). |
| Icons | Lucide React | latest | D-03: Tree-shakeable, pairs with shadcn/ui. |
| Body font | Inter | via Google Fonts CDN | D-04: Modern geometric sans-serif. Loaded via `@import` in index.css. |

## Architecture Patterns

### Tailwind CSS v4 + Vite Setup
- Install: `npm install tailwindcss @tailwindcss/vite`
- Vite plugin: `import tailwindcss from '@tailwindcss/vite'` → add to `plugins[]` array
- CSS entry: `@import "tailwindcss";` in `src/index.css` (replaces old `@tailwind` directives)
- No `tailwind.config.ts` needed in v4 — configuration is done via CSS `@theme` directive
- Dark mode: CSS class strategy (`.dark` on `<html>` element), enabled via `@custom-variant dark (&:where(.dark, .dark *));` in CSS

### shadcn/ui Setup with Vite
- Init: `npx shadcn@latest init -t vite` — creates `components.json`, `src/lib/utils.ts`, installs `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`
- Add components: `npx shadcn@latest add button dialog alert-dialog input textarea tabs badge sheet toggle`
- Path alias: `@` → `./src` in both `vite.config.ts` and `tsconfig.json`
- Components are copied to `src/components/ui/` — fully owned by the project

### Theme Provider Pattern
- Use `class` strategy: toggle `.dark` class on `<html>` element
- Store preference in localStorage (key: `melody-map-theme`) via existing `useLocalStorage` hook pattern
- Create `src/context/ThemeProvider.tsx` that wraps children and applies class to document root
- shadcn/ui has built-in dark mode support — all components use `dark:` variants automatically

### Holy Grail Layout Pattern
- Sidebar (left): Navigation list of sheets/compositions. Collapsible via state toggle.
- TopBar (top): App branding, view mode toggle, dark mode toggle, contextual actions
- Main content (center): Route-dependent content (SheetList, SheetEditor, CompositionEditor)
- Implementation: CSS Grid on `AppLayout` — `grid-template-columns: auto 1fr` + `grid-template-rows: auto 1fr`
- Responsive: Sidebar collapses to hamburger menu on `<768px` width (Tailwind `md:` breakpoint)

### View Mode Pattern
- State: `viewMode: 'edit' | 'performance'` stored in SheetEditor local state
- Edit mode: Current full editing capability, redesigned with Tailwind + shadcn
- Performance mode: Tabs component for instrument selection (Piano/Guitar/Drums), each tab shows lyrics + that instrument's chords + arrangement, large font, no edit controls
- Toggle: In TopBar or SheetEditor header — uses shadcn Tabs or ToggleGroup

## Don't Hand-Roll

| What | Why | Use Instead |
|------|-----|-------------|
| Modal/Dialog overlay | Accessibility, focus trap, escape handling | shadcn Dialog / AlertDialog |
| Button variants | Consistent styling, disabled states, loading states | shadcn Button with variants |
| Form inputs | Consistent focus ring, dark mode, error states | shadcn Input / Textarea |
| Tab navigation | ARIA tabs pattern, keyboard nav | shadcn Tabs |
| Sheet/drawer | Mobile sidebar, slide-in pattern | shadcn Sheet |
| Icon rendering | Consistent sizing, tree-shaking | Lucide React components |

## Common Pitfalls

1. **Tailwind v4 vs v3 config:** v4 does NOT use `tailwind.config.ts` or `postcss.config.js`. All config is in CSS via `@theme` and `@variant`. Do NOT follow v3 guides.
2. **shadcn/ui path alias:** Must configure BOTH `vite.config.ts` (resolve.alias) AND `tsconfig.json` (compilerOptions.paths) or imports will fail at runtime.
3. **Dark mode class timing:** ThemeProvider must apply `.dark` class BEFORE first render — use a `<script>` tag in `index.html` or sync `useEffect` with layout effect to prevent flash of wrong theme.
4. **Inline styles override Tailwind:** If any inline `style={{}}` remains, it can override Tailwind utilities. Must remove ALL inline styles from migrated components.
5. **Print CSS specificity:** New Tailwind classes may conflict with `print.css` rules. Update print selectors to target the new layout structure (sidebar, topbar should hide in print).
6. **React Router + Layout:** AppLayout must be inside `<BrowserRouter>` but wrapping `<Routes>` — otherwise route-based props won't propagate correctly.

## Security Notes

- No backend concerns (frontend-only app)
- No user-generated content rendering (no XSS vectors beyond React's built-in escaping)
- localStorage persistence is same-origin only
- Theme preference in localStorage is a simple string — no injection risk
