import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { SheetProvider } from './context/SheetContext';
import { CompositionProvider } from './context/CompositionContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppLayout from './components/layout/AppLayout';
import CompositionPerformanceView from './components/CompositionPerformanceView';
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

function CompositionPerformancePage() {
  const { id } = useParams<{ id: string }>();
  return <CompositionPerformanceView compositionId={id ?? ''} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <SheetProvider>
            <CompositionProvider>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<SheetList />} />
                  <Route path="/sheet/:id" element={<SheetEditorPage />} />
                  <Route path="/composition/:id" element={<CompositionEditorPage />} />
                  <Route path="/composition/:id/performance" element={<CompositionPerformancePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </CompositionProvider>
          </SheetProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
