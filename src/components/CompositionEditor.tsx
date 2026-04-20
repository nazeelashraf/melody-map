import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComposition, useCompositionActions } from '../context/CompositionContext';
import { useSheet } from '../context/SheetContext';
import type { Composition } from '../types';

interface CompositionEditorProps {
  compositionId: string;
}

export default function CompositionEditor({ compositionId }: CompositionEditorProps) {
  const { state, dispatch } = useComposition();
  const { setActiveComposition } = useCompositionActions();
  const { state: sheetState } = useSheet();
  const [titleDraft, setTitleDraft] = useState('');

  const composition = useMemo(
    () => state.compositions.find((currentComposition) => currentComposition.id === compositionId),
    [compositionId, state.compositions],
  );

  useEffect(() => {
    if (!compositionId) return undefined;

    setActiveComposition(compositionId);

    return () => {
      setActiveComposition(null);
    };
  }, [compositionId, setActiveComposition]);

  useEffect(() => {
    if (!composition) return;
    setTitleDraft(composition.title);
  }, [composition]);

  if (!composition) {
    return (
      <div style={pageStyle}>
        <div style={emptyStateStyle}>
          <p style={emptyTitleStyle}>Composition not found</p>
          <p style={emptyCopyStyle}>This composition was removed or the URL is invalid.</p>
          <Link to="/" style={primaryLinkStyle}>
            Back to library
          </Link>
        </div>
      </div>
    );
  }

  const updateComposition = (updates: Partial<Composition>) => {
    dispatch({
      type: 'UPDATE_COMPOSITION',
      payload: { id: composition.id, updates },
    });
  };

  const compositionEntries = composition.sheetIds.map((sheetId, index) => ({
    index,
    sheetId,
    sheet: sheetState.sheets.find((sheet) => sheet.id === sheetId),
  }));

  const selectedSheetIds = new Set(composition.sheetIds);
  const availableSheets = sheetState.sheets.filter((sheet) => !selectedSheetIds.has(sheet.id));
  const missingSheetCount = compositionEntries.filter((entry) => !entry.sheet).length;

  const commitTitle = () => {
    const nextTitle = titleDraft.trim();
    if (!nextTitle || nextTitle === composition.title) {
      setTitleDraft(composition.title);
      return;
    }

    updateComposition({ title: nextTitle });
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      setTitleDraft(composition.title);
      event.currentTarget.blur();
    }
  };

  const addSheet = (sheetId: string) => {
    updateComposition({ sheetIds: [...composition.sheetIds, sheetId] });
  };

  const removeSheet = (indexToRemove: number) => {
    updateComposition({
      sheetIds: composition.sheetIds.filter((_, index) => index !== indexToRemove),
    });
  };

  const moveSheet = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= composition.sheetIds.length) return;

    const nextSheetIds = [...composition.sheetIds];
    const [movedSheetId] = nextSheetIds.splice(fromIndex, 1);
    nextSheetIds.splice(toIndex, 0, movedSheetId);
    updateComposition({ sheetIds: nextSheetIds });
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <Link to="/" style={backLinkStyle}>
            Library
          </Link>
          <h1 style={titleStyle}>{composition.title}</h1>
          <p style={subtitleStyle}>Build an ordered setlist from your saved sheets, then adjust the sequence as the arrangement changes.</p>
        </div>
      </div>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <h2 style={panelTitleStyle}>Composition Details</h2>
          <div style={badgeRowStyle}>
            <span style={metaBadgeStyle}>{composition.sheetIds.length} entries</span>
            {missingSheetCount > 0 && <span style={warningBadgeStyle}>{missingSheetCount} missing</span>}
          </div>
        </div>

        <div style={fieldGridStyle}>
          <label style={fieldStyle}>
            <span style={fieldLabelStyle}>Title</span>
            <input
              type="text"
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={commitTitle}
              onKeyDown={handleTitleKeyDown}
              placeholder="Sunday morning set"
              style={inputStyle}
            />
          </label>
        </div>
      </section>

      <div style={contentGridStyle}>
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <h2 style={panelTitleStyle}>Set Order</h2>
            <span style={metaBadgeStyle}>{compositionEntries.length} slots</span>
          </div>

          {compositionEntries.length === 0 ? (
            <div style={emptyPanelStyle}>
              <p style={emptyPanelTitleStyle}>No sheets in this composition yet.</p>
              <p style={emptyPanelCopyStyle}>Add sheets from the library panel to start building the order.</p>
            </div>
          ) : (
            <div style={stackStyle}>
              {compositionEntries.map((entry) => (
                <div key={`${entry.sheetId}-${entry.index}`} style={listItemStyle}>
                  <div style={{ flex: 1 }}>
                    <div style={listItemHeaderStyle}>
                      <span style={indexBadgeStyle}>{entry.index + 1}</span>
                      <span style={itemTitleStyle}>{entry.sheet?.title ?? 'Missing sheet'}</span>
                    </div>
                    <p style={itemMetaStyle}>
                      {entry.sheet
                        ? `${entry.sheet.tempo} BPM • ${entry.sheet.lyricsLines.length} lyric lines`
                        : 'This sheet no longer exists in the library.'}
                    </p>
                    {entry.sheet && (
                      <Link to={`/sheet/${entry.sheet.id}`} style={inlineLinkStyle}>
                        Open sheet
                      </Link>
                    )}
                  </div>

                  <div style={actionColumnStyle}>
                    <button
                      onClick={() => moveSheet(entry.index, entry.index - 1)}
                      disabled={entry.index === 0}
                      style={secondaryButtonStyle(entry.index === 0)}
                    >
                      Up
                    </button>
                    <button
                      onClick={() => moveSheet(entry.index, entry.index + 1)}
                      disabled={entry.index === compositionEntries.length - 1}
                      style={secondaryButtonStyle(entry.index === compositionEntries.length - 1)}
                    >
                      Down
                    </button>
                    <button onClick={() => removeSheet(entry.index)} style={dangerButtonStyle}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <h2 style={panelTitleStyle}>Library Sheets</h2>
            <span style={metaBadgeStyle}>{availableSheets.length} available</span>
          </div>

          {sheetState.sheets.length === 0 ? (
            <div style={emptyPanelStyle}>
              <p style={emptyPanelTitleStyle}>No sheets in the library.</p>
              <p style={emptyPanelCopyStyle}>Create a sheet first, then return here to add it to the composition.</p>
              <Link to="/" style={primaryLinkStyle}>
                Go to library
              </Link>
            </div>
          ) : availableSheets.length === 0 ? (
            <div style={emptyPanelStyle}>
              <p style={emptyPanelTitleStyle}>All sheets are already included.</p>
              <p style={emptyPanelCopyStyle}>Remove one from the order if you want to swap it out.</p>
            </div>
          ) : (
            <div style={stackStyle}>
              {availableSheets.map((sheet) => (
                <div key={sheet.id} style={listItemStyle}>
                  <div style={{ flex: 1 }}>
                    <p style={itemTitleStyle}>{sheet.title}</p>
                    <p style={itemMetaStyle}>{sheet.tempo} BPM • {sheet.lyricsLines.length} lyric lines</p>
                    <Link to={`/sheet/${sheet.id}`} style={inlineLinkStyle}>
                      Open sheet
                    </Link>
                  </div>

                  <button onClick={() => addSheet(sheet.id)} style={primaryButtonStyle}>
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '1120px',
  margin: '0 auto',
  display: 'grid',
  gap: '1.5rem',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
};

const backLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  marginBottom: '0.75rem',
  color: '#3b82f6',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '2rem',
  lineHeight: 1.1,
  color: '#111827',
};

const subtitleStyle: React.CSSProperties = {
  margin: '0.75rem 0 0',
  maxWidth: '640px',
  color: '#4b5563',
  lineHeight: 1.6,
};

const contentGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1.5rem',
  alignItems: 'start',
};

const panelStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '1.25rem',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
};

const panelHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1rem',
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.1rem',
  color: '#111827',
};

const badgeRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const metaBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.3rem 0.65rem',
  borderRadius: '999px',
  backgroundColor: '#eff6ff',
  color: '#1d4ed8',
  fontSize: '0.8rem',
  fontWeight: 600,
};

const warningBadgeStyle: React.CSSProperties = {
  ...metaBadgeStyle,
  backgroundColor: '#fef2f2',
  color: '#b91c1c',
};

const fieldGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: '1rem',
};

const fieldStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.45rem',
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#374151',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.8rem 0.9rem',
  borderRadius: '10px',
  border: '1px solid #d1d5db',
  fontSize: '1rem',
};

const stackStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.85rem',
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '1rem',
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  alignItems: 'flex-start',
};

const listItemHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
};

