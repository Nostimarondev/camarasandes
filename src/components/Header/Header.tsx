import React from 'react';
import { ThemeMode } from '../../types/cctv';

interface HeaderProps {
  showCameras: boolean;
  onToggleCameras: () => void;
  onAddCamera: () => void;
  onOpenAddZoneModal: () => void;
  onToggleBgPhoto: () => void;
  showBgPhoto: boolean;
  onResetView: () => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onReloadBuild: () => void;
  onExportPng: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showCameras,
  onToggleCameras,
  onAddCamera,
  onOpenAddZoneModal,
  onToggleBgPhoto,
  showBgPhoto,
  onResetView,
  snapToGrid,
  onToggleSnap,
  theme,
  onThemeChange,
  onExportJson,
  onImportJson,
  onReloadBuild,
  onExportPng
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportJson(e.target.files[0]);
    }
  };

  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo-icon">
          <i className="fa-solid fa-video"></i>
        </div>
        <div className="brand-text">
          <h1>Planta Cabudare — CCTV</h1>
          <p>Lácteos Los Andes • Sistema de Monitoreo y Cobertura de Cámaras</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="tool-group">
          <button
            className={`btn btn-icon-text ${showCameras ? 'active' : ''}`}
            onClick={onToggleCameras}
            title="Mostrar u Ocultar Triángulos de Cámaras"
          >
            <i className={`fa-solid ${showCameras ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            <span>Cámaras: {showCameras ? 'VISIBLES' : 'OCULTAS'}</span>
          </button>
          <button className="btn btn-primary" onClick={onAddCamera} title="Agregar Nueva Cámara">
            <i className="fa-solid fa-plus"></i>
            <span>+ Cámara</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenAddZoneModal} title="Agregar Zona al Plano">
            <i className="fa-solid fa-draw-polygon"></i>
            <span>+ Zona</span>
          </button>
        </div>

        <div className="divider-v"></div>

        <div className="tool-group">
          <button
            className={`btn btn-icon-text ${showBgPhoto ? 'active' : ''}`}
            onClick={onToggleBgPhoto}
            title="Mostrar/Ocultar foto del plano original"
          >
            <i className="fa-solid fa-map"></i>
            <span>Plano Referencia</span>
          </button>
          <button className="btn btn-icon" onClick={onResetView} title="Centrar Vista">
            <i className="fa-solid fa-compress-arrows-alt"></i>
          </button>
          <button
            className={`btn btn-icon ${snapToGrid ? 'active' : ''}`}
            onClick={onToggleSnap}
            title="Ajuste a Cuadrícula (Snap)"
          >
            <i className="fa-solid fa-border-all"></i>
          </button>
        </div>

        <div className="divider-v"></div>

        <div className="tool-group">
          <select
            className="select-input"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
            title="Estilo del Mapa"
          >
            <option value="theme-blueprint">Modo Blueprint (Azul)</option>
            <option value="theme-dark">Modo Oscuro (CCTV)</option>
            <option value="theme-light">Modo Claro (CAD)</option>
          </select>
        </div>

        <div className="divider-v"></div>

        <div className="tool-group">
          <button className="btn btn-icon-text" onClick={onExportJson} title="Guardar proyecto a archivo JSON">
            <i className="fa-solid fa-download"></i>
            <span>Guardar</span>
          </button>
          <label htmlFor="file-import-json-react" className="btn btn-icon-text" title="Cargar proyecto JSON" style={{ cursor: 'pointer' }}>
            <i className="fa-solid fa-folder-open"></i>
            <span>Cargar</span>
          </label>
          <input type="file" id="file-import-json-react" accept=".json" onChange={handleFileChange} style={{ display: 'none' }} />

          <button className="btn btn-icon-text" onClick={onReloadBuild} title="Cargar/Restablecer configuración camarasbuild.json">
            <i className="fa-solid fa-rotate-left"></i>
            <span>Camaras Build</span>
          </button>

          <button className="btn btn-icon-text btn-success" onClick={onExportPng} title="Exportar Mapa como Imagen PNG">
            <i className="fa-solid fa-file-image"></i>
            <span>Exportar PNG</span>
          </button>
        </div>
      </div>
    </header>
  );
};
