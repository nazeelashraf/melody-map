import { Link, useLocation } from 'react-router-dom';
import { Music, Layers, Plus, FileMusic } from 'lucide-react';
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
        <Music className="h-6 w-6 text-accent flex-shrink-0" />
        {!collapsed && (
          <span className="text-lg font-bold text-shell-foreground">Melody Map</span>
        )}
      </div>

      <Separator className="mx-4 bg-shell-border" />

      {/* Sheets section */}
      <div className="px-2 py-2">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-xs font-semibold text-shell-foreground/50 uppercase tracking-wide">Sheets</span>
            <Badge variant="secondary" className="text-xs bg-shell-surface text-shell-foreground/70 border-0">{state.sheets.length}</Badge>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-2">
            <Badge variant="secondary" className="text-xs bg-shell-surface text-shell-foreground/70 border-0">{state.sheets.length}</Badge>
          </div>
        )}
        <div className="space-y-0.5">
          {state.sheets.map(sheet => (
            <Link
              key={sheet.id}
              to={`/sheet/${sheet.id}`}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                isActive(`/sheet/${sheet.id}`)
                  ? 'bg-accent-muted text-accent border-l-2 border-accent'
                  : 'text-shell-foreground/70 hover:bg-shell-surface hover:text-shell-foreground'
              }`}
            >
              <Music className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="truncate max-w-[180px]">{sheet.title}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <Separator className="mx-4 bg-shell-border" />

      {/* Compositions section */}
      <div className="px-2 py-2">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-xs font-semibold text-shell-foreground/50 uppercase tracking-wide">Compositions</span>
            <Badge variant="secondary" className="text-xs bg-shell-surface text-shell-foreground/70 border-0">{compositionState.compositions.length}</Badge>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-2">
            <Badge variant="secondary" className="text-xs bg-shell-surface text-shell-foreground/70 border-0">{compositionState.compositions.length}</Badge>
          </div>
        )}
        <div className="space-y-0.5">
          {compositionState.compositions.map(comp => (
            <Link
              key={comp.id}
              to={`/composition/${comp.id}`}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                isActive(`/composition/${comp.id}`)
                  ? 'bg-accent-muted text-accent border-l-2 border-accent'
                  : 'text-shell-foreground/70 hover:bg-shell-surface hover:text-shell-foreground'
              }`}
            >
              <Layers className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <span className="truncate max-w-[180px]">{comp.title}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-full bg-shell">
      <nav className="flex-1 overflow-y-auto" aria-label="Main navigation">
        {navItems}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-shell-border flex-shrink-0">
        <div className="flex flex-col gap-1.5">
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-accent bg-shell-surface hover:bg-accent-muted transition-colors w-full"
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>New Sheet</span>}
          </Link>
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-accent bg-shell-surface hover:bg-accent-muted transition-colors w-full"
          >
            <FileMusic className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>New Composition</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}
