import React from 'react'
import type { ZonaDano } from '../types/taller'
import { ZONAS_DANO } from '../types/taller'
import { BosquejoVehiculo } from './BosquejoVehiculo'

interface Props {
  zonas: ZonaDano[]
  onChangeZonas: (zonas: ZonaDano[]) => void
  readOnly?: boolean
}

export const InspeccionVehicular16Zonas: React.FC<Props> = ({
  zonas,
  onChangeZonas,
  readOnly = false
}) => {
  const toggleZona = (zona: ZonaDano) => {
    if (readOnly) return
    if (zonas.includes(zona)) {
      onChangeZonas(zonas.filter(z => z !== zona))
    } else {
      onChangeZonas([...zonas, zona])
    }
  }

  // Grupos semánticos de las 16 zonas
  const grupos = [
    {
      titulo: 'Guardabarros (4 cuadrantes)',
      items: [
        'guardabarros delantero izquierdo',
        'guardabarros delantero derecho',
        'guardabarros trasero izquierdo',
        'guardabarros trasero derecho'
      ] as ZonaDano[]
    },
    {
      titulo: 'Parantes y Estructura',
      items: [
        'parante izquierdo',
        'parante derecho',
        'techo',
        'caja'
      ] as ZonaDano[]
    },
    {
      titulo: 'Puertas Laterales',
      items: [
        'puerta delantera izquierda',
        'puerta trasera izquierda',
        'puerta delantera derecha',
        'puerta trasera derecha'
      ] as ZonaDano[]
    },
    {
      titulo: 'Frente y Trasera',
      items: [
        'capot',
        'baul',
        'paragolpes delantero',
        'paragolpes trasero'
      ] as ZonaDano[]
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 border border-slate-300 rounded-lg shadow-sm">
      {/* Columna Izquierda: Bosquejo Gráfico */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <BosquejoVehiculo
          zonasSeleccionadas={zonas}
          onToggleZona={toggleZona}
          readOnly={readOnly}
        />
      </div>

      {/* Columna Derecha: Checkboxes agrupados */}
      <div className="lg:col-span-7 space-y-4">
        <div className="border-b pb-2">
          <h3 className="font-display uppercase text-sm sm:text-base font-bold text-slate-900">
            Checklist de Inspección de Recepción (16 Paneles)
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Marcá los paneles con bollos, rayones o áreas a intervenir para dejar constancia digital al cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {grupos.map(g => (
            <div key={g.titulo} className="bg-slate-50 border border-slate-200 p-3 rounded-md">
              <h4 className="font-mono text-xs font-bold text-blue-900 uppercase border-b border-slate-200 pb-1 mb-2">
                {g.titulo}
              </h4>
              <div className="space-y-1.5">
                {g.items.map(zona => {
                  const check = zonas.includes(zona)
                  return (
                    <label
                      key={zona}
                      className={`flex items-center gap-2 p-1.5 rounded text-xs font-mono cursor-pointer transition select-none ${
                        check ? 'bg-red-100 font-bold text-red-900 border border-red-300' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={check}
                        disabled={readOnly}
                        onChange={() => toggleZona(zona)}
                        className="w-3.5 h-3.5 text-red-600 rounded border-slate-300 focus:ring-red-500"
                      />
                      <span className="capitalize">{zona}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-600">
          <span>Paneles marcados con daño/trabajo: <strong className="text-red-600 font-bold">{zonas.length}</strong> de 16</span>
          {!readOnly && zonas.length > 0 && (
            <button
              type="button"
              onClick={() => onChangeZonas([])}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              Desmarcar todos
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
