# DESIGN.md — Melody Map

> A synthesized design language for Melody Map, blending Notion (sheet canvas), Linear (app shell), Figma (collaboration), and Miro (instrument track layout).

---

## 1. Visual Theme & Atmosphere

Melody Map operates in two distinct spatial zones that never compete:

- **The sheet canvas** — warm, paper-like, editorial. Lyrics breathe here. Chord symbols float above like handwritten annotations. The feel is a quality lead sheet, not a software form.
- **The app shell (sidebar + toolbar)** — dark, precise, unobtrusive. Song library, setlists, instrument tracks. It recedes so the canvas can sing.

The instrument track area bridges both zones: Miro's pastel pairs assign a distinct warm color per instrument, creating glanceable structure without visual noise.

**Key characteristics:**
- Light canvas: warm white (`#f6f5f4`) background, near-black text (`rgba(0,0,0,0.95)`)
- Dark sidebar: near-black (`#0f1011`) with luminance-stepped surfaces
- Inter Variable as the system font throughout — weight 510 is the UI workhorse
- Berkeley Mono for all chord symbols and notation labels
- One chromatic accent: Linear's indigo-violet (`#5e6ad2` / `#7170ff`) for CTAs and chord chips
- Miro's pastel light/dark pairs for instrument track identity
- Dashed violet borders (`1.5px dashed rgba(113,112,255,0.5)`) for all selected elements — the Figma selection metaphor applied to music editing
- Whisper-thin borders everywhere — depth from contrast, not shadows

---

## 2. Color Palette & Roles

### Canvas & Shell

| Name | Value | Role |
|------|-------|------|
| Warm White | `#f6f5f4` | Page background, alternating sections |
| Sheet Surface | `#ffffff` | Active sheet card, input backgrounds |
| Near-Black | `rgba(0,0,0,0.95)` | Primary text on canvas |
| Warm Gray 500 | `#615d59` | Secondary text, descriptions |
| Warm Gray 300 | `#a39e98` | Placeholders, disabled states |
| Sidebar BG | `#0f1011` | Shell sidebar background |
| Sidebar Surface | `#191a1b` | Elevated cards/panels in sidebar |
| Sidebar Hover | `#28282c` | Hover state on sidebar items |
| Primary Text (dark) | `#f7f8f8` | Headings on dark sidebar |
| Secondary Text (dark) | `#d0d6e0` | Body on dark sidebar |
| Muted Text (dark) | `#8a8f98` | Metadata, timestamps on dark |

### Accent (One chromatic color)

| Name | Value | Role |
|------|-------|------|
| Brand Indigo | `#5e6ad2` | Primary CTA buttons |
| Accent Violet | `#7170ff` | Chord chips, interactive links, active states |
| Accent Hover | `#828fff` | Hover on violet elements |
| Chord Chip BG | `rgba(113,112,255,0.08)` | Background of chord symbol chips |
| Chord Chip Border | `rgba(113,112,255,0.4)` | Dashed border on chord chips |

### Section Badges (pill labels for Verse / Chorus / Bridge / etc.)

| Section | Background | Text |
|---------|------------|------|
| Verse | `#f2f9ff` | `#097fe8` |
| Chorus | `#fff0f0` | `#c0392b` |
| Bridge | `#f0fff4` | `#1a7a3a` |
| Pre-Chorus | `#fff8e1` | `#b06a00` |
| Outro | `#f5f0ff` | `#6b3fa0` |
| Intro | `#f6f5f4` | `#615d59` |

### Instrument Track Colors (Miro pastel pairs)

Each instrument is assigned one pastel pair used consistently throughout the app — track rows, avatars, presence indicators, export highlights.

| Instrument | Light Fill | Dark Text |
|------------|-----------|-----------|
| Vocal / Lead | `#ffc6c6` | `#600000` |
| Piano / Keys | `#c3faf5` | `#187574` |
| Guitar | `#ffd8f4` | `#5a0050` |
| Bass | `#ffe6cd` | `#7a3a00` |
| Drums | `#e8e8f5` | `#2e2e6a` |
| Strings | `#d4f5d4` | `#1a5c1a` |
| Brass / Wind | `#fff3cc` | `#7a5c00` |
| Custom / Other | `#f0f0f0` | `#444441` |

### Borders & Elevation

