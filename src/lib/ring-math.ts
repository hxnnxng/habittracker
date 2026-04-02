export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

export function describeArc(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);

  const spanDeg = endAngle - startAngle;
  const largeArc = spanDeg > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export function getSegmentAngles(goalCount: number, gapDeg: number = 2) {
  const segmentSize = 360 / goalCount;
  const halfGap = gapDeg / 2;

  return Array.from({ length: goalCount }, (_, i) => ({
    startAngle: i * segmentSize + halfGap,
    endAngle: (i + 1) * segmentSize - halfGap,
    midAngle: (i + 0.5) * segmentSize,
  }));
}

export function getLevelRadii(
  levels: number,
  innerR: number = 30,
  outerR: number = 130,
  gapPx: number = 2
) {
  const totalGap = gapPx * (levels - 1);
  const bandThickness = (outerR - innerR - totalGap) / levels;

  return Array.from({ length: levels }, (_, j) => ({
    innerRadius: innerR + j * (bandThickness + gapPx),
    outerRadius: innerR + j * (bandThickness + gapPx) + bandThickness,
  }));
}

export function goalColor(goalIndex: number, goalCount: number) {
  const hue = goalIndex * (360 / goalCount);
  return {
    filled: `hsl(${hue}, 70%, 55%)`,
    filledGlow: `hsla(${hue}, 80%, 55%, 0.4)`,
    unfilled: `hsla(${hue}, 20%, 30%, 0.3)`,
    hover: `hsl(${hue}, 70%, 65%)`,
    text: `hsl(${hue}, 60%, 70%)`,
  };
}

export function labelPosition(midAngle: number, radius: number) {
  const pos = polarToCartesian(0, 0, radius, midAngle);
  const rotation =
    midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle;
  return { ...pos, rotation };
}
