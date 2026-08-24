export type CameraType = 'Fija' | 'PTZ' | 'Domo' | 'Térmica';
export type CameraStatus = 'active' | 'warning' | 'offline';

export interface Camera {
  id: string;
  name: string;
  x: number;
  y: number;
  angle: number;
  reach: number;
  fov: number;
  type: CameraType;
  status: CameraStatus;
  zone: string;
  conduit: string;
  isRedHighlight?: boolean;
}

export type ZoneType = 'road' | 'building' | 'parking' | 'green' | 'security' | 'hazard' | 'small-box';

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  fontSize?: number;
  verticalText?: boolean;
}

export type ThemeMode = 'theme-blueprint' | 'theme-dark' | 'theme-light';
export type HandleType = 'move' | 'rotate' | 'resize' | null;

export interface AppState {
  zoom: number;
  panX: number;
  panY: number;
  showCameras: boolean;
  selectedCameraId: string | null;
  selectedZoneId: string | null;
  draggingHandle: HandleType;
  dragTargetId: string | null;
  snapToGrid: boolean;
  gridSize: number;
  showBgPhoto: boolean;
  theme: ThemeMode;
  zones: Zone[];
  cameras: Camera[];
}
