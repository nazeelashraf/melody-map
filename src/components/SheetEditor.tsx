import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { instrumentTypes } from '../schemas/sheet.schema';
import { useSheet, useSheetActions } from '../context/SheetContext';
import type { InstrumentType, LyricsLine } from '../types';
import ExportButton from './ExportButton';

interface SheetEditorProps {
  sheetId: string;
}

function createLyricsLine(lyrics = ''): LyricsLine {
  return { lyrics, chords: ''.padEnd(lyrics.length, ' ') };
}

function clampTempo(value: number): number {
  if (Number.isNaN(value)) return 20;
  return Math.min(300, Math.max(20, value));
}

function normalizeChordLine(rawValue: string, targetLength: number): string {
  if (rawValue.length >= targetLength) {
    return rawValue.slice(0, targetLength);
  }

  return rawValue.padEnd(targetLength, ' ');
}

function splitLyricsText(value: string): string[] {
  return value === '' ? [] : value.split('\n');
}

function syncChordsToLyrics(previousLyrics: string, nextLyrics: string, previousChords: string): string {
  const normalizedPreviousChords = normalizeChordLine(previousChords, previousLyrics.length);

  let prefixLength = 0;
  while (
    prefixLength < previousLyrics.length &&
    prefixLength < nextLyrics.length &&
    previousLyrics[prefixLength] === nextLyrics[prefixLength]
  ) {
    prefixLength += 1;
  }

  let suffixLength = 0;
  while (
    suffixLength < previousLyrics.length - prefixLength &&
    suffixLength < nextLyrics.length - prefixLength &&
    previousLyrics[previousLyrics.length - 1 - suffixLength] === nextLyrics[nextLyrics.length - 1 - suffixLength]
  ) {
    suffixLength += 1;
  }

  const previousMiddleLength = previousLyrics.length - prefixLength - suffixLength;
  const nextMiddleLength = nextLyrics.length - prefixLength - suffixLength;
  const previousMiddleChords = normalizedPreviousChords.slice(prefixLength, prefixLength + previousMiddleLength);

  let nextMiddleChords = '';
  if (previousMiddleLength === nextMiddleLength) {
    nextMiddleChords = previousMiddleChords;
  } else if (nextMiddleLength > previousMiddleLength) {
    nextMiddleChords = previousMiddleChords + ' '.repeat(nextMiddleLength - previousMiddleLength);
  } else {
    nextMiddleChords = previousMiddleChords.slice(0, nextMiddleLength);
  }

  return [
    normalizedPreviousChords.slice(0, prefixLength),
    nextMiddleChords,
    normalizedPreviousChords.slice(previousLyrics.length - suffixLength),
  ].join('');
}

function syncLyricsLines(previousLines: LyricsLine[], nextLyricsText: string): LyricsLine[] {
  const nextLyricsLines = splitLyricsText(nextLyricsText);

  let prefixLength = 0;
  while (
    prefixLength < previousLines.length &&
    prefixLength < nextLyricsLines.length &&
    previousLines[prefixLength].lyrics === nextLyricsLines[prefixLength]
  ) {
    prefixLength += 1;
  }

  let suffixLength = 0;
  while (
    suffixLength < previousLines.length - prefixLength &&
    suffixLength < nextLyricsLines.length - prefixLength &&
    previousLines[previousLines.length - 1 - suffixLength].lyrics ===
      nextLyricsLines[nextLyricsLines.length - 1 - suffixLength]
  ) {
    suffixLength += 1;
  }

  const previousMiddleLines = previousLines.slice(prefixLength, previousLines.length - suffixLength);
  const nextMiddleLines = nextLyricsLines
    .slice(prefixLength, nextLyricsLines.length - suffixLength)
    .map((lyrics, index) => {
      const previousLine = previousMiddleLines[index];

      if (!previousLine) {
        return createLyricsLine(lyrics);
      }

      return {
        lyrics,
        chords: syncChordsToLyrics(previousLine.lyrics, lyrics, previousLine.chords),
      };
    });

  return [
    ...previousLines.slice(0, prefixLength),
    ...nextMiddleLines,
    ...previousLines.slice(previousLines.length - suffixLength),
  ];
}

function formatPreviewLine(line: LyricsLine): string {
  if (line.lyrics.length === 0) {
    return '';
  }

  return `${normalizeChordLine(line.chords, line.lyrics.length)}\n${line.lyrics}`;
}