const indexBadgeStyle: React.CSSProperties = {
  minWidth: '1.75rem',
  height: '1.75rem',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#111827',
  color: '#fff',
  fontSize: '0.8rem',
  fontWeight: 700,
};

const itemTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1rem',
  fontWeight: 600,
  color: '#111827',
};

const itemMetaStyle: React.CSSProperties = {
  margin: '0.35rem 0 0',
  color: '#6b7280',
  fontSize: '0.875rem',
  lineHeight: 1.5,
};

const inlineLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '0.5rem',
  color: '#3b82f6',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
};

const actionColumnStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.45rem',
  minWidth: '88px',
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: '8px',
  padding: '0.6rem 0.85rem',
  backgroundColor: '#2563eb',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
};

function secondaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '0.45rem 0.75rem',
    backgroundColor: disabled ? '#f3f4f6' : '#fff',
    color: disabled ? '#9ca3af' : '#374151',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

const dangerButtonStyle: React.CSSProperties = {
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '0.45rem 0.75rem',
  backgroundColor: '#fef2f2',
  color: '#b91c1c',
  fontWeight: 600,
  cursor: 'pointer',
};

const emptyPanelStyle: React.CSSProperties = {
  padding: '1.25rem',
  borderRadius: '10px',
  border: '1px dashed #d1d5db',
  backgroundColor: '#f9fafb',
};

const emptyPanelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontWeight: 600,
  color: '#111827',
};

const emptyPanelCopyStyle: React.CSSProperties = {
  margin: '0.5rem 0 0',
  color: '#6b7280',
  lineHeight: 1.6,
};

const emptyStateStyle: React.CSSProperties = {
  minHeight: '60vh',
  display: 'grid',
  placeItems: 'center',
  textAlign: 'center',
  padding: '2rem',
  backgroundColor: '#fff',
};

const emptyTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#111827',
};

const emptyCopyStyle: React.CSSProperties = {
  margin: '0.75rem 0 1.25rem',
  color: '#6b7280',
};

const primaryLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem 1rem',
  borderRadius: '999px',
  backgroundColor: '#2563eb',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 600,
};
