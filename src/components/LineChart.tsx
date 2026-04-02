"use client";

import type { Entry } from "@/lib/types";

interface LineChartProps {
  entries: Entry[];
  goals: string[];
  levels: number;
  goalCount: number;
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export default function LineChart({
  entries,
  goals,
  levels,
  goalCount,
}: LineChartProps) {
  if (entries.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted">Ingen data at vise endnu</p>
      </div>
    );
  }

  const padding = { top: 20, right: 16, bottom: 40, left: 32 };
  const width = 600;
  const height = 240;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = levels;

  function getX(i: number): number {
    if (entries.length === 1) return padding.left + chartW / 2;
    return padding.left + (i / (entries.length - 1)) * chartW;
  }

  function getY(val: number): number {
    return padding.top + chartH - (val / maxVal) * chartH;
  }

  // Grid lines
  const gridLines = Array.from({ length: maxVal + 1 }, (_, i) => i);

  // Determine label density based on entry count
  const maxLabels = 8;
  const labelStep = Math.max(1, Math.ceil(entries.length / maxLabels));

  return (
    <div className="glass rounded-2xl p-4 overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        {gridLines.map((val) => (
          <g key={`grid-${val}`}>
            <line
              x1={padding.left}
              y1={getY(val)}
              x2={width - padding.right}
              y2={getY(val)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={padding.left - 8}
              y={getY(val)}
              textAnchor="end"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.25)"
              fontSize="10"
            >
              {val}
            </text>
          </g>
        ))}

        {/* Lines per goal */}
        {goals.map((goal, gi) => {
          const hue = (gi * 360) / goalCount;
          const color = `hsl(${hue}, 70%, 55%)`;
          const colorGlow = `hsla(${hue}, 80%, 55%, 0.3)`;

          // Build path for this goal
          const points = entries.map((entry, i) => ({
            x: getX(i),
            y: getY(entry.scores[gi] ?? 0),
          }));

          if (points.length === 0) return null;

          const linePath = points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ");

          // Area fill path
          const areaPath = `${linePath} L ${points[points.length - 1].x} ${getY(0)} L ${points[0].x} ${getY(0)} Z`;

          return (
            <g key={`goal-${gi}`}>
              {/* Area fill */}
              <path
                d={areaPath}
                fill={`url(#gradient-${gi})`}
                opacity={0.15}
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient
                  id={`gradient-${gi}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Glow line */}
              <path
                d={linePath}
                fill="none"
                stroke={colorGlow}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Main line */}
              <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={entries.length <= 14 ? 3 : 0}
                  fill={color}
                />
              ))}
            </g>
          );
        })}

        {/* X-axis labels */}
        {entries.map((entry, i) => {
          if (i % labelStep !== 0 && i !== entries.length - 1) return null;
          return (
            <text
              key={`label-${i}`}
              x={getX(i)}
              y={height - 8}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
            >
              {formatDateShort(entry.date)}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 px-1">
        {goals.map((goal, gi) => {
          const hue = (gi * 360) / goalCount;
          return (
            <div key={gi} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: `hsl(${hue}, 70%, 55%)`,
                  boxShadow: `0 0 6px hsla(${hue}, 80%, 55%, 0.4)`,
                }}
              />
              <span className="text-xs text-white/50">{goal}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
