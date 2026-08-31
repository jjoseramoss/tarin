import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type {
  Challenge,
  ChallengeCheckIn,
  ChallengeMessage,
  ChallengeMembership,
  ChallengeTarget,
  UserProfile,
} from "@/types";

interface ChallengeRow {
  id: string;
  creator_id: string;
  title: string;
  header_image_url: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface ChallengeTargetRow {
  id: string;
  challenge_id: string;
  title: string;
  sort_order: number;
}

interface ChallengeMembershipRow {
  challenge_id: string;
  user_id: string;
  joined_at: string;
}

interface ChallengeCheckInRow {
  id: string;
  challenge_id: string;
  challenge_target_id: string;
  user_id: string;
  date: string;
  note: string | null;
  created_at: string;
}

interface ChallengeMessageRow {
  id: string;
  challenge_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

function toChallenge(r: ChallengeRow): Challenge {
  return {
    id: r.id,
    creatorId: r.creator_id,
    title: r.title,
    headerImageUrl: r.header_image_url ?? undefined,
    startDate: r.start_date,
    endDate: r.end_date,
    createdAt: r.created_at,
  };
}

function toChallengeTarget(r: ChallengeTargetRow): ChallengeTarget {
  return {
    id: r.id,
    challengeId: r.challenge_id,
    title: r.title,
    order: r.sort_order,
  };
}

function toMembership(r: ChallengeMembershipRow): ChallengeMembership {
  return { challengeId: r.challenge_id, userId: r.user_id, joinedAt: r.joined_at };
}

function toCheckIn(r: ChallengeCheckInRow): ChallengeCheckIn {
  return {
    id: r.id,
    challengeId: r.challenge_id,
    challengeTargetId: r.challenge_target_id,
    userId: r.user_id,
    date: r.date,
    note: r.note ?? undefined,
    createdAt: r.created_at,
  };
}

function toMessage(r: ChallengeMessageRow): ChallengeMessage & { author?: UserProfile } {
  return {
    id: r.id,
    challengeId: r.challenge_id,
    userId: r.user_id,
    body: r.body,
    createdAt: r.created_at,
    ...(r.profiles
      ? {
          author: {
            id: r.profiles.id,
            username: r.profiles.username,
            displayName: r.profiles.display_name,
            avatarUrl: r.profiles.avatar_url ?? "",
          },
        }
      : null),
  };
}

function todayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function inRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

export interface ChallengeWithTargets {
  challenge: Challenge;
  targets: ChallengeTarget[];
}

export interface JoinedChallengeTarget {
  challenge: Challenge;
  target: ChallengeTarget;
  completedToday: boolean;
  streak: number;
}

export function useChallenges() {
  const { userId } = useAuth();

  const [challenges, setChallenges] = useState<ChallengeWithTargets[]>([]);
  const [memberships, setMemberships] = useState<ChallengeMembership[]>([]);
  const [myCheckIns, setMyCheckIns] = useState<ChallengeCheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!userId) {
      setChallenges([]);
      setMemberships([]);
      setMyCheckIns([]);
      setIsLoading(false);
      return;
    }

    const [{ data: challengeRows }, { data: targetRows }, { data: membershipRows }, { data: checkInRows }] =
      await Promise.all([
        supabase.from("challenges").select("*").order("start_date", { ascending: true }),
        supabase.from("challenge_targets").select("*").order("sort_order", { ascending: true }),
        supabase.from("challenge_members").select("*").eq("user_id", userId),
        supabase.from("challenge_check_ins").select("*").eq("user_id", userId),
      ]);

    const ch = ((challengeRows as ChallengeRow[]) ?? []).map(toChallenge);
    const targets = ((targetRows as ChallengeTargetRow[]) ?? []).map(toChallengeTarget);

    const byChallenge = new Map<string, ChallengeTarget[]>();
    for (const t of targets) {
      const arr = byChallenge.get(t.challengeId) ?? [];
      arr.push(t);
      byChallenge.set(t.challengeId, arr);
    }

