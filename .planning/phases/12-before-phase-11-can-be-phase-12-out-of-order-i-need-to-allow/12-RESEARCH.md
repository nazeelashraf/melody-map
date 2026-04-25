# Phase 12 Research — In-Place Cue Transposition

**Phase:** 12
**Date:** 2026-04-24
**Status:** Complete
**Discovery Level:** 1 — quick verification

## Goal

Research how to add in-place semitone transposition for chorded cue lines without breaking Melody Map's lyrics-first alignment model.

## Existing Codebase Constraints

- `src/schemas/sheet.schema.ts` requires every cue string to match `lyrics.length`.
- `src/lib/lyrics-utils.ts` already treats cue content as fixed-width character grids and exposes `normalizeCueLine`, `normalizeDrumCues`, and `syncLyricsLine`.
- `src/lib/lyrics-utils.ts` also already identifies grouped chords by scanning contiguous non-space runs in `deriveGroupedChords`, which matches the roadmap rule that chord candidates are space-delimited cue tokens.
- `src/components/SheetEditor.tsx` is the correct integration point because Phase 12 requires an edit-in-place action on the currently selected instrument.
- `src/components/PerformanceView.tsx` reads stored cue strings only; if transposition edits sheet data in place, performance mode updates automatically without a separate transpose state.

## Research Findings

### 1. Use fixed semitone transposition, not key-aware diatonic rewriting

Music transposition shifts pitches by a constant interval; chromatic transposition specifically shifts each pitch by the same number of semitones, and pitch-class transposition is modeled as modulo-12 addition.[^transposition][^pitch-class]

For this feature, the safest implementation is a predefined sharp-based state machine / lookup table:

`A -> A# -> B -> C -> C# -> D -> D# -> E -> F -> F# -> G -> G# -> A`

This matches the user request for half-step control and avoids introducing key-signature logic.

### 2. Token recognition should be space-delimited, then root-validated

The roadmap says the system should consider sequences between spaces as chord candidates, but it also says unrecognizable chords must remain unchanged. That means parsing should be:

1. Split cue lines into contiguous non-space tokens by position.
2. For each token, try to match a recognized root prefix from the sharp-based table.
3. Preserve the suffix exactly (`m`, `7`, `sus4`, `maj7`, etc.).
4. If the token root is not recognized, return the original token unchanged.

This preserves current grouped-chord behavior and keeps unknown notation safe.

### 3. Padding must happen before normalization to avoid silent truncation

Current `normalizeCueLine` truncates when the incoming cue string exceeds the target length. That is correct for regular editing, but it is unsafe for transposition because `Am -> A#m` can grow the token length.

Therefore transposition needs a dedicated path that:

1. Rebuilds the transposed cue line while preserving each token's original start index.
2. Computes the required new line length from the farthest token end.
3. Pads `lyrics` with trailing spaces to that new length when necessary.
4. Pads all other cue fields (`piano`, `guitar`, and all drum lanes) to the same new length.

This keeps the schema valid and satisfies the rule that chord start positions must not move relative to the lyrics.

### 4. Scope should stay on piano + guitar only

Phase 12 is explicitly for chorded instruments. Drums use lane hits, not transposable pitch tokens, so the UI should hide or disable transpose actions when percussion is selected.

### 5. No new dependency is needed

The existing `lyrics-utils.ts` module plus Vitest is enough. This is a pure data-transformation feature with a clear input/output contract, so it is a strong TDD candidate.

## Recommended Implementation Shape

### Utility layer

Add tested helpers in `src/lib/lyrics-utils.ts`:

- `transposeChordToken(token, semitoneDelta)`
- `transposeCueLinePreservingColumns(cueLine, semitoneDelta)`
- `transposeLyricsLinesForInstrument(lines, instrument, semitoneDelta)`

Behavior:

- Recognize roots: `A, A#, B, C, C#, D, D#, E, F, F#, G, G#`
- Preserve token suffixes exactly
- Leave unknown tokens unchanged
- Preserve token start columns
- Extend line length instead of truncating
- Pad every cue field to the new `lyrics.length`

### UI layer

Add controls in `src/components/SheetEditor.tsx` only:

- Visible when `editorInstrument` is `piano` or `guitar`
- Hidden or disabled with helper text for `drums`
- Semitone selector covering negative and positive half-steps
- Apply action that updates all lyric lines for the current instrument in place

## Risks / Pitfalls

- **Do not reuse `normalizeCueLine` as the primary transposition writer** before calculating overflow, or expanded chords will be cut off.
- **Do not shift token start positions** while rebuilding cue lines.
- **Do not change other instruments' note content** except required trailing-space padding to maintain schema alignment.
- **Do not add a persistent transpose offset**; Phase 12 requires editing cue text in place.
- **Do not attempt flat/enharmonic normalization unless explicitly requested**; unknown tokens are supposed to remain unchanged.

## Verification Targets

- Utility tests cover semitone wraparound, suffix preservation, unknown-token passthrough, and overflow padding.
- `npm run typecheck` passes after SheetEditor wiring.
- `npx vitest run src/lib/lyrics-utils.test.ts` passes with new transpose coverage.

## Recommendation

Plan this as two waves:

1. **Wave 1:** TDD utility work for token transposition + line padding.
2. **Wave 2:** SheetEditor control wiring that applies the utility to the selected chorded instrument.

No UI-SPEC or external-service setup is needed for this phase.

[^transposition]: https://en.wikipedia.org/wiki/Transposition_(music)
[^pitch-class]: https://en.wikipedia.org/wiki/Pitch_class
