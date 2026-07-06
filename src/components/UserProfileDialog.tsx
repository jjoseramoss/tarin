import { UserPlus, UserMinus, Check, X } from "lucide-react";
import type { UserProfile } from "@/types";
import { targets as allTargets } from "@/data/mock";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type FriendStatus = "friend" | "incoming" | "outgoing" | "none" | "self";

interface UserProfileDialogProps {
  user: UserProfile | null;
  status: FriendStatus;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onRemove: () => void;
}

/** Read-only viewer for someone else's public profile — reached by tapping a friend card. */
export function UserProfileDialog({
  user,
  status,
  onOpenChange,
  onAdd,
  onAccept,
  onDecline,
  onRemove,
}: UserProfileDialogProps) {
  const userTargets = user ? allTargets.filter((t) => t.userId === user.id).slice(0, 3) : [];

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        {user && (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center gap-2 pt-1 text-center">
                <Avatar className="h-20 w-20 border border-border">
                  <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                  <AvatarFallback className="text-2xl">{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <DialogTitle>{user.displayName}</DialogTitle>
                <DialogDescription>@{user.username}</DialogDescription>
              </div>
            </DialogHeader>

            {user.bio && (
              <p className="text-center text-sm text-foreground/80">{user.bio}</p>
            )}

            {userTargets.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Targets
                </span>
                {userTargets.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <span className="flex-1 font-medium">{t.title}</span>
                    <Badge variant="outline" className="capitalize">
                      {t.frequency}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {status !== "self" && (
              <DialogFooter>
                {status === "friend" && (
                  <Button variant="outline" onClick={onRemove}>
                    <UserMinus className="h-4 w-4" /> Remove friend
                  </Button>
                )}
                {status === "incoming" && (
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={onAccept}>
                      <Check className="h-4 w-4" /> Accept
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={onDecline}>
                      <X className="h-4 w-4" /> Decline
                    </Button>
                  </div>
                )}
                {status === "outgoing" && (
                  <Button variant="outline" disabled>
                    Request sent
                  </Button>
                )}
                {status === "none" && (
                  <Button onClick={onAdd}>
                    <UserPlus className="h-4 w-4" /> Add friend
                  </Button>
                )}
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
