import React from 'react';
import { Camera } from '../../types/cctv';

interface CameraCardProps {
  camera: Camera;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera, isSelected, onSelect }) => {
  return (
    <div
      className={`camera-card ${isSelected ? 'active' : ''}`}
      onClick={() => onSelect(camera.id)}
    >
      <div className="cam-card-info">
        <div className="cam-card-title">
          <span className={`status-dot ${camera.status}`}></span>
          <span>{camera.name}</span>
        </div>
        <div className="cam-card-sub">
          <i className="fa-solid fa-compass"></i> {camera.angle}° • Alcance: {camera.reach}px • Apertura: {camera.fov}°
        </div>
      </div>
    </div>
  );
};
