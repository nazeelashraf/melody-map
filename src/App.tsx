import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { SheetProvider } from './context/SheetContext';
import { CompositionProvider } from './context/CompositionContext';
import CompositionEditor from './components/CompositionEditor';
import SheetList from './components/SheetList';
import SheetEditor from './components/SheetEditor';

function SheetEditorPage() {
  const { id } = useParams<{ id: string }>();
  return <SheetEditor sheetId={id ?? ''} />;
}

function CompositionEditorPage() {
  const { id } = useParams<{ id: string }>();
  return <CompositionEditor compositionId={id ?? ''} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SheetProvider>
        <CompositionProvider>
          <Routes>
            <Route path="/" element={<SheetList />} />
            <Route path="/sheet/:id" element={<SheetEditorPage />} />
            <Route path="/composition/:id" element={<CompositionEditorPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CompositionProvider>
      </SheetProvider>
    </BrowserRouter>
  );
}
