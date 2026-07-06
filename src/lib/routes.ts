import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Rss, Scale, UtensilsCrossed, Users, UserRound } from "lucide-react";

export type Route = "dashboard" | "feed" | "weight" | "diet" | "friends" | "profile";

export interface RouteMeta {
  key: Route;
  label: string;
  icon: LucideIcon;
}

/** Always-visible primary routes (first slots in the bottom bar / sidebar). */
export const PRIMARY_ROUTES: RouteMeta[] = [
  { key: "dashboard", label: "Targets", icon: LayoutGrid },
  { key: "feed", label: "Feed", icon: Rss },
];

/**
 * Secondary routes. On mobile these live behind the "More" button so the
 * bottom bar doesn't get crowded as more features ship; on large devices
 * they're just added straight into the sidebar. Add new features here.
 */
export const MORE_ROUTES: RouteMeta[] = [
  { key: "weight", label: "Weight", icon: Scale },
  { key: "diet", label: "Diet", icon: UtensilsCrossed },
  { key: "friends", label: "Friends", icon: Users },
];

export const PROFILE_ROUTE: RouteMeta = { key: "profile", label: "Profile", icon: UserRound };

export const ROUTE_TITLES: Record<Route, string> = {
  dashboard: "Your targets.",
  feed: "Activity feed.",
  weight: "Weight tracker.",
  diet: "Diet tracker.",
  friends: "Friends.",
  profile: "Profile.",
};
