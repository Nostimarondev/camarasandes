import React from 'react';
import { Zone } from '../../types/cctv';

interface ZoneItemProps {
  zone: Zone;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ZoneItem: React.FC<ZoneItemProps> = ({ zone, isSelected, onSelect }) => {
  const fontSz = zone.fontSize || (zone.h > 150 ? 16 : 12);

  return (
    <g className="zone-group" onClick={() => onSelect(zone.id)}>
      <rect
        x={zone.x}
        y={zone.y}
        width={zone.w}
        height={zone.h}
        className={`zone-shape type-${zone.type} ${isSelected ? 'selected' : ''}`}
        style={zone.color ? { fill: zone.color } : undefined}
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
