import { useState, useEffect, useCallback } from 'react';
import { Camera, Zone, ThemeMode, HandleType } from '../types/cctv';
import { DEFAULT_ZONES } from '../constants/defaultZones';
import { DEFAULT_CAMERAS } from '../constants/defaultCameras';

const STORAGE_KEY = 'cctv_saved_cameras';

export function useCctvState() {
  const [zoom, setZoom] = useState<number>(0.95);
  const [panX, setPanX] = useState<number>(30);
  const [panY, setPanY] = useState<number>(20);

  const [showCameras, setShowCameras] = useState<boolean>(true);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<HandleType>(null);
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);

  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [gridSize] = useState<number>(10);
  const [showBgPhoto, setShowBgPhoto] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('theme-blueprint');

  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES);
  const [cameras, setCameras] = useState<Camera[]>(DEFAULT_CAMERAS);

  // Load initial cameras from localStorage or camarasbuild.json
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCameras(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }

    // Try fetching public/camarasbuild.json
    fetch('camarasbuild.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.cameras) && data.cameras.length > 0) {
          setCameras(data.cameras);
        }
      })
      .catch(() => {
        // Default fallback already set
      });
  }, []);

  // Save to localStorage whenever cameras array changes
  const saveCameras = useCallback((updatedCameras: Camera[]) => {
    setCameras(updatedCameras);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCameras));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, []);

  const addCamera = useCallback((camera: Camera) => {
    setCameras((prev) => {
      const updated = [...prev, camera];
      saveCameras(updated);
      return updated;
    });
    setSelectedCameraId(camera.id);
    setSelectedZoneId(null);
  }, [saveCameras]);

  const updateCamera = useCallback((id: string, updates: Partial<Camera>) => {
    setCameras((prev) => {
      const updated = prev.map((cam) => (cam.id === id ? { ...cam, ...updates } : cam));
      saveCameras(updated);
      return updated;
    });
  }, [saveCameras]);

  const deleteCamera = useCallback((id: string) => {
    setCameras((prev) => {
      const updated = prev.filter((cam) => cam.id !== id);
      saveCameras(updated);
      return updated;
    });
    setSelectedCameraId(null);
  }, [saveCameras]);

  const duplicateCamera = useCallback((id: string) => {
    setCameras((prev) => {
      const target = prev.find((c) => c.id === id);
      if (!target) return prev;
      const newCam: Camera = {
        ...target,
        id: `cam-${Date.now()}`,
        name: `${target.name} (Copia)`,
        x: target.x + 30,
        y: target.y + 30
      };
      const updated = [...prev, newCam];
      saveCameras(updated);
      setSelectedCameraId(newCam.id);
      return updated;
    });
  }, [saveCameras]);

  const resetToBuildPreset = useCallback(async () => {
    try {
      const res = await fetch('camarasbuild.json');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.cameras)) {
          saveCameras(data.cameras);
          if (data.zones && Array.isArray(data.zones)) setZones(data.zones);
          return;
        }
      }
    } catch (e) {}

    saveCameras(DEFAULT_CAMERAS);
    setZones(DEFAULT_ZONES);
  }, [saveCameras]);

  const addZone = useCallback((zone: Zone) => {
    setZones((prev) => [...prev, zone]);
  }, []);

  return {
    zoom, setZoom,
    panX, setPanX,
    panY, setPanY,
    showCameras, setShowCameras,
    selectedCameraId, setSelectedCameraId,
    selectedZoneId, setSelectedZoneId,
    draggingHandle, setDraggingHandle,
    dragTargetId, setDragTargetId,
    snapToGrid, setSnapToGrid,
    gridSize,
    showBgPhoto, setShowBgPhoto,
    theme, setTheme,
    zones, setZones,
    cameras, setCameras,
    addCamera,
    updateCamera,
    deleteCamera,
    duplicateCamera,
    resetToBuildPreset,
    addZone,
    saveCameras
  };
}
