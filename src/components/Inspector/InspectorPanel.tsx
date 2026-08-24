import React from 'react';
import { Camera, CameraType, CameraStatus } from '../../types/cctv';
import { QuickAngleChips } from './QuickAngleChips';

interface InspectorPanelProps {
  selectedCamera: Camera | null;
  onUpdateCamera: (id: string, updates: Partial<Camera>) => void;
  onDuplicateCamera: (id: string) => void;
  onDeleteCamera: (id: string) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedCamera,
  onUpdateCamera,
  onDuplicateCamera,
  onDeleteCamera
}) => {
  if (!selectedCamera) {
    return (
      <aside className="sidebar right-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">
            <i className="fa-solid fa-sliders"></i>
            <h2>Inspector de Cobertura</h2>
          </div>
        </div>
        <div className="empty-state">
          <i className="fa-solid fa-crosshairs"></i>
          <p>Selecciona una cámara en el plano para inspeccionar y ajustar su campo de visión, ángulo o canalización.</p>
        </div>
      </aside>
    );
  }

  const cam = selectedCamera;

  return (
    <aside className="sidebar right-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <i className="fa-solid fa-sliders"></i>
          <h2>Inspector de Cobertura</h2>
        </div>
        <span className="badge badge-accent">{cam.name.split(':')[0]}</span>
      </div>

      <div className="inspector-form scrollable">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="insp-cam-name"><i className="fa-solid fa-tag"></i> Identificador de Cámara</label>
          <input
            type="text"
            id="insp-cam-name"
            className="input-text"
            value={cam.name}
            onChange={(e) => onUpdateCamera(cam.id, { name: e.target.value })}
          />
        </div>

        {/* Angle Slider */}
        <div className="form-group">
          <div className="label-with-val">
            <label><i className="fa-solid fa-compass"></i> Orientación (Ángulo)</label>
            <span className="val-badge">{cam.angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={cam.angle}
            onChange={(e) => onUpdateCamera(cam.id, { angle: parseInt(e.target.value) })}
          />
          <QuickAngleChips onSelectAngle={(angle) => onUpdateCamera(cam.id, { angle })} />
        </div>

        {/* Reach Slider */}
        <div className="form-group">
          <div className="label-with-val">
            <label><i className="fa-solid fa-ruler-combined"></i> Alcance (Metros / Px)</label>
            <span className="val-badge">{cam.reach} px</span>
          </div>
          <input
            type="range"
            min="40"
            max="400"
            step="5"
            value={cam.reach}
            onChange={(e) => onUpdateCamera(cam.id, { reach: parseInt(e.target.value) })}
          />
        </div>

        {/* FOV Slider */}
        <div className="form-group">
          <div className="label-with-val">
            <label><i className="fa-solid fa-expand"></i> Apertura del Lente (FOV)</label>
            <span className="val-badge">{cam.fov}°</span>
          </div>
          <input
            type="range"
            min="15"
            max="150"
            step="5"
            value={cam.fov}
            onChange={(e) => onUpdateCamera(cam.id, { fov: parseInt(e.target.value) })}
          />
        </div>

        {/* Type Select */}
        <div className="form-group">
          <label htmlFor="insp-cam-type"><i className="fa-solid fa-video"></i> Tipo de Cámara</label>
          <select
            id="insp-cam-type"
            className="select-input"
            value={cam.type}
            onChange={(e) => onUpdateCamera(cam.id, { type: e.target.value as CameraType })}
          >
            <option value="Fija">Cámara Fija (Bala)</option>
            <option value="PTZ">Cámara PTZ (Giratoria)</option>
            <option value="Domo">Cámara Domo</option>
            <option value="Térmica">Cámara Térmica</option>
          </select>
        </div>

        {/* Status Select */}
        <div className="form-group">
          <label htmlFor="insp-cam-status"><i className="fa-solid fa-signal"></i> Estado de la Cámara</label>
          <select
            id="insp-cam-status"
            className="select-input"
            value={cam.status}
            onChange={(e) => onUpdateCamera(cam.id, { status: e.target.value as CameraStatus })}
          >
            <option value="active">Activa / Operativa</option>
            <option value="warning">En Mantenimiento</option>
            <option value="offline">Inactiva / Falla</option>
          </select>
        </div>

        {/* Zone Location */}
        <div className="form-group">
          <label htmlFor="insp-cam-zone"><i className="fa-solid fa-location-dot"></i> Ubicación / Zona</label>
          <input
            type="text"
            id="insp-cam-zone"
            className="input-text"
            value={cam.zone}
            onChange={(e) => onUpdateCamera(cam.id, { zone: e.target.value })}
            placeholder="Ej: PCP Portón Principal"
          />
        </div>

        {/* Conduit Details */}
        <div className="form-group">
          <label htmlFor="insp-cam-conduit"><i className="fa-solid fa-plug"></i> Detalle de Canalización</label>
          <input
            type="text"
            id="insp-cam-conduit"
            className="input-text"
            value={cam.conduit}
            onChange={(e) => onUpdateCamera(cam.id, { conduit: e.target.value })}
            placeholder="Ej: Condulet T + Manguera 3/4"
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn btn-secondary flex-1" type="button" onClick={() => onDuplicateCamera(cam.id)}>
            <i className="fa-solid fa-copy"></i> Duplicar
          </button>
          <button className="btn btn-danger flex-1" type="button" onClick={() => onDeleteCamera(cam.id)}>
            <i className="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </aside>
  );
};
