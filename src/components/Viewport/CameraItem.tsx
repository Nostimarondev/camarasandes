import React from 'react';
import { Camera } from '../../types/cctv';
import { getConePath } from '../../utils/geometry';

interface CameraItemProps {
  camera: Camera;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMouseDownMoveHandle: (e: React.MouseEvent, id: string) => void;
}

export const CameraItem: React.FC<CameraItemProps> = ({
  camera,
  isSelected,
  onSelect,
  onMouseDownMoveHandle
}) => {
  const dStr = getConePath(camera.x, camera.y, camera.angle, camera.reach, camera.fov);

  // Dynamic cone styling based on status & selection
  let coneFill = 'url(#fov-gradient-active)';
  let coneStroke = '#3b82f6';
  let strokeWidth = '1.5';
  let nodeFill = '#1e3a8a';

  if (isSelected) {
    coneFill = 'url(#fov-gradient-selected)';
    coneStroke = '#10b981';
    strokeWidth = '2.5';
    nodeFill = '#10b981';
  } else if (camera.status === 'warning') {
    coneFill = 'url(#fov-gradient-warning)';
    coneStroke = '#f59e0b';
    strokeWidth = '1.8';
    nodeFill = '#d97706';
  } else if (camera.status === 'offline') {
    coneFill = 'url(#fov-gradient-offline)';
    coneStroke = '#ef4444';
    strokeWidth = '1.8';
    nodeFill = '#dc2626';
  }

  return (
    <>
      {/* FOV Cone Path */}
      <path
        d={dStr}
        className="camera-cone"
        fill={coneFill}
        stroke={coneStroke}
        strokeWidth={strokeWidth}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(camera.id);
        }}
      />

      {/* Camera Node Icon */}
      <g
        transform={`translate(${camera.x}, ${camera.y})`}
        className="camera-node"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(camera.id);
        }}
        onMouseDown={(e) => onMouseDownMoveHandle(e, camera.id)}
        style={{ cursor: 'pointer' }}
      >
        <circle
          r={isSelected ? 13 : 10}
          fill={nodeFill}
          stroke="#ffffff"
          strokeWidth="2"
        />
        <polygon
          points="-4,-4 7,0 -4,4"
          fill="#ffffff"
          transform={`rotate(${camera.angle})`}
        />
        <text
          x="0"
          y="-16"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill={isSelected ? '#10b981' : '#f8fafc'}
        >
          {camera.name.split(':')[0]}
        </text>
      </g>
    </>
  );
};
