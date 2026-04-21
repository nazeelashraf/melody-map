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
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
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
