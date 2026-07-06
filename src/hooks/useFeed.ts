import { useMemo } from "react";
import type { CheckIn, Target, UserProfile } from "@/types";
import { checkIns as seedCheckIns, getTarget, getUser, users, CURRENT_USER_ID } from "@/data/mock";
import { useCheckinData } from "@/hooks/useCheckinData";
import { useFriends } from "@/hooks/useFriends";
import { useMyProfile } from "@/hooks/useMyProfile";

export interface FeedEntry {
  checkIn: CheckIn;
  target: Target;
  user: UserProfile;
  streak: number;
}

/**
 * The feed's data layer, kept isolated the same way useCheckinData is —
 * this is the piece that gets swapped for a Supabase realtime subscription
 * (check-ins where user_id in (me, my connections), ordered by completed_at)
 * once a real backend exists. Until then, "automatic" means it's fully
 * reactive: any check-in or friendship change re-derives the feed instantly.
 *
 * Visibility rule: your own activity, plus activity from anyone you're
 * connected to in any way — accepted friends, and anyone with a pending
 * request in either direction (you asked them, or they asked you).
 */
export function useFeed() {
  const { checkIns: liveCheckIns, streakFor } = useCheckinData();
  const { statusFor } = useFriends();
  const { profile: me } = useMyProfile();

  const visibleUserIds = useMemo(() => {
    const ids = new Set<string>([CURRENT_USER_ID]);
    for (const u of users) {
      if (u.id === CURRENT_USER_ID) continue;
      if (statusFor(u.id) !== "none") ids.add(u.id);
    }
    return ids;
  }, [statusFor]);

  const entries = useMemo<FeedEntry[]>(() => {
    const mine = liveCheckIns.filter((c) => c.userId === CURRENT_USER_ID && c.note);
    const connections = seedCheckIns.filter(
      (c) => c.userId !== CURRENT_USER_ID && visibleUserIds.has(c.userId)
    );

    return [...mine, ...connections]
      .filter((c) => getTarget(c.targetId))
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
      .map((c) => {
        const target = getTarget(c.targetId)!;
        const user = c.userId === CURRENT_USER_ID ? me : getUser(c.userId)!;
        const streak = c.userId === CURRENT_USER_ID ? streakFor(target.id) : 0;
        return { checkIn: c, target, user, streak };
      });
  }, [liveCheckIns, visibleUserIds, me, streakFor]);

  return { entries };
}
