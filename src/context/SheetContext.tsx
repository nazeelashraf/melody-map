import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { Sheet } from '../types';
import { sheetSchema } from '../schemas/sheet.schema';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SheetState {
  sheets: Sheet[];
  activeSheetId: string | null;
}

type SheetAction =
  | { type: 'CREATE_SHEET'; payload: Sheet }
  | { type: 'UPDATE_SHEET'; payload: { id: string; updates: Partial<Sheet> } }
  | { type: 'DELETE_SHEET'; payload: string }
  | { type: 'SET_ACTIVE_SHEET'; payload: string | null };

function createInitialSheetState(initialSheets: Sheet[]): SheetState {
  return {
    sheets: initialSheets.flatMap((sheet) => {
      const parsed = sheetSchema.safeParse(sheet);
      return parsed.success ? [parsed.data] : [];
    }),
    activeSheetId: null,
  };
}

function sheetReducer(state: SheetState, action: SheetAction): SheetState {
  switch (action.type) {
    case 'CREATE_SHEET':
      return { ...state, sheets: [...state.sheets, action.payload] };
    case 'UPDATE_SHEET':
      return {
        ...state,
        sheets: state.sheets.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        ),
      };
    case 'DELETE_SHEET':
      return {
        ...state,
        sheets: state.sheets.filter(s => s.id !== action.payload),
        activeSheetId: state.activeSheetId === action.payload ? null : state.activeSheetId,
      };
    case 'SET_ACTIVE_SHEET':
      return { ...state, activeSheetId: action.payload };
    default:
      return state;
  }
}

const SheetContext = createContext<{
  state: SheetState;
  dispatch: React.Dispatch<SheetAction>;
} | null>(null);

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [storedSheets, setStoredSheets] = useLocalStorage<Sheet[]>('melody-map-sheets', []);
  const [state, dispatch] = useReducer(sheetReducer, storedSheets, createInitialSheetState);

  useEffect(() => {
    setStoredSheets(state.sheets);
  }, [state.sheets, setStoredSheets]);

  return (
    <SheetContext.Provider value={{ state, dispatch }}>
      {children}
    </SheetContext.Provider>
  );
}

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error('useSheet must be used within SheetProvider');
  return ctx;
}

export function useSheetActions() {
  const { dispatch } = useSheet();

  const createSheet = useCallback((title: string) => {
    const newSheet: Sheet = {
      id: crypto.randomUUID(),
      title,
      tempo: 120,
      lyricsLines: [],
      arrangements: { piano: '', guitar: '', drums: '' },
    };
    dispatch({ type: 'CREATE_SHEET', payload: newSheet });
    return newSheet.id;
  }, [dispatch]);

  const renameSheet = useCallback((id: string, title: string) => {
    dispatch({ type: 'UPDATE_SHEET', payload: { id, updates: { title } } });
  }, [dispatch]);

  const deleteSheet = useCallback((id: string) => {
    dispatch({ type: 'DELETE_SHEET', payload: id });
  }, [dispatch]);

  const setActiveSheet = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_SHEET', payload: id });
  }, [dispatch]);

  return { createSheet, renameSheet, deleteSheet, setActiveSheet };
}
