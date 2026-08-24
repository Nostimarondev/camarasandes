import React, { useState } from 'react';
import { Camera } from '../../types/cctv';
import { CameraCard } from './CameraCard';

interface CameraListSidebarProps {
  cameras: Camera[];
  selectedCameraId: string | null;
  onSelectCamera: (id: string) => void;
}

export const CameraListSidebar: React.FC<CameraListSidebarProps> = ({
  cameras,
  selectedCameraId,
  onSelectCamera
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCameras = cameras.filter(
    (cam) =>
      cam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cam.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="sidebar left-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <i className="fa-solid fa-list-check"></i>
          <h2>Inventario de Cámaras</h2>
        </div>
        <span className="badge" id="camera-count-badge">
          {cameras.length}
        </span>
      </div>

      <div className="search-box">
        <i className="fa-solid fa-search"></i>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o zona..."
        />
      </div>

      <div className="camera-list scrollable">
        {filteredCameras.map((cam) => (
          <CameraCard
            key={cam.id}
            camera={cam}
            isSelected={cam.id === selectedCameraId}
            onSelect={onSelectCamera}
          />
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="summary-stat">
          <span><i className="fa-solid fa-shield-halved"></i> Cámaras Activas:</span>
          <strong>{cameras.filter((c) => c.status === 'active').length} / {cameras.length}</strong>
        </div>
      </div>
    </aside>
  );
};
