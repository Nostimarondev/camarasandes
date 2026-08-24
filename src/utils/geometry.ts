export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return ((rad * 180) / Math.PI + 360) % 360;
}

export function getConePath(x: number, y: number, angleDeg: number, reach: number, fovDeg: number): string {
  const halfFov = fovDeg / 2;
  const startAngle = degToRad(angleDeg - halfFov);
  const endAngle = degToRad(angleDeg + halfFov);

  const x1 = x + reach * Math.cos(startAngle);
  const y1 = y + reach * Math.sin(startAngle);
  const x2 = x + reach * Math.cos(endAngle);
  const y2 = y + reach * Math.sin(endAngle);

  const largeArcFlag = fovDeg > 180 ? 1 : 0;
  return `M ${x} ${y} L ${x1} ${y1} A ${reach} ${reach} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

export function snap(val: number, snapToGrid: boolean = true, gridSize: number = 10): number {
  if (!snapToGrid) return Math.round(val);
  return Math.round(val / gridSize) * gridSize;
}

export function getCanvasCoordinates(
  e: { clientX: number; clientY: number },
  svgElement: SVGSVGElement | null,
  zoom: number
): { x: number; y: number } {
  if (!svgElement) return { x: 0, y: 0 };
  const rect = svgElement.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) / zoom,
    y: (e.clientY - rect.top) / zoom
  };
}
