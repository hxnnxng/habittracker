import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { HabitConfig } from "@/lib/types";

export async function GET() {
  const data = await readData();
  if (!data.config.goals.length) {
    return NextResponse.json(null, { status: 404 });
  }
  return NextResponse.json({
    config: data.config,
    configHistory: data.configHistory,
  });
}

export async function POST(request: Request) {
  const config: HabitConfig = await request.json();
  const data = await readData();
  const today = new Date().toISOString().split("T")[0];

  const hadConfig = data.config.goals.length > 0;
  const goalsCountChanged = data.config.goals.length !== config.goals.length;
  const levelsChanged = data.config.levels !== config.levels;

  if (hadConfig) {
    data.configHistory.push({
      date: today,
      config: { ...data.config },
    });
  }

  // If structure changed (count or levels), entries need adjustment
  if (goalsCountChanged || levelsChanged) {
    // Pad or trim scores in existing entries to match new goal count
    data.entries = data.entries.map((entry) => {
      const newScores = Array.from(
        { length: config.goals.length },
        (_, i) => {
          const oldScore = entry.scores[i] ?? 0;
          // Clamp to new level max
          return Math.min(oldScore, config.levels);
        }
      );
      return { ...entry, scores: newScores };
    });
  }

  data.config = config;
  await writeData(data);
  return NextResponse.json({ ok: true });
}
