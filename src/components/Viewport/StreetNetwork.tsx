import React from 'react';

export const StreetNetwork: React.FC = () => {
  const streetD = `
    M 140 100 
    L 140 1040 
    L 240 1040 
    L 240 680 
    L 1680 680 
    L 1680 1040 
    L 1760 1040 
    L 1760 300 
    L 1680 300 
    L 1680 600 
    L 760 600
    L 760 100
    L 660 100
    L 660 600
    L 240 600 
    L 240 100 
    Z
  `;

  const notes = [
    'Caja condulet LL = 1',
    'LR = 1',
    'Manguera metalica 3/4"',
    'Caja condulet tipo T = 1 + 1'
  ];

  return (
    <>
      {/* Unified Continuous Street Path */}
      <path
        d={streetD}
        fill="rgba(30, 41, 59, 0.85)"
        stroke="var(--border-accent)"
        strokeWidth="2"
      />

      {/* Street Labels */}
      <text
        x="190"
        y="500"
        transform="rotate(-90 190 500)"
        className="zone-label-text"
        fontSize="14"
        fill="#94a3b8"
      >
        CALLE INTERNA
      </text>

      <text
        x="450"
        y="645"
        className="zone-label-text"
        fontSize="16"
        fontWeight="700"
        fill="#ffffff"
      >
        CALLES INTERNAS DE PLANTA
      </text>

      {/* Technical Notes inside Planta Cabudare */}
      <g transform="translate(280, 740)">
        {notes.map((note, idx) => (
          <text
            key={idx}
            x="0"
            y={idx * 35}
            fontFamily="JetBrains Mono, monospace"
            fontSize="20"
            fill="#93c5fd"
          >
            {note}
          </text>
        ))}
      </g>
    </>
  );
};
