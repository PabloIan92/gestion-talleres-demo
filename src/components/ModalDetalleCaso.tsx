import React, { useState } from 'react'
import { useDemoStore } from '../context/DemoStoreContext'
import type { CasoDemo, EtapaCaso } from '../types/taller'
import { ETAPAS_CASO, TIPOS_SERVICIO } from '../types/taller'
import { BosquejoVehiculo } from './BosquejoVehiculo'
import { X, Clock, AlertTriangle, CheckCircle, FileText, Wrench, Shield, DollarSign, PenTool } from 'lucide-react'

interface Props {
  caso: CasoDemo | null
  onClose: () => void
}

export const ModalDetalleCaso: React.FC<Props> = ({ caso, onClose }) => {
  const { rol, avanzarEtapa, marcarEsperandoRepuesto, actualizarCaso } = useDemoStore()

  const [repuestoInput, setRepuestoInput] = useState('')
  const [showRepuestoModal, setShowRepuestoModal] = useState(false)
  const [showFirmaModal, setShowFirmaModal] = useState(false)
  const [firmaRealizada, setFirmaRealizada] = useState(false)

  // Edit fields for insurance
  const [editSiniestro, setEditSiniestro] = useState(caso?.numero_siniestro || '')
  const [editDenuncia, setEditDenuncia] = useState(caso?.denuncia || '')

  if (!caso) return null

  const tipoServicioLabel = TIPOS_SERVICIO.find(t => t.id === caso.tipo_servicio)?.label || 'Servicio General'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-300 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-[#123a6b] text-white px-5 py-4 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-bold">
                {caso.orden_numero}
              </span>
              <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded uppercase">
                {caso.patente}
              </span>
            </div>
            <h2 className="font-display uppercase text-lg sm:text-xl font-bold mt-1">
              {caso.vehiculo_marca_modelo} ({caso.vehiculo_ano})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {/* Timeline de Etapas */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <h4 className="text-[11px] font-mono uppercase font-bold text-slate-500 mb-2 flex items-center gap-1.5">
              <Clock size={13} />
              <span>Etapa actual del vehículo:</span>
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase bg-blue-600 text-white shadow-xs">
                {caso.estado}
              </span>
              <span className="text-xs font-mono text-slate-500">
                (Lleva {caso.dias_en_etapa} {caso.dias_en_etapa === 1 ? 'día' : 'días'} en esta etapa)
              </span>
            </div>

            {/* Repuesto Faltante Alert if applicable */}
            {caso.estado === 'esperando repuesto' && caso.repuesto_faltante && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded text-xs font-mono text-amber-900 flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">REPUESTO FALTANTE REGISTRADO:</strong>
                  <span>{caso.repuesto_faltante}</span>
                </div>
              </div>
            )}
          </div>

          {/* Ficha Técnica del Vehículo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Tipo Servicio:</span>
              <strong className="text-slate-900 font-semibold">{tipoServicioLabel}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Kilometraje:</span>
              <strong className="text-slate-900 font-semibold">{caso.kilometraje ? `${caso.kilometraje.toLocaleString()} km` : 'No reg.'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Combustible:</span>
              <strong className="text-slate-900 font-semibold">{caso.combustible || '1/2'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Canal:</span>
              <strong className="uppercase text-blue-800 font-bold">{caso.canal}</strong>
            </div>
          </div>

          {/* Cliente y Tareas */}
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="font-mono text-slate-500 block">Cliente:</span>
              <strong className="font-sans text-sm text-slate-900 block">{caso.cliente_nombre}</strong>
              <span className="font-mono text-slate-600">{caso.cliente_telefono}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="font-mono text-slate-500 block">Trabajo / Falla reportada:</span>
              <p className="font-sans text-sm text-slate-800 mt-0.5 leading-relaxed">{caso.falla_reportada}</p>
            </div>

            {/* Seguro section if applicable */}
            {caso.canal === 'seguro' && (
              <div className="bg-blue-50/80 p-3.5 rounded-lg border border-blue-200 text-xs font-mono space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Shield size={14} />
                  <span>Aseguradora: {caso.aseguradora}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500 block">Siniestro:</span>
                    <strong className="text-slate-800">{caso.numero_siniestro || 'Pendiente de carga'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Denuncia:</span>
                    <strong className="text-slate-800">{caso.denuncia || 'Pendiente de carga'}</strong>
                  </div>
                </div>

                {/* Inline edit for siniestro/denuncia */}
                {(!caso.numero_siniestro || !caso.denuncia) && (
                  <div className="pt-2 border-t border-blue-200 space-y-1.5">
                    <span className="text-[11px] text-blue-800 font-bold block">Completar datos de siniestro ahora:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nº Siniestro"
                        value={editSiniestro}
                        onChange={e => setEditSiniestro(e.target.value)}
                        className="px-2 py-1 text-xs bg-white border rounded border-slate-300"
                      />
                      <input
                        type="text"
                        placeholder="Nº Denuncia"
                        value={editDenuncia}
                        onChange={e => setEditDenuncia(e.target.value)}
                        className="px-2 py-1 text-xs bg-white border rounded border-slate-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        actualizarCaso(caso.id, {
                          numero_siniestro: editSiniestro.trim() || undefined,
                          denuncia: editDenuncia.trim() || undefined
                        })
                      }}
                      className="px-2.5 py-1 bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer hover:bg-blue-800"
                    >
                      Guardar datos de seguro
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bosquejo de 16 Zonas */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold uppercase text-slate-800">
              Inspección Exterior de Daños / Intervenciones:
            </h4>
            <BosquejoVehiculo
              zonasSeleccionadas={caso.zonas_dano}
              readOnly={true}
            />
            <div className="text-xs font-mono text-slate-600">
              Paneles marcados ({caso.zonas_dano.length}):{' '}
              <span className="font-semibold text-slate-900">
                {caso.zonas_dano.length > 0 ? caso.zonas_dano.join(', ') : 'Ninguno (sin daños exteriores)'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions by Role */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 shrink-0 space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase flex items-center justify-between">
            <span>Acciones Operativas (Visto por: <strong>{rol.toUpperCase()}</strong>)</span>
            <span>Presupuesto: <strong>${caso.presupuesto_monto.toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* TALLER ACTIONS */}
            {rol === 'taller' && (
              <>
                {caso.estado === 'ingresado' && (
                  <button
                    onClick={() => avanzarEtapa(caso.id, 'en reparación')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    Comenzar Reparación
                  </button>
                )}

                {caso.estado === 'en reparación' && (
                  <>
                    <button
                      onClick={() => setShowRepuestoModal(true)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5"
                    >
                      <AlertTriangle size={14} />
                      <span>Esperando Repuesto</span>
                    </button>
                    <button
                      onClick={() => avanzarEtapa(caso.id, 'listo para firma')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Listo para Firma
                    </button>
                  </>
                )}

                {caso.estado === 'esperando repuesto' && (
                  <button
                    onClick={() => avanzarEtapa(caso.id, 'en reparación')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    Llegó Repuesto → Retomar Trabajo
                  </button>
                )}
              </>
            )}

            {/* RECEPCION ACTIONS */}
            {rol === 'recepcion' && (
              <>
                {caso.estado === 'borrador' && (
                  <button
                    onClick={() => avanzarEtapa(caso.id, caso.canal === 'seguro' ? 'enviado a la aseguradora' : 'turno coordinado')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    {caso.canal === 'seguro' ? 'Enviar a Aseguradora' : 'Coordinar Turno'}
                  </button>
                )}

                {caso.estado === 'turno coordinado' && (
                  <button
                    onClick={() => avanzarEtapa(caso.id, 'ingresado')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    Ingresar Vehículo al Taller
                  </button>
                )}

                {caso.estado === 'listo para firma' && (
                  <button
                    onClick={() => setShowFirmaModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5"
                  >
                    <PenTool size={14} />
                    <span>Firma de Entrega del Cliente</span>
                  </button>
                )}
              </>
            )}

            {/* DUEÑO ACTIONS */}
            {rol === 'dueno' && (
              <>
                {caso.estado === 'firmado' && (
                  <button
                    onClick={() => {
                      actualizarCaso(caso.id, {
                        estado: 'facturado',
                        facturado_monto: caso.presupuesto_monto,
                        dias_en_etapa: 0
                      })
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>Emitir Factura (${caso.presupuesto_monto.toLocaleString()})</span>
                  </button>
                )}

                {caso.estado === 'facturado' && (
                  <>
                    <button
                      onClick={() => {
                        actualizarCaso(caso.id, {
                          estado: 'cobrado',
                          cobrado_monto: caso.presupuesto_monto,
                          dias_en_etapa: 0
                        })
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer flex items-center gap-1.5"
                    >
                      <DollarSign size={14} />
                      <span>Registrar Cobro Total</span>
                    </button>
                    {caso.canal === 'seguro' && (
                      <button
                        onClick={() => avanzarEtapa(caso.id, 'reclamo a la compañía')}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer"
                      >
                        Iniciar Reclamo Cía.
                      </button>
                    )}
                  </>
                )}

                {caso.estado === 'reclamo a la compañía' && (
                  <button
                    onClick={() => {
                      actualizarCaso(caso.id, {
                        estado: 'cobrado',
                        cobrado_monto: caso.presupuesto_monto,
                        dias_en_etapa: 0
                      })
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    Reclamo Resuelto → Cobrado
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal Esperando Repuesto */}
        {showRepuestoModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white p-5 rounded-lg max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-mono text-sm font-bold uppercase text-slate-900 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-600" />
                <span>Pausar Trabajo por Falta de Repuesto</span>
              </h3>
              <p className="text-xs text-slate-600 font-sans">
                Indicá qué pieza, filtro o repuesto mecánico/chapa falta para que el encargado gestione la compra.
              </p>
              <input
                type="text"
                placeholder="Ej: Bomba de agua / Pastillas de freno / Óptica delantera"
                value={repuestoInput}
                onChange={e => setRepuestoInput(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded border-slate-300 focus:outline-none focus:border-amber-600"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRepuestoModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (repuestoInput.trim()) {
                      marcarEsperandoRepuesto(caso.id, repuestoInput.trim())
                      setShowRepuestoModal(false)
                    }
                  }}
                  className="px-4 py-1.5 bg-amber-600 text-white text-xs font-mono font-bold uppercase rounded"
                >
                  Confirmar Pausa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Firma Entrega */}
        {showFirmaModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white p-5 rounded-lg max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="font-mono text-sm font-bold uppercase text-slate-900 flex items-center gap-2">
                <PenTool size={18} className="text-emerald-600" />
                <span>Firma de Retiro y Conformidad del Cliente</span>
              </h3>
              <p className="text-xs text-slate-600 font-sans">
                El cliente firma en pantalla certificando que retira el vehículo conforme con las tareas realizadas.
              </p>
              <div
                onClick={() => setFirmaRealizada(true)}
                className="h-28 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-100 transition"
              >
                {firmaRealizada ? (
                  <span className="font-display italic text-2xl text-blue-900 font-bold">
                    {caso.cliente_nombre} (Firmado)
                  </span>
                ) : (
                  <span className="text-xs font-mono text-slate-400">
                    Tocá aquí para simular firma táctil del cliente
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowFirmaModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  disabled={!firmaRealizada}
                  onClick={() => {
                    actualizarCaso(caso.id, { estado: 'firmado', dias_en_etapa: 0 })
                    setShowFirmaModal(false)
                  }}
                  className="px-4 py-1.5 bg-emerald-600 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase rounded cursor-pointer"
                >
                  Registrar Firma y Entregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
