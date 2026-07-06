import { useCallback, useEffect, useState } from "react";

const AUTH_KEY = "checkin.auth.v1";

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
 * Prototype auth gate. No real backend yet — logging in or signing up just
 * flips a flag in localStorage. This is the seam that gets swapped for
 * `supabase.auth` once a real backend is wired up.
 */
export function useAuth() {
  const [isAuthed, setIsAuthed] = useState(() => loadFromStorage(AUTH_KEY, false));

  useEffect(() => {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(isAuthed));
  }, [isAuthed]);

  const login = useCallback(() => setIsAuthed(true), []);
  const logout = useCallback(() => setIsAuthed(false), []);

  return { isAuthed, login, logout };
}
