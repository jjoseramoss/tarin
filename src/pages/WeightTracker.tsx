import { useState, type FormEvent } from "react";
import { useWeightData } from "@/hooks/useWeightData";
import { WeightChart } from "@/components/WeightChart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WeightTracker() {
  const { latestEntry, logWeight, entriesInRange } = useWeightData();
  const [value, setValue] = useState("");

  const dayLine = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    logWeight(Math.round(parsed * 10) / 10);
    setValue("");
  }

  return (
    <div className="flex flex-col gap-5 px-4 pb-28 pt-6 md:px-10 md:pb-12 md:pt-8">
      <header className="md:hidden">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {dayLine}
        </p>
        <h1 className="font-display text-3xl font-black leading-tight tracking-tight">
          Weight tracker.
        </h1>
      </header>

      <p className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground md:block">
        {dayLine}
      </p>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Current weight
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-6xl font-black leading-none tracking-tight md:text-7xl">
            {latestEntry ? latestEntry.weight.toFixed(1) : "—"}
          </span>
          <span className="text-lg font-medium text-muted-foreground">lbs</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <WeightChart entriesInRange={entriesInRange} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <span className="text-sm font-medium">Log today's weight</span>
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              placeholder="0.0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-16 w-32 rounded-xl border-2 border-border bg-background text-center font-display text-3xl font-bold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" size="lg" disabled={!value.trim()}>
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
