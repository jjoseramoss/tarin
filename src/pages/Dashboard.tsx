import { useMemo, useState } from "react";
import { useCheckinData } from "@/hooks/useCheckinData";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useChallenges } from "@/hooks/useChallenges";
import { useAuth } from "@/hooks/useAuth";
import { TargetCard } from "@/components/TargetCard";
import { AddTargetDialog } from "@/components/AddTargetDialog";
import { ChallengeTargetsSection } from "@/components/ChallengeTargetsSection";
import { ChallengeChatDialog } from "@/components/ChallengeChatDialog";
import { ChallengeLeaderboardDialog } from "@/components/ChallengeLeaderboardDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Dashboard() {
  const { userId } = useAuth();
  const {
    myTargets,
    isCompletedNow,
    streakFor,
    toggleComplete,
    addTarget,
    updateTarget,
    deleteTarget,
  } = useCheckinData();

  const { profile: me } = useMyProfile();

  const challenges = useChallenges();
  const [chatOpenFor, setChatOpenFor] = useState<string | null>(null);
  const [leaderboardOpenFor, setLeaderboardOpenFor] = useState<string | null>(null);

  const completedToday = useMemo(
    () => myTargets.filter((t) => isCompletedNow(t.id)).length,
    [myTargets, isCompletedNow]
  );

  const now = new Date();
  const monthName = now.toLocaleDateString(undefined, { month: "long" });
  const dayLine = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-5 px-4 pb-28 pt-6 md:px-10 md:pb-12 md:pt-8">
      <header className="flex items-start justify-between md:hidden">
        <div>
          <p className="font-display text-4xl font-black leading-none tracking-tight text-accent">
            {monthName}
          </p>
          <p className="mt-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {dayLine}
          </p>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight">
            Your targets.
          </h1>
        </div>
        <Avatar className="h-11 w-11 border border-border">
          <AvatarImage src={me.avatarUrl} alt={me.displayName} />
          <AvatarFallback>{me.displayName[0]}</AvatarFallback>
        </Avatar>
      </header>

      <div className="hidden md:block">
        <p className="font-display text-5xl font-black leading-none tracking-tight text-accent">
          {monthName}
        </p>
        <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {dayLine}
        </p>
      </div>

      {myTargets.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-display text-base font-bold text-foreground">
            {completedToday}/{myTargets.length}
          </span>
          done so far today
        </div>
      )}

      <AddTargetDialog onCreate={addTarget} />

      <ChallengeTargetsSection
        items={challenges.joinedTargetsForDashboard}
        onToggle={challenges.toggleToday}
        onOpenChat={(id) => setChatOpenFor(id)}
        onOpenLeaderboard={(id) => setLeaderboardOpenFor(id)}
      />

      <h2 className="font-display text-2xl font-black tracking-tight">Your Targets</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:items-start md:gap-4 lg:grid-cols-3">
        {myTargets.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground md:col-span-full">
            No targets yet — add your first one above.
          </p>
        )}
        {myTargets.map((t) => (
          <TargetCard
            key={t.id}
            target={t}
            completed={isCompletedNow(t.id)}
            streak={streakFor(t.id)}
            onToggle={(note) => toggleComplete(t.id, note)}
            onDelete={() => deleteTarget(t.id)}
            onRename={(title) => updateTarget(t.id, { title })}
          />
        ))}
      </div>

      <ChallengeChatDialog
        challengeId={chatOpenFor}
        open={!!chatOpenFor}
        onOpenChange={(open) => setChatOpenFor(open ? chatOpenFor : null)}
        loadChat={challenges.loadChat}
        sendChat={challenges.sendChatMessage}
        meId={userId}
      />

      <ChallengeLeaderboardDialog
        challengeId={leaderboardOpenFor}
        open={!!leaderboardOpenFor}
        onOpenChange={(open) => setLeaderboardOpenFor(open ? leaderboardOpenFor : null)}
        loadLeaderboard={challenges.loadLeaderboard}
      />
    </div>
  );
}
