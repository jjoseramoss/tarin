import { useCallback, useEffect, useMemo, useState } from "react";
import { users, CURRENT_USER_ID } from "@/data/mock";

const FRIENDS_KEY = "checkin.friends.v1";

interface FriendsState {
  /** Accepted, mutual friends. */
  friends: string[];
  /** Requests sent to me, awaiting my decision. */
  incoming: string[];
  /** Requests I've sent, awaiting the other person. */
  outgoing: string[];
}

const SEED_STATE: FriendsState = {
  friends: ["u-marco"],
  incoming: ["u-sam"],
  outgoing: [],
};

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
 * Prototype data layer for friends. Seeded with one accepted friend and one
 * incoming invite so the feature has something to demo. localStorage-backed
 * for now — swap for a real friends/requests table once Supabase is wired up.
 */
export function useFriends() {
  const [state, setState] = useState<FriendsState>(() =>
    loadFromStorage(FRIENDS_KEY, SEED_STATE)
  );

  useEffect(() => {
    window.localStorage.setItem(FRIENDS_KEY, JSON.stringify(state));
  }, [state]);

  const otherUsers = useMemo(
    () => users.filter((u) => u.id !== CURRENT_USER_ID),
    []
  );

  const discoverable = useMemo(
    () =>
      otherUsers.filter(
        (u) =>
          !state.friends.includes(u.id) &&
          !state.incoming.includes(u.id) &&
          !state.outgoing.includes(u.id)
      ),
    [otherUsers, state]
  );

  const sendRequest = useCallback((userId: string) => {
    setState((prev) =>
      prev.outgoing.includes(userId) || prev.friends.includes(userId)
        ? prev
        : { ...prev, outgoing: [...prev.outgoing, userId] }
    );
  }, []);

  const acceptRequest = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      incoming: prev.incoming.filter((id) => id !== userId),
      friends: prev.friends.includes(userId) ? prev.friends : [...prev.friends, userId],
    }));
  }, []);

  const declineRequest = useCallback((userId: string) => {
    setState((prev) => ({ ...prev, incoming: prev.incoming.filter((id) => id !== userId) }));
  }, []);

  const removeFriend = useCallback((userId: string) => {
    setState((prev) => ({ ...prev, friends: prev.friends.filter((id) => id !== userId) }));
  }, []);

  function statusFor(userId: string): "friend" | "incoming" | "outgoing" | "none" {
    if (state.friends.includes(userId)) return "friend";
    if (state.incoming.includes(userId)) return "incoming";
    if (state.outgoing.includes(userId)) return "outgoing";
    return "none";
  }

  return {
    friendIds: state.friends,
    incomingIds: state.incoming,
    outgoingIds: state.outgoing,
    discoverable,
    friendCount: state.friends.length,
    statusFor,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
  };
}
