import React from 'react';
import { Zone } from '../../types/cctv';

interface ZoneItemProps {
  zone: Zone;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ZONE_TYPE_DEFAULTS: Record<string, { fill: string; stroke: string; strokeWidth: number; strokeDasharray?: string }> = {
  road: { fill: 'rgba(30,41,59,0.7)', stroke: '#475569', strokeWidth: 2 },
  building: { fill: 'rgba(30,58,138,0.4)', stroke: '#3b82f6', strokeWidth: 2.5 },
  parking: { fill: 'rgba(15,23,42,0.5)', stroke: '#334155', strokeWidth: 2 },
  green: { fill: 'rgba(16,185,129,0.12)', stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '6 4' },
  security: { fill: 'rgba(239,68,68,0.35)', stroke: '#ef4444', strokeWidth: 2 },
  hazard: { fill: 'rgba(185,28,28,0.3)', stroke: '#dc2626', strokeWidth: 2, strokeDasharray: '8 4' },
  'small-box': { fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1.5 },
};

export const ZoneItem: React.FC<ZoneItemProps> = ({ zone, isSelected, onSelect }) => {
  const fontSz = zone.fontSize || (zone.h > 150 ? 16 : 12);
  const defaults = ZONE_TYPE_DEFAULTS[zone.type] || { fill: 'rgba(30,58,138,0.4)', stroke: '#3b82f6', strokeWidth: 2 };

  const fill = zone.color || defaults.fill;
  const stroke = isSelected ? '#10b981' : defaults.stroke;
  const strokeWidth = isSelected ? 3 : defaults.strokeWidth;
  const strokeDasharray = defaults.strokeDasharray;

  return (
    <g className="zone-group" onClick={() => onSelect(zone.id)}>
      <rect
        x={zone.x}
        y={zone.y}
        width={zone.w}
        height={zone.h}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        className={`zone-shape type-${zone.type} ${isSelected ? 'selected' : ''}`}
      />

      {zone.name && (
        <text
          x={zone.x + zone.w / 2}
          y={zone.verticalText ? zone.y + zone.h / 2 : zone.y + zone.h / 2 + fontSz / 3}
          transform={
            zone.verticalText
              ? `rotate(-90 ${zone.x + zone.w / 2} ${zone.y + zone.h / 2})`
              : undefined
          }
          className="zone-label-text"
          fontSize={fontSz}
          fontWeight="600"
          fill="#ffffff"
          textAnchor="middle"
        >
          {zone.name}
        </text>
      )}
    </g>
  );
};

