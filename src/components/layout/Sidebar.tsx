import { Link, useLocation } from 'react-router-dom';
import { Music, Layers, Plus } from 'lucide-react';
import { useSheet } from '../../context/SheetContext';
import { useComposition } from '../../context/CompositionContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ collapsed = false, onNavigate }: SidebarProps) {
  const { state } = useSheet();
  const { state: compositionState } = useComposition();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = (
    <>
      {/* App branding */}
      <div className="flex items-center gap-2 px-4 py-4">
        <Music className="h-5 w-5 text-primary flex-shrink-0" />
        {!collapsed && (
          <span className="text-base font-bold text-foreground">Melody Map</span>
        )}
      </div>

      <Separator className="mx-4" />

      {/* Sheets section */}
      <div className="px-2 py-2">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sheets</span>
            <Badge variant="secondary">{state.sheets.length}</Badge>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-1.5">
            <Badge variant="secondary">{state.sheets.length}</Badge>
          </div>
        )}
        <div className="space-y-0.5">
          {state.sheets.map(sheet => (
            <Link
              key={sheet.id}
              to={`/sheet/${sheet.id}`}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                isActive(`/sheet/${sheet.id}`)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Music className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="truncate">{sheet.title}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <Separator className="mx-4" />

      {/* Compositions section */}
      <div className="px-2 py-2">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Compositions</span>
            <Badge variant="secondary">{compositionState.compositions.length}</Badge>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-1.5">
            <Badge variant="secondary">{compositionState.compositions.length}</Badge>
          </div>
        )}
        <div className="space-y-0.5">
          {compositionState.compositions.map(comp => (
            <Link
              key={comp.id}
              to={`/composition/${comp.id}`}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                isActive(`/composition/${comp.id}`)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Layers className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="truncate">{comp.title}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto">
        {navItems}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t">
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>New Sheet</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}
