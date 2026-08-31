import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

type Message = { id: string; body: string; createdAt: string; userId: string; author?: UserProfile };

export function ChallengeChatDialog({
  challengeId,
  open,
  onOpenChange,
  loadChat,
  sendChat,
  meId,
}: {
  challengeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loadChat: (challengeId: string) => Promise<Message[]>;
  sendChat: (challengeId: string, body: string) => Promise<Message | undefined>;
  meId: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || !challengeId) return;
    setIsLoading(true);
    loadChat(challengeId)
      .then((m) => setMessages(m))
      .finally(() => setIsLoading(false));
  }, [open, challengeId, loadChat]);

  async function handleSend() {
    if (!challengeId) return;
    const trimmed = draft.trim();
    if (!trimmed) return;
    const created = await sendChat(challengeId, trimmed);
    if (created) setMessages((prev) => [created, ...prev]);
    setDraft("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Challenge chat</DialogTitle>
          <DialogDescription>Only members can see and post messages.</DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[55vh] flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-secondary/30 p-3">
          {isLoading && <div className="h-20 rounded-md bg-muted" />}
          {!isLoading && messages.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No messages yet — start it off.</div>
          )}
          {!isLoading &&
            messages
              .slice()
              .reverse()
              .map((m) => (
                <div key={m.id} className={cn("flex gap-2", m.userId === meId ? "justify-end" : "justify-start")}>
                  {m.userId !== meId && (
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarImage src={m.author?.avatarUrl} alt={m.author?.displayName ?? ""} />
                      <AvatarFallback>{(m.author?.displayName ?? "?")[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                      m.userId === meId ? "bg-accent text-accent-foreground" : "bg-background"
                    )}
                  >
                    {m.userId !== meId && (
                      <div className="mb-1 text-xs font-semibold text-muted-foreground">{m.author?.displayName ?? "User"}</div>
                    )}
                    <div className="whitespace-pre-wrap">{m.body}</div>
                  </div>
                </div>
              ))}
        </div>

        <div className="flex items-end gap-2">
          <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message..." className="min-h-[44px]" />
          <Button onClick={handleSend} disabled={!draft.trim()}>
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
