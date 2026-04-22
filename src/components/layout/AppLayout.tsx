import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSheet } from '@/context/SheetContext';
import { useComposition } from '@/context/CompositionContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { state: sheetState } = useSheet();
  const { state: compState } = useComposition();

  // Determine page title based on current route
  const getPageTitle = (): string => {
    if (location.pathname === '/') return 'Library';

    if (location.pathname.startsWith('/sheet/')) {
      const id = location.pathname.split('/sheet/')[1];
      const sheet = sheetState.sheets.find(s => s.id === id);
      return sheet ? sheet.title : 'Sheet';
    }

    if (location.pathname.startsWith('/composition/')) {
      const id = location.pathname.split('/composition/')[1];
      const comp = compState.compositions.find(c => c.id === id);
      return comp ? comp.title : 'Composition';
    }

    return 'Library';
  };

  const handleNavigate = () => setMobileOpen(false);

  return (
    <div className="flex h-full bg-canvas">
      {/* Desktop sidebar */}
      <aside data-sidebar className="hidden md:flex md:flex-col w-64 border-r border-shell-border bg-shell overflow-hidden flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar collapsed={false} onNavigate={handleNavigate} />
        </SheetContent>
      </Sheet>

      {/* Top bar + main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          title={getPageTitle()}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-canvas">
          {children}
        </main>
      </div>
    </div>
  );
}
