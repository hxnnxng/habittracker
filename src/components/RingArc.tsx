"use client";

import { describeArc } from "@/lib/ring-math";

interface RingArcProps {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  filled: boolean;
  filledColor: string;
  glowColor: string;
  unfilledColor: string;
  hoverColor: string;
  onClick: () => void;
  arcId: string;
}

export default function RingArc({
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  filled,
  filledColor,
  glowColor,
  unfilledColor,
  hoverColor,
  onClick,
  arcId,
}: RingArcProps) {
  const d = describeArc(0, 0, innerRadius, outerRadius, startAngle, endAngle);

  return (
    <g>
      {filled && (
        <path
          d={d}
          fill={glowColor}
          filter="blur(6px)"
          pointerEvents="none"
        />
      )}
      <path
        d={d}
        fill={filled ? filledColor : unfilledColor}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={0.5}
        onClick={onClick}
        className="cursor-pointer transition-all duration-200"
        style={{
          transformOrigin: "center",
        }}
        onMouseEnter={(e) => {
          (e.target as SVGPathElement).style.fill = filled
            ? hoverColor
            : hoverColor;
          (e.target as SVGPathElement).style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          (e.target as SVGPathElement).style.fill = filled
            ? filledColor
            : unfilledColor;
          (e.target as SVGPathElement).style.transform = "scale(1)";
        }}
        data-arc-id={arcId}
      />
    </g>
  );
}