| Name | Value | Use |
|------|-------|-----|
| Canvas border | `1px solid rgba(0,0,0,0.1)` | Sheet cards, dividers on light surfaces |
| Canvas shadow | `rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2px 7.8px, rgba(0,0,0,0.02) 0px 0.8px 2.9px` | Elevated cards on canvas |
| Sidebar border | `1px solid rgba(255,255,255,0.08)` | Cards, inputs in sidebar |
| Sidebar subtle | `1px solid rgba(255,255,255,0.05)` | Dividers in sidebar |
| Track ring | `rgb(224,226,232) 0px 0px 0px 1px` | Instrument track row hover (Miro) |
| Selection border | `1.5px dashed rgba(113,112,255,0.5)` | Selected chord, note, lyric block |
| Focus ring | `2px solid #7170ff` | Keyboard focus on all interactive elements |

---

## 3. Typography Rules

### Font Families

| Family | Use |
|--------|-----|
| `Inter Variable` | All UI — navigation, labels, lyrics, headings. Fallbacks: `SF Pro Display, -apple-system, system-ui` |
| `Berkeley Mono` | Chord symbols, notation labels, key signatures, time signatures. Fallbacks: `ui-monospace, SF Mono, Menlo` |

**OpenType features on Inter:** `"cv01", "ss03"` globally — gives a cleaner, more geometric character (Linear's approach). Also enable `"kern"` on all text.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Song title | Inter Variable | 32px | 510 | 1.10 | -0.704px | Top of the sheet card |
| Section heading | Inter Variable | 20px | 590 | 1.33 | -0.24px | Verse, Chorus, Bridge labels |
| Lyrics body | Inter Variable | 16px | 400 | 1.65 | normal | Generous line height for readability |
| Chord symbol | Berkeley Mono | 14px | 400 | 1.50 | normal | Always violet, always above lyric line |
| Track label | Inter Variable | 11px | 510 | 1.40 | +0.06em | Uppercase, muted — sidebar track names |
| Nav / sidebar item | Inter Variable | 13px | 510 | 1.50 | -0.13px | Sidebar links and section titles |
| Sidebar heading | Inter Variable | 11px | 510 | 1.40 | +0.06em | Uppercase section labels in sidebar |
| Caption / metadata | Inter Variable | 13px | 400 | 1.50 | -0.13px | Last edited, collaborator count |
| Badge / pill | Inter Variable | 12px | 600 | 1.33 | +0.125px | Section labels, status tags |
| Button | Inter Variable | 14px | 510 | 1.40 | normal | CTAs and toolbar buttons |
| Micro label | Inter Variable | 10px | 510 | 1.50 | -0.15px | Timestamps, subtle overlines |

### Principles

- **Weight 510 is the UI workhorse.** Use it for navigation, labels, toolbar items, and any text that guides the user. 400 is for reading (lyrics). 590 is for announcing (section headings, song title emphasis).
- **Chord symbols never use Inter.** Berkeley Mono creates an unmistakable visual lane — instantly recognizable as notation, not lyric or label.
- **Negative tracking at scale.** Song title at 32px uses -0.704px. Below 16px, tracking normalizes. Badge text uses positive tracking (+0.125px) for legibility at small sizes.
- **Lyrics need room.** Line height 1.65 on lyric body — musicians scan line by line while playing; generous spacing prevents rushing.
- **Sidebar text is always cool.** Canvas text is warm near-black (`rgba(0,0,0,0.95)`). Sidebar text is always pulled from the Linear grayscale (`#f7f8f8`, `#d0d6e0`, `#8a8f98`). Never mix the two palettes.

---

## 4. Component Stylings

### Buttons

**Primary CTA (Indigo)**
- Background: `#5e6ad2`
- Text: `#ffffff`
- Padding: `8px 16px`
- Radius: `6px`
- Hover: `#7170ff`
- Use: "New song", "Save", "Share"

**Ghost / Secondary (Canvas)**
- Background: `rgba(0,0,0,0.04)`
- Text: `rgba(0,0,0,0.95)`
- Border: `0.5px solid rgba(0,0,0,0.1)`
- Padding: `8px 16px`
- Radius: `4px`
- Hover: `rgba(0,0,0,0.08)` background
- Use: "Export PDF", "Duplicate", "Cancel"

**Sidebar Ghost (Dark surface)**
- Background: `rgba(255,255,255,0.02)`
- Text: `#d0d6e0`
- Border: `1px solid rgba(255,255,255,0.08)`
- Radius: `6px`
- Hover: `rgba(255,255,255,0.05)` background
- Use: Sidebar actions, toolbar buttons

**Toolbar Icon Button**
- Background: `rgba(255,255,255,0.05)`
- Radius: `50%` (circle)
- Border: `1px solid rgba(255,255,255,0.08)`
- Size: 32×32px
- Use: Play, transpose, insert chord

**Pill Tag (Section labels)**
- Radius: `9999px`
- Padding: `3px 10px`
- Font: `12px Inter 600`
- Letter-spacing: `+0.125px`
- Colors: per section badge table above

### Chord Chips

The primary distinctive component. Chord symbols float above lyric lines in monospace violet chips with dashed borders.

- Background: `rgba(113,112,255,0.08)`
- Text: `#7170ff`
- Font: `Berkeley Mono 14px`
- Padding: `3px 10px`
- Radius: `4px`
- Border: `0.5px dashed rgba(113,112,255,0.4)`
- Selected state: border becomes `1.5px dashed rgba(113,112,255,0.8)`, background `rgba(113,112,255,0.14)`

### Sheet Card

The main editing surface for a song.

- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.1)`
- Radius: `12px`
- Shadow: 3-layer stack (max opacity 0.04)
- Padding: `32px 40px`
- Max-width: `860px` centered on warm white canvas

### Instrument Track Row

Horizontal rows stacked in the track panel, inspired by Miro's spatial canvas logic.

- Background: instrument's pastel light color (see table)
- Radius: `6px`
- Height: `28px`
- Track label: uppercase Inter 10px 510, instrument's dark color
- Border: none; track ring (`rgb(224,226,232) 0px 0px 0px 1px`) on hover
- Selected: `1.5px dashed rgba(113,112,255,0.5)` outline

### Presence Avatars (Collaboration)

Inspired by Figma's multi-user color logic. Each collaborator gets a Miro pastel pair as their identity color — consistent across their cursor, avatar, and any edits they make.

- Shape: `50%` circle
- Size: `28px`
- Background: collaborator's assigned pastel light color
- Text: initials, collaborator's pastel dark color
- Border: `2px solid` page background (creates stacking effect)
- Stack with `-6px` left margin for groups

### Sidebar Navigation

- Background: `#0f1011`
- Active item: `rgba(255,255,255,0.05)` background + `#f7f8f8` text + `4px` left accent bar in `#7170ff`
- Hover item: `rgba(255,255,255,0.03)` background
- Section label: 11px Inter 510 uppercase, `#62666d`, letter-spacing `+0.06em`
- Item text: 13px Inter 510, `#d0d6e0`
- Radius on items: `6px`

