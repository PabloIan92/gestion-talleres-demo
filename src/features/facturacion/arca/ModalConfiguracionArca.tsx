import { useState, useEffect } from 'react'
import {
  Building2,
  Key,
  CheckCircle2,
  AlertTriangle,
  X,
  HelpCircle,
  Zap,
} from 'lucide-react'
import type { ConfiguracionArca, ArcaAmbiente, ArcaTipoComprobante } from './types'
import { getArcaConfig, saveArcaConfig, DEFAULT_ARCA_CONFIG } from './storage'
import { probarConexionArca, formatearCuit, validarCuit } from './arcaService'

interface ModalConfiguracionArcaProps {
  isOpen: boolean
  onClose: () => void
  onConfigSaved?: (config: ConfiguracionArca) => void
}

export function ModalConfiguracionArca({
  isOpen,
  onClose,
  onConfigSaved,
}: ModalConfiguracionArcaProps) {
  const [config, setConfig] = useState<ConfiguracionArca>(DEFAULT_ARCA_CONFIG)
  const [probando, setProbando] = useState(false)
  const [testResult, setTestResult] = useState<{
    ok: boolean
    mensaje: string
    proximoComprobante?: number
    servidor?: string
  } | null>(null)
  const [guardadoExitoso, setGuardadoExitoso] = useState(false)
  const [mostrarAyuda, setMostrarAyuda] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const actual = getArcaConfig()
      setConfig(actual)
      setTestResult(null)
      setGuardadoExitoso(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleProbarConexion = async () => {
    setProbando(true)
    setTestResult(null)
    try {
      const res = await probarConexionArca(config)
      setTestResult(res)
    } catch (err: any) {
      setTestResult({
        ok: false,
        mensaje: err?.message || 'Error al conectar con los servidores de ARCA.',
      })
    } finally {
      setProbando(false)
    }
  }

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault()
    saveArcaConfig(config)
    setGuardadoExitoso(true)
    if (onConfigSaved) onConfigSaved(config)
    setTimeout(() => {
      onClose()
    }, 1200)
  }

  const handleFileUpload = (
    field: 'certificadoCrt' | 'clavePrivadaKey',
    file: File | undefined
  ) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setConfig((prev) => ({ ...prev, [field]: content }))
    }
    reader.readAsText(file)
  }

  const cuitValido = validarCuit(config.cuit)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-arca-title"
    >
      <div className="bg-white rounded-lg shadow-2xl border border-steel-300 w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[92dvh]">
        {/* Header */}
        <div className="bg-navy text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <h3 id="modal-arca-title" className="font-display uppercase text-base sm:text-lg tracking-wide m-0 text-white">
                Conexión ARCA (ex-AFIP)
              </h3>
              <p className="font-mono text-[11px] text-steel-300 m-0">
                Facturación Electrónica Web Services (WSFE v1.2)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-steel-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleGuardar} className="p-5 overflow-y-auto space-y-4">
          {/* Banner de Estado General */}
          <div className="flex items-center justify-between p-3 bg-steel-50 border border-steel-200 rounded">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${config.activo ? 'bg-emerald-500 animate-pulse' : 'bg-steel-400'}`} />
              <span className="font-mono text-xs font-bold uppercase text-navy">
                Estado del Módulo ARCA: {config.activo ? 'Habilitado' : 'Desactivado'}
              </span>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono">
              <input
                type="checkbox"
                checked={config.activo}
                onChange={(e) => setConfig((prev) => ({ ...prev, activo: e.target.checked }))}
                className="w-4 h-4 text-navy rounded border-steel-300 focus:ring-navy cursor-pointer"
              />
              <span className="text-graphite font-semibold">Activar facturación con ARCA</span>
            </label>
          </div>

          {/* CUIT & Punto de Venta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="arca-cuit" className="block text-xs font-mono font-bold uppercase text-steel-700 mb-1">
                CUIT del Emisor (Taller) *
              </label>
              <input
                id="arca-cuit"
                type="text"
                value={config.cuit}
                onChange={(e) => setConfig((prev) => ({ ...prev, cuit: e.target.value }))}
                placeholder="Ej: 30-71234567-8"
                className={`w-full px-3 py-2 text-sm font-mono border rounded focus:outline-none focus:ring-1 ${
                  config.cuit && !cuitValido ? 'border-red-500 bg-red-50/50' : 'border-steel-300 focus:border-navy'
                }`}
                required
              />
              {config.cuit && !cuitValido ? (
                <span className="text-[11px] text-red-600 font-sans mt-0.5 block">
                  CUIT con formato o dígito verificador inválido
                </span>
              ) : (
                <span className="text-[11px] text-steel-500 font-sans mt-0.5 block">
                  11 dígitos con o sin guiones ({formatearCuit(config.cuit)})
                </span>
              )}
            </div>

            <div>
              <label htmlFor="arca-pv" className="block text-xs font-mono font-bold uppercase text-steel-700 mb-1">
                Punto de Venta Habilitado *
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="arca-pv"
                  type="number"
                  min="1"
                  max="99998"
                  value={config.puntoVenta || ''}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      puntoVenta: Math.max(1, parseInt(e.target.value, 10) || 1),
                    }))
                  }
                  placeholder="Ej: 1"
                  className="w-24 px-3 py-2 text-sm font-mono border border-steel-300 rounded focus:outline-none focus:border-navy"
                  required
                />
                <span className="text-xs font-mono text-steel-600 bg-steel-100 px-2.5 py-2 rounded border border-steel-200">
                  Formato: <strong>{String(config.puntoVenta || 1).padStart(5, '0')}</strong>
                </span>
              </div>
              <span className="text-[11px] text-steel-500 font-sans mt-0.5 block">
                Debe estar dado de alta en ARCA bajo "Facturación Electrónica - Web Services".
              </span>
            </div>
          </div>

          {/* Ambiente & Tipo Comprobante Default */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="arca-ambiente" className="block text-xs font-mono font-bold uppercase text-steel-700 mb-1">
                Ambiente de Conexión *
              </label>
              <select
                id="arca-ambiente"
                value={config.ambiente}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, ambiente: e.target.value as ArcaAmbiente }))
                }
                className="w-full px-3 py-2 text-sm font-sans border border-steel-300 rounded bg-white focus:outline-none focus:border-navy"
              >
                <option value="homologacion">Homologación (Testing / Pruebas sin validez fiscal)</option>
                <option value="produccion">Producción (ARCA Oficial con validez fiscal)</option>
              </select>
              <span className="text-[11px] text-steel-500 font-sans mt-0.5 block">
                {config.ambiente === 'homologacion'
                  ? 'Recomendado para verificar el flujo antes de emitir comprobantes tributarios.'
                  : '⚠️ Emite comprobantes fiscales oficiales válidos ante ARCA.'}
              </span>
            </div>

            <div>
              <label htmlFor="arca-tipo-default" className="block text-xs font-mono font-bold uppercase text-steel-700 mb-1">
                Tipo de Comprobante por Defecto
              </label>
              <select
                id="arca-tipo-default"
                value={config.tipoFacturaDefault}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    tipoFacturaDefault: e.target.value as ArcaTipoComprobante,
                  }))
                }
                className="w-full px-3 py-2 text-sm font-sans border border-steel-300 rounded bg-white focus:outline-none focus:border-navy"
              >
                <option value="Factura B">Factura B (Consumidor Final / Particulares)</option>
                <option value="Factura A">Factura A (Responsable Inscripto / Aseguradoras)</option>
                <option value="Factura C">Factura C (Monotributo)</option>
              </select>
              <span className="text-[11px] text-steel-500 font-sans mt-0.5 block">
                En cada caso se puede seleccionar según sea Particular o Seguro.
              </span>
            </div>
          </div>

          {/* Certificado Digital y Clave Privada */}
          <div className="border-t border-steel-200 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase text-navy flex items-center gap-1.5">
                <Key size={14} className="text-navy" />
                Certificado Digital X.509 y Clave Privada
              </span>
              <button
                type="button"
                onClick={() => setMostrarAyuda(!mostrarAyuda)}
                className="text-xs text-blue hover:underline flex items-center gap-1 font-sans cursor-pointer"
              >
                <HelpCircle size={13} />
                <span>{mostrarAyuda ? 'Ocultar guía' : '¿Cómo se obtienen?'}</span>
              </button>
            </div>

            {mostrarAyuda && (
              <div className="mb-3 p-3 bg-blue-50/70 border border-blue-200 rounded text-xs font-sans text-graphite space-y-1">
                <p className="font-bold text-navy">Pasos en la web de ARCA (ex-AFIP):</p>
                <ol className="list-decimal pl-4 space-y-1 text-steel-700">
                  <li>Ingresa con CUIT y Clave Fiscal al servicio <strong>"Administración de Certificados Digitales"</strong>.</li>
                  <li>Genera o sube un requerimiento (CSR) y descarga el archivo <strong>.crt</strong>.</li>
                  <li>Guarda también el archivo <strong>.key</strong> de tu clave privada generado en tu computadora.</li>
                  <li>En <strong>"Administrador de Relaciones de Clave Fiscal"</strong> vincula el servicio <em>"WSFE - Facturación Electrónica"</em> con ese computador fiscal.</li>
                </ol>
                <p className="pt-1">
                  <a href="#guia" onClick={() => onClose()} className="font-bold text-blue hover:underline">
                    Ver guía paso a paso completa con capturas →
                  </a>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-steel-700 mb-1">
                  Certificado Digital (.crt / .pem)
                </label>
                <div className="space-y-1.5">
                  <input
                    type="file"
                    accept=".crt,.pem,.cer"
                    onChange={(e) => handleFileUpload('certificadoCrt', e.target.files?.[0])}
                    className="text-xs text-steel-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-steel-300 file:text-xs file:font-mono file:bg-steel-100 hover:file:bg-steel-200 cursor-pointer"
                  />
                  <textarea
                    rows={2}
                    value={config.certificadoCrt}
                    onChange={(e) => setConfig((prev) => ({ ...prev, certificadoCrt: e.target.value }))}
                    placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                    className="w-full px-2.5 py-1.5 text-[11px] font-mono border border-steel-300 rounded focus:outline-none focus:border-navy"
                  />
                  {config.certificadoCrt && (
                    <span className="text-[10px] text-emerald-600 font-mono block">
                      ✓ Certificado cargado ({config.certificadoCrt.length} caracteres)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-steel-700 mb-1">
                  Clave Privada (.key)
                </label>
                <div className="space-y-1.5">
                  <input
                    type="file"
                    accept=".key,.pem,.txt"
                    onChange={(e) => handleFileUpload('clavePrivadaKey', e.target.files?.[0])}
                    className="text-xs text-steel-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-steel-300 file:text-xs file:font-mono file:bg-steel-100 hover:file:bg-steel-200 cursor-pointer"
                  />
                  <textarea
                    rows={2}
                    value={config.clavePrivadaKey}
                    onChange={(e) => setConfig((prev) => ({ ...prev, clavePrivadaKey: e.target.value }))}
                    placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                    className="w-full px-2.5 py-1.5 text-[11px] font-mono border border-steel-300 rounded focus:outline-none focus:border-navy"
                  />
                  {config.clavePrivadaKey && (
                    <span className="text-[10px] text-emerald-600 font-mono block">
                      ✓ Clave privada cargada ({config.clavePrivadaKey.length} caracteres)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Resultado de la Prueba de Conexión */}
          {testResult && (
            <div
              className={`p-3.5 rounded border text-xs font-sans ${
                testResult.ok
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {testResult.ok ? (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold">{testResult.mensaje}</p>
                  {testResult.servidor && (
                    <p className="text-[11px] font-mono opacity-80">
                      Servidor consultado: {testResult.servidor}
                    </p>
                  )}
                  {testResult.proximoComprobante && (
                    <p className="text-[11px] font-mono font-semibold text-emerald-800">
                      Próximo número disponible: #{testResult.proximoComprobante} (Punto de Venta{' '}
                      {String(config.puntoVenta).padStart(5, '0')})
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {guardadoExitoso && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs font-sans font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Configuración de ARCA guardada exitosamente.</span>
            </div>
          )}

          {/* Footer de Acciones */}
          <div className="pt-3 border-t border-steel-200 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={handleProbarConexion}
              disabled={probando}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold uppercase rounded border border-steel-400 bg-white text-navy hover:bg-steel-100 transition cursor-pointer disabled:opacity-50"
            >
              <Zap size={14} className={probando ? 'animate-spin text-amber-600' : 'text-amber-500'} />
              <span>{probando ? 'Probando WSAA...' : 'Probar Conexión con ARCA'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-mono uppercase text-steel-600 hover:text-graphite cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold uppercase rounded bg-navy hover:bg-navy/90 text-white transition shadow-sm cursor-pointer"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
