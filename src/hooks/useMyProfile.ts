import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserProfile } from "@/types";
import { getUser, CURRENT_USER_ID } from "@/data/mock";

const PROFILE_KEY = "checkin.profile.v1";
const MAX_PINNED = 3;

interface ProfileOverrides {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  pinnedTargetIds?: string[];
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Prototype data layer for "my" editable profile fields. The base identity
 * (id, username) stays fixed from the seed data; display name, bio, avatar
 * and pinned targets are overridable and persisted to localStorage.
 */
export function useMyProfile() {
  const base = getUser(CURRENT_USER_ID)!;
  const [overrides, setOverrides] = useState<ProfileOverrides>(() =>
    loadFromStorage(PROFILE_KEY, {} as ProfileOverrides)
  );

  useEffect(() => {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(overrides));
  }, [overrides]);

  const profile: UserProfile = useMemo(
    () => ({
      ...base,
      displayName: overrides.displayName ?? base.displayName,
      bio: overrides.bio ?? base.bio,
      avatarUrl: overrides.avatarUrl ?? base.avatarUrl,
    }),
    [base, overrides]
  );

  const pinnedTargetIds = overrides.pinnedTargetIds ?? [];

  const updateProfile = useCallback(
    (patch: { displayName?: string; bio?: string; avatarUrl?: string }) => {
      setOverrides((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const setPinnedTargets = useCallback((ids: string[]) => {
    setOverrides((prev) => ({ ...prev, pinnedTargetIds: ids.slice(0, MAX_PINNED) }));
  }, []);

  return { profile, pinnedTargetIds, updateProfile, setPinnedTargets, maxPinned: MAX_PINNED };
}
