import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Row = { user_id: string; display_name: string; avatar_url: string | null; completed_count: number };

export function ChallengeLeaderboardDialog({
  challengeId,
  open,
  onOpenChange,
  loadLeaderboard,
}: {
  challengeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loadLeaderboard: (challengeId: string) => Promise<Row[]>;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || !challengeId) return;
    setIsLoading(true);
    loadLeaderboard(challengeId)
      .then((r) => setRows(r))
      .finally(() => setIsLoading(false));
  }, [open, challengeId, loadLeaderboard]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leaderboard</DialogTitle>
          <DialogDescription>Ranked by total check-ins during the challenge.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {isLoading && <div className="h-20 rounded-md bg-muted" />}
          {!isLoading && rows.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No check-ins yet.</div>
          )}
          {!isLoading &&
            rows.map((r, idx) => (
              <div key={r.user_id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 text-sm font-bold text-muted-foreground">#{idx + 1}</div>
                  <Avatar className="h-7 w-7 border border-border">
                    <AvatarImage src={r.avatar_url ?? ""} alt={r.display_name} />
                    <AvatarFallback>{(r.display_name || "?")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium">{r.display_name}</div>
                </div>
                <div className="text-sm font-semibold">{r.completed_count}</div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
