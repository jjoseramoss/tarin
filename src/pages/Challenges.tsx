import { useEffect, useMemo, useState } from "react";
import { BarChart3, MessageCirclePlus, MoreVertical, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useChallenges } from "@/hooks/useChallenges";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/types";
import { ChallengeChatDialog } from "@/components/ChallengeChatDialog";
import { ChallengeLeaderboardDialog } from "@/components/ChallengeLeaderboardDialog";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isActive(c: Challenge, day: string) {
  return day >= c.startDate && day <= c.endDate;
}

function isUpcoming(c: Challenge, day: string) {
  return day < c.startDate;
}

function startOfNextWeek() {
  const now = new Date();
  const day = now.getDay();
  const delta = (8 - day) % 7 || 7;
  const d = new Date(now);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function endOfWeek(start: string) {
  const d = new Date(start);
  d.setDate(d.getDate() + 6);
  return d.toISOString().slice(0, 10);
}

function startOfNextMonth() {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return d.toISOString().slice(0, 10);
}

function endOfMonth(start: string) {
  const d = new Date(start);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return end.toISOString().slice(0, 10);
}

export function Challenges() {
  const { userId } = useAuth();
  const {
    challenges,
    joinedChallengeIds,
    isLoading,
    joinChallenge,
    leaveChallenge,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    loadChat,
    sendChatMessage,
    loadLeaderboard,
  } = useChallenges();

  const today = todayKey();

  const active = useMemo(() => challenges.filter((c) => isActive(c.challenge, today)), [challenges, today]);
  const upcoming = useMemo(() => challenges.filter((c) => isUpcoming(c.challenge, today)), [challenges, today]);

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [headerImageUrl, setHeaderImageUrl] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [targets, setTargets] = useState<string[]>([""]);

  const [chatOpenFor, setChatOpenFor] = useState<string | null>(null);
  const [leaderboardOpenFor, setLeaderboardOpenFor] = useState<string | null>(null);
  const [editFor, setEditFor] = useState<Challenge | null>(null);
  const [deleteFor, setDeleteFor] = useState<Challenge | null>(null);

  function resetCreate() {
    setTitle("");
    setHeaderImageUrl("");
    setStartDate(today);
    setEndDate(today);
    setTargets([""]);
  }

  async function handleCreate() {
    const cleanedTargets = targets.map((t) => t.trim()).filter(Boolean);
    if (!title.trim() || !startDate || !endDate || cleanedTargets.length === 0) return;
    await createChallenge({
      title: title.trim(),
      headerImageUrl: headerImageUrl.trim() || undefined,
      startDate,
      endDate,
      targets: cleanedTargets,
    });
    setCreateOpen(false);
    resetCreate();
  }

  useEffect(() => {
    if (!createOpen) resetCreate();
  }, [createOpen]);

  return (
    <div className="flex flex-col gap-5 px-4 pb-28 pt-6 md:px-10 md:pb-12 md:pt-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black leading-tight tracking-tight">Challenges.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join a challenge, check in daily, climb the board.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4" /> Create
        </Button>
      </div>

      {isLoading && <div className="h-24 rounded-lg bg-muted" />}

      {!isLoading && active.length === 0 && upcoming.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">No challenges yet — create the first one.</p>
      )}

      {active.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-black tracking-tight">Current</h2>
            <Badge variant="outline">Live</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {active.map((c) => (
              <ChallengeCard
                key={c.challenge.id}
                challenge={c.challenge}
                targets={c.targets}
                joined={joinedChallengeIds.has(c.challenge.id)}
                canManage={c.challenge.creatorId === userId}
                onJoin={() => joinChallenge(c.challenge.id)}
                onLeave={() => leaveChallenge(c.challenge.id)}
                onChat={() => setChatOpenFor(c.challenge.id)}
                onLeaderboard={() => setLeaderboardOpenFor(c.challenge.id)}
                onEdit={() => setEditFor(c.challenge)}
                onDelete={() => setDeleteFor(c.challenge)}
              />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-black tracking-tight">Upcoming</h2>
            <Badge variant="outline">Soon</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((c) => (
              <ChallengeCard
                key={c.challenge.id}
                challenge={c.challenge}
                targets={c.targets}
                joined={joinedChallengeIds.has(c.challenge.id)}
                canManage={c.challenge.creatorId === userId}
                onJoin={() => joinChallenge(c.challenge.id)}
                onLeave={() => leaveChallenge(c.challenge.id)}
                onChat={() => setChatOpenFor(c.challenge.id)}
                onLeaderboard={() => setLeaderboardOpenFor(c.challenge.id)}
                onEdit={() => setEditFor(c.challenge)}
                onDelete={() => setDeleteFor(c.challenge)}
              />
            ))}
          </div>
        </div>
      )}

      <CreateChallengeDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={title}
        setTitle={setTitle}
        headerImageUrl={headerImageUrl}
        setHeaderImageUrl={setHeaderImageUrl}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        targets={targets}
        setTargets={setTargets}
        onPresetWeek={() => {
          const start = startOfNextWeek();
          setStartDate(start);
          setEndDate(endOfWeek(start));
        }}
        onPresetMonth={() => {
          const start = startOfNextMonth();
          setStartDate(start);
          setEndDate(endOfMonth(start));
        }}
        onCreate={handleCreate}
      />

      <ChallengeChatDialog
        challengeId={chatOpenFor}
        open={!!chatOpenFor}
        onOpenChange={(open) => setChatOpenFor(open ? chatOpenFor : null)}
        loadChat={loadChat}
        sendChat={sendChatMessage}
        meId={userId}
      />

      <ChallengeLeaderboardDialog
        challengeId={leaderboardOpenFor}
        open={!!leaderboardOpenFor}
        onOpenChange={(open) => setLeaderboardOpenFor(open ? leaderboardOpenFor : null)}
        loadLeaderboard={loadLeaderboard}
      />

      <EditChallengeDialog
        challenge={editFor}
        open={!!editFor}
        onOpenChange={(open) => setEditFor(open ? editFor : null)}
        onSave={async (id, patch) => {
          await updateChallenge(id, patch);
          setEditFor(null);
        }}
      />

      <ConfirmDeleteDialog
        challenge={deleteFor}
        open={!!deleteFor}
        onOpenChange={(open) => setDeleteFor(open ? deleteFor : null)}
        onConfirm={async (id) => {
          await deleteChallenge(id);
          setDeleteFor(null);
        }}
      />
    </div>
  );
}

function ChallengeCard({
  challenge,
  targets,
  joined,
  canManage,
  onJoin,
  onLeave,
  onChat,
  onLeaderboard,
  onEdit,
  onDelete,
}: {
  challenge: Challenge;
  targets: { id: string; title: string }[];
  joined: boolean;
  canManage: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onChat: () => void;
  onLeaderboard: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate font-display text-base font-bold leading-tight">{challenge.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {challenge.startDate} • {challenge.endDate}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {challenge.headerImageUrl && (
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <img src={challenge.headerImageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem destructive onClick={onDelete}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {targets.slice(0, 5).map((t) => (
            <div key={t.id} className="truncate text-sm text-foreground/90">
              • {t.title}
            </div>
          ))}
          {targets.length > 5 && <div className="text-xs text-muted-foreground">+{targets.length - 5} more</div>}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {!joined ? (
            <Button onClick={onJoin} className="flex-1 min-w-[120px]">
              <Users className="h-4 w-4" /> Join
            </Button>
          ) : (
            <>
              <Button onClick={onChat} variant="ghost" className="flex-1 min-w-[120px]">
                <MessageCirclePlus className="h-4 w-4" /> Chat
              </Button>
              <Button onClick={onLeaderboard} variant="ghost" className="flex-1 min-w-[120px]">
                <BarChart3 className="h-4 w-4" /> Leaderboard
              </Button>
              <Button onClick={onLeave} variant="outline" className="min-w-[110px]">
                Leave
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EditChallengeDialog({
  challenge,
  open,
  onOpenChange,
  onSave,
}: {
  challenge: Challenge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, patch: { title?: string; headerImageUrl?: string; startDate?: string; endDate?: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [headerImageUrl, setHeaderImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!challenge) return;
    setTitle(challenge.title);
    setHeaderImageUrl(challenge.headerImageUrl ?? "");
    setStartDate(challenge.startDate);
    setEndDate(challenge.endDate);
  }, [challenge]);

  const canSave = !!challenge && title.trim() && startDate && endDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit challenge</DialogTitle>
          <DialogDescription>Update title, image URL, and dates.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-ch-title">Title</Label>
            <Input id="edit-ch-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-ch-image">Header image URL</Label>
            <Input id="edit-ch-image" value={headerImageUrl} onChange={(e) => setHeaderImageUrl(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-ch-start">Start date</Label>
              <Input id="edit-ch-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-ch-end">End date</Label>
              <Input id="edit-ch-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              if (!challenge) return;
              onSave(challenge.id, {
                title: title.trim(),
                headerImageUrl: headerImageUrl.trim() || undefined,
                startDate,
                endDate,
              });
            }}
            disabled={!canSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDeleteDialog({
  challenge,
  open,
  onOpenChange,
  onConfirm,
}: {
  challenge: Challenge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete challenge?</DialogTitle>
          <DialogDescription>
            This deletes the challenge, its targets, chat, and check-ins.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (!challenge) return;
              onConfirm(challenge.id);
            }}
            disabled={!challenge}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateChallengeDialog({
  open,
  onOpenChange,
  title,
  setTitle,
  headerImageUrl,
  setHeaderImageUrl,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  targets,
  setTargets,
  onPresetWeek,
  onPresetMonth,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  setTitle: (v: string) => void;
  headerImageUrl: string;
  setHeaderImageUrl: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  targets: string[];
  setTargets: (v: string[]) => void;
  onPresetWeek: () => void;
  onPresetMonth: () => void;
  onCreate: () => void;
}) {
  const canCreate = title.trim() && startDate && endDate && targets.some((t) => t.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a challenge</DialogTitle>
          <DialogDescription>
            Pick a start/end date, add daily targets, and share the link with friends.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="challenge-title">Title</Label>
            <Input id="challenge-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="September Lock In" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="challenge-image">Header image URL (optional)</Label>
            <Input
              id="challenge-image"
              value={headerImageUrl}
              onChange={(e) => setHeaderImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="challenge-start">Start date</Label>
              <Input id="challenge-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="challenge-end">End date</Label>
              <Input id="challenge-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" onClick={onPresetWeek}>
              Next week
            </Button>
            <Button type="button" variant="ghost" onClick={onPresetMonth}>
              Next month
            </Button>
          </div>

          <div className="grid gap-2">
            <Label>Targets</Label>
            <div className="flex flex-col gap-2">
              {targets.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={t}
                    onChange={(e) => {
                      const next = targets.slice();
                      next[idx] = e.target.value;
                      setTargets(next);
                    }}
                    placeholder={idx === 0 ? "Drink 1 gal water" : "Add another target"}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("shrink-0", targets.length === 1 && "opacity-40")}
                    disabled={targets.length === 1}
                    onClick={() => setTargets(targets.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="ghost" onClick={() => setTargets([...targets, ""]) }>
                Add target
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onCreate} disabled={!canCreate}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
