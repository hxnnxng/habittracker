"use client";

import RingArc from "./RingArc";
import { getLevelRadii, goalColor, labelPosition } from "@/lib/ring-math";

interface RingSegmentProps {
  goalIndex: number;
  goalName: string;
  goalCount: number;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  levels: number;
  currentScore: number;
  onScoreChange: (newScore: number) => void;
}

export default function RingSegment({
  goalIndex,
  goalName,
  goalCount,
  startAngle,
  endAngle,
  midAngle,
  levels,
  currentScore,
  onScoreChange,
}: RingSegmentProps) {
  const radii = getLevelRadii(levels);
  const colors = goalColor(goalIndex, goalCount);
  const label = labelPosition(midAngle, 142);

  function handleClick(levelIndex: number) {
    const newScore = levelIndex + 1;
    if (newScore === currentScore) {
      onScoreChange(newScore - 1);
    } else {
      onScoreChange(newScore);
    }
  }

  return (
    <g>
      {radii.map((r, j) => (
        <RingArc
          key={j}
          innerRadius={r.innerRadius}
          outerRadius={r.outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          filled={j < currentScore}
          filledColor={colors.filled}
          glowColor={colors.filledGlow}
          unfilledColor={colors.unfilled}
          hoverColor={colors.hover}
          onClick={() => handleClick(j)}
          arcId={`goal-${goalIndex}-level-${j}`}
        />
      ))}
      <text
        x={label.x}
        y={label.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={colors.text}
        fontSize="10"
        fontWeight="600"
        transform={`rotate(${label.rotation}, ${label.x}, ${label.y})`}
        pointerEvents="none"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {goalName}
      </text>
    </g>
  );
}
