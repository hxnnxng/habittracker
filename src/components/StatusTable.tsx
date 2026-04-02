"use client";

import type { Entry } from "@/lib/types";

interface StatusTableProps {
  entries: Entry[];
  goals: string[];
  levels: number;
  goalCount: number;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const dayNames = ["søn", "man", "tir", "ons", "tor", "fre", "lør"];
  return `${dayNames[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

export default function StatusTable({
  entries,
  goals,
  levels,
  goalCount,
}: StatusTableProps) {
  const last5 = entries.slice(-5).reverse();

  if (last5.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-muted">Ingen registreringer endnu</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-4 py-3 text-muted font-medium">
                Dato
              </th>
              {goals.map((goal, i) => (
                <th key={i} className="px-4 py-3 text-center font-medium">
                  <span
                    style={{
                      color: `hsl(${(i * 360) / goalCount}, 60%, 70%)`,
                    }}
                  >
                    {goal}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-muted font-medium">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {last5.map((entry, idx) => {
              const total = entry.scores.reduce((a, b) => a + b, 0);
              const maxTotal = goals.length * levels;
              return (
                <tr
                  key={entry.date}
                  className="border-b border-white/5 last:border-0"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {formatDate(entry.date)}
                  </td>
                  {entry.scores.map((score, i) => (
                    <td key={i} className="px-4 py-3 text-center">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold"
                        style={{
                          backgroundColor: `hsla(${(i * 360) / goalCount}, 70%, 55%, ${score / levels * 0.3 + 0.05})`,
                          color:
                            score > 0
                              ? `hsl(${(i * 360) / goalCount}, 60%, 70%)`
                              : "rgba(255,255,255,0.2)",
                        }}
                      >
                        {score}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold">{total}</span>
                    <span className="text-muted text-xs">/{maxTotal}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
