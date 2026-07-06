import { useMemo, useState } from "react";
import type { WeightEntry } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WeightRange } from "@/hooks/useWeightData";

interface WeightChartProps {
  entriesInRange: (range: WeightRange) => WeightEntry[];
}

const RANGES: { key: WeightRange; label: string }[] = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

const WIDTH = 600;
const HEIGHT = 200;
const PAD_X = 8;
const PAD_Y = 16;

/**
 * Small hand-rolled SVG line chart — no charting library dependency, kept
 * consistent with the rest of the app's hand-written component approach.
 */
export function WeightChart({ entriesInRange }: WeightChartProps) {
  const [range, setRange] = useState<WeightRange>("month");
  const entries = entriesInRange(range);

  const { points, path, minW, maxW } = useMemo(() => {
    if (entries.length === 0) {
      return { points: [] as { x: number; y: number; e: WeightEntry }[], path: "", minW: 0, maxW: 0 };
    }
    const weights = entries.map((e) => e.weight);
    let min = Math.min(...weights);
    let max = Math.max(...weights);
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const span = max - min;
    const innerW = WIDTH - PAD_X * 2;
    const innerH = HEIGHT - PAD_Y * 2;

    const pts = entries.map((e, i) => {
      const x = PAD_X + (entries.length === 1 ? innerW / 2 : (i / (entries.length - 1)) * innerW);
      const y = PAD_Y + innerH - ((e.weight - min) / span) * innerH;
      return { x, y, e };
    });

    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

    return { points: pts, path: d, minW: min, maxW: max };
  }, [entries]);

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={range} onValueChange={(v) => setRange(v as WeightRange)}>
        <TabsList>
          {RANGES.map((r) => (
            <TabsTrigger key={r.key} value={r.key}>
              {r.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {entries.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          No entries yet for this range.
        </div>
      ) : (
        <div className="w-full">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-40 w-full sm:h-48"
            preserveAspectRatio="none"
          >
            {entries.length > 1 && (
              <path
                d={`${path} L ${points[points.length - 1].x} ${HEIGHT - PAD_Y} L ${points[0].x} ${HEIGHT - PAD_Y} Z`}
                fill="hsl(var(--accent) / 0.12)"
                stroke="none"
              />
            )}
            {entries.length > 1 && (
              <path d={path} fill="none" stroke="hsl(var(--accent))" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            )}
            {points.map((p) => (
              <circle key={p.e.id} cx={p.x} cy={p.y} r={entries.length > 40 ? 1.5 : 3} fill="hsl(var(--accent))">
                <title>{`${p.e.date}: ${p.e.weight}`}</title>
              </circle>
            ))}
          </svg>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{minW.toFixed(1)}</span>
            <span>{maxW.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
