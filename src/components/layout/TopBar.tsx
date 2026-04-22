import { Moon, Sun, Menu, Library } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

interface TopBarProps {
  onMenuClick?: () => void;
  title?: string;
}

export default function TopBar({ onMenuClick, title = 'Library' }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const isLibrary = location.pathname === '/';

  return (
    <header data-topbar className="flex items-center justify-between px-4 py-3 border-b border-shell-border bg-shell">
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-11 w-11 min-h-[44px] min-w-[44px] text-shell-foreground hover:bg-shell-surface hover:text-shell-foreground"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 min-w-0">
          {!isLibrary && (
            <>
              <Library className="h-4 w-4 text-shell-foreground/50 flex-shrink-0 hidden sm:block" />
              <span className="text-sm text-shell-foreground/50 hidden sm:block">Library</span>
              <span className="text-sm text-shell-foreground/30 hidden sm:block">/</span>
            </>
          )}
          <h2 className="text-lg font-semibold text-shell-foreground truncate">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-shell-foreground hover:bg-shell-surface hover:text-shell-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
