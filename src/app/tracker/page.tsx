"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Ring from "@/components/Ring";
import { getConfig, getEntries, saveEntry } from "@/lib/api-client";
import type { HabitConfig } from "@/lib/types";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function TrackerPage() {
  const router = useRouter();
  const [config, setConfig] = useState<HabitConfig | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cfg = await getConfig();
      if (!cfg) {
        router.push("/setup");
        return;
      }
      setConfig(cfg);

      const entries = await getEntries(1);
      const today = todayISO();
      const todayEntry = entries.find((e) => e.date === today);

      if (todayEntry) {
        setScores(todayEntry.scores);
      } else {
        setScores(new Array(cfg.goals.length).fill(0));
      }
      setLoading(false);
    }
    load();
  }, [router]);

  function handleScoreChange(goalIndex: number, newScore: number) {
    setScores((prev) => {
      const next = [...prev];
      next[goalIndex] = newScore;
      return next;
    });
    setSaved(false);
  }

  async function handleSave() {
    if (!config) return;
    setSaved(false);
    await saveEntry({ date: todayISO(), scores });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!config) return null;

  const today = new Date();
  const dayNames = [
    "søndag",
    "mandag",
    "tirsdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lørdag",
  ];
  const monthNames = [
    "januar",
    "februar",
    "marts",
    "april",
    "maj",
    "juni",
    "juli",
    "august",
    "september",
    "oktober",
    "november",
    "december",
  ];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 pb-28">
      <div className="animate-fade-in text-center mb-4">
        <p className="text-muted text-sm capitalize">
          {dayNames[today.getDay()]}
        </p>
        <h1 className="text-2xl font-bold">
          {today.getDate()}. {monthNames[today.getMonth()]}
        </h1>
      </div>

      <Ring
        goals={config.goals}
        levels={config.levels}
        scores={scores}
        onScoreChange={handleScoreChange}
      />

      <div className="mt-8 w-full max-w-sm animate-fade-in">
        <button
          onClick={handleSave}
          className="group relative w-full h-14 rounded-2xl overflow-hidden active:scale-[0.97] transition-transform"
        >
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${saved ? "opacity-0" : "opacity-100"}`}
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1rem",
            }}
          />
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${saved ? "opacity-100" : "opacity-0"}`}
            style={{
              background:
                "linear-gradient(135deg, rgba(52,211,153,0.2) 0%, rgba(16,185,129,0.1) 100%)",
              border: "1px solid rgba(52,211,153,0.3)",
              borderRadius: "1rem",
            }}
          />
          <span
            className={`relative z-10 font-semibold text-base tracking-wide transition-all duration-500 ${
              saved ? "text-emerald-400" : "text-white/80 group-hover:text-white"
            }`}
          >
            {saved ? "Gemt" : "Gem"}
          </span>
        </button>
      </div>
    </div>
  );
}
