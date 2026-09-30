import React, { useState } from 'react'
import { useDemoStore } from '../context/DemoStoreContext'
import type { TipoServicioId, ZonaDano } from '../types/taller'
import { TIPOS_SERVICIO } from '../types/taller'
import { InspeccionVehicular16Zonas } from './InspeccionVehicular16Zonas'
import { X, CheckCircle, Wrench, Shield, Car, User } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const ModalNuevoCaso: React.FC<Props> = ({ isOpen, onClose }) => {
  const { crearCaso } = useDemoStore()

  const [tipoServicio, setTipoServicio] = useState<TipoServicioId>('mecanica_general')
  const [canal, setCanal] = useState<'particular' | 'seguro'>('particular')
  const [patente, setPatente] = useState('')
  const [marcaModelo, setMarcaModelo] = useState('')
  const [ano, setAno] = useState(2022)
  const [kilometraje, setKilometraje] = useState<number | undefined>(45000)
  const [combustible, setCombustible] = useState<'1/4' | '1/2' | '3/4' | 'Lleno'>('1/2')
  const [clienteNombre, setClienteNombre] = useState('')
  const [clienteTelefono, setClienteTelefono] = useState('')
  const [fallaReportada, setFallaReportada] = useState('')
  const [aseguradora, setAseguradora] = useState('La Segunda Seguros')
  const [numeroSiniestro, setNumeroSiniestro] = useState('')
  const [denuncia, setDenuncia] = useState('')
  const [presupuestoMonto, setPresupuestoMonto] = useState(150000)
  const [zonasDano, setZonasDano] = useState<ZonaDano[]>([])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patente.trim() || !clienteNombre.trim()) {
      alert('Por favor complete patente y nombre del cliente.')
      return
    }

    crearCaso({
      patente: patente.toUpperCase().trim(),
      vehiculo_marca_modelo: marcaModelo.trim() || 'Vehículo sin especificar',
      vehiculo_ano: ano,
      kilometraje: kilometraje || undefined,
      combustible,
      cliente_nombre: clienteNombre.trim(),
      cliente_telefono: clienteTelefono.trim(),
      canal,
      tipo_servicio: tipoServicio,
      falla_reportada: fallaReportada.trim() || 'Sin detalle de falla inicial',
      aseguradora: canal === 'seguro' ? aseguradora : undefined,
      numero_siniestro: canal === 'seguro' && numeroSiniestro ? numeroSiniestro.trim() : undefined,
      denuncia: canal === 'seguro' && denuncia ? denuncia.trim() : undefined,
      estado: 'borrador',
      zonas_dano: zonasDano,
      presupuesto_monto: presupuestoMonto,
      inspeccion_guardada: zonasDano.length > 0
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#123a6b] text-white px-5 py-3.5 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-white/10">
              <Car size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-display uppercase text-lg font-bold leading-tight">
                Ingreso de Nuevo Vehículo / Orden de Trabajo
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                Recepción técnica, datos del cliente e inspección de estado exterior
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-6">
          {/* 1. Tipo de Servicio y Canal */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-bold uppercase text-slate-800">
              1. Seleccionar Tipo de Servicio del Taller *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {TIPOS_SERVICIO.map(t => {
                const activo = tipoServicio === t.id
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => {
                      setTipoServicio(t.id)
                      if (t.id === 'siniestro_seguro') setCanal('seguro')
                    }}
                    className={`p-3 rounded-lg border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                      activo
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">{t.label}</span>
                      {activo && <CheckCircle size={16} className="text-blue-600 shrink-0" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Canal Switcher */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-mono text-slate-600">Canal de pago:</span>
              <label className="inline-flex items-center gap-1.5 text-xs font-mono cursor-pointer">
                <input
                  type="radio"
                  name="canal"
                  checked={canal === 'particular'}
                  onChange={() => setCanal('particular')}
                  className="text-blue-600"
                />
                <span className="font-semibold">Particular</span>
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs font-mono cursor-pointer">
                <input
                  type="radio"
                  name="canal"
                  checked={canal === 'seguro'}
                  onChange={() => setCanal('seguro')}
                  className="text-blue-600"
                />
                <span className="font-semibold text-blue-900">Compañía de Seguro</span>
              </label>
            </div>
          </div>

          {/* 2. Datos del Vehículo */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Wrench size={14} className="text-blue-600" />
              <span>2. Datos del Vehículo e Ingreso</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Patente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: AF 123 CD"
                  value={patente}
                  onChange={e => setPatente(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm font-mono border rounded uppercase border-slate-300 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Marca y Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Toyota Hilux 2.8 / VW Gol 1.6"
                  value={marcaModelo}
                  onChange={e => setMarcaModelo(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border rounded border-slate-300 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Año</label>
                <input
                  type="number"
                  value={ano}
                  onChange={e => setAno(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm font-mono border rounded border-slate-300 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Kilometraje</label>
                <input
                  type="number"
                  placeholder="Ej: 54000"
                  value={kilometraje || ''}
                  onChange={e => setKilometraje(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-1.5 text-sm font-mono border rounded border-slate-300 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Combustible al Ingreso</label>
                <select
                  value={combustible}
                  onChange={e => setCombustible(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-sm font-mono border rounded border-slate-300 bg-white focus:border-blue-600 focus:outline-none"
                >
                  <option value="1/4">1/4 de Tanque</option>
                  <option value="1/2">1/2 Tanque</option>
                  <option value="3/4">3/4 de Tanque</option>
                  <option value="Lleno">Tanque Lleno</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Presupuesto Estimado ($)</label>
                <input
                  type="number"
                  value={presupuestoMonto}
                  onChange={e => setPresupuestoMonto(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm font-mono border rounded border-slate-300 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Motivo de Ingreso / Fallas o Trabajos Solicitados
              </label>
              <textarea
                rows={2}
                placeholder="Describí los síntomas mecánicos o los detalles de chapa/granizo..."
                value={fallaReportada}
                onChange={e => setFallaReportada(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border rounded border-slate-300 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Datos del Cliente y Seguro */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <User size={14} className="text-blue-600" />
              <span>3. Datos del Cliente {canal === 'seguro' && 'y Aseguradora'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcelo Fernández"
                  value={clienteNombre}
                  onChange={e => setClienteNombre(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border rounded border-slate-300 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+54 9 11 0000-0000"
                  value={clienteTelefono}
                  onChange={e => setClienteTelefono(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm font-mono border rounded border-slate-300 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {canal === 'seguro' && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-md mt-2 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-900 font-bold">
                  <Shield size={14} />
                  <span>Datos de Compañía de Seguros (Alta Flexible en Borrador)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1">Aseguradora *</label>
                    <select
                      value={aseguradora}
                      onChange={e => setAseguradora(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border rounded bg-white border-slate-300"
                    >
                      <option value="La Segunda Seguros">La Segunda Seguros</option>
                      <option value="Federación Patronal">Federación Patronal</option>
                      <option value="Sancor Seguros">Sancor Seguros</option>
                      <option value="San Cristóbal">San Cristóbal</option>
                      <option value="Mapfre Argentina">Mapfre Argentina</option>
                      <option value="Rivadavia Seguros">Rivadavia Seguros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1">Nº Siniestro (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: SIN-88123"
                      value={numeroSiniestro}
                      onChange={e => setNumeroSiniestro(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border rounded border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1">Nº Denuncia (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: DEN-2026-X"
                      value={denuncia}
                      onChange={e => setDenuncia(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border rounded border-slate-300"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Inspección de 16 Zonas */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-bold uppercase text-slate-800">
              4. Relevamiento Exterior de Carrocería (16 Paneles)
            </h3>
            <InspeccionVehicular16Zonas
              zonas={zonasDano}
              onChangeZonas={setZonasDano}
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-slate-600 hover:bg-slate-100 rounded border border-slate-300 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase rounded shadow-sm transition cursor-pointer"
            >
              Guardar e Ingresar al Taller
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
