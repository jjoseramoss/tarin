import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ToggleProps {
  className?: string;
}

/** Icon button for large devices (laptop/desktop). */
export function ThemeToggleButton({ className }: ToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

/** Pill switch used on mobile, shown only in the Profile section. */
export function ThemeSwitch({ className }: ToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-border transition-colors",
        isDark ? "bg-foreground/80" : "bg-secondary",
        className
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm transition-transform",
          isDark ? "translate-x-6" : "translate-x-1"
        )}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-foreground" />
        ) : (
          <Sun className="h-3 w-3 text-muted-foreground" />
        )}
      </span>
    </button>
  );
}
