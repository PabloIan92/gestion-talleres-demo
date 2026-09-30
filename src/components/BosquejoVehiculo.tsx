import React from 'react'
import type { ZonaDano } from '../types/taller'

interface BosquejoProps {
  zonasSeleccionadas: ZonaDano[]
  onToggleZona?: (zona: ZonaDano) => void
  readOnly?: boolean
}

export const BosquejoVehiculo: React.FC<BosquejoProps> = ({
  zonasSeleccionadas,
  onToggleZona,
  readOnly = false
}) => {
  const isSelected = (zona: ZonaDano) => zonasSeleccionadas.includes(zona)

  const handleClick = (zona: ZonaDano) => {
    if (!readOnly && onToggleZona) {
      onToggleZona(zona)
    }
  }

  const getFill = (zona: ZonaDano) => {
    return isSelected(zona) ? '#ef4444' : '#f8fafc'
  }

  const getStroke = (zona: ZonaDano) => {
    return isSelected(zona) ? '#b91c1c' : '#334155'
  }

  const getTextColor = (zona: ZonaDano) => {
    return isSelected(zona) ? '#ffffff' : '#1e293b'
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-300 rounded-lg">
      <div className="text-xs font-mono uppercase font-bold text-slate-700 mb-2 flex items-center gap-2">
        <span>Diagrama Exterior de Recepción (16 Zonas)</span>
        {!readOnly && <span className="text-[11px] text-blue-600 font-normal">(Tocá sobre el auto para marcar o desmarcar)</span>}
      </div>

      <svg viewBox="0 0 380 480" className="w-full max-w-[340px] drop-shadow-sm select-none">
        {/* Background Car Base Contour */}
        <path
          d="M 120 20 C 140 10, 240 10, 260 20 C 285 35, 290 80, 290 130 L 290 350 C 290 410, 280 450, 260 460 C 240 470, 140 470, 120 460 C 100 450, 90 410, 90 350 L 90 130 C 90 80, 95 35, 120 20 Z"
          fill="#e2e8f0"
          stroke="#0f172a"
          strokeWidth="3"
        />

        {/* PARAGOLPES DELANTERO */}
        <path
          d="M 110 20 C 140 8, 240 8, 270 20 L 275 42 C 240 32, 140 32, 105 42 Z"
          fill={getFill('paragolpes delantero')}
          stroke={getStroke('paragolpes delantero')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('paragolpes delantero')}
        />
        <text x="190" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill={getTextColor('paragolpes delantero')} pointerEvents="none">
          Paragolpes Delantero
        </text>

        {/* GUARDABARROS DELANTERO IZQUIERDO */}
        <path
          d="M 85 45 L 115 45 L 115 125 L 80 125 C 75 95, 75 65, 85 45 Z"
          fill={getFill('guardabarros delantero izquierdo')}
          stroke={getStroke('guardabarros delantero izquierdo')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('guardabarros delantero izquierdo')}
        />
        <text x="98" y="85" textAnchor="middle" fontSize="8" fontWeight="bold" fill={getTextColor('guardabarros delantero izquierdo')} transform="rotate(-90, 98, 85)" pointerEvents="none">
          Guardabarros D.I.
        </text>

        {/* CAPOT */}
        <path
          d="M 120 45 L 260 45 L 255 125 L 125 125 Z"
          fill={getFill('capot')}
          stroke={getStroke('capot')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('capot')}
        />
        <text x="190" y="88" textAnchor="middle" fontSize="11" fontWeight="bold" fill={getTextColor('capot')} pointerEvents="none">
          CAPOT
        </text>

        {/* GUARDABARROS DELANTERO DERECHO */}
        <path
          d="M 265 45 L 295 45 C 305 65, 305 95, 300 125 L 265 125 Z"
          fill={getFill('guardabarros delantero derecho')}
          stroke={getStroke('guardabarros delantero derecho')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('guardabarros delantero derecho')}
        />
        <text x="282" y="85" textAnchor="middle" fontSize="8" fontWeight="bold" fill={getTextColor('guardabarros delantero derecho')} transform="rotate(90, 282, 85)" pointerEvents="none">
          Guardabarros D.D.
        </text>

        {/* PARANTE IZQUIERDO */}
        <path
          d="M 120 130 L 132 130 L 130 270 L 118 270 Z"
          fill={getFill('parante izquierdo')}
          stroke={getStroke('parante izquierdo')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('parante izquierdo')}
        />
        <text x="125" y="200" textAnchor="middle" fontSize="7" fontWeight="bold" fill={getTextColor('parante izquierdo')} transform="rotate(-90, 125, 200)" pointerEvents="none">
          Parante Izq
        </text>

        {/* PARANTE DERECHO */}
        <path
          d="M 248 130 L 260 130 L 262 270 L 250 270 Z"
          fill={getFill('parante derecho')}
          stroke={getStroke('parante derecho')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('parante derecho')}
        />
        <text x="255" y="200" textAnchor="middle" fontSize="7" fontWeight="bold" fill={getTextColor('parante derecho')} transform="rotate(90, 255, 200)" pointerEvents="none">
          Parante Der
        </text>

        {/* PUERTA DELANTERA IZQUIERDA */}
        <rect
          x="75" y="130" width="40" height="70" rx="3"
          fill={getFill('puerta delantera izquierda')}
          stroke={getStroke('puerta delantera izquierda')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('puerta delantera izquierda')}
        />
        <text x="95" y="168" textAnchor="middle" fontSize="8" fontWeight="bold" fill={getTextColor('puerta delantera izquierda')} transform="rotate(-90, 95, 168)" pointerEvents="none">
          Puerta D.I.
        </text>

        {/* TECHO */}
        <rect
          x="137" y="130" width="106" height="140" rx="4"
          fill={getFill('techo')}
          stroke={getStroke('techo')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('techo')}
        />
        <text x="190" y="205" textAnchor="middle" fontSize="12" fontWeight="bold" fill={getTextColor('techo')} pointerEvents="none">
          TECHO
        </text>

        {/* PUERTA DELANTERA DERECHA */}
        <rect
          x="265" y="130" width="40" height="70" rx="3"
          fill={getFill('puerta delantera derecha')}
          stroke={getStroke('puerta delantera derecha')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('puerta delantera derecha')}
        />
        <text x="285" y="168" textAnchor="middle" fontSize="8" fontWeight="bold" fill={getTextColor('puerta delantera derecha')} transform="rotate(90, 285, 168)" pointerEvents="none">
          Puerta D.D.
        </text>

        {/* PUERTA TRASERA IZQUIERDA */}
        <rect
          x="75" y="205" width="40" height="70" rx="3"
          fill={getFill('puerta trasera izquierda')}
          stroke={getStroke('puerta trasera izquierda')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('puerta trasera izquierda')}
        />
        <text x="95" y="243" textAnchor="middle" fontSize="8" fontWeight="bold" fill={getTextColor('puerta trasera izquierda')} transform="rotate(-90, 95, 243)" pointerEvents="none">
          Puerta T.I.
        </text>

        {/* PUERTA TRASERA DERECHA */}
        <rect
          x="265" y="205" width="40" height="70" rx="3"
          fill={getFill('puerta trasera derecha')}
          stroke={getStroke('puerta trasera derecha')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('puerta trasera derecha')}
        />
        <text x="285" y="243" textAnchor="middle" fontSize="8" fontWeight="bold" fill={getTextColor('puerta trasera derecha')} transform="rotate(90, 285, 243)" pointerEvents="none">
          Puerta T.D.
        </text>

        {/* GUARDABARROS TRASERO IZQUIERDO */}
        <path
          d="M 80 280 L 115 280 L 115 365 L 85 365 C 75 340, 75 305, 80 280 Z"
          fill={getFill('guardabarros trasero izquierdo')}
          stroke={getStroke('guardabarros trasero izquierdo')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('guardabarros trasero izquierdo')}
        />
        <text x="98" y="325" textAnchor="middle" fontSize="8" fontWeight="bold" fill={getTextColor('guardabarros trasero izquierdo')} transform="rotate(-90, 98, 325)" pointerEvents="none">
          Guardabarros T.I.
        </text>

        {/* BAUL / PORTON */}
        <rect
          x="122" y="278" width="136" height="60" rx="3"
          fill={getFill('baul')}
          stroke={getStroke('baul')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('baul')}
        />
        <text x="190" y="312" textAnchor="middle" fontSize="10" fontWeight="bold" fill={getTextColor('baul')} pointerEvents="none">
          BAÚL / PORTÓN
        </text>

        {/* GUARDABARROS TRASERO DERECHO */}
        <path
          d="M 265 280 L 300 280 C 305 305, 305 340, 295 365 L 265 365 Z"
          fill={getFill('guardabarros trasero derecho')}
          stroke={getStroke('guardabarros trasero derecho')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('guardabarros trasero derecho')}
        />
        <text x="282" y="325" textAnchor="middle" fontSize="8" fontWeight="bold" fill={getTextColor('guardabarros trasero derecho')} transform="rotate(90, 282, 325)" pointerEvents="none">
          Guardabarros T.D.
        </text>

        {/* CAJA (PICK-UPS / UTILITARIOS) */}
        <rect
          x="122" y="344" width="136" height="50" rx="3"
          fill={getFill('caja')}
          stroke={getStroke('caja')}
          strokeWidth="2"
          strokeDasharray="4 2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('caja')}
        />
        <text x="190" y="372" textAnchor="middle" fontSize="9" fontWeight="bold" fill={getTextColor('caja')} pointerEvents="none">
          CAJA (Pick-ups / Utilitarios)
        </text>

        {/* PARAGOLPES TRASERO */}
        <path
          d="M 105 400 C 140 410, 240 410, 275 400 L 270 422 C 240 432, 140 432, 110 422 Z"
          fill={getFill('paragolpes trasero')}
          stroke={getStroke('paragolpes trasero')}
          strokeWidth="2"
          className={!readOnly ? 'cursor-pointer hover:opacity-80 transition' : ''}
          onClick={() => handleClick('paragolpes trasero')}
        />
        <text x="190" y="415" textAnchor="middle" fontSize="9" fontWeight="bold" fill={getTextColor('paragolpes trasero')} pointerEvents="none">
          Paragolpes Trasero
        </text>
      </svg>

      <div className="flex items-center gap-4 mt-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-slate-100 border border-slate-500 rounded" />
          <span>Sin daños</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-red-500 border border-red-700 rounded" />
          <span className="font-bold text-red-600">Daño / Trabajo marcado</span>
        </div>
      </div>
    </div>
  )
}
