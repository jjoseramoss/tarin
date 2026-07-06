import { useCallback } from "react";
import { useDietData } from "@/hooks/useDietData";
import { MealSectionCard } from "@/components/MealSectionCard";
import type { MealSection } from "@/types";
import { todayKey } from "@/lib/utils";

const SECTIONS: { key: MealSection; title: string; emoji: string }[] = [
  { key: "breakfast", title: "Breakfast", emoji: "🍳" },
  { key: "lunch", title: "Lunch", emoji: "🥪" },
  { key: "dinner", title: "Dinner", emoji: "🍝" },
  { key: "snacks", title: "Snacks", emoji: "🍎" },
];

export function DietTracker() {
  const { day, addItem, updateItem, removeItem } = useDietData(todayKey());

  const dayLine = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Stable per-section callbacks so MealSectionCard's effect deps don't churn.
  const makeAdd = useCallback((section: MealSection) => () => addItem(section), [addItem]);
  const makeUpdate = useCallback(
    (section: MealSection) => (id: string, text: string) => updateItem(section, id, text),
    [updateItem]
  );
  const makeRemove = useCallback(
    (section: MealSection) => (id: string) => removeItem(section, id),
    [removeItem]
  );

  return (
    <div className="flex flex-col gap-5 px-4 pb-28 pt-6 md:px-10 md:pb-12 md:pt-8">
      <header className="md:hidden">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {dayLine}
        </p>
        <h1 className="font-display text-3xl font-black leading-tight tracking-tight">
          Diet tracker.
        </h1>
      </header>

      <p className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground md:block">
        {dayLine}
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {SECTIONS.map((s) => (
          <MealSectionCard
            key={s.key}
            title={s.title}
            emoji={s.emoji}
            items={day[s.key]}
            onAdd={makeAdd(s.key)}
            onUpdate={makeUpdate(s.key)}
            onRemove={makeRemove(s.key)}
          />
        ))}
      </div>
    </div>
  );
}
