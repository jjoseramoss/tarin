import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type View = "landing" | "login" | "signup";

interface AuthProps {
  onAuthed: () => void;
}

/**
 * Simple local auth gate. No backend yet, so login/signup both just
 * confirm the form and let the person in — this is the seam that gets
 * swapped for real Supabase auth later.
 */
export function Auth({ onAuthed }: AuthProps) {
  const [view, setView] = useState<View>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onAuthed();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-12">
      <div className="flex flex-col items-center gap-4">
        <img src="/target.png" alt="TARIN" className="h-20 w-20 object-contain md:h-24 md:w-24" />
        <h1 className="font-display text-5xl font-black tracking-tight md:text-6xl">TARIN</h1>
      </div>

      {view === "landing" && (
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button size="lg" onClick={() => setView("login")}>
            Log in
          </Button>
          <Button size="lg" variant="outline" onClick={() => setView("signup")}>
            Sign up
          </Button>
        </div>
      )}

      {view !== "landing" && (
        <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
          <div className="flex flex-col gap-1.5 text-left">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="mt-1">
            {view === "login" ? "Log in" : "Create account"}
          </Button>
          <button
            type="button"
            onClick={() => setView("landing")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
}
