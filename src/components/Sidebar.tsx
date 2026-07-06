import { cn } from "@/lib/utils";
import { PRIMARY_ROUTES, MORE_ROUTES, type Route } from "@/lib/routes";

interface SidebarProps {
  route: Route;
  onNavigate: (r: Route) => void;
}

const items = [...PRIMARY_ROUTES, ...MORE_ROUTES];

export function Sidebar({ route, onNavigate }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card/60 px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <img src="/target.png" alt="" className="h-6 w-6 object-contain" />
        <p className="font-display text-xl font-black tracking-tight">TARIN</p>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map(({ key, label, icon: Icon }) => {
          const active = route === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2.4 : 1.8}
                fill={active ? "currentColor" : "none"}
                fillOpacity={active ? 0.12 : 0}
              />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
