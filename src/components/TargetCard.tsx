import { useState } from "react";
import { Check, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Target } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TargetCardProps {
  target: Target;
  completed: boolean;
  streak: number;
  onToggle: (note?: string) => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

export function TargetCard({
  target,
  completed,
  streak,
  onToggle,
  onDelete,
  onRename,
}: TargetCardProps) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(target.title);

  function handleMainAction() {
    if (completed) {
      onToggle(); // un-complete, no note needed
      return;
    }
    setNoteOpen(true);
  }

  function confirmComplete() {
    onToggle(note);
    setNote("");
    setNoteOpen(false);
  }

  const streakTone = streak >= 3 ? "hot" : streak >= 1 ? "warm" : "none";

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
              style={{ backgroundColor: `${target.colorHex}22` }}
            >
              {target.emoji}
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold leading-tight">{target.title}</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="capitalize">
                  {target.frequency}
                </Badge>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold",
                    streakTone === "none" && "text-muted-foreground",
                    streakTone === "warm" && "text-muted-foreground",
                    streakTone === "hot" &&
                      "text-accent drop-shadow-[0_0_10px_rgba(248,113,113,0.45)]"
                  )}
                >
                  {streak}
                  {streakTone !== "none" && <span aria-hidden>🔥</span>}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleMainAction}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                completed
                  ? "border-transparent bg-success text-white"
                  : "border-border bg-transparent text-muted-foreground hover:border-accent hover:text-accent"
              )}
              aria-label={completed ? "Mark incomplete" : "Mark complete"}
            >
              <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="h-3.5 w-3.5" /> Rename
                </DropdownMenuItem>
                <DropdownMenuItem destructive onClick={onDelete}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {target.emoji} {target.title}
            </DialogTitle>
            <DialogDescription>Add a note (optional), then check it off.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="How'd it go?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button onClick={confirmComplete}>
              <Check className="h-4 w-4" /> Mark complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename target</DialogTitle>
          </DialogHeader>
          <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus />
          <DialogFooter>
            <Button
              onClick={() => {
                if (editTitle.trim()) onRename(editTitle.trim());
                setEditOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
