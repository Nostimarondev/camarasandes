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
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URLObj = window.URL || window.webkitURL || window;
  const blobURL = URLObj.createObjectURL(svgBlob);

  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2200;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0b1329';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.setAttribute('href', png);
      a.setAttribute('download', filename);
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };
  image.src = blobURL;
}
