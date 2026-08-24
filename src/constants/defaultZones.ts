import { Zone } from '../types/cctv';

export const DEFAULT_ZONES: Zone[] = [
  // Top Highway
  { id: 'z-intercomunal', name: 'AVENIDA INTERCOMUNAL', type: 'road', x: 40, y: 40, w: 1920, h: 60, color: 'rgba(30, 41, 59, 0.7)' },
  
  // Left Vertical Building: Servicios Médicos
  { id: 'z-servicios-medicos', name: 'SERVICIOS MEDICOS', type: 'building', verticalText: true, x: 40, y: 300, w: 100, h: 740, color: 'rgba(15, 23, 42, 0.85)' },
  
  // Portón de acceso on left street
  { id: 'z-gate-top-left', name: 'PORTON DE ACCESO', type: 'security', x: 140, y: 300, w: 100, h: 40, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },
  { id: 'z-barrera-left', name: 'BARRERA VEHICULAR', type: 'security', verticalText: true, x: 250, y: 120, w: 35, h: 90, fontSize: 8, color: 'rgba(59, 130, 246, 0.3)' },

  // Left Parking Lots
  { id: 'z-estac-top-left', name: 'ESTACIONAMIENTO', type: 'parking', x: 240, y: 100, w: 520, h: 200, color: 'rgba(15, 23, 42, 0.5)' },
  { id: 'z-estac-mid-left', name: 'ESTACIONAMIENTO', type: 'parking', x: 240, y: 300, w: 420, h: 240, color: 'rgba(15, 23, 42, 0.5)' },
  
  // Motos Area
  { id: 'z-motos-l', name: 'MOTOS', type: 'parking', x: 560, y: 500, w: 100, h: 40, color: 'rgba(31, 41, 55, 0.9)' },
  { id: 'z-gate-motos-top', name: 'PORTON DE ACCESO', type: 'security', x: 580, y: 300, w: 80, h: 40, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },
  { id: 'z-barrera-motos', name: 'BARRERA VEHICULAR', type: 'security', verticalText: true, x: 620, y: 120, w: 35, h: 90, fontSize: 8, color: 'rgba(59, 130, 246, 0.3)' },

  // Áreas Verdes
  { id: 'z-green-mid-left', name: 'AREAS VERDES', type: 'green', x: 240, y: 540, w: 420, h: 60, color: 'rgba(16, 185, 129, 0.12)' },
  { id: 'z-trailer-medico', name: 'TRAILER MEDICO', type: 'small-box', x: 400, y: 545, w: 90, h: 22, fontSize: 8, color: 'rgba(255,255,255,0.08)' },
  { id: 'z-bodega', name: 'BODEGA', type: 'small-box', x: 400, y: 572, w: 90, h: 22, fontSize: 8, color: 'rgba(255,255,255,0.08)' },

  // Central Entrance Section
  { id: 'z-blank-box-center', name: '', type: 'small-box', x: 660, y: 105, w: 100, h: 40, color: 'rgba(255, 255, 255, 0.08)' },
  { id: 'z-gate-center-main', name: 'PORTON DE ACCESO', type: 'security', x: 660, y: 300, w: 100, h: 40, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },
  { id: 'z-nomina', name: 'NOMINA', type: 'small-box', verticalText: true, x: 660, y: 390, w: 35, h: 100, fontSize: 9, color: 'rgba(255,255,255,0.1)' },

  // PCP Column
  { id: 'z-pcp', name: 'PCP', type: 'small-box', x: 760, y: 300, w: 100, h: 60, fontSize: 9, color: 'rgba(255, 255, 255, 0.08)' },
  { id: 'z-facturacion', name: 'FACTURACION', type: 'small-box', x: 760, y: 360, w: 100, h: 50, fontSize: 8, color: 'rgba(255,255,255,0.08)' },
  { id: 'z-green-under-pcp', name: 'AREAS VERDES', type: 'green', x: 760, y: 410, w: 100, h: 130, fontSize: 9, color: 'rgba(16, 185, 129, 0.12)' },

  // Right Transport Parking & Complex
  { id: 'z-estac-top-right', name: 'ESTACIONAMIENTO', type: 'parking', x: 860, y: 100, w: 680, h: 200, color: 'rgba(15, 23, 42, 0.5)' },
  { id: 'z-blank-box-top-right', name: '', type: 'small-box', x: 1540, y: 100, w: 400, h: 200, color: 'rgba(255, 255, 255, 0.05)' },

  { id: 'z-gate-right-transp', name: 'PORTON DE ACCESO', type: 'security', x: 860, y: 300, w: 100, h: 40, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },
  { id: 'z-barrera-right', name: 'BARRERA VEHICULAR', type: 'security', verticalText: true, x: 860, y: 120, w: 35, h: 90, fontSize: 8, color: 'rgba(59, 130, 246, 0.3)' },
  
  { id: 'z-green-transp-top', name: 'AREAS VERDES', type: 'green', x: 960, y: 300, w: 580, h: 40, color: 'rgba(16, 185, 129, 0.12)' },
  { id: 'z-estac-transporte', name: 'ESTACIONAMIENTO DE TRANSPORTE', type: 'parking', x: 860, y: 340, w: 680, h: 200, color: 'rgba(15, 23, 42, 0.6)' },
  
  { id: 'z-green-transp-bot-full', name: 'AREAS VERDES', type: 'green', x: 760, y: 540, w: 780, h: 60, color: 'rgba(16, 185, 129, 0.12)' },
  
  // Rightmost Complex
  { id: 'z-inces-outer', name: '', type: 'small-box', x: 1540, y: 300, w: 140, h: 300, color: 'rgba(255, 255, 255, 0.05)' },
  { id: 'z-gate-inces', name: 'PORTON DE ACCESO', type: 'security', x: 1540, y: 300, w: 70, h: 35, fontSize: 7, color: 'rgba(239, 68, 68, 0.35)' },
  { id: 'z-trailer-inces', name: 'TRAILER INCES', type: 'small-box', verticalText: true, x: 1585, y: 370, w: 45, h: 140, fontSize: 8, color: 'rgba(255,255,255,0.08)' },

  { id: 'z-gate-internal-road', name: 'PORTON DE ACCESO', type: 'security', x: 1680, y: 300, w: 80, h: 35, fontSize: 8, color: 'rgba(239, 68, 68, 0.35)' },

  { id: 'z-gas-outer', name: '', type: 'small-box', x: 1760, y: 300, w: 180, h: 300, color: 'rgba(255, 255, 255, 0.05)' },
  { id: 'z-gas-1', name: 'BOMBONA DE GAS', type: 'hazard', x: 1780, y: 355, w: 140, h: 50, fontSize: 9, color: 'rgba(185, 28, 28, 0.3)' },
  { id: 'z-gas-2', name: 'BOMBONA DE GAS', type: 'hazard', x: 1780, y: 425, w: 140, h: 50, fontSize: 9, color: 'rgba(185, 28, 28, 0.3)' },

  // Main Lower Complex
  { id: 'z-planta-cabudare', name: 'PLANTA CABUDARE', type: 'building', x: 240, y: 680, w: 1440, h: 360, color: 'rgba(30, 58, 138, 0.4)' },
  { id: 'z-almacen-uht', name: 'ALMACEN UHT', type: 'building', verticalText: true, x: 1760, y: 680, w: 180, h: 360, color: 'rgba(30, 58, 138, 0.6)' }
];
