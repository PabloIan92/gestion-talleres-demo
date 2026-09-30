import { useState, useEffect } from 'react'
import {
  Building2,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Settings,
} from 'lucide-react'
import type { Caso } from '../../../types/taller'
import type { ConfiguracionArca, ArcaTipoComprobante, FacturaArcaResponse } from './types'
import { getArcaConfig } from './storage'
import { emitirComprobanteArca } from './arcaService'
import { ModalConfiguracionArca } from './ModalConfiguracionArca'

interface SeccionFacturaArcaProps {
  caso: Caso
  montoFacturado: string
  onFacturaEmitida: (info: {
    numeroFactura: string
    cae: string
    caeVto: string
    fechaEmision: string
    resumenFiscal: string
  }) => void
}

export function SeccionFacturaArca({
  caso,
  montoFacturado,
  onFacturaEmitida,
}: SeccionFacturaArcaProps) {
  const [config, setConfig] = useState<ConfiguracionArca>(getArcaConfig())
  const [modalConfigAbierto, setModalConfigAbierto] = useState(false)
  const [tipoComprobante, setTipoComprobante] = useState<ArcaTipoComprobante>(() => {
    return caso.canal === 'seguro' ? 'Factura A' : 'Factura B'
  })
  const [docTipo, setDocTipo] = useState<'CUIT' | 'DNI' | 'Consumidor Final'>(() => {
    return caso.canal === 'seguro' ? 'CUIT' : 'DNI'
  })
  const [docNro, setDocNro] = useState<string>('')
  const [emitirLoading, setEmitirLoading] = useState(false)
  const [errorEmision, setErrorEmision] = useState<string | null>(null)
  const [resultadoFiscal, setResultadoFiscal] = useState<FacturaArcaResponse | null>(null)

  useEffect(() => {
    setConfig(getArcaConfig())
  }, [modalConfigAbierto])

  const montoNum = parseFloat(montoFacturado) || 0
  const arcaHabilitado = config.activo && (config.cuit || '').replace(/\D/g, '').length === 11

  const handleEmitirFactura = async () => {
    if (montoNum <= 0) {
      setErrorEmision('El monto facturado debe ser mayor a 0 para emitir el comprobante.')
      return
    }

    if (tipoComprobante === 'Factura A' && (!docNro || docNro.replace(/\D/g, '').length !== 11)) {
      setErrorEmision('Para Factura A es obligatorio ingresar un CUIT de 11 dígitos.')
      return
    }

    setEmitirLoading(true)
    setErrorEmision(null)

    try {
      const response = await emitirComprobanteArca(config, {
        puntoVenta: config.puntoVenta,
        tipoComprobante,
        concepto: config.conceptoDefault,
        docTipo,
        docNro: docNro.trim() || 'Consumidor Final',
        receptorNombre: caso.canal === 'seguro' ? (caso.aseguradora || caso.cliente_nombre) : caso.cliente_nombre,
        montoTotal: montoNum,
        fechaComprobante: new Date().toISOString().split('T')[0],
        descripcionServicio: `Servicio y reparación sobre vehículo ${caso.vehiculo_marca_modelo || ''} patente ${caso.patente}`,
      })

      setResultadoFiscal(response)

      const resumen = `[ARCA WSFE] CAE: ${response.cae} | Vto CAE: ${response.caeVto} | Comprobante: ${response.numeroFactura} (${response.tipoComprobante})`
      onFacturaEmitida({
        numeroFactura: response.numeroFactura,
        cae: response.cae,
        caeVto: response.caeVto,
        fechaEmision: response.fechaEmision,
        resumenFiscal: resumen,
      })
    } catch (err: any) {
      setErrorEmision(err?.message || 'Error al autorizar comprobante en ARCA.')
    } finally {
      setEmitirLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 border-2 border-steel-300 rounded p-4 flex flex-col gap-3">
      {/* Cabecera ARCA */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-steel-200">
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-navy" />
          <div>
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-navy m-0 flex items-center gap-1.5">
              <span>Facturación Electrónica ARCA (ex-AFIP)</span>
              {arcaHabilitado ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {config.ambiente === 'produccion' ? 'Producción Fiscal' : 'Homologación'}
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-300">
                  Sin configurar
                </span>
              )}
            </h4>
            <p className="text-[11px] font-sans text-steel-600 m-0">
              {arcaHabilitado
                ? `Punto de Venta ${String(config.puntoVenta).padStart(5, '0')} • CUIT ${config.cuit}`
                : 'Conectá tu CUIT y Punto de Venta para autorizar comprobantes en 1 clic'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalConfigAbierto(true)}
          className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-steel-600 hover:text-navy px-2.5 py-1 rounded border border-steel-300 bg-white hover:bg-steel-100 transition cursor-pointer"
        >
          <Settings size={13} />
          <span>Configurar ARCA</span>
        </button>
      </div>

      {/* Si no está habilitado */}
      {!arcaHabilitado && (
        <div className="bg-amber-50/70 border border-amber-200 rounded p-3 text-xs font-sans text-graphite flex items-start gap-2.5">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-navy">Módulo ARCA listo para activar:</span>
            <p className="text-steel-600 mt-0.5">
              Podés configurar el CUIT del taller y el Punto de Venta Web Services para emitir comprobantes con CAE oficial directamente desde esta ficha sin salir de la app.
            </p>
            <button
              type="button"
              onClick={() => setModalConfigAbierto(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-navy bg-white border border-steel-400 px-2.5 py-1 rounded hover:bg-steel-50 transition cursor-pointer"
            >
              <Zap size={13} className="text-amber-600" />
              <span>Abrir Asistente de Conexión ARCA</span>
            </button>
          </div>
        </div>
      )}

      {/* Formulario rápido de Emisión ARCA */}
      {arcaHabilitado && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label htmlFor="arca-tipo-comp" className="block font-mono uppercase text-steel-600 font-semibold mb-1">
                Comprobante:
              </label>
              <select
                id="arca-tipo-comp"
                value={tipoComprobante}
                onChange={(e) => setTipoComprobante(e.target.value as ArcaTipoComprobante)}
                className="w-full px-2.5 py-1.5 font-sans border border-steel-300 rounded bg-white focus:outline-none focus:border-navy"
              >
                <option value="Factura B">Factura B (Particular)</option>
                <option value="Factura A">Factura A (Seguro/Cía)</option>
                <option value="Factura C">Factura C (Monotributo)</option>
              </select>
            </div>

            <div>
              <label htmlFor="arca-doc-tipo" className="block font-mono uppercase text-steel-600 font-semibold mb-1">
                Identificación:
              </label>
              <select
                id="arca-doc-tipo"
                value={docTipo}
                onChange={(e) => setDocTipo(e.target.value as any)}
                className="w-full px-2.5 py-1.5 font-sans border border-steel-300 rounded bg-white focus:outline-none focus:border-navy"
              >
                <option value="CUIT">CUIT</option>
                <option value="DNI">DNI</option>
                <option value="Consumidor Final">Consumidor Final</option>
              </select>
            </div>

            <div>
              <label htmlFor="arca-doc-nro" className="block font-mono uppercase text-steel-600 font-semibold mb-1">
                N° Documento / CUIT:
              </label>
              <input
                id="arca-doc-nro"
                type="text"
                value={docNro}
                onChange={(e) => setDocNro(e.target.value)}
                placeholder={docTipo === 'CUIT' ? '30-XXXXXXXX-X' : 'Número...'}
                className="w-full px-2.5 py-1.5 font-mono border border-steel-300 rounded focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          {errorEmision && (
            <div className="p-2.5 rounded bg-red-50 border border-red-300 text-xs font-sans text-red-700 flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{errorEmision}</span>
            </div>
          )}

          {resultadoFiscal ? (
            <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded text-xs font-sans text-emerald-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>¡Comprobante Autorizado por ARCA!</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div>
                  <span className="text-steel-500 block">Número Asignado:</span>
                  <strong className="text-navy">{resultadoFiscal.numeroFactura}</strong>
                </div>
                <div>
                  <span className="text-steel-500 block">CAE Oficial:</span>
                  <strong className="text-emerald-800">{resultadoFiscal.cae}</strong>
                </div>
                <div>
                  <span className="text-steel-500 block">Vencimiento CAE:</span>
                  <strong className="text-graphite">{resultadoFiscal.caeVto}</strong>
                </div>
              </div>
              <p className="text-[11px] text-steel-600 pt-1 border-t border-emerald-200">
                Los datos se completaron automáticamente en el formulario de arriba. Podés guardar o facturar el caso para dejar el registro definitivo.
              </p>
            </div>
          ) : (
            <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-sans text-steel-500">
                Monto a autorizar: <strong className="font-mono text-navy">${montoNum.toLocaleString('es-AR')}</strong>
              </span>

              <button
                type="button"
                onClick={handleEmitirFactura}
                disabled={emitirLoading || montoNum <= 0}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold uppercase px-3.5 py-2 rounded transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={14} className={emitirLoading ? 'animate-spin' : ''} />
                <span>{emitirLoading ? 'Autorizando en ARCA...' : '⚡ Emitir Comprobante y Obtener CAE'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      <ModalConfiguracionArca
        isOpen={modalConfigAbierto}
        onClose={() => setModalConfigAbierto(false)}
        onConfigSaved={(nuevaConfig) => setConfig(nuevaConfig)}
      />
    </div>
  )
}
