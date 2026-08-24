import React from 'react';

interface QuickAngleChipsProps {
  onSelectAngle: (angle: number) => void;
}

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export const QuickAngleChips: React.FC<QuickAngleChipsProps> = ({ onSelectAngle }) => {
  return (
    <div className="quick-angle-buttons">
      {ANGLES.map((angle) => (
        <button
          key={angle}
          className="btn-chip"
          type="button"
          onClick={() => onSelectAngle(angle)}
        >
          {angle}°
        </button>
      ))}
    </div>
  );
};
