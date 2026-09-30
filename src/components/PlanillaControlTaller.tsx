import React from 'react'
import { useDemoStore } from '../context/DemoStoreContext'
import type { CasoDemo, EtapaCaso } from '../types/taller'
import { TIPOS_SERVICIO } from '../types/taller'
import { Wrench, Plus, AlertTriangle, Car, CheckCircle, Clock, ShieldAlert, DollarSign } from 'lucide-react'

interface Props {
  onOpenNuevoCaso: () => void
}

export const PlanillaControlTaller: React.FC<Props> = ({ onOpenNuevoCaso }) => {
  const {
    rol,
    casos,
    setCasoSeleccionado,
    filtroServicio,
    setFiltroServicio,
    filtroCanal,
    setFiltroCanal
  } = useDemoStore()

  // KPIs
  const autosEnTaller = casos.filter(c => ['ingresado', 'esperando repuesto', 'en reparación'].includes(c.estado)).length
  const esperandoRepuesto = casos.filter(c => c.estado === 'esperando repuesto').length
  const trabados = casos.filter(c => c.dias_en_etapa >= 5 && !['cobrado'].includes(c.estado)).length
  const facturadoSinCobrar = casos
    .filter(c => ['facturado', 'reclamo a la compañía'].includes(c.estado))
    .reduce((acc, c) => acc + (c.facturado_monto || c.presupuesto_monto) - (c.cobrado_monto || 0), 0)

  // Filtered cases
  const casosFiltrados = casos.filter(c => {
    if (filtroServicio !== 'todos' && c.tipo_servicio !== filtroServicio) return false
    if (filtroCanal !== 'todos' && c.canal !== filtroCanal) return false
    return true
  })

  // 9 Columns in the Board
  const columnasEtapas: { id: string; label: string; match: (estado: EtapaCaso) => boolean }[] = [
    { id: 'borrador', label: 'Borrador', match: e => e === 'borrador' },
    { id: 'enviado', label: 'Env. Cía', match: e => e === 'enviado a la aseguradora' },
    { id: 'aprobado', label: 'Aprobado', match: e => e === 'aprobado' },
    { id: 'turno', label: 'Turno', match: e => e === 'turno coordinado' },
    { id: 'ingresado', label: 'Ingresado', match: e => e === 'ingresado' },
    { id: 'repuesto', label: 'Repuesto', match: e => e === 'esperando repuesto' },
    { id: 'reparacion', label: 'En Curso', match: e => e === 'en reparación' },
    { id: 'firma', label: 'Listo Firma', match: e => e === 'listo para firma' },
    { id: 'finalizado', label: 'Cobrado', match: e => ['firmado', 'facturado', 'cobrado', 'reclamo a la compañía'].includes(e) },
  ]

  const renderSemaforoCelda = (caso: CasoDemo, col: typeof columnasEtapas[0], colIndex: number) => {
    // Determine status of this cell
    const etapaActualIndex = columnasEtapas.findIndex(c => c.match(caso.estado))
    
    // Active stage
    if (col.match(caso.estado)) {
      if (caso.estado === 'esperando repuesto') {
        return (
          <div className="flex items-center justify-center">
            <span className="px-1.5 py-0.5 bg-amber-500 text-white font-mono text-[10px] font-bold rounded animate-pulse" title="Esperando repuesto">
              REP
            </span>
          </div>
        )
      }
      if (caso.estado === 'reclamo a la compañía') {
        return (
          <div className="flex items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center" title="Reclamo a compañía">
              !
            </span>
          </div>
        )
      }
      return (
        <div className="flex items-center justify-center">
          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs" title="En curso">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </span>
        </div>
      )
    }

    // Completed stage prior to current
    if (etapaActualIndex > colIndex) {
      return (
        <div className="flex items-center justify-center text-emerald-600 font-bold text-xs" title="Completado">
          ✓
        </div>
      )
    }

    // Pending future stage
    return (
      <div className="flex items-center justify-center text-slate-300 text-xs">
        —
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top KPIs Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">Autos en Taller</span>
            <span className="text-2xl font-display font-bold text-slate-900">{autosEnTaller}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
            <Car size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">Esperando Repuesto</span>
            <span className="text-2xl font-display font-bold text-amber-600">{esperandoRepuesto}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">Casos Trabados (≥5d)</span>
            <span className={`text-2xl font-display font-bold ${trabados > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {trabados}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-300 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">Pendiente de Cobro</span>
            <span className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              ${(facturadoSinCobrar / 1000).toLocaleString()}k
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & New Case button */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold uppercase text-slate-600 mr-1">Filtrar:</span>
          
          <select
            value={filtroServicio}
            onChange={e => setFiltroServicio(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono border rounded border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="todos">Todos los Servicios</option>
            <option value="mecanica_general">Mecánica General</option>
            <option value="service_mantenimiento">Service y Mantenimiento</option>
            <option value="chapa_sacabollos">Chapa y Sacabollos (PDR)</option>
            <option value="siniestro_seguro">Siniestros / Seguros</option>
          </select>

          <select
            value={filtroCanal}
            onChange={e => setFiltroCanal(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono border rounded border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="todos">Todos los Canales</option>
            <option value="particular">Solo Particular</option>
            <option value="seguro">Solo Compañías de Seguro</option>
          </select>

          <span className="text-xs font-mono text-slate-500 ml-2">
            ({casosFiltrados.length} {casosFiltrados.length === 1 ? 'caso' : 'casos'})
          </span>
        </div>

        {/* New Case Button */}
        <button
          onClick={onOpenNuevoCaso}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase rounded shadow-sm transition cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} />
          <span>+ Nuevo Ingreso / Orden</span>
        </button>
      </div>

      {/* 9-Stage Dense Table (Excel style) */}
      <div className="bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-[#123a6b] text-white font-mono uppercase text-[11px] tracking-wider border-b border-blue-900">
                <th className="py-2.5 px-3">Orden / Patente</th>
                <th className="py-2.5 px-3">Vehículo y Cliente</th>
                <th className="py-2.5 px-2 text-center">Días</th>
                {columnasEtapas.map(c => (
                  <th key={c.id} className="py-2.5 px-2 text-center font-bold">
                    {c.label}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-right">Presupuesto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {casosFiltrados.map(caso => {
                const esTrabado = caso.dias_en_etapa >= 5 && caso.estado !== 'cobrado'
                return (
                  <tr
                    key={caso.id}
                    onClick={() => setCasoSeleccionado(caso)}
                    className="hover:bg-blue-50/60 transition cursor-pointer group"
                  >
                    {/* Orden y Patente */}
                    <td className="py-2 px-3 font-mono">
                      <div className="font-bold text-blue-900 group-hover:text-blue-700 flex items-center gap-1.5">
                        <span>{caso.orden_numero}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase font-semibold">
                        {caso.patente}
                      </span>
                    </td>

                    {/* Vehículo y Cliente */}
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-900 text-xs">
                        {caso.vehiculo_marca_modelo}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                        <span>{caso.cliente_nombre}</span>
                        {caso.canal === 'seguro' && (
                          <span className="text-blue-700 font-bold">({caso.aseguradora?.split(' ')[0]})</span>
                        )}
                      </div>
                    </td>

                    {/* Días en Etapa */}
                    <td className="py-2 px-2 text-center font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        esTrabado ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse' : 'text-slate-600'
                      }`}>
                        {caso.dias_en_etapa}d
                      </span>
                    </td>

                    {/* 9 Columnas de Semáforos */}
                    {columnasEtapas.map((col, idx) => (
                      <td key={col.id} className="py-2 px-2 text-center border-l border-slate-100">
                        {renderSemaforoCelda(caso, col, idx)}
                      </td>
                    ))}

                    {/* Monto Presupuesto */}
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ${caso.presupuesto_monto.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="bg-slate-50 p-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold text-xs">✓</span> Completado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> En curso
            </span>
            <span className="flex items-center gap-1.5">
              <span className="px-1 bg-amber-500 text-white rounded text-[9px] font-bold">REP</span> Esperando repuesto
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Reclamo
            </span>
          </div>
          <div>
            <span>Hacé click en cualquier fila para ver el detalle y operar</span>
          </div>
        </div>
      </div>
    </div>
  )
}