    setChallenges(ch.map((c) => ({ challenge: c, targets: byChallenge.get(c.id) ?? [] })));
    setMemberships(((membershipRows as ChallengeMembershipRow[]) ?? []).map(toMembership));
    setMyCheckIns(((checkInRows as ChallengeCheckInRow[]) ?? []).map(toCheckIn));
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);
    reload();
  }, [reload]);

  const joinedChallengeIds = useMemo(() => new Set(memberships.map((m) => m.challengeId)), [memberships]);

  const joinChallenge = useCallback(
    async (challengeId: string) => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("challenge_members")
        .insert({ challenge_id: challengeId, user_id: userId })
        .select()
        .single();
      if (!error && data) setMemberships((prev) => [...prev, toMembership(data as ChallengeMembershipRow)]);
    },
    [userId]
  );

  const leaveChallenge = useCallback(
    async (challengeId: string) => {
      if (!userId) return;
      const { error } = await supabase
        .from("challenge_members")
        .delete()
        .eq("challenge_id", challengeId)
        .eq("user_id", userId);
      if (!error) {
        setMemberships((prev) => prev.filter((m) => m.challengeId !== challengeId));
        setMyCheckIns((prev) => prev.filter((c) => c.challengeId !== challengeId));
      }
    },
    [userId]
  );

  const createChallenge = useCallback(
    async (input: {
      title: string;
      headerImageUrl?: string;
      startDate: string;
      endDate: string;
      targets: string[];
    }) => {
      if (!userId) return;

      const { data: challengeRow, error: challengeError } = await supabase
        .from("challenges")
        .insert({
          creator_id: userId,
          title: input.title,
          header_image_url: input.headerImageUrl?.trim() || null,
          start_date: input.startDate,
          end_date: input.endDate,
        })
        .select()
        .single();

      if (challengeError || !challengeRow) return;

      const created = toChallenge(challengeRow as ChallengeRow);
      const targetPayload = input.targets
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t, i) => ({ challenge_id: created.id, title: t, sort_order: i }));

      const { data: createdTargets } = await supabase.from("challenge_targets").insert(targetPayload).select();

      setChallenges((prev) => [
        ...prev,
        { challenge: created, targets: ((createdTargets as ChallengeTargetRow[]) ?? []).map(toChallengeTarget) },
      ]);
  },
    [userId]
  );

  const updateChallenge = useCallback(
    async (challengeId: string, patch: { title?: string; headerImageUrl?: string; startDate?: string; endDate?: string }) => {
      const dbPatch: Record<string, unknown> = {};
      if (patch.title !== undefined) dbPatch.title = patch.title;
      if (patch.headerImageUrl !== undefined) dbPatch.header_image_url = patch.headerImageUrl?.trim() || null;
      if (patch.startDate !== undefined) dbPatch.start_date = patch.startDate;
      if (patch.endDate !== undefined) dbPatch.end_date = patch.endDate;
      if (Object.keys(dbPatch).length === 0) return;

      const { data, error } = await supabase.from("challenges").update(dbPatch).eq("id", challengeId).select().single();
      if (error || !data) return;

      const updated = toChallenge(data as ChallengeRow);
      setChallenges((prev) => prev.map((c) => (c.challenge.id === challengeId ? { ...c, challenge: updated } : c)));
    },
    []
  );

  const deleteChallenge = useCallback(async (challengeId: string) => {
    const { error } = await supabase.from("challenges").delete().eq("id", challengeId);
    if (!error) {
      setChallenges((prev) => prev.filter((c) => c.challenge.id !== challengeId));
      setMemberships((prev) => prev.filter((m) => m.challengeId !== challengeId));
      setMyCheckIns((prev) => prev.filter((c) => c.challengeId !== challengeId));
    }
  }, []);

  const toggleToday = useCallback(
    async (challenge: Challenge, target: ChallengeTarget, note?: string) => {
      if (!userId) return;
      const date = todayDateKey();

      const existing = myCheckIns.find(
        (c) => c.challengeTargetId === target.id && c.userId === userId && c.date === date
      );

      if (existing) {
        const { error } = await supabase.from("challenge_check_ins").delete().eq("id", existing.id);
        if (!error) setMyCheckIns((prev) => prev.filter((c) => c.id !== existing.id));
        return;
      }

      const { data, error } = await supabase
        .from("challenge_check_ins")
        .insert({
          challenge_id: challenge.id,
          challenge_target_id: target.id,
          user_id: userId,
          date,
          note: note?.trim() || null,
        })
        .select()
        .single();

      if (!error && data) setMyCheckIns((prev) => [toCheckIn(data as ChallengeCheckInRow), ...prev]);
    },
    [userId, myCheckIns]
  );

  const joinedTargetsForDashboard = useMemo<JoinedChallengeTarget[]>(() => {
    const today = todayDateKey();
    const checkInByTargetDate = new Set(myCheckIns.map((c) => `${c.challengeTargetId}:${c.date}`));

    const streakFor = (challenge: Challenge, targetId: string) => {
      const rows = myCheckIns
        .filter((c) => c.challengeId === challenge.id && c.challengeTargetId === targetId)
        .map((c) => c.date)
        .sort()
        .reverse();

      if (rows.length === 0) return 0;

      let cursor = today;
      let streak = 0;
      for (let i = 0; i < 400; i++) {
        if (!inRange(cursor, challenge.startDate, challenge.endDate)) break;
        if (checkInByTargetDate.has(`${targetId}:${cursor}`)) {
          streak++;
        } else if (i !== 0) {
          break;
        }
        const d = new Date(cursor);
        d.setDate(d.getDate() - 1);
        cursor = d.toISOString().slice(0, 10);
      }

      return streak;
    };

    const out: JoinedChallengeTarget[] = [];
    for (const item of challenges) {
      if (!joinedChallengeIds.has(item.challenge.id)) continue;
      if (!inRange(today, item.challenge.startDate, item.challenge.endDate)) continue;
      for (const t of item.targets) {
        out.push({
          challenge: item.challenge,
          target: t,
          completedToday: checkInByTargetDate.has(`${t.id}:${today}`),
          streak: streakFor(item.challenge, t.id),
        });
      }
    }

    return out;
  }, [challenges, joinedChallengeIds, myCheckIns]);

  const loadChat = useCallback(async (challengeId: string) => {
    const { data } = await supabase
      .from("challenge_messages")
      .select("*, profiles(id, username, display_name, avatar_url)")
      .eq("challenge_id", challengeId)
      .order("created_at", { ascending: false })
      .limit(200);

    return ((data as ChallengeMessageRow[]) ?? []).map(toMessage);
  }, []);

  const sendChatMessage = useCallback(
    async (challengeId: string, body: string) => {
      if (!userId) return undefined;
      const { data, error } = await supabase
        .from("challenge_messages")
        .insert({ challenge_id: challengeId, user_id: userId, body: body.trim() })
        .select("*, profiles(id, username, display_name, avatar_url)")
        .single();
      if (error || !data) return undefined;
      return toMessage(data as ChallengeMessageRow);
    },
    [userId]
  );

  const loadLeaderboard = useCallback(async (challengeId: string) => {
    const { data } = await supabase.rpc("challenge_leaderboard", { p_challenge_id: challengeId });
    return (data as { user_id: string; display_name: string; avatar_url: string | null; completed_count: number }[]) ?? [];
  }, []);

  return {
    challenges,
    memberships,
    joinedChallengeIds,
    joinedTargetsForDashboard,
    isLoading,
    reload,
    joinChallenge,
    leaveChallenge,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    toggleToday,
    loadChat,
    sendChatMessage,
    loadLeaderboard,
  };
}
