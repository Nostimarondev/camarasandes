import React, { useRef, useCallback, useEffect, MutableRefObject } from 'react';
import { Camera, Zone } from '../../types/cctv';
import { ZoneItem } from './ZoneItem';
import { CameraItem } from './CameraItem';
import { StreetNetwork } from './StreetNetwork';
import { getCanvasCoordinates, radToDeg, snap } from '../../utils/geometry';
import { useViewportPanZoom } from '../../hooks/useViewportPanZoom';

interface InteractiveHandleProps {
  cam: Camera;
  onUpdateCamera: (id: string, updates: Partial<Camera>) => void;
  zoom: number;
  svgRef: MutableRefObject<SVGSVGElement | null>;
  snapToGrid: boolean;
  gridSize: number;
}

const InteractiveHandles: React.FC<InteractiveHandleProps> = ({
  cam, onUpdateCamera, zoom, svgRef, snapToGrid, gridSize
}) => {
  const draggingRef = useRef<'rotate' | 'resize' | null>(null);

  const rotDistance = cam.reach + 25;
  const rotRad = (cam.angle * Math.PI) / 180;
  const rotX = cam.x + rotDistance * Math.cos(rotRad);
  const rotY = cam.y + rotDistance * Math.sin(rotRad);

  const arcRad = ((cam.angle + cam.fov / 2) * Math.PI) / 180;
  const resX = cam.x + cam.reach * Math.cos(arcRad);
  const resY = cam.y + cam.reach * Math.sin(arcRad);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const coords = getCanvasCoordinates(e, svgRef.current, zoom);
      if (draggingRef.current === 'rotate') {
        const dx = coords.x - cam.x;
        const dy = coords.y - cam.y;
        const angle = Math.round(radToDeg(Math.atan2(dy, dx)));
        onUpdateCamera(cam.id, { angle });
      } else if (draggingRef.current === 'resize') {
        const dx = coords.x - cam.x;
        const dy = coords.y - cam.y;
        const reach = Math.max(30, Math.min(400, Math.round(Math.sqrt(dx * dx + dy * dy))));
        onUpdateCamera(cam.id, { reach });
      }
    };
    const handleMouseUp = () => { draggingRef.current = null; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cam, onUpdateCamera, zoom, svgRef, snapToGrid, gridSize]);

  return (
    <>
      <line x1={cam.x} y1={cam.y} x2={rotX} y2={rotY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,4" />
      <circle
        cx={rotX} cy={rotY} r={8}
        fill="#10b981" stroke="#fff" strokeWidth="2"
        className="handle-node handle-rotate"
        style={{ cursor: 'grab' }}
        onMouseDown={(e) => { e.stopPropagation(); draggingRef.current = 'rotate'; }}
      />
      <circle
        cx={resX} cy={resY} r={8}
        fill="#f59e0b" stroke="#fff" strokeWidth="2"
        className="handle-node handle-resize"
        style={{ cursor: 'nwse-resize' }}
        onMouseDown={(e) => { e.stopPropagation(); draggingRef.current = 'resize'; }}
      />
    </>
  );
};

interface ViewportCanvasProps {
  zoom: number; setZoom: React.Dispatch<React.SetStateAction<number>>;
  panX: number; setPanX: React.Dispatch<React.SetStateAction<number>>;
  panY: number; setPanY: React.Dispatch<React.SetStateAction<number>>;
  zones: Zone[];
  cameras: Camera[];
  showCameras: boolean;
  showBgPhoto: boolean;
  selectedCameraId: string | null;
  selectedZoneId: string | null;
  snapToGrid: boolean;
  gridSize: number;
  onSelectCamera: (id: string) => void;
  onSelectZone: (id: string) => void;
  onClearSelection: () => void;
  onUpdateCamera: (id: string, updates: Partial<Camera>) => void;
  svgRef: MutableRefObject<SVGSVGElement | null>;
}

