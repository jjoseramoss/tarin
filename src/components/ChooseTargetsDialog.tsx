import { useState } from "react";
import { ListChecks } from "lucide-react";
import type { Target } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChooseTargetsDialogProps {
  targets: Target[];
  pinnedTargetIds: string[];
  maxPinned: number;
  onSave: (ids: string[]) => void;
}

export function ChooseTargetsDialog({
  targets,
  pinnedTargetIds,
  maxPinned,
  onSave,
}: ChooseTargetsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(pinnedTargetIds);

  function openWithFreshValues(next: boolean) {
    if (next) setSelected(pinnedTargetIds);
    setOpen(next);
  }

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= maxPinned) return prev;
      return [...prev, id];
    });
  }

  function submit() {
    onSave(selected);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={openWithFreshValues}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ListChecks className="h-3.5 w-3.5" /> Choose targets
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feature on your profile</DialogTitle>
          <DialogDescription>
            Pick up to {maxPinned} targets to show on your profile.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {targets.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              You don't have any targets yet.
            </p>
          )}
          {targets.map((t) => {
            const checked = selected.includes(t.id);
            const disabled = !checked && selected.length >= maxPinned;
            return (
              <button
                key={t.id}
                type="button"
                disabled={disabled}
                onClick={() => toggle(t.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  checked
                    ? "border-accent bg-accent/10"
                    : "border-border hover:bg-secondary/60",
                  disabled && "opacity-40"
                )}
              >
                <span className="text-lg">{t.emoji}</span>
                <span className="flex-1">{t.title}</span>
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border text-xs",
                    checked ? "border-accent bg-accent text-accent-foreground" : "border-border"
                  )}
                >
                  {checked ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
