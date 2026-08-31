import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { BarChart3, MessageCirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Challenge, ChallengeTarget } from "@/types";

function formatRange(start: string, end: string) {
  const fmt = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" });
  const s = fmt.format(new Date(start));
  const e = fmt.format(new Date(end));
  return start === end ? s : `${s} – ${e}`;
}

export interface JoinedChallengeTargetItem {
  challenge: Challenge;
  target: ChallengeTarget;
  completedToday: boolean;
  streak: number;
}

export function ChallengeTargetsSection({
  items,
  onToggle,
  onOpenChat,
  onOpenLeaderboard,
}: {
  items: JoinedChallengeTargetItem[];
  onToggle: (challenge: Challenge, target: ChallengeTarget, note?: string) => void;
  onOpenChat: (challengeId: string) => void;
  onOpenLeaderboard: (challengeId: string) => void;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, { challenge: Challenge; items: JoinedChallengeTargetItem[] }>();
    for (const item of items) {
      const existing = map.get(item.challenge.id);
      if (existing) existing.items.push(item);
      else map.set(item.challenge.id, { challenge: item.challenge, items: [item] });
    }
    return Array.from(map.values());
  }, [items]);

  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [pending, setPending] = useState<{ challenge: Challenge; target: ChallengeTarget } | null>(null);

  function handleToggle(item: JoinedChallengeTargetItem) {
    if (item.completedToday) {
      onToggle(item.challenge, item.target);
      return;
    }
    setPending({ challenge: item.challenge, target: item.target });
    setNoteOpen(true);
  }

  function confirmComplete() {
    if (!pending) return;
    onToggle(pending.challenge, pending.target, note);
    setNote("");
    setPending(null);
    setNoteOpen(false);
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-2xl font-black tracking-tight">Challenges</h2>

      {groups.map((g) => (
        <Card key={g.challenge.id} className="overflow-hidden">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-lg font-black leading-tight tracking-tight">
                  {g.challenge.title}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{formatRange(g.challenge.startDate, g.challenge.endDate)}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onOpenChat(g.challenge.id)} aria-label="Open chat">
                  <MessageCirclePlus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenLeaderboard(g.challenge.id)}
                  aria-label="Open leaderboard"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                {g.challenge.headerImageUrl && (
                  <div className="h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted">
                    <img src={g.challenge.headerImageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {g.items
                .slice()
                .sort((a, b) => a.target.order - b.target.order)
                .map((item) => (
                  <div key={item.target.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{item.target.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        Streak: {item.streak}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(item)}
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                        item.completedToday
                          ? "border-transparent bg-success text-white"
                          : "border-border bg-transparent text-muted-foreground hover:border-accent hover:text-accent"
                      )}
                      aria-label={item.completedToday ? "Mark incomplete" : "Mark complete"}
                    >
                      <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pending ? pending.target.title : "Add note"}</DialogTitle>
            <DialogDescription>Add a note (optional), then check it off.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="How'd it go?" value={note} onChange={(e) => setNote(e.target.value)} autoFocus />
          <DialogFooter>
            <Button onClick={confirmComplete} disabled={!pending}>
              <Check className="h-4 w-4" /> Mark complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
