import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { Composition } from '../types';
import { compositionSchema } from '../schemas/sheet.schema';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CompositionState {
  compositions: Composition[];
  activeCompositionId: string | null;
}

type CompositionAction =
  | { type: 'CREATE_COMPOSITION'; payload: Composition }
  | { type: 'UPDATE_COMPOSITION'; payload: { id: string; updates: Partial<Composition> } }
  | { type: 'DELETE_COMPOSITION'; payload: string }
  | { type: 'SET_ACTIVE_COMPOSITION'; payload: string | null };

function createInitialCompositionState(initialCompositions: Composition[]): CompositionState {
  return {
    compositions: initialCompositions.flatMap((composition) => {
      const parsed = compositionSchema.safeParse(composition);
      return parsed.success ? [parsed.data] : [];
    }),
    activeCompositionId: null,
  };
}

function compositionReducer(state: CompositionState, action: CompositionAction): CompositionState {
  switch (action.type) {
    case 'CREATE_COMPOSITION':
      return { ...state, compositions: [...state.compositions, action.payload] };
    case 'UPDATE_COMPOSITION':
      return {
        ...state,
        compositions: state.compositions.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };
    case 'DELETE_COMPOSITION':
      return {
        ...state,
        compositions: state.compositions.filter(c => c.id !== action.payload),
        activeCompositionId: state.activeCompositionId === action.payload ? null : state.activeCompositionId,
      };
    case 'SET_ACTIVE_COMPOSITION':
      return { ...state, activeCompositionId: action.payload };
    default:
      return state;
  }
}

const CompositionContext = createContext<{
  state: CompositionState;
  dispatch: React.Dispatch<CompositionAction>;
} | null>(null);

export function CompositionProvider({ children }: { children: React.ReactNode }) {
  const [storedCompositions, setStoredCompositions] = useLocalStorage<Composition[]>('melody-map-compositions', []);
  const [state, dispatch] = useReducer(
    compositionReducer,
    storedCompositions,
    createInitialCompositionState,
  );

  useEffect(() => {
    setStoredCompositions(state.compositions);
  }, [state.compositions, setStoredCompositions]);

  return (
    <CompositionContext.Provider value={{ state, dispatch }}>
      {children}
    </CompositionContext.Provider>
  );
}

export function useComposition() {
  const ctx = useContext(CompositionContext);
  if (!ctx) throw new Error('useComposition must be used within CompositionProvider');
  return ctx;
}

export function useCompositionActions() {
  const { dispatch } = useComposition();

  const createComposition = useCallback((title: string) => {
    const newComposition: Composition = {
      id: crypto.randomUUID(),
      title,
      sheetIds: [],
    };
    dispatch({ type: 'CREATE_COMPOSITION', payload: newComposition });
    return newComposition.id;
  }, [dispatch]);

  const renameComposition = useCallback((id: string, title: string) => {
    dispatch({ type: 'UPDATE_COMPOSITION', payload: { id, updates: { title } } });
  }, [dispatch]);

  const deleteComposition = useCallback((id: string) => {
    dispatch({ type: 'DELETE_COMPOSITION', payload: id });
  }, [dispatch]);

  const setActiveComposition = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_COMPOSITION', payload: id });
  }, [dispatch]);

  return { createComposition, renameComposition, deleteComposition, setActiveComposition };
}
