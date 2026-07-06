import { useCallback, useEffect, useMemo, useState } from "react";
import type { WeightEntry } from "@/types";
import { CURRENT_USER_ID } from "@/data/mock";
import { todayKey, daysAgoKey } from "@/lib/utils";

const WEIGHT_KEY = "checkin.weight.v1";

export type WeightRange = "week" | "month" | "year";

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
 * Prototype data layer for weight tracking. Same shape as useCheckinData:
 * localStorage-backed for now, swap for Supabase later.
 */
export function useWeightData() {
  const [entries, setEntries] = useState<WeightEntry[]>(() =>
    loadFromStorage(WEIGHT_KEY, [] as WeightEntry[])
  );

  useEffect(() => {
    window.localStorage.setItem(WEIGHT_KEY, JSON.stringify(entries));
  }, [entries]);

  const myEntries = useMemo(
    () =>
      entries
        .filter((e) => e.userId === CURRENT_USER_ID)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [entries]
  );

  const latestEntry = useMemo(
    () => (myEntries.length ? myEntries[myEntries.length - 1] : undefined),
    [myEntries]
  );

  const logWeight = useCallback((weight: number, date: string = todayKey()) => {
    setEntries((prev) => {
      const existing = prev.find(
        (e) => e.userId === CURRENT_USER_ID && e.date === date
      );
      if (existing) {
        return prev.map((e) =>
          e.id === existing.id ? { ...e, weight, createdAt: new Date().toISOString() } : e
        );
      }
      const entry: WeightEntry = {
        id: `w-${Date.now()}`,
        userId: CURRENT_USER_ID,
        date,
        weight,
        createdAt: new Date().toISOString(),
      };
      return [...prev, entry];
    });
  }, []);

  const entriesInRange = useCallback(
    (range: WeightRange) => {
      const daysBack = range === "week" ? 7 : range === "month" ? 30 : 365;
      const cutoff = daysAgoKey(daysBack);
      return myEntries.filter((e) => e.date >= cutoff);
    },
    [myEntries]
  );

  return {
    entries: myEntries,
    latestEntry,
    logWeight,
    entriesInRange,
  };
}
