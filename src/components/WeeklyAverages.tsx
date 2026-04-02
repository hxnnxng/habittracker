"use client";

import type { Entry } from "@/lib/types";

interface WeeklyAveragesProps {
  entries: Entry[];
  goals: string[];
  levels: number;
  goalCount: number;
}

function getISOWeekNumber(dateStr: string): { year: number; week: number } {
  const d = new Date(dateStr + "T12:00:00");
  const temp = new Date(d.getTime());
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const yearStart = new Date(temp.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((temp.getTime() - yearStart.getTime()) / 86400000 -
        3 +
        ((yearStart.getDay() + 6) % 7)) /
        7
    );
  return { year: temp.getFullYear(), week: weekNum };
}

function weekKey(info: { year: number; week: number }) {
  return `${info.year}-W${String(info.week).padStart(2, "0")}`;
}

export default function WeeklyAverages({
  entries,
  goals,
  levels,
  goalCount,
}: WeeklyAveragesProps) {
  const byWeek = new Map<string, Entry[]>();
  for (const e of entries) {
    const key = weekKey(getISOWeekNumber(e.date));
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key)!.push(e);
  }

  const weeks = [...byWeek.keys()].sort().slice(-4).reverse();

  if (weeks.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-muted">Ikke nok data til ugentlige gennemsnit</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {weeks.map((week, wIdx) => {
        const weekEntries = byWeek.get(week)!;
        const avgs = goals.map((_, gi) => {
          const sum = weekEntries.reduce((s, e) => s + (e.scores[gi] || 0), 0);
          return sum / weekEntries.length;
        });
        const totalAvg = avgs.reduce((a, b) => a + b, 0);
        const maxTotal = goals.length * levels;

        return (
          <div
            key={week}
            className="glass rounded-2xl p-4 animate-fade-in"
            style={{ animationDelay: `${wIdx * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted text-sm font-medium">
                Uge {week.split("-W")[1]}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold">
                  {totalAvg.toFixed(1)}
                </span>
                <span className="text-muted text-xs">/{maxTotal}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {goals.map((goal, gi) => {
                const pct = avgs[gi] / levels;
                return (
                  <div key={gi} className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-xs font-medium truncate"
                        style={{
                          color: `hsl(${(gi * 360) / goalCount}, 60%, 70%)`,
                        }}
                      >
                        {goal}
                      </span>
                      <span className="text-xs text-muted ml-1">
                        {avgs[gi].toFixed(1)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(pct * 100, 2)}%`,
                          backgroundColor: `hsl(${(gi * 360) / goalCount}, 70%, 55%)`,
                          boxShadow: `0 0 8px hsla(${(gi * 360) / goalCount}, 80%, 55%, 0.3)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-muted text-xs mt-2">
              {weekEntries.length} registrering{weekEntries.length !== 1 && "er"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