export const ViewportCanvas: React.FC<ViewportCanvasProps> = ({
  zoom, setZoom, panX, setPanX, panY, setPanY,
  zones, cameras, showCameras, showBgPhoto,
  selectedCameraId, selectedZoneId,
  snapToGrid, gridSize,
  onSelectCamera, onSelectZone, onClearSelection,
  onUpdateCamera, svgRef
}) => {
  const { viewportRef, handleMouseDown } = useViewportPanZoom({
    panX, setPanX, panY, setPanY, zoom, setZoom, onClearSelection
  });

  const draggingCamRef = useRef<string | null>(null);

  const handleCameraMouseDownMove = useCallback((e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSelectCamera(id);
    draggingCamRef.current = id;
  }, [onSelectCamera]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingCamRef.current) return;
      const coords = getCanvasCoordinates(e, svgRef.current, zoom);
      onUpdateCamera(draggingCamRef.current, {
        x: snap(coords.x, snapToGrid, gridSize),
        y: snap(coords.y, snapToGrid, gridSize)
      });
    };
    const handleMouseUp = () => { draggingCamRef.current = null; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoom, snapToGrid, gridSize, onUpdateCamera, svgRef]);

  const selectedCam = cameras.find(c => c.id === selectedCameraId);

  return (
    <div
      ref={viewportRef}
      id="canvas-viewport"
      className="canvas-viewport"
      onMouseDown={handleMouseDown}
    >
      <div className="canvas-hint">
        <i className="fa-solid fa-circle-info"></i>
        <span><strong>Controles:</strong> Usa el botón <strong>"Cámaras: VISIBLES"</strong> para ocultar los triángulos. Haz clic en cualquier cámara para ajustar.</span>
      </div>

      <div
        id="canvas-transform-wrapper"
        className="canvas-transform-wrapper"
        style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: '0 0' }}
      >
        <svg
          id="croquis-svg"
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.12)" strokeWidth="1" />
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="1.5" />
            </pattern>
            <pattern id="grid-pattern-fine" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59, 130, 246, 0.05)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="fov-gradient-active" cx="0%" cy="0%" r="100%" fx="0%" fy="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#2563eb" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.05" />
            </radialGradient>
            <radialGradient id="fov-gradient-selected" cx="0%" cy="0%" r="100%" fx="0%" fy="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#059669" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="fov-gradient-warning" cx="0%" cy="0%" r="100%" fx="0%" fy="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="fov-gradient-offline" cx="0%" cy="0%" r="100%" fx="0%" fy="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#dc2626" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#grid-pattern-fine)" />
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {/* Reference Photo Layer */}
          {showBgPhoto && (
            <image
              href="/WhatsApp Image 2026-08-24 at 8.40.30 AM.jpeg"
              x="40" y="40" width="1740" height="1000"
              opacity="0.4"
            />
          )}

          {/* Street Network */}
          <StreetNetwork />

          {/* Zone Shapes */}
          {zones.map(zone => (
            <ZoneItem
              key={zone.id}
              zone={zone}
              isSelected={zone.id === selectedZoneId}
              onSelect={onSelectZone}
            />
          ))}

          {/* Cameras Layer */}
          {showCameras && cameras.map(cam => (
            <CameraItem
              key={cam.id}
              camera={cam}
              isSelected={cam.id === selectedCameraId}
              onSelect={onSelectCamera}
              onMouseDownMoveHandle={handleCameraMouseDownMove}
            />
          ))}

          {/* Interactive Handles for Selected Camera */}
          {showCameras && selectedCam && (
            <InteractiveHandles
              cam={selectedCam}
              onUpdateCamera={onUpdateCamera}
              zoom={zoom}
              svgRef={svgRef}
              snapToGrid={snapToGrid}
              gridSize={gridSize}
            />
          )}
        </svg>
      </div>

      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button
          className="btn-zoom"
          onClick={() => setZoom(z => Math.min(3.5, z * 1.2))}
          title="Acercar"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
        <span id="zoom-level-text">{Math.round(zoom * 100)}%</span>
        <button
          className="btn-zoom"
          onClick={() => setZoom(z => Math.max(0.3, z / 1.2))}
          title="Alejar"
        >
          <i className="fa-solid fa-minus"></i>
        </button>
        <button
          className="btn-zoom"
          onClick={() => { setZoom(0.8); setPanX(30); setPanY(20); }}
          title="Ajustar"
        >
          <i className="fa-solid fa-expand"></i>
        </button>
      </div>
    </div>
  );
};
