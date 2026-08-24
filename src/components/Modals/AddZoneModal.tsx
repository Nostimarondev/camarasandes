import React, { useState } from 'react';
import { Zone, ZoneType } from '../../types/cctv';

interface AddZoneModalProps {
  onAdd: (zone: Zone) => void;
  onClose: () => void;
}

const ZONE_COLORS: Record<ZoneType, string> = {
  'road':       'rgba(30, 41, 59, 0.7)',
  'building':   'rgba(30, 58, 138, 0.4)',
  'parking':    'rgba(15, 23, 42, 0.5)',
  'green':      'rgba(16, 185, 129, 0.12)',
  'security':   'rgba(239, 68, 68, 0.35)',
  'hazard':     'rgba(185, 28, 28, 0.3)',
  'small-box':  'rgba(255, 255, 255, 0.08)'
};

export const AddZoneModal: React.FC<AddZoneModalProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('Nueva Zona');
  const [type, setType] = useState<ZoneType>('building');
  const [x, setX] = useState(300);
  const [y, setY] = useState(700);
  const [w, setW] = useState(200);
  const [h, setH] = useState(120);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `z-custom-${Date.now()}`,
      name,
      type,
      x, y, w, h,
      color: ZONE_COLORS[type]
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fa-solid fa-draw-polygon"></i> Agregar Zona al Plano</h3>
          <button className="btn btn-icon" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleAdd}>
          <div className="form-group">
            <label>Nombre de la Zona</label>
            <input className="input-text" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Tipo de Zona</label>
            <select className="select-input" value={type} onChange={(e) => setType(e.target.value as ZoneType)}>
              <option value="building">Edificio / Área de Producción</option>
              <option value="parking">Estacionamiento</option>
              <option value="green">Área Verde</option>
              <option value="road">Vía / Calle</option>
              <option value="security">Portón / Seguridad</option>
              <option value="hazard">Zona de Riesgo</option>
              <option value="small-box">Caja Pequeña (Custom)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>X</label>
              <input className="input-text" type="number" value={x} onChange={(e) => setX(+e.target.value)} />
            </div>
            <div className="form-group">
              <label>Y</label>
              <input className="input-text" type="number" value={y} onChange={(e) => setY(+e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ancho</label>
              <input className="input-text" type="number" value={w} onChange={(e) => setW(+e.target.value)} />
            </div>
            <div className="form-group">
              <label>Alto</label>
              <input className="input-text" type="number" value={h} onChange={(e) => setH(+e.target.value)} />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" type="button" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" type="submit">
              <i className="fa-solid fa-plus"></i> Agregar Zona
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
