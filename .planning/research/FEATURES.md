# Feature Research

**Domain:** Song arrangement editor with multi-instrument sheet support
**Researched:** 2026-04-20
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Create sheet | Core workflow — every app needs this | LOW | Must set title and instrument count |
| Edit sheet title | Typos happen; names change | LOW | Inline editing |
| Add/edit lyrics | Primary content alongside arrangements | MEDIUM | Textarea with line-break preservation |
| Add/edit chords | Essential for musicians reading sheets | MEDIUM | Chord symbols alongside lyrics or in separate track |
| Edit tempo | BPM is fundamental to performance | LOW | Numeric input with range validation |
| View sheet list | Navigate between sheets | LOW | Sidebar or home view |
| Delete sheet | Remove unwanted work | LOW | With confirmation |
| Local persistence | App must remember work across refreshes | MEDIUM | localStorage sync via useEffect |
| JSON export | Backup and sharing | LOW | Download as .json file |
| JSON import | Restore from backup or share | MEDIUM | File picker + Zod validation |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Multi-instrument arrangement view | See piano/guitar/drums side-by-side with lyrics | HIGH | Main differentiator; requires thoughtful layout |
| Composition builder | Assemble multi-sheet performances | MEDIUM | Ordered list of sheets; reordering UI |
| Per-instrument chord/section data | Not just chords above lyrics — full arrangement notation | HIGH | Depends on what "arrangement" means — see below |
| Section markers | Label verse/chorus/bridge sections | LOW | Collapsible lyric blocks |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Real-time collaboration | "Modern apps have this" | Significant complexity; conflicts, presence, sync | Single-user local-first is faster to ship |
| Audio playback | "Would be cool" | Large dependency; audio APIs are complex | Defer to v2 if requested |
| PDF export | "Professional output" | PDF generation is painful; print CSS is simpler | Print stylesheet first |
| Automatic chord detection | "AI magic" | Requires ML model; unreliable | Manual chord entry |
| MIDI import | "I have MIDI files" | MIDI parsing is complex; varies widely | JSON import covers power users |

## Feature Dependencies

```
[Sheet CRUD]
    └──requires──> [Sheet Data Model]
    └──requires──> [Local Persistence]

[Arrangement Editor]
    └──requires──> [Sheet CRUD]
    └──requires──> [Instrument Data Model]

[Composition Builder]
    └──requires──> [Sheet CRUD]
    └──enhances──> [Sheet List View]

[JSON Import/Export]
    └──requires──> [Sheet Data Model]
    └──requires──> [Zod Schema Validation]
```

### Dependency Notes

- **Arrangement Editor requires Sheet CRUD:** Can't edit a sheet that doesn't exist yet
- **Composition Builder requires Sheet CRUD:** Compositions reference existing sheets
- **JSON Import requires Zod validation:** Must reject malformed data before touching app state

## MVP Definition

### Launch With (v1)

- [ ] Create, edit, delete sheets — with title and tempo
- [ ] Edit lyrics with line-break preservation
- [ ] Edit chords/section markers per sheet
- [ ] Piano, guitar, drum arrangement data per sheet (see open question below)
- [ ] Local persistence — survives browser refresh
- [ ] JSON export (download sheet as .json)
- [ ] JSON import (load sheet from .json with validation)
- [ ] Create, edit, delete compositions from multiple sheets
- [ ] Reorder sheets within a composition

### Add After Validation (v1.x)

- [ ] Print-friendly view / CSS print styles
- [ ] Section markers (verse, chorus, bridge labels)
- [ ] Key signature / transpose support
- [ ] Dark mode

### Future Consideration (v2+)

- [ ] Audio playback (Web Audio API)
- [ ] MIDI import
- [ ] Collaborative editing
- [ ] Cloud sync / account system

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Sheet CRUD | HIGH | LOW | P1 |
| Lyrics editing | HIGH | LOW | P1 |
| Local persistence | HIGH | MEDIUM | P1 |
| JSON export/import | HIGH | MEDIUM | P1 |
| Instrument arrangements | HIGH | HIGH | P1 (core differentiator) |
| Composition builder | MEDIUM | MEDIUM | P2 |
| Tempo editing | MEDIUM | LOW | P1 |
| Reorder composition sheets | MEDIUM | LOW | P2 |

## Competitor Feature Analysis

| Feature | Flat | Song Surgeon | Ultimate Guitar | Our Approach |
|---------|------|--------------|----------------|-------------|
| Multi-instrument | Partial | No | Tabs only | Full side-by-side arrangement view |
| Lyrics + chords | Yes | Yes | Yes | Same, plus full instrument notation |
| Composition/setlist | No | No | Yes (pro) | Core feature, not pro-gated |
| JSON import/export | No | No | No | Core feature for data portability |
| Frontend-only | N/A | Yes | No | Core constraint |
| Local persistence | Partial (cookies) | Unknown | No | Full localStorage |

## Open Questions Affecting Scope

The arrangement format for piano/guitar/drums is the biggest scope lever. Three plausible definitions:

1. **Chord-symbol only:** Just chord names (C, Am7, Fmaj9) placed above lyrics sections. Simplest.
2. **Section-based notes:** Short text blocks per section per instrument (e.g., "Piano: intro arpeggio, verse: sparse chords"). Medium complexity.
3. **Structured notation:** Tab-style grids or note entry. High complexity, likely v2.

For v1, option 1 or 2 is realistic. Option 2 seems best balance: useful enough to justify "arrangement" while staying buildable.

## Sources

- Flat (flat.io) — collaborative music notation competitor
- Ultimate Guitar — popular guitar tab/chord site
- Song Surgeon — audioaced song analysis tool

---
*Feature research for: melody-map song arrangement editor*
*Researched: 2026-04-20*
