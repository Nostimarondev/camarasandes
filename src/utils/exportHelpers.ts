import { Camera, Zone } from '../types/cctv';

export function exportToJson(data: { cameras: Camera[]; zones: Zone[] }, filename: string = 'planta_cabudare_cctv_plan.json') {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const anchor = document.createElement('a');
  anchor.setAttribute('href', dataStr);
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function exportToPng(svgElement: SVGSVGElement | null, filename: string = 'Planta_Cabudare_CCTV_Croquis.png') {
  if (!svgElement) return;

  // Clone SVG element to preserve current DOM state and avoid modifying live view
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Define full dimensions so Canvas draws at full high resolution
  const svgWidth = 3200;
  const svgHeight = 2000;
  clone.setAttribute('width', String(svgWidth));
  clone.setAttribute('height', String(svgHeight));
  clone.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

  // Embed inline stylesheet for SVG elements (font-family, colors, strokes)
  const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleElement.textContent = `
    .zone-shape { transition: fill 0.2s, stroke 0.2s; }
    .type-road      { fill: rgba(30,41,59,0.7);    stroke: #475569; stroke-width: 2px; }
    .type-building  { fill: rgba(30,58,138,0.4);   stroke: #3b82f6; stroke-width: 2.5px; }
    .type-parking   { fill: rgba(15,23,42,0.5);    stroke: #334155; stroke-width: 2px; }
    .type-green     { fill: rgba(16,185,129,0.12); stroke: #10b981; stroke-width: 1.5px; stroke-dasharray: 6 4; }
    .type-security  { fill: rgba(239,68,68,0.35);  stroke: #ef4444; stroke-width: 2px; }
    .type-hazard    { fill: rgba(185,28,28,0.3);   stroke: #dc2626; stroke-width: 2px; stroke-dasharray: 8 4; }
    .type-small-box { fill: rgba(255,255,255,0.08); stroke: rgba(255,255,255,0.3); stroke-width: 1.5px; }
    .zone-label-text { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-weight: 700; fill: #ffffff; text-anchor: middle; }
    text { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  `;
  clone.insertBefore(styleElement, clone.firstChild);

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URLObj = window.URL || window.webkitURL || window;
  const blobURL = URLObj.createObjectURL(svgBlob);

  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = svgWidth;
    canvas.height = svgHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark blueprint background fill
      ctx.fillStyle = '#0b1329';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.setAttribute('href', png);
      a.setAttribute('download', filename);
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    URLObj.revokeObjectURL(blobURL);
  };
  image.src = blobURL;
}