export default function SheetEditor({ sheetId }: SheetEditorProps) {
  const { state, dispatch } = useSheet();
  const { setActiveSheet } = useSheetActions();
  const [titleDraft, setTitleDraft] = useState('');

  const sheet = useMemo(
    () => state.sheets.find(currentSheet => currentSheet.id === sheetId),
    [sheetId, state.sheets],
  );

  useEffect(() => {
    if (!sheetId) return undefined;

    setActiveSheet(sheetId);

    return () => {
      setActiveSheet(null);
    };
  }, [sheetId, setActiveSheet]);

  useEffect(() => {
    if (!sheet) return;
    setTitleDraft(sheet.title);
  }, [sheet]);

  if (!sheet) {
    return (
      <div style={pageStyle}>
        <div style={emptyStateStyle}>
          <p style={emptyTitleStyle}>Sheet not found</p>
          <p style={emptyCopyStyle}>This song sheet was removed or the URL is invalid.</p>
          <Link to="/" style={primaryLinkStyle}>
            Back to sheets
          </Link>
        </div>
      </div>
    );
  }

  const updateSheet = (updates: Partial<typeof sheet>) => {
    dispatch({
      type: 'UPDATE_SHEET',
      payload: { id: sheet.id, updates },
    });
  };

  const lyricsText = sheet.lyricsLines.map((line) => line.lyrics).join('\n');
  const lyricsPreview = sheet.lyricsLines
    .map(formatPreviewLine)
    .join('\n');

  const updateLyricsLines = (lyricsLines: LyricsLine[]) => {
    updateSheet({ lyricsLines });
  };

  const commitTitle = () => {
    const nextTitle = titleDraft.trim();
    if (!nextTitle || nextTitle === sheet.title) {
      setTitleDraft(sheet.title);
      return;
    }

    updateSheet({ title: nextTitle });
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      setTitleDraft(sheet.title);
      event.currentTarget.blur();
    }
  };

  const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSheet({ tempo: clampTempo(Number(event.target.value)) });
  };

  const handleLyricsTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateLyricsLines(syncLyricsLines(sheet.lyricsLines, event.target.value));
  };

  const handleChordChange = (lineIndex: number, nextChords: string) => {
    const currentLine = sheet.lyricsLines[lineIndex];
    const nextLines = [...sheet.lyricsLines];
    nextLines[lineIndex] = {
      ...currentLine,
      chords: normalizeChordLine(nextChords, currentLine.lyrics.length),
    };
    updateLyricsLines(nextLines);
  };

  const handleAddLine = () => {
    updateLyricsLines([...sheet.lyricsLines, createLyricsLine()]);
  };

  const handleInsertLine = (lineIndex: number) => {
    const nextLines = [...sheet.lyricsLines];
    nextLines.splice(lineIndex + 1, 0, createLyricsLine());
    updateLyricsLines(nextLines);
  };

  const handleDeleteLine = (lineIndex: number) => {
    updateLyricsLines(sheet.lyricsLines.filter((_, index) => index !== lineIndex));
  };

  const handleArrangementChange = (instrument: InstrumentType, value: string) => {
    updateSheet({
      arrangements: {
        ...sheet.arrangements,
        [instrument]: value,
      },
    });
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <Link to="/" style={backLinkStyle}>
            Sheets
          </Link>
          <h1 style={titleStyle}>{sheet.title}</h1>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <ExportButton data={sheet} label="Export sheet" />
          </div>
          <p style={subtitleStyle}>Edit lyrics, place chord text above each character position, and keep separate arrangements per instrument.</p>
        </div>
      </div>

      <div style={editorGridStyle}>
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <h2 style={panelTitleStyle}>Sheet Details</h2>
            <span style={metaBadgeStyle}>{sheet.lyricsLines.length} lines</span>
          </div>
          <div style={fieldGridStyle}>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Title</span>
              <input
                type="text"
                value={titleDraft}
                onChange={event => setTitleDraft(event.target.value)}
                onBlur={commitTitle}
                onKeyDown={handleTitleKeyDown}
                style={inputStyle}
              />
            </label>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Tempo</span>
              <input
                type="number"
                min={20}
                max={300}
                value={sheet.tempo}
                onChange={handleTempoChange}
                style={inputStyle}
              />
            </label>
          </div>
        </section>

        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={panelTitleStyle}>Lyrics And Chords</h2>
              <p style={panelCopyStyle}>Type lyrics in the textarea, preserve verse breaks with blank lines, and keep chord markers aligned per lyric row.</p>
            </div>
            <button type="button" onClick={handleAddLine} style={primaryButtonStyle}>
              Add line
            </button>
          </div>

          <label style={stackedFieldStyle}>
            <span style={fieldLabelStyle}>Lyrics</span>
            <textarea
              value={lyricsText}
              onChange={handleLyricsTextChange}
              rows={Math.max(6, sheet.lyricsLines.length + 2)}
              style={lyricsAreaStyle}
              placeholder="Type one lyric line per row. Leave a blank line between verses."
            />
          </label>

          {sheet.lyricsLines.length === 0 ? (
            <div style={emptyEditorStyle}>
              <p style={emptyTitleStyle}>No lyric lines yet</p>
              <p style={emptyCopyStyle}>Start typing in the lyrics textarea, then place chord text above each generated line.</p>
            </div>
          ) : (
            <div style={lineListStyle}>
              {sheet.lyricsLines.map((line, lineIndex) => (
                <article key={`${sheet.id}-${lineIndex}`} style={lineCardStyle}>
                  <div style={lineMetaRowStyle}>
                    <span style={lineLabelStyle}>Line {lineIndex + 1}</span>
                    <div style={lineActionsStyle}>
                      <button type="button" onClick={() => handleInsertLine(lineIndex)} style={secondaryButtonStyle}>
                        Insert below
                      </button>
                      <button type="button" onClick={() => handleDeleteLine(lineIndex)} style={dangerButtonStyle}>
                        Remove
                      </button>
                    </div>
                  </div>
                  {line.lyrics.length > 0 ? (
                    <>
                      <label style={stackedFieldStyle}>
                        <span style={fieldLabelStyle}>Chords</span>
                        <input
                          type="text"
                          value={line.chords}
                          onChange={event => handleChordChange(lineIndex, event.target.value)}
                          spellCheck={false}
                          style={monospaceInputStyle}
                          placeholder="Am   F     C"
                        />
                      </label>
                      <div style={stackedFieldStyle}>
                        <span style={fieldLabelStyle}>Linked lyric line</span>
                        <div style={lineLyricsStyle}>{line.lyrics}</div>
                      </div>
                    </>
                  ) : (
                    <div style={verseBreakStyle}>Blank line preserved for verse spacing.</div>
                  )}
                </article>
              ))}
            </div>
          )}

          {sheet.lyricsLines.length > 0 && (
            <div style={previewPanelStyle}>
              <div style={previewHeaderStyle}>
                <h3 style={previewTitleStyle}>Rendered Preview</h3>
                <span style={previewCopyStyle}>Line breaks and chord spacing stay visible in monospace output.</span>
              </div>
              <pre style={previewStyle}>{lyricsPreview}</pre>
            </div>
          )}
        </section>

        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={panelTitleStyle}>Arrangements</h2>
              <p style={panelCopyStyle}>Keep notes, sections, or cues for piano, guitar, and drums independently.</p>
            </div>
          </div>

          <div style={arrangementGridStyle}>
            {instrumentTypes.map((instrument) => (
              <label key={instrument} style={stackedFieldStyle}>
                <span style={fieldLabelStyle}>{instrument} arrangement</span>
                <textarea
                  value={sheet.arrangements[instrument]}
                  onChange={(event) => handleArrangementChange(instrument, event.target.value)}
                  rows={10}
                  style={arrangementAreaStyle}
                  placeholder="Verse: sparse voicings\nChorus: open chords"
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
  padding: '2rem clamp(1rem, 3vw, 2.5rem)',
};

const headerStyle: React.CSSProperties = {
  maxWidth: '1100px',
  margin: '0 auto 1.5rem',
};

const editorGridStyle: React.CSSProperties = {
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'grid',
  gap: '1rem',
};

const panelStyle: React.CSSProperties = {
  backgroundColor: '#ffffffcc',
  backdropFilter: 'blur(12px)',
  border: '1px solid #dbe4ff',
  borderRadius: '18px',
  padding: '1.25rem',
  boxShadow: '0 20px 45px rgba(59, 130, 246, 0.08)',
};

const panelHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
  marginBottom: '1rem',
  flexWrap: 'wrap',
};

const fieldGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1rem',
};

const fieldStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.5rem',
};

const stackedFieldStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.4rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  padding: '0.85rem 0.95rem',
  fontSize: '1rem',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
};

const monospaceAreaStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '12px',
  border: '1px solid #cbd5e1',
  padding: '0.85rem 0.95rem',
  fontSize: '0.95rem',
  lineHeight: 1.5,
  fontFamily: 'ui-monospace, SFMono-Regular, SFMono-Regular, Consolas, monospace',
  resize: 'vertical',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
};

const monospaceInputStyle: React.CSSProperties = {
  ...monospaceAreaStyle,
  resize: undefined,
};

const arrangementAreaStyle: React.CSSProperties = {
  ...monospaceAreaStyle,
  fontFamily: 'inherit',
};

const lyricsAreaStyle: React.CSSProperties = {
  ...monospaceAreaStyle,
  marginBottom: '1rem',
};

const titleStyle: React.CSSProperties = {
  margin: '0.35rem 0 0.25rem',
  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
  lineHeight: 1.05,
  color: '#0f172a',
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  maxWidth: '56rem',
  color: '#475569',
  lineHeight: 1.6,
};

const backLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  textDecoration: 'none',
  color: '#4338ca',
  fontWeight: 600,
};

const primaryLinkStyle: React.CSSProperties = {
  ...backLinkStyle,
  justifyContent: 'center',
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.1rem',
  color: '#0f172a',
};

