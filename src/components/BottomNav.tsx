import { useState } from "react";
import { Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIMARY_ROUTES, MORE_ROUTES, PROFILE_ROUTE, type Route } from "@/lib/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type { Route };

interface BottomNavProps {
  route: Route;
  onNavigate: (r: Route) => void;
}

const moreKeys = new Set(MORE_ROUTES.map((r) => r.key));

export function BottomNav({ route, onNavigate }: BottomNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const isMoreActive = moreKeys.has(route);

  const items = [...PRIMARY_ROUTES];

  return (
    <>
      <nav className="safe-bottom fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-sm items-center justify-around px-6 py-2">
          {items.map(({ key, label, icon: Icon }) => {
            const active = route === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground"
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

          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
              isMoreActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <Grid2x2
              className="h-5 w-5"
              strokeWidth={isMoreActive ? 2.4 : 1.8}
              fill={isMoreActive ? "currentColor" : "none"}
              fillOpacity={isMoreActive ? 0.12 : 0}
            />
            More
          </button>

          {(() => {
            const { key, label, icon: Icon } = PROFILE_ROUTE;
            const active = route === key;
            return (
              <button
                onClick={() => onNavigate(key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground"
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
          })()}
        </div>
      </nav>

      <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>More</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3">
            {MORE_ROUTES.map(({ key, label, icon: Icon }) => {
              const active = route === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    onNavigate(key);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border text-xs font-medium transition-colors",
                    active
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                  {label}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
