import React, { useState, useMemo, useEffect } from 'react'
import { useDemoStore } from '../context/DemoStoreContext'
import type { CasoDemo, ItemStock, EtapaCaso } from '../types/taller'
import {
  STAGES,
  STAGE_COLORS,
  STATE_MAPPING,
  getDiasEtapa,
  getStuckLevel,
  normalizeText,
  formatMoneda,
} from './planillaUtils'
import { BosquejoVehiculo } from './BosquejoVehiculo'
import './PlanillaControl.css'

const MOBILE_QUERY = '(max-width: 768px)'

function useIsMobileScreen() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia(MOBILE_QUERY).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(MOBILE_QUERY)
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

interface PlanillaControlProps {
  onOpenNuevoCaso: () => void
  onNavigateTab?: (tab: string) => void
}

export function PlanillaControl({ onOpenNuevoCaso, onNavigateTab }: PlanillaControlProps) {
  const {
    casos,
    stock,
    rol,
    avanzarEtapa,
    marcarEsperandoRepuesto,
    actualizarCaso
  } = useDemoStore()

  const isMobileScreen = useIsMobileScreen()
  const [vistaForzada, setVistaForzada] = useState<'tarjetas' | 'tabla' | null>(null)
  const modoMovil = vistaForzada ?? (isMobileScreen ? 'tarjetas' : 'tabla')
  const [activeTab, setActiveTab] = useState<'casos' | 'stock'>('casos')
  const [currentFilter, setCurrentFilter] = useState<'todos' | 'seguro' | 'particular'>('todos')
  const [onlyStuck, setOnlyStuck] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCasoId, setSelectedCasoId] = useState<string | null>(null)

  const selectedCaso = useMemo(() => {
    if (!selectedCasoId) return null
    return casos.find((c) => c.id === selectedCasoId) || null
  }, [casos, selectedCasoId])

  // KPIs exactamente como en producción
  const kpis = useMemo(() => {
    const inShop = casos.filter((c) => {
      return [
        'ingresado',
        'esperando repuesto',
        'en reparación',
        'listo para firma',
        'firmado',
        'facturado',
        'reclamo a la compañía',
        'cobrado',
      ].includes(c.estado)
    }).length

    const waitingParts = casos.filter((c) => c.estado === 'esperando repuesto').length
    const stuck = casos.filter((c) => getStuckLevel(c as any) !== 'none').length
    const noAdvance = casos.filter((c) => getStuckLevel(c as any) === 'critical').length
    const claims = casos.filter((c) => c.estado === 'reclamo a la compañía').length

    const pendingCash = casos.reduce((acc, c) => {
      if (c.estado === 'cobrado') return acc
      const facturado = c.facturado_monto || (['facturado', 'reclamo a la compañía'].includes(c.estado) ? c.presupuesto_monto : 0)
      const cobrado = c.cobrado_monto || 0
      if (facturado > cobrado) {
        return acc + (facturado - cobrado)
      }
      return acc
    }, 0)

    return { inShop, waitingParts, stuck, noAdvance, claims, pendingCash }
  }, [casos])

  // Casos filtrados
  const filteredCasos = useMemo(() => {
    return casos.filter((c) => {
      if (currentFilter !== 'todos' && c.canal !== currentFilter) return false
      if (onlyStuck && getStuckLevel(c as any) === 'none') return false
      if (searchQuery.trim()) {
        const q = normalizeText(searchQuery)
        const matchesPatente = normalizeText(c.patente).includes(q)
        const matchesCliente = normalizeText(c.cliente_nombre).includes(q)
        const matchesOT = normalizeText(c.orden_numero).includes(q)
        const matchesAseg = normalizeText(c.aseguradora).includes(q)
        const matchesVehiculo = normalizeText(c.vehiculo_marca_modelo).includes(q)
        if (!matchesPatente && !matchesCliente && !matchesOT && !matchesAseg && !matchesVehiculo) {
          return false
        }
      }
      return true
    })
  }, [casos, currentFilter, onlyStuck, searchQuery])

  function renderStageCell(caso: CasoDemo, stageIdx: number) {
    const map = STATE_MAPPING[caso.estado] || { idx: 0, kind: 'waiting' }
    const sc = STAGE_COLORS[stageIdx]

    if (stageIdx < map.idx) {
      return (
        <td key={stageIdx} className="stage-cell">
          <span
            className="cell-dot done"
            style={{ borderColor: sc.border, color: sc.border, background: sc.bg }}
            title="Completado"
          >
            ✓
          </span>
        </td>
      )
    } else if (stageIdx === map.idx) {
      if (map.kind === 'parts') {
        return (
          <td key={stageIdx} className="stage-cell">
            <span className="cell-dot parts" title={`Falta repuesto: ${caso.repuesto_faltante || 'Pendiente'}`}>
              REP
            </span>
          </td>
        )
      } else if (map.kind === 'active') {
        return (
          <td key={stageIdx} className="stage-cell">
            <span
              className="cell-dot active"
              style={{ borderColor: sc.border, color: sc.border, background: sc.bg }}
              title="En proceso activo"
            >
              •
            </span>
          </td>
        )
      } else if (map.kind === 'blocked') {
        return (
          <td key={stageIdx} className="stage-cell">
            <span className="cell-dot blocked" title="Reclamo abierto a compañía">
              ✕
            </span>
          </td>
        )
      } else {
        return (
          <td key={stageIdx} className="stage-cell">
            <span
              className="cell-dot waiting"
              style={{ borderColor: sc.border, color: sc.border, background: sc.bg, borderStyle: 'dashed' }}
              title="En espera"
            >
              •
            </span>
          </td>
        )
      }
    } else {
      return (
        <td key={stageIdx} className="stage-cell">
          <span className="cell-dot future" title="Pendiente">-</span>
        </td>
      )
    }
  }

  return (
    <div>
      {/* 1. Header Banner exactamente igual a producción */}
      <section className="header-banner">
        <div>
          <p className="kicker">Control de procesos en tiempo real</p>
          <h2>Planilla de Control del Taller</h2>
          <p>
            Vista tabular de seguimiento integral de cada vehículo. <strong>Nadie edita esta planilla a mano:</strong>{' '}
            cada celda se actualiza y colorea automáticamente cuando el responsable (Recepción, Taller o Dueño) aprueba
            o completa su ficha correspondiente.
          </p>
        </div>
        <div className="concept-callout">
          <strong>&ldquo;Es tu Excel, pero se llena solo&rdquo;</strong>
          Mantiene el control estricto de aprobaciones por rol sin perder la vista gráfica global y compacta que necesitás
          para controlar el taller.
        </div>
      </section>

      {/* 2. KPIs Grid exactamente igual a producción */}
      <section className="kpi-grid" aria-label="Indicadores clave del taller">
        <div className="kpi-card">
          <div className="kpi-label">Autos en taller</div>
          <div className="kpi-value">{kpis.inShop}</div>
          <div className="kpi-sub">En reparación o ingresados</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Esperando repuesto</div>
          <div className="kpi-value warning">{kpis.waitingParts}</div>
          <div className="kpi-sub">Freno de taller por proveedor</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Casos trabados (&ge;5 días)</div>
          <div className="kpi-value alert">{kpis.stuck}</div>
          <div className="kpi-sub">Demorados en la misma etapa</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Sin avance (&ge;7 días)</div>
          <div className="kpi-value alert">{kpis.noAdvance}</div>
          <div className="kpi-sub">Una semana sin cambiar de etapa</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Reclamos a Cías.</div>
          <div className="kpi-value alert">{kpis.claims}</div>
          <div className="kpi-sub">Seguros sin pagar a tiempo</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Facturado sin cobrar</div>
          <div className="kpi-value">{formatMoneda(kpis.pendingCash)}</div>
          <div className="kpi-sub">(Visible para Dueño)</div>
        </div>
      </section>

      {/* 3. Controls Bar exactamente en la misma ubicación */}
      <div className="controls-bar">
        <div className="tabs-nav" role="tablist">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'casos' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'casos'}
            onClick={() => setActiveTab('casos')}
          >
            Casos de Taller
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'stock'}
            onClick={() => setActiveTab('stock')}
          >
            Control de Stock
          </button>
        </div>

        {activeTab === 'casos' && (
          <div className="filters-group" id="casosFilters">
            <span className="search-box">
              <span className="search-icon" aria-hidden="true">
                🔍
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por patente o cliente..."
                aria-label="Buscar por patente o cliente"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Limpiar búsqueda"
                  onClick={() => setSearchQuery('')}
                >
                  &times;
                </button>
              )}
            </span>

            <button
              type="button"
              className={`filter-pill ${currentFilter === 'todos' ? 'active' : ''}`}
              aria-pressed={currentFilter === 'todos'}
              onClick={() => setCurrentFilter('todos')}
            >
              Todos
            </button>
            <button
              type="button"
              className={`filter-pill ${currentFilter === 'seguro' ? 'active' : ''}`}
              aria-pressed={currentFilter === 'seguro'}
              onClick={() => setCurrentFilter('seguro')}
            >
              Seguro
            </button>
            <button
              type="button"
              className={`filter-pill ${currentFilter === 'particular' ? 'active' : ''}`}
              aria-pressed={currentFilter === 'particular'}
              onClick={() => setCurrentFilter('particular')}
            >
              Particular
            </button>

            <label className="stuck-toggle">
              <input
                type="checkbox"
                style={{ accentColor: 'var(--red)' }}
                checked={onlyStuck}
                onChange={(e) => setOnlyStuck(e.target.checked)}
              />
              Solo trabados (&ge;5d)
            </label>

            <div className="flex md:hidden items-center border border-graphite bg-white rounded overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setVistaForzada('tarjetas')}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                  modoMovil === 'tarjetas' ? 'bg-navy text-white' : 'text-graphite bg-transparent'
                }`}
              >
                📱 Tarjetas
              </button>
              <button
                type="button"
                onClick={() => setVistaForzada('tabla')}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                  modoMovil === 'tabla' ? 'bg-navy text-white' : 'text-graphite bg-transparent'
                }`}
              >
                📊 Tabla
              </button>
            </div>
          </div>
        )}

        {/* Botón "+ Nuevo caso" exactamente a la derecha de la barra de controles */}
        <button
          type="button"
          onClick={onOpenNuevoCaso}
          className="btn-nuevo-caso"
          style={{
            marginLeft: 'auto',
            background: 'var(--blue, #123a6b)',
            color: '#ffffff',
            border: '2px solid var(--graphite, #1b1d21)',
            padding: '8px 16px',
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '2px 2px 0 var(--graphite, #1b1d21)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          + Nuevo caso
        </button>
      </div>

      {/* 4. Sheet: Casos Tab */}
      {activeTab === 'casos' && (
        <>
          {/* Mobile Cards View */}
          {modoMovil === 'tarjetas' && (
            <div className="planilla-cards-mobile block md:hidden">
              {filteredCasos.length === 0 ? (
                <div className="p-6 text-center text-steel-500 font-mono text-sm bg-white border-2 border-steel-300">
                  No hay casos para este filtro.
                </div>
              ) : (
                filteredCasos.map((caso) => {
                  const level = getStuckLevel(caso as any)
                  const dias = getDiasEtapa(caso as any)
                  const map = STATE_MAPPING[caso.estado] || { idx: 0, kind: 'waiting' }
                  const currentStage = STAGES[map.idx] || STAGES[0]

                  return (
                    <div
                      key={`card-${caso.id}`}
                      className={`caso-card-mobile ${level === 'critical' ? 'row-critical' : ''}`}
                      onClick={() => setSelectedCasoId(caso.id)}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-mono text-lg font-bold tracking-wide ${
                              level === 'critical' ? 'text-red' : 'text-navy'
                            }`}
                          >
                            {caso.patente}
                          </span>
                          <span className="ot-tag">{caso.orden_numero}</span>
                        </div>
                        <span className={`channel-badge ${caso.canal}`}>
                          {caso.canal === 'seguro' ? 'Seguro' : 'Particular'}
                        </span>
                      </div>

                      <div className="text-xs text-graphite flex flex-wrap gap-x-3 gap-y-1 mb-2.5 font-sans">
                        <span>🚗 <strong>{caso.vehiculo_marca_modelo}</strong></span>
                        <span>👤 {caso.cliente_nombre}</span>
                        {caso.aseguradora && <span className="text-steel-600">🏢 {caso.aseguradora}</span>}
                      </div>

                      <div className="bg-steel-100 border border-steel-200 p-2.5 rounded flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-white shrink-0"
                            style={{ background: STAGE_COLORS[map.idx]?.border || '#123a6b' }}
                          >
                            {map.idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-navy truncate block">
                              {currentStage.label}
                            </span>
                            <span className="text-[10px] text-steel-500 font-mono block">
                              Etapa actual
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`font-mono text-xs font-bold ${
                              level === 'critical' ? 'text-red' : level === 'warning' ? 'text-brass' : 'text-steel-600'
                            }`}
                          >
                            {caso.estado === 'cobrado' ? '-' : `${dias}d`}
                          </span>
                          {level === 'critical' && (
                            <span className="stall-badge block text-[9px] mt-0.5">
                              ⚠ 1 sem. sin avance
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mini-pipeline" title="Progreso de 9 etapas del caso">
                        {STAGES.map((s, sIdx) => {
                          let dotClass = 'future'
                          if (sIdx < map.idx) dotClass = 'done'
                          else if (sIdx === map.idx) {
                            if (map.kind === 'blocked') dotClass = 'alert'
                            else if (map.kind === 'parts') dotClass = 'parts'
                            else if (map.kind === 'waiting') dotClass = 'waiting'
                            else dotClass = 'active'
                          }
                          return (
                            <div
                              key={s.id}
                              className={`mini-pipe-dot ${dotClass}`}
                              title={`${sIdx + 1}. ${s.shortLabel}`}
                            />
                          )
                        })}
                      </div>

                      <div className="mt-2 text-right">
                        <span className="text-[11px] font-mono font-bold text-blue hover:underline">
                          Ver detalle y fotos →
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Desktop Table View */}
          {modoMovil === 'tabla' && (
            <section
              className="sheet-wrapper block"
              aria-label="Planilla de casos de taller"
            >
              <table className="sheet-table">
                <thead>
                  <tr>
                    <th className="sticky-col" style={{ color: '#ffffff' }}>
                      Patente / OT
                    </th>
                    <th className="th-info" style={{ minWidth: '140px' }}>
                      Cliente
                    </th>
                    <th className="th-info" style={{ minWidth: '90px' }}>
                      Canal
                    </th>
                    <th className="th-info" style={{ minWidth: '130px' }}>
                      Aseguradora
                    </th>
                    {STAGES.map((s, idx) => (
                      <th key={s.id} className="th-stage" title={`${s.label}: ${s.desc}`}>
                        <span
                          className="th-stage-num"
                          style={{ background: STAGE_COLORS[idx].border, color: '#fff' }}
                        >
                          {idx + 1}
                        </span>
                        <span className="th-stage-label">{s.shortLabel}</span>
                      </th>
                    ))}
                    <th
                      className="th-info"
                      style={{ width: '70px', textAlign: 'center' }}
                      title="Días transcurridos en la etapa actual"
                    >
                      Días
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCasos.length === 0 ? (
                    <tr>
                      <td colSpan={14} style={{ textAlign: 'center', padding: '28px', color: '#68737d' }}>
                        No hay casos para este filtro.
                      </td>
                    </tr>
                  ) : (
                    filteredCasos.map((caso) => {
                      const level = getStuckLevel(caso as any)
                      const dias = getDiasEtapa(caso as any)

                      return (
                        <tr
                          key={caso.id}
                          className={`${level === 'critical' ? 'row-critical' : ''}`}
                          tabIndex={0}
                          role="button"
                          aria-label={`Abrir caso ${caso.patente}`}
                          onClick={() => setSelectedCasoId(caso.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedCasoId(caso.id)
                            }
                          }}
                        >
                          <td className="sticky-col">
                            <span className={`patente-cell ${level === 'critical' ? 'alert-text' : ''}`}>
                              {caso.patente}
                            </span>
                            <span className="ot-tag">{caso.orden_numero}</span>
                          </td>
                          <td>
                            <div className={`client-name ${level === 'critical' ? 'alert-text' : ''}`} title={caso.cliente_nombre}>
                              {caso.cliente_nombre}
                            </div>
                            {level === 'critical' && (
                              <span className="stall-badge" title="Sin cambio de etapa hace 7 días o más">
                                ⚠ 1 sem. sin avance
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`channel-badge ${caso.canal}`}>
                              {caso.canal === 'seguro' ? 'Seguro' : 'Partic.'}
                            </span>
                          </td>
                          <td>
                            <span className="aseg-name">{caso.aseguradora || 'Pago directo'}</span>
                          </td>
                          {STAGES.map((_, idx) => renderStageCell(caso, idx))}
                          <td className={`days-cell ${level !== 'none' ? level : ''}`}>
                            {caso.estado === 'cobrado' ? '-' : `${dias}d`}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </section>
          )}
        </>
      )}

      {/* 5. Sheet: Stock Tab */}
      {activeTab === 'stock' && (
        <section className="stock-wrapper" aria-label="Control de stock">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Código / Ítem</th>
                <th>Categoría</th>
                <th style={{ textAlign: 'center' }}>En Stock</th>
                <th style={{ textAlign: 'center' }}>Mínimo Sugerido</th>
                <th>Estado</th>
                <th>Observaciones / Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono, monospace)' }}>{item.nombre}</strong>
                    <span className="block text-[10px] text-steel-500 font-mono">{item.codigo}</span>
                  </td>
                  <td>
                    <span className="channel-badge seguro">{item.categoria}</span>
                  </td>
                  <td
                    style={{
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {item.cantidad_actual}
                  </td>
                  <td
                    style={{
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono, monospace)',
                      color: '#68737d',
                    }}
                  >
                    {item.cantidad_minima}
                  </td>
                  <td>
                    <span
                      className={`stock-status ${
                        item.estado === 'OK' ? 'ok' : item.estado === 'Bajo' ? 'bajo' : 'faltante'
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#4e5964' }}>
                    Depósito general de taller mecánico y carrocería
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 16px', background: '#f8fafb', borderTop: '1px solid var(--steel-300)' }}>
            <button
              type="button"
              className="filter-pill"
              onClick={() => onNavigateTab?.('stock')}
              style={{ background: 'var(--navy)', color: '#fff' }}
            >
              Administrar Insumos y Repuestos &rarr;
            </button>
          </div>
        </section>
      )}

      {/* 6. Legend Card exactamente igual a producción */}
      <section className="legend-card" aria-label="Leyenda de colores">
        <span className="legend-title">Semáforo:</span>
        <div className="legend-items">
          <span className="legend-item">
            <span className="cell-dot done" style={{ width: '18px', height: '18px', fontSize: '0.6rem' }}>
              ✓
            </span>{' '}
            Completado
          </span>
          <span className="legend-item">
            <span className="cell-dot active" style={{ width: '18px', height: '18px', fontSize: '0.6rem' }}>
              •
            </span>{' '}
            En proceso activo (Taller/Recepción)
          </span>
          <span className="legend-item">
            <span className="cell-dot waiting" style={{ width: '18px', height: '18px', fontSize: '0.6rem' }}>
              •
            </span>{' '}
            En espera externa (Aseguradora/Turno)
          </span>
          <span className="legend-item">
            <span
              className="cell-dot parts"
              style={{ width: 'auto', height: '18px', fontSize: '0.55rem', padding: '0 3px' }}
            >
              REP
            </span>{' '}
            Falta repuesto proveedor
          </span>
          <span className="legend-item">
            <span className="cell-dot blocked" style={{ width: '18px', height: '18px', fontSize: '0.6rem' }}>
              ✕
            </span>{' '}
            Reclamo / Bloqueado
          </span>
          <span className="legend-item">
            <span className="cell-dot future" style={{ width: '18px', height: '18px', fontSize: '0.6rem' }}>
              -
            </span>{' '}
            Pendiente
          </span>
        </div>
        <div className="legend-items" style={{ marginTop: '6px' }}>
          <span className="legend-item" style={{ gap: '6px' }}>
            <span style={{ display: 'inline-flex' }}>
              <span style={{ width: '14px', height: '14px', background: 'hsl(0,60%,42%)' }}></span>
              <span style={{ width: '14px', height: '14px', background: 'hsl(31,60%,42%)' }}></span>
              <span style={{ width: '14px', height: '14px', background: 'hsl(63,55%,38%)' }}></span>
              <span style={{ width: '14px', height: '14px', background: 'hsl(94,55%,38%)' }}></span>
              <span style={{ width: '14px', height: '14px', background: 'hsl(125,55%,38%)' }}></span>
            </span>
            Color de columna = etapa del proceso (rojo &rarr; verde)
          </span>
          <span className="legend-item">
            <span className="stall-badge" style={{ marginTop: 0 }}>
              ⚠ 1 sem.
            </span>{' '}
            Sin cambio de etapa hace 7+ días
          </span>
        </div>
      </section>

      {/* 7. Drawer Detail Modal exactamente igual a producción */}
      {selectedCaso && (
        <div
          className="drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCasoId(null)
          }}
        >
          <aside className="drawer" aria-label="Detalle del caso" aria-modal="true" role="dialog">
            <div className="drawer-head">
              <h3>
                {selectedCaso.patente} · {selectedCaso.orden_numero}
              </h3>
              <button
                type="button"
                className="close-button"
                aria-label="Cerrar detalle"
                onClick={() => setSelectedCasoId(null)}
              >
                &times;
              </button>
            </div>

            <div className="drawer-body">
              {/* Acciones operativas de etapa */}
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', marginBottom: '12px' }}>
                {selectedCaso.estado === 'borrador' && (
                  <button
                    type="button"
                    className="filter-pill"
                    style={{
                      background: 'var(--blue)',
                      color: '#fff',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderColor: 'var(--blue)',
                    }}
                    onClick={() => {
                      avanzarEtapa(selectedCaso.id, 'enviado a la aseguradora')
                    }}
                  >
                    📸 Avanzar: Enviar Presupuesto con Fotos a Compañía &rarr;
                  </button>
                )}

                {selectedCaso.estado === 'enviado a la aseguradora' && (
                  <button
                    type="button"
                    className="filter-pill"
                    style={{
                      background: 'var(--green, #2e7d32)',
                      color: '#fff',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderColor: 'var(--green, #2e7d32)',
                    }}
                    onClick={() => {
                      avanzarEtapa(selectedCaso.id, 'aprobado')
                    }}
                  >
                    ✓ Aprobar Presupuesto / Generar Orden &rarr;
                  </button>
                )}

                {selectedCaso.estado === 'aprobado' && (
                  <button
                    type="button"
                    className="filter-pill"
                    style={{
                      background: 'var(--blue)',
                      color: '#fff',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderColor: 'var(--blue)',
                    }}
                    onClick={() => {
                      avanzarEtapa(selectedCaso.id, 'turno coordinado')
                    }}
                  >
                    📅 Coordinar Turno de Ingreso &rarr;
                  </button>
                )}

                {selectedCaso.estado === 'turno coordinado' && (
                  <button
                    type="button"
                    className="filter-pill"
                    style={{
                      background: 'var(--blue)',
                      color: '#fff',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderColor: 'var(--blue)',
                    }}
                    onClick={() => {
                      avanzarEtapa(selectedCaso.id, 'ingresado')
                    }}
                  >
                    🚗 Registrar Ingreso al Taller con Checklist &rarr;
                  </button>
                )}

                {selectedCaso.estado === 'ingresado' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="filter-pill flex-1"
                      style={{
                        background: 'var(--navy)',
                        color: '#fff',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        borderColor: 'var(--navy)',
                      }}
                      onClick={() => {
                        avanzarEtapa(selectedCaso.id, 'en reparación')
                      }}
                    >
                      🔧 Pasar a Reparación &rarr;
                    </button>
                    <button
                      type="button"
                      className="filter-pill"
                      style={{
                        background: 'var(--brass)',
                        color: '#fff',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        borderColor: 'var(--brass)',
                      }}
                      onClick={() => {
                        const rep = prompt('Ingrese el repuesto faltante:', 'Filtros y bujías')
                        if (rep) marcarEsperandoRepuesto(selectedCaso.id, rep)
                      }}
                    >
                      Falta Repuesto
                    </button>
                  </div>
                )}

                {selectedCaso.estado === 'esperando repuesto' && (
                  <button
                    type="button"
                    className="filter-pill"
                    style={{
                      background: 'var(--green, #2e7d32)',
                      color: '#fff',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderColor: 'var(--green, #2e7d32)',
                    }}
                    onClick={() => {
                      avanzarEtapa(selectedCaso.id, 'en reparación')
                    }}
                  >
                    ✓ Repuesto Recibido: Reanudar Reparación &rarr;
                  </button>
                )}

                {selectedCaso.estado === 'en reparación' && (
                  <button
                    type="button"
                    className="filter-pill"
                    style={{
                      background: 'var(--green, #2e7d32)',
                      color: '#fff',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderColor: 'var(--green, #2e7d32)',
                    }}
                    onClick={() => {
                      avanzarEtapa(selectedCaso.id, 'listo para firma')
                    }}
                  >
                    ✓ Trabajo Finalizado: Listo para Entrega y Firma &rarr;
                  </button>
                )}

                {selectedCaso.estado === 'listo para firma' && (
                  <button
                    type="button"
                    className="filter-pill"
                    style={{
                      background: 'var(--green, #2e7d32)',
                      color: '#fff',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderColor: 'var(--green, #2e7d32)',
                    }}
                    onClick={() => {
                      avanzarEtapa(selectedCaso.id, 'firmado')
                    }}
                  >
                    ✍️ Registrar Firma de Conformidad del Cliente &rarr;
                  </button>
                )}

                {['firmado', 'facturado', 'reclamo a la compañía'].includes(selectedCaso.estado) && (
                  <button
                    type="button"
                    className="filter-pill"
                    style={{
                      background: 'var(--navy)',
                      color: '#fff',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      borderColor: 'var(--navy)',
                    }}
                    onClick={() => {
                      setSelectedCasoId(null)
                      onNavigateTab?.('facturacion')
                    }}
                  >
                    💰 Ir a Facturación & Cobro ARCA &rarr;
                  </button>
                )}
              </div>

              {/* Data Grid */}
              <section className="ticket-panel">
                <div className="detail-grid">
                  <div className="field">
                    <span>Vehículo</span>
                    <strong>{selectedCaso.vehiculo_marca_modelo} ({selectedCaso.vehiculo_ano})</strong>
                  </div>
                  <div className="field">
                    <span>Cliente</span>
                    <strong>{selectedCaso.cliente_nombre}</strong>
                  </div>
                  <div className="field">
                    <span>Teléfono</span>
                    <strong>{selectedCaso.cliente_telefono}</strong>
                  </div>
                  <div className="field">
                    <span>Canal</span>
                    <strong>{selectedCaso.canal === 'seguro' ? 'Seguro' : 'Particular'}</strong>
                  </div>
                  <div className="field">
                    <span>Aseguradora</span>
                    <strong>{selectedCaso.aseguradora || 'No aplica (directo)'}</strong>
                  </div>
                  <div className="field">
                    <span>N° Siniestro / Denuncia</span>
                    <strong>{selectedCaso.numero_siniestro || selectedCaso.denuncia || '-'}</strong>
                  </div>
                  <div className="field">
                    <span>Kilometraje</span>
                    <strong>{selectedCaso.kilometraje ? `${selectedCaso.kilometraje.toLocaleString()} km` : 'No registrado'}</strong>
                  </div>
                  <div className="field">
                    <span>Combustible</span>
                    <strong>{selectedCaso.combustible || '1/2 tanque'}</strong>
                  </div>
                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <span>Falla Reportada / Trabajo Solicitado</span>
                    <strong style={{ color: 'var(--navy)' }}>{selectedCaso.falla_reportada}</strong>
                  </div>
                  {selectedCaso.repuesto_faltante && (
                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: 'var(--red)' }}>Repuesto Pendiente</span>
                      <strong style={{ color: 'var(--red)' }}>{selectedCaso.repuesto_faltante}</strong>
                    </div>
                  )}
                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <span>Días en Etapa Actual ({selectedCaso.estado})</span>
                    <strong>{selectedCaso.dias_en_etapa} días</strong>
                  </div>
                </div>
              </section>

              {/* Bosquejo del Vehículo */}
              <section className="ticket-panel">
                <span className="kicker">Inspección de Carrocería (16 Zonas)</span>
                <BosquejoVehiculo zonasSeleccionadas={selectedCaso.zonas_dano || []} readOnly />
              </section>

              {/* 9-stage pipeline */}
              <section className="ticket-panel">
                <span className="kicker">Cadena de Aprobación de 9 Etapas</span>
                <div className="pipeline-steps">
                  {STAGES.map((s, idx) => {
                    const map = STATE_MAPPING[selectedCaso.estado] || { idx: 0, kind: 'waiting' }
                    let stepClass = ''
                    let icon = '○'
                    let note = 'Pendiente'

                    if (idx < map.idx) {
                      stepClass = 'done'
                      icon = '✓'
                      note = 'Completado'
                    } else if (idx === map.idx) {
                      if (map.kind === 'parts') {
                        stepClass = 'warning'
                        icon = '!'
                        note = `Falta repuesto: ${selectedCaso.repuesto_faltante || 'Solicitado'}`
                      } else if (map.kind === 'blocked') {
                        stepClass = 'alert'
                        icon = '✕'
                        note = 'Reclamo abierto a aseguradora'
                      } else {
                        stepClass = 'active'
                        icon = '•'
                        note = 'En curso'
                      }
                    }

                    return (
                      <div key={s.id} className={`pipe-step ${stepClass}`}>
                        <div className="pipe-icon">{icon}</div>
                        <div className="pipe-info">
                          <strong>{s.label}</strong>
                          <span className="pipe-role">[{s.role}]</span>
                          <p>{note}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Desglose financiero */}
              <section className="ticket-panel">
                <span className="kicker">Importes y Facturación</span>
                <div className="detail-grid">
                  <div className="field">
                    <span>Presupuesto Aprobado</span>
                    <strong>{formatMoneda(selectedCaso.presupuesto_monto)}</strong>
                  </div>
                  <div className="field">
                    <span>Facturado</span>
                    <strong>{formatMoneda(selectedCaso.facturado_monto || (['facturado', 'cobrado'].includes(selectedCaso.estado) ? selectedCaso.presupuesto_monto : 0))}</strong>
                  </div>
                  <div className="field">
                    <span>Cobrado</span>
                    <strong style={{ color: 'var(--green, #2e7d32)' }}>
                      {formatMoneda(selectedCaso.cobrado_monto || (selectedCaso.estado === 'cobrado' ? selectedCaso.presupuesto_monto : 0))}
                    </strong>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
