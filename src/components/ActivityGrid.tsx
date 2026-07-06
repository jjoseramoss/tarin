import { useMemo } from "react";
import { cn, toDateKey } from "@/lib/utils";
import type { CheckIn, Target } from "@/types";

interface ActivityGridProps {
  target: Target;
  checkIns: CheckIn[];
}

interface Cell {
  key: string;
  date: Date;
  done: boolean;
  future: boolean;
}

/**
 * Builds a flat, chronologically-ordered list of day cells covering the
 * last `days` days, ending today. The list is grouped into weeks of 7
 * (Sunday-start) so it can be laid out as a column-major CSS grid.
 */
function buildCells(days: number, doneKeys: Set<string>): Cell[] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));
  // Roll back to the most recent Sunday so weeks line up as columns.
  const startDow = start.getDay();
  start.setDate(start.getDate() - startDow);

  const totalCells = Math.ceil((days + startDow) / 7) * 7;
  const out: Cell[] = [];
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = toDateKey(d);
    out.push({
      key,
      date: d,
      done: doneKeys.has(key),
      future: d > today,
    });
  }
  return out;
}

function Grid({
  cells,
  target,
  size,
  className,
}: {
  cells: Cell[];
  target: Target;
  size: number;
  className?: string;
}) {
  const weeks = cells.length / 7;

  return (
    <div className={cn("overflow-x-auto no-scrollbar", className)}>
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateRows: `repeat(7, ${size}px)`,
          gridTemplateColumns: `repeat(${weeks}, ${size}px)`,
          gridAutoFlow: "column",
        }}
      >
        {cells.map((cell) => (
          <div
            key={cell.key}
            title={cell.key}
            className={cn("rounded-[1px]", cell.future ? "opacity-0" : "bg-muted")}
            style={{
              width: size,
              height: size,
              ...(cell.done && !cell.future
                ? { backgroundColor: target.colorHex }
                : undefined),
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * GitHub-contribution-style grid: one column per week, one cell per day,
 * most recent week on the right. Filled cells use the target's color.
 *
 * Cells are kept small and uniform on every screen size — this is meant
 * to be a subtle consistency cue, not a big visual element. Mobile shows
 * just the current month; large devices show the full year.
 */
export function ActivityGrid({ target, checkIns }: ActivityGridProps) {
  const doneKeys = useMemo(
    () => new Set(checkIns.filter((c) => c.targetId === target.id).map((c) => c.periodKey)),
    [checkIns, target.id]
  );

  const daysInCurrentMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }, []);

  const monthCells = useMemo(
    () => buildCells(daysInCurrentMonth, doneKeys),
    [daysInCurrentMonth, doneKeys]
  );
  const yearCells = useMemo(() => buildCells(365, doneKeys), [doneKeys]);

  return (
    <div>
      <Grid cells={monthCells} target={target} size={6} className="lg:hidden" />
      <Grid cells={yearCells} target={target} size={8} className="hidden lg:block" />
    </div>
  );
}
