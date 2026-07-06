import { useCallback, useEffect, useState } from "react";
import type { DietDay, MealSection } from "@/types";
import { CURRENT_USER_ID } from "@/data/mock";
import { todayKey } from "@/lib/utils";

const DIET_KEY = "checkin.diet.v1";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function emptyDay(date: string): DietDay {
  return {
    userId: CURRENT_USER_ID,
    date,
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
}

/**
 * Prototype data layer for the diet log. One DietDay record per user per
 * day, each holding an array of free-text items per meal section.
 * localStorage-backed for now, swap for Supabase later.
 */
export function useDietData(date: string = todayKey()) {
  const [days, setDays] = useState<DietDay[]>(() =>
    loadFromStorage(DIET_KEY, [] as DietDay[])
  );

  useEffect(() => {
    window.localStorage.setItem(DIET_KEY, JSON.stringify(days));
  }, [days]);

  const day =
    days.find((d) => d.userId === CURRENT_USER_ID && d.date === date) ??
    emptyDay(date);

  /** Appends a new, empty input row to a section — the "+" button action. */
  const addItem = useCallback(
    (section: MealSection) => {
      setDays((prev) => {
        const existing = prev.find(
          (d) => d.userId === CURRENT_USER_ID && d.date === date
        );
        const item = {
          id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text: "",
        };
        if (existing) {
          return prev.map((d) =>
            d === existing ? { ...d, [section]: [...d[section], item] } : d
          );
        }
        const fresh = emptyDay(date);
        fresh[section] = [item];
        return [...prev, fresh];
      });
    },
    [date]
  );

  const updateItem = useCallback(
    (section: MealSection, id: string, text: string) => {
      setDays((prev) =>
        prev.map((d) =>
          d.userId === CURRENT_USER_ID && d.date === date
            ? { ...d, [section]: d[section].map((i) => (i.id === id ? { ...i, text } : i)) }
            : d
        )
      );
    },
    [date]
  );

  const removeItem = useCallback(
    (section: MealSection, id: string) => {
      setDays((prev) =>
        prev.map((d) =>
          d.userId === CURRENT_USER_ID && d.date === date
            ? { ...d, [section]: d[section].filter((i) => i.id !== id) }
            : d
        )
      );
    },
    [date]
  );

  return { day, addItem, updateItem, removeItem };
}
