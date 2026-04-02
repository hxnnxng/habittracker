"use client";

import { getSegmentAngles } from "@/lib/ring-math";
import RingSegment from "./RingSegment";

interface RingProps {
  goals: string[];
  levels: number;
  scores: number[];
  onScoreChange: (goalIndex: number, newScore: number) => void;
}

export default function Ring({
  goals,
  levels,
  scores,
  onScoreChange,
}: RingProps) {
  const segments = getSegmentAngles(goals.length);

  return (
    <div className="w-full max-w-[85vw] max-h-[85vw] sm:max-w-[400px] sm:max-h-[400px] aspect-square mx-auto animate-scale-in">
      <svg viewBox="-160 -160 320 320" className="w-full h-full">
        {segments.map((seg, i) => (
          <RingSegment
            key={i}
            goalIndex={i}
            goalName={goals[i]}
            goalCount={goals.length}
            startAngle={seg.startAngle}
            endAngle={seg.endAngle}
            midAngle={seg.midAngle}
            levels={levels}
            currentScore={scores[i]}
            onScoreChange={(newScore) => onScoreChange(i, newScore)}
          />
        ))}
      </svg>
    </div>
  );
}