const panelCopyStyle: React.CSSProperties = {
  margin: '0.35rem 0 0',
  color: '#64748b',
  lineHeight: 1.5,
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#334155',
};

const metaBadgeStyle: React.CSSProperties = {
  backgroundColor: '#e0e7ff',
  color: '#4338ca',
  borderRadius: '999px',
  padding: '0.35rem 0.75rem',
  fontSize: '0.8rem',
  fontWeight: 700,
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: '999px',
  padding: '0.75rem 1rem',
  background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
  color: '#fff',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: '999px',
  padding: '0.45rem 0.75rem',
  backgroundColor: '#fff',
  color: '#334155',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const dangerButtonStyle: React.CSSProperties = {
  ...secondaryButtonStyle,
  border: '1px solid #fecaca',
  color: '#b91c1c',
  backgroundColor: '#fff5f5',
};

const lineListStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.9rem',
  marginBottom: '1rem',
};

const lineCardStyle: React.CSSProperties = {
  border: '1px solid #dbe4ff',
  borderRadius: '16px',
  padding: '1rem',
  backgroundColor: '#f8fbff',
  display: 'grid',
  gap: '0.75rem',
};

const lineMetaRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

const lineActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const lineLabelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#6366f1',
};

const lineLyricsStyle: React.CSSProperties = {
  borderRadius: '12px',
  border: '1px solid #dbe4ff',
  backgroundColor: '#ffffff',
  padding: '0.85rem 0.95rem',
  fontSize: '0.95rem',
  lineHeight: 1.5,
  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
};

const verseBreakStyle: React.CSSProperties = {
  borderRadius: '12px',
  border: '1px dashed #c7d2fe',
  backgroundColor: '#eef2ff',
  padding: '0.85rem 0.95rem',
  color: '#4f46e5',
  fontSize: '0.9rem',
  fontWeight: 600,
};

const emptyStateStyle: React.CSSProperties = {
  maxWidth: '36rem',
  margin: '4rem auto',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '2rem',
  border: '1px solid #dbe4ff',
};

const emptyEditorStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem 1.5rem',
  borderRadius: '16px',
  border: '1px dashed #c7d2fe',
  backgroundColor: '#f8fbff',
};

const emptyTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.05rem',
  fontWeight: 700,
  color: '#0f172a',
};

const emptyCopyStyle: React.CSSProperties = {
  margin: '0.5rem 0 1rem',
  color: '#64748b',
  lineHeight: 1.6,
};

const previewPanelStyle: React.CSSProperties = {
  borderTop: '1px solid #dbe4ff',
  paddingTop: '1rem',
  display: 'grid',
  gap: '0.75rem',
};

const previewHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.75rem',
  flexWrap: 'wrap',
  alignItems: 'baseline',
};

const previewTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.95rem',
  color: '#0f172a',
};

const previewCopyStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '0.85rem',
};

const previewStyle: React.CSSProperties = {
  margin: 0,
  padding: '1rem',
  borderRadius: '16px',
  backgroundColor: '#0f172a',
  color: '#e2e8f0',
  fontSize: '0.95rem',
  lineHeight: 1.5,
  fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
  overflowX: 'auto',
};

const arrangementGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1rem',
};
