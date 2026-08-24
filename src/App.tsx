import React, { useRef, useCallback, useState, MutableRefObject } from 'react';
import { useCctvState } from './hooks/useCctvState';
import { Header } from './components/Header/Header';
import { CameraListSidebar } from './components/Sidebar/CameraListSidebar';
import { InspectorPanel } from './components/Inspector/InspectorPanel';
import { ViewportCanvas } from './components/Viewport/ViewportCanvas';
import { AddZoneModal } from './components/Modals/AddZoneModal';
import { Camera, Zone, ThemeMode } from './types/cctv';
import { exportToJson, exportToPng } from './utils/exportHelpers';

const App: React.FC = () => {
  const state = useCctvState();
  const svgRef = useRef<SVGSVGElement | null>(null) as MutableRefObject<SVGSVGElement | null>;
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);

  // Apply theme to body element
  React.useEffect(() => {
    document.body.className = state.theme;
  }, [state.theme]);

  const selectedCamera = state.cameras.find(c => c.id === state.selectedCameraId) || null;

  const handleAddCamera = useCallback(() => {
    const newCam: Camera = {
      id: `cam-${Date.now()}`,
      name: `CAM-${String(state.cameras.length + 1).padStart(2, '0')}: Nueva Cámara`,
      x: 800,
      y: 500,
      angle: 0,
      reach: 150,
      fov: 60,
      type: 'Fija',
      status: 'active',
      zone: 'Sin Asignar',
      conduit: 'Sin Especificar'
    };
    state.addCamera(newCam);
  }, [state]);

  const handleImportJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.cameras) state.saveCameras(data.cameras);
        if (data.zones) state.setZones(data.zones);
      } catch (err) {
        alert('Error al cargar el archivo JSON. Asegúrate de que sea un archivo válido.');
      }
    };
    reader.readAsText(file);
  }, [state]);

  const handleExportJson = useCallback(() => {
    exportToJson({ cameras: state.cameras, zones: state.zones });
  }, [state.cameras, state.zones]);

  const handleExportPng = useCallback(() => {
    exportToPng(svgRef.current);
  }, []);

  const handleResetView = useCallback(() => {
    state.setZoom(0.8);
    state.setPanX(30);
    state.setPanY(20);
  }, [state]);

  const handleClearSelection = useCallback(() => {
    state.setSelectedCameraId(null);
    state.setSelectedZoneId(null);
  }, [state]);

  return (
    <div className="app-container">
      <Header
        showCameras={state.showCameras}
        onToggleCameras={() => state.setShowCameras(prev => !prev)}
        onAddCamera={handleAddCamera}
        onOpenAddZoneModal={() => setShowAddZoneModal(true)}
        onToggleBgPhoto={() => state.setShowBgPhoto(prev => !prev)}
        showBgPhoto={state.showBgPhoto}
        onResetView={handleResetView}
        snapToGrid={state.snapToGrid}
        onToggleSnap={() => state.setSnapToGrid(prev => !prev)}
        theme={state.theme}
        onThemeChange={(t: ThemeMode) => state.setTheme(t)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onReloadBuild={state.resetToBuildPreset}
        onExportPng={handleExportPng}
      />

      <div className="main-layout">
        <CameraListSidebar
          cameras={state.cameras}
          selectedCameraId={state.selectedCameraId}
          onSelectCamera={(id) => {
            state.setSelectedCameraId(id);
            state.setSelectedZoneId(null);
          }}
        />

        <ViewportCanvas
          zoom={state.zoom} setZoom={state.setZoom}
          panX={state.panX} setPanX={state.setPanX}
          panY={state.panY} setPanY={state.setPanY}
          zones={state.zones}
          cameras={state.cameras}
          showCameras={state.showCameras}
          showBgPhoto={state.showBgPhoto}
          selectedCameraId={state.selectedCameraId}
          selectedZoneId={state.selectedZoneId}
          snapToGrid={state.snapToGrid}
          gridSize={state.gridSize}
          onSelectCamera={(id) => {
            state.setSelectedCameraId(id);
            state.setSelectedZoneId(null);
          }}
          onSelectZone={(id) => {
            state.setSelectedZoneId(id);
            state.setSelectedCameraId(null);
          }}
          onClearSelection={handleClearSelection}
          onUpdateCamera={state.updateCamera}
          svgRef={svgRef}
        />

        <InspectorPanel
          selectedCamera={selectedCamera}
          onUpdateCamera={state.updateCamera}
          onDuplicateCamera={state.duplicateCamera}
          onDeleteCamera={state.deleteCamera}
        />
      </div>

      {showAddZoneModal && (
        <AddZoneModal
          onAdd={state.addZone}
          onClose={() => setShowAddZoneModal(false)}
        />
      )}
    </div>
  );
};

export default App;
