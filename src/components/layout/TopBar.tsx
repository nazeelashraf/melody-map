import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '@/components/ui/button';

interface TopBarProps {
  onMenuClick?: () => void;
  title?: string;
}

export default function TopBar({ onMenuClick, title = 'Library' }: TopBarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header data-topbar className="flex items-center justify-between px-4 py-2 border-b border-shell-border bg-shell">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-shell-foreground hover:bg-shell-surface hover:text-shell-foreground"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-shell-foreground">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-shell-foreground hover:bg-shell-surface hover:text-shell-foreground"
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
