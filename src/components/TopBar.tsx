import { useMyProfile } from "@/hooks/useMyProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import { ROUTE_TITLES, type Route } from "@/lib/routes";

interface TopBarProps {
  route: Route;
  onNavigate: (r: Route) => void;
}

export function TopBar({ route, onNavigate }: TopBarProps) {
  const { profile: me } = useMyProfile();

  return (
    <header className="hidden h-16 shrink-0 items-center justify-between border-b border-border bg-card/60 px-8 md:flex">
      <h1 className="font-display text-lg font-bold tracking-tight">{ROUTE_TITLES[route]}</h1>
      <div className="flex items-center gap-3">
        <ThemeToggleButton />
        <button
          onClick={() => onNavigate("profile")}
          className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Profile"
        >
          <Avatar
            className={
              "h-9 w-9 border-2 transition-colors " +
              (route === "profile" ? "border-accent" : "border-border")
            }
          >
            <AvatarImage src={me.avatarUrl} alt={me.displayName} />
            <AvatarFallback>{me.displayName[0]}</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
