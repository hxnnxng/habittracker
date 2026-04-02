"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LineChart from "@/components/LineChart";
import { getAllData } from "@/lib/api-client";
import type { HabitConfig, Entry } from "@/lib/types";

type Period = "1w" | "1m" | "6m" | "1y";

const periodLabels: Record<Period, string> = {
  "1w": "1 uge",
  "1m": "1 mnd.",
  "6m": "6 mnd.",
  "1y": "1 år",
};

function getStartDate(period: Period): Date {
  const now = new Date();
  switch (period) {
    case "1w":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    case "1m":
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case "6m":
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    case "1y":
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  }
}

function filterEntries(entries: Entry[], period: Period): Entry[] {
  const start = getStartDate(period);
  const startStr = start.toISOString().split("T")[0];
  return entries.filter((e) => e.date >= startStr);
}

export default function StatusPage() {
  const router = useRouter();
  const [config, setConfig] = useState<HabitConfig | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("1m");

  useEffect(() => {
    async function load() {
      const data = await getAllData();
      if (!data) {
        router.push("/setup");
        return;
      }
      setConfig(data.config);
      setEntries(data.entries);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!config) return null;

  const filtered = filterEntries(entries, period);

  return (
    <div className="min-h-dvh px-6 pt-12 pb-28">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-1 animate-fade-in">Status</h1>
        <p className="text-muted text-sm mb-6 animate-fade-in">
          Din fremgang over tid
        </p>

        {/* Period selector */}
        <div className="flex gap-2 mb-6 animate-fade-in">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
                period === p
                  ? "bg-white/10 text-white border border-white/15"
                  : "text-white/35 border border-transparent"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>

        <div className="animate-fade-in">
          <LineChart
            entries={filtered}
            goals={config.goals}
            levels={config.levels}
            goalCount={config.goals.length}
          />
        </div>

        {/* Summary cards */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4 animate-fade-in">
            {config.goals.map((goal, gi) => {
              const hue = (gi * 360) / config.goals.length;
              const vals = filtered.map((e) => e.scores[gi] ?? 0);
              const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
              const latest = vals[vals.length - 1];
              return (
                <div key={gi} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: `hsl(${hue}, 70%, 55%)`,
                        boxShadow: `0 0 6px hsla(${hue}, 80%, 55%, 0.4)`,
                      }}
                    />
                    <span className="text-xs text-white/50 truncate">
                      {goal}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: `hsl(${hue}, 60%, 70%)` }}
                    >
                      {avg.toFixed(1)}
                    </span>
                    <span className="text-xs text-white/25">gns.</span>
                  </div>
                  <div className="text-xs text-white/30 mt-1">
                    Seneste: {latest}/{config.levels}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