### Inputs & Forms

- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.1)`
- Radius: `4px`
- Padding: `8px 12px`
- Font: Inter 14px 400
- Placeholder: `#a39e98`
- Focus: `2px solid #7170ff` outline, `rgba(113,112,255,0.08)` background tint

---

## 5. Layout Principles

### Spatial Zones

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR (dark, #0f1011)   │  SHEET CANVAS (warm, #f6f5f4) │
│                            │                                │
│  Song library              │  ┌─────────────────────────┐  │
│  Setlists                  │  │  Sheet card (#ffffff)   │  │
│  Shared songs              │  │                         │  │
│  ─────────────────         │  │  [Am7] [Dm7] [G7]       │  │
│  INSTRUMENT TRACKS         │  │  Lyric line here...     │  │
│  ── Vocal  ████████        │  │                         │  │
│  ── Keys   ████████        │  │  [Section: Chorus]      │  │
│  ── Guitar ████████        │  │  ...                    │  │
│                            │  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Spacing System

- Base unit: `8px`
- Scale: `4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px`
- Sheet card internal padding: `32px 40px` (desktop), `24px 20px` (mobile)
- Between section blocks on sheet: `40px`
- Sidebar item height: `36px`
- Track row height: `28px`
- Track row gap: `6px`

### Grid & Container

- Sidebar width: `240px` (collapsible to `48px` icon rail)
- Sheet canvas max-width: `860px`, centered
- Track panel height: flexible, min `120px`
- Sheet + track panel split: sheet is primary; track panel sits below or as a right panel depending on viewport

### Whitespace Philosophy

- **Canvas breathes.** 80px+ vertical padding between song sections. Musicians read sheet music across a page — crowding is the enemy.
- **Sidebar is dense.** 8px gaps, compact 36px rows. It's a navigator, not a reading surface.
- **Contrast does the work.** No heavy shadows. The shift from `#0f1011` sidebar to `#f6f5f4` canvas communicates zone instantly.

### Border Radius Scale

| Size | Value | Use |
|------|-------|-----|
| Micro | `2px` | Inline badges, toolbar mini-buttons |
| Subtle | `4px` | Buttons, inputs, chord chips |
| Standard | `6px` | Sidebar items, functional containers |
| Card | `12px` | Sheet cards, featured panels |
| Large | `16px` | Hero cards, modal dialogs |
| Full pill | `9999px` | Section badges, filter chips, status tags |
| Circle | `50%` | Presence avatars, icon buttons |

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow, no border | Canvas background, track rows |
| Whisper | `1px solid rgba(0,0,0,0.1)` | Sheet card borders, dividers |
| Soft card | 3-layer shadow stack (max opacity 0.04) | Sheet cards on canvas |
| Sidebar surface | `rgba(255,255,255,0.02–0.05)` bg + `rgba(255,255,255,0.08)` border | Cards, panels in sidebar |
| Dialog | 5-layer shadow stack (max opacity 0.05, 52px blur) | Modals, command palette |
| Selection | `1.5px dashed rgba(113,112,255,0.5)` | Selected chord/lyric — no shadow |
| Focus | `2px solid #7170ff` outline | Keyboard navigation |

**Shadow philosophy:** No single hard shadow anywhere. Canvas cards use Notion's multi-layer ambient stack — depth you feel, not see. Sidebar uses Linear's luminance stepping (`rgba(255,255,255, 0.02 → 0.04 → 0.05)` for successive levels) instead of shadows. The only solid visual treatment is the selection dashed border.

---

## 7. Selection & Interaction Language

Borrowed directly from Figma's editor metaphor — the website UI language references the product UI language.

- **Selected chord chip:** dashed violet border thickens, background deepens slightly
- **Selected lyric block:** dashed violet outline wraps the entire text block (`border-radius: 4px`)
- **Selected track row:** dashed violet outline around the full row
- **Focus on any input:** solid violet ring (`2px solid #7170ff`) — distinct from selection (dashed) vs focus (solid)
- **Cursor in editing mode:** standard text cursor; no custom cursor
- **Hover on track row:** ring shadow appears (`rgb(224,226,232) 0px 0px 0px 1px`)

The **dashed = selected / editable** pattern is the single most important interaction convention in Melody Map. Apply it consistently — users learn it once, it works everywhere.

---

## 8. Do's and Don'ts

### Do
- Keep the sheet canvas warm — `#f6f5f4` and `#ffffff` only. Never introduce cool gray to the canvas zone.
- Use dashed violet borders for every selected element — chord, lyric, track, block.
- Assign instrument colors from the Miro pastel pair table and keep them stable — same color on every screen, in exports, in avatars.
- Use `Berkeley Mono` for every chord symbol. No exceptions.
- Use Inter weight 510 for all navigation, labels, and UI text. 400 for lyrics. 590 for section headings only.
- Reserve `#7170ff` exclusively for chords and interactive CTAs. Don't use it decoratively.
- Use `1px solid rgba(0,0,0,0.1)` (Notion's whisper border) on all canvas-side containers.
- Use `rgba(255,255,255,0.08)` borders on all sidebar-side containers.
- Let section badges (Verse, Chorus, etc.) carry their own semantic colors — these are the only color variety on the canvas.

### Don't
- Don't apply the dark sidebar palette to the sheet canvas — the zone split is load-bearing.
- Don't use more than 2 pastel instrument colors visible in the same viewport section.
- Don't use solid borders on dark surfaces — always semi-transparent white.
- Don't use solid focus outlines on selected elements — dashed is selection, solid is focus. Keep them distinct.
- Don't add decorative drop shadows — elevation comes from background contrast and the multi-layer ambient stack.
- Don't introduce warm colors (coral, orange) as interactive accent colors — those are instrument identity colors only.
- Don't use Inter weight 700 (bold) anywhere — the maximum is 590. 510 is the default emphasis.
- Don't use positive letter-spacing on text above 16px — tracking is negative at scale, normal below.
- Don't put chord symbols in Inter — it breaks the visual lane that separates notation from lyrics.

---

## 9. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <600px | Sidebar hidden (bottom nav or drawer), single-column canvas, track panel collapsed |
| Tablet | 600–900px | Sidebar collapses to icon rail (48px), sheet card full width |
| Desktop | 900–1280px | Full sidebar (240px) + sheet canvas + optional track panel |
| Large | >1280px | Generous canvas margins, track panel may sit alongside |

### Collapsing Strategy

- Song title: 32px → 24px → 20px
- Section headings: 20px → 16px, letter-spacing relaxes
- Sheet card padding: `32px 40px` → `24px 20px` → `16px 12px`
- Track panel: full height → collapsed accordion → hidden (accessible via icon)
- Chord chips: same size at all breakpoints — they must always be legible
- Presence avatars: stack of 3 max on mobile, expand on desktop

---

## 10. Agent Prompt Guide

### Quick Color Reference
```
Canvas background:    #f6f5f4
Sheet surface:        #ffffff
Primary text:         rgba(0,0,0,0.95)
Secondary text:       #615d59
Muted text:           #a39e98
Sidebar background:   #0f1011
Sidebar surface:      #191a1b
Sidebar text:         #f7f8f8
Sidebar body:         #d0d6e0
Sidebar muted:        #8a8f98
CTA button:           #5e6ad2
Chord accent:         #7170ff
Chord hover:          #828fff
Chord chip bg:        rgba(113,112,255,0.08)
Canvas border:        1px solid rgba(0,0,0,0.1)
Sidebar border:       1px solid rgba(255,255,255,0.08)
Selection border:     1.5px dashed rgba(113,112,255,0.5)
Focus ring:           2px solid #7170ff
```

### Example Component Prompts

**Sheet card with lyrics and chords:**
> "Create a white card (`#ffffff`, `1px solid rgba(0,0,0,0.1)`, `12px` radius, 3-layer ambient shadow). Song title at 32px Inter Variable weight 510, letter-spacing -0.704px. Section label 'Verse I' at 20px weight 590, letter-spacing -0.24px. Chord chips above each lyric phrase: Berkeley Mono 14px `#7170ff`, `rgba(113,112,255,0.08)` background, `0.5px dashed rgba(113,112,255,0.4)` border, `4px` radius. Lyric text at 16px Inter 400, line-height 1.65, `rgba(0,0,0,0.95)`. Card padding 32px 40px."

**Sidebar with song list:**
> "Dark sidebar `#0f1011`, width 240px. Section labels: Inter 11px weight 510 uppercase, letter-spacing +0.06em, color `#62666d`. Song items: 36px tall, `6px` radius, Inter 13px weight 510 `#d0d6e0`. Active item: `rgba(255,255,255,0.05)` background, `#f7f8f8` text, `4px` left bar in `#7170ff`. Hover: `rgba(255,255,255,0.03)` background."

**Instrument track panel:**
> "Stack horizontal track rows, each 28px tall, `6px` radius, `6px` gap. Vocal row: `#ffc6c6` background. Keys row: `#c3faf5`. Guitar: `#ffd8f4`. Bass: `#ffe6cd`. Track label: Inter 10px weight 510 uppercase, instrument's dark color. On hover: ring shadow `rgb(224,226,232) 0px 0px 0px 1px`. Selected: `1.5px dashed rgba(113,112,255,0.5)` outline."

**Primary CTA button:**
> "Background `#5e6ad2`, text `#ffffff`, padding `8px 16px`, radius `6px`, Inter 14px weight 510. Hover: `#7170ff`. Focus: `2px solid #7170ff` outline."

**Section badge:**
> "Pill shape `9999px` radius, padding `3px 10px`, Inter 12px weight 600, letter-spacing +0.125px. Verse: `#f2f9ff` bg / `#097fe8` text. Chorus: `#fff0f0` bg / `#c0392b` text. Bridge: `#f0fff4` bg / `#1a7a3a` text."

**Presence avatar stack:**
> "Circles 28px, `50%` radius, `2px solid #f6f5f4` border (creates separation). Stack with `-6px` left margin. Use Miro pastel pairs for bg/text: first collaborator gets `#ffc6c6` / `#600000`, second gets `#c3faf5` / `#187574`, etc. Show initials at Inter 11px weight 500."

### Iteration Guide

1. **Zone first.** Before any component, ask: is this on the canvas (warm, light) or in the shell (dark, precise)? Never mix the two palettes.
2. **Dashed = selected.** Every selectable element gets `1.5px dashed rgba(113,112,255,0.5)` when active. Solid ring is focus only.
3. **Chords in mono.** Berkeley Mono, always violet (`#7170ff`), always a chip with dashed border. No exceptions.
4. **Instrument colors are identity.** Pick from the Miro pastel table, assign once per instrument, use that color in every context — track rows, avatars, export highlights.
5. **510 navigates, 400 reads, 590 announces.** Apply Inter weights accordingly across all text.
6. **Shadows are cumulative and faint.** Max individual opacity 0.04 on canvas, 0.05 on deep cards. Never a single solid shadow.
7. **Section badges are the only color variety on the canvas.** Everything else is neutral or violet.
8. **Letter-spacing:** -0.704px at 32px, -0.24px at 20px, normal at 16px and below. Mono labels use +0.06em.
