import React, { useMemo, useState } from 'react'
import { useDemoStore } from '../context/DemoStoreContext'
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Search,
  ExternalLink,
  Sparkles,
  X
} from 'lucide-react'
import { ModalConfiguracionArca } from '../features/facturacion/arca/ModalConfiguracionArca'
import { getArcaConfig } from '../features/facturacion/arca/storage'
import { ModalComprobanteX } from '../features/facturacion/interno/ModalComprobanteX'
import { SeccionComprobanteInternoX } from '../features/facturacion/interno/SeccionComprobanteInternoX'
import type { ComprobanteInternoData, TipoComprobanteInterno } from '../features/facturacion/interno/types'
import type { CasoDemo } from '../types/taller'

function formatMoneda(monto: number): string {
  return `$ ${new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: monto % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(monto)}`
}

export function getTipoComprobanteInfo(numeroFactura?: string): {
  esInterno: boolean
  etiqueta: string
  tipo: 'arca' | 'factura_x' | 'remito_x' | 'recibo_x' | 'presupuesto_x' | 'sin_emitir'
  badgeClass: string
} {
  if (!numeroFactura || !numeroFactura.trim() || numeroFactura.toLowerCase() === 'sin factura') {
    return { esInterno: false, etiqueta: 'Sin emitir', tipo: 'sin_emitir', badgeClass: 'bg-steel-200 text-steel-700' }
  }
  const upper = numeroFactura.toUpperCase().trim()
  if (upper.startsWith('FX-') || upper.startsWith('FCX-') || upper.startsWith('FACTURA X')) {
    return { esInterno: true, etiqueta: 'Factura X (No Fiscal)', tipo: 'factura_x', badgeClass: 'bg-slate-800 text-white' }
  }
  if (upper.startsWith('REM-') || upper.startsWith('REMITO')) {
    return { esInterno: true, etiqueta: 'Remito X (No Fiscal)', tipo: 'remito_x', badgeClass: 'bg-amber-800 text-white' }
  }
  if (upper.startsWith('RCX-') || upper.startsWith('RECIBO')) {
    return { esInterno: true, etiqueta: 'Recibo X (No Fiscal)', tipo: 'recibo_x', badgeClass: 'bg-teal-800 text-white' }
  }
  if (upper.startsWith('PRE-')) {
    return { esInterno: true, etiqueta: 'Presupuesto X', tipo: 'presupuesto_x', badgeClass: 'bg-zinc-700 text-white' }
  }
  if (upper.startsWith('X-')) {
    return { esInterno: true, etiqueta: 'Comprobante X', tipo: 'factura_x', badgeClass: 'bg-slate-800 text-white' }
  }
  return { esInterno: false, etiqueta: 'ARCA Oficial (A/B)', tipo: 'arca', badgeClass: 'bg-navy text-white' }
}

export function FacturacionView() {
  const { casos, setCasoSeleccionado, actualizarCaso } = useDemoStore()
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroCanal, setFiltroCanal] = useState<string>('todos')
  const [filtroTipoComprobante, setFiltroTipoComprobante] = useState<string>('todos')
  const [modalArcaAbierto, setModalArcaAbierto] = useState(false)
  const [arcaConfig, setArcaConfig] = useState(getArcaConfig())

  const [comprobanteModal, setComprobanteModal] = useState<ComprobanteInternoData | null>(null)
  const [casoParaEmitirX, setCasoParaEmitirX] = useState<CasoDemo | null>(null)

  // Mapear casos a items de facturación
  const items = useMemo(() => {
    return casos.map((c, idx) => {
      const facturado = c.facturado_monto || (['facturado', 'cobrado', 'reclamo a la compañía'].includes(c.estado) ? c.presupuesto_monto : 0)
      const cobrado = c.cobrado_monto || (c.estado === 'cobrado' ? facturado : 0)
      const diferencial = facturado > cobrado ? facturado - cobrado : 0
      const tieneFactura = ['facturado', 'cobrado', 'reclamo a la compañía'].includes(c.estado)

      let numFactura = c.numero_factura || ''
      if (!numFactura && tieneFactura) {
        numFactura = c.canal === 'particular' && idx % 2 === 0
          ? `FX-0001-${(100 + idx).toString().padStart(8, '0')}`
          : `FC-B-0001-${(1000 + idx).toString().padStart(8, '0')}`
      }

      return {
        caso_id: c.id,
        patente: c.patente,
        vehiculo: c.vehiculo_marca_modelo,
        cliente_nombre: c.cliente_nombre,
        cliente_telefono: c.cliente_telefono,
        canal: c.canal,
        aseguradora: c.aseguradora,
        estado: c.estado,
        numero_factura: numFactura,
        fecha_factura: c.fecha_factura || (tieneFactura ? c.created_at : ''),
        monto_facturado: facturado,
        monto_cobrado: cobrado,
        diferencial: diferencial,
        caso_original: c
      }
    })
  }, [casos])

  // Métricas KPI con desglose Fiscal vs Interno No Fiscal
  const kpis = useMemo(() => {
    let facturado = 0
    let facturadoFiscal = 0
    let facturadoInterno = 0
    let cobrado = 0
    let pendiente = 0
    let enReclamo = 0

    for (const item of items) {
      facturado += item.monto_facturado
      if (item.monto_facturado > 0) {
        const info = getTipoComprobanteInfo(item.numero_factura)
        if (info.esInterno) {
          facturadoInterno += item.monto_facturado
        } else if (info.tipo === 'arca') {
          facturadoFiscal += item.monto_facturado
        }
      }
      cobrado += item.monto_cobrado
      if (item.diferencial > 0) {
        pendiente += item.diferencial
      }
      if (item.estado === 'reclamo a la compañía') {
        enReclamo += 1
      }
    }

    return {
      totalFacturado: facturado,
      facturadoFiscal,
      facturadoInterno,
      totalCobrado: cobrado,
      pendienteCobro: pendiente,
      enReclamoCount: enReclamo,
    }
  }, [items])

  // Filtrado
  const itemsFiltrados = useMemo(() => {
    const q = filtroTexto.trim().toLowerCase()

    return items.filter((item) => {
      if (q) {
        const matchesPatente = item.patente.toLowerCase().includes(q)
        const matchesCliente = item.cliente_nombre.toLowerCase().includes(q)
        const matchesVehiculo = item.vehiculo.toLowerCase().includes(q)
        const matchesFactura = item.numero_factura.toLowerCase().includes(q)
        const matchesAseguradora = item.aseguradora?.toLowerCase().includes(q) ?? false

        if (!matchesPatente && !matchesCliente && !matchesVehiculo && !matchesFactura && !matchesAseguradora) {
          return false
        }
      }

      if (filtroEstado !== 'todos' && item.estado !== filtroEstado) {
        return false
      }

      if (filtroCanal !== 'todos' && item.canal !== filtroCanal) {
        return false
      }

      if (filtroTipoComprobante !== 'todos') {
        const info = getTipoComprobanteInfo(item.numero_factura)
        if (filtroTipoComprobante === 'fiscal' && info.tipo !== 'arca') {
          return false
        }
        if (filtroTipoComprobante === 'interno' && !info.esInterno) {
          return false
        }
        if (filtroTipoComprobante === 'sin_factura' && info.tipo !== 'sin_emitir') {
          return false
        }
      }

      return true
    })
  }, [items, filtroTexto, filtroEstado, filtroCanal, filtroTipoComprobante])

  function abrirModalComprobante(item: typeof items[number]) {
    const info = getTipoComprobanteInfo(item.numero_factura)
    let tipo: TipoComprobanteInterno = 'Factura X'
    if (info.tipo === 'remito_x') tipo = 'Remito X'
    else if (info.tipo === 'recibo_x') tipo = 'Recibo X'
    else if (info.tipo === 'presupuesto_x') tipo = 'Presupuesto X'

    setComprobanteModal({
      tipo,
      puntoVenta: '0001',
      numero: 1,
      numeroCompleto: item.numero_factura,
      fechaEmision: item.fecha_factura || new Date().toISOString().split('T')[0],
      concepto: `Reparación y servicio taller sobre ${item.vehiculo} patente ${item.patente}`,
      monto: item.monto_facturado,
      casoId: item.caso_id,
      patente: item.patente,
      vehiculo: item.vehiculo,
      clienteNombre: item.cliente_nombre,
      clienteTelefono: item.cliente_telefono,
      tallerNombre: 'Taller Mecánico & Carrocería',
    })
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-graphite pb-3 sm:pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-navy">
            Facturación y Cobranza
          </h1>
          <p className="text-[11px] sm:text-xs font-mono text-steel-500 uppercase mt-0.5">
            Panel exclusivo de control financiero: Facturación Fiscal ARCA y Comprobantes Internos (Factura X / Remitos)
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              const candidato = casos.find(c => c.estado === 'firmado') || casos.find(c => c.estado === 'facturado') || casos[0]
              setCasoParaEmitirX(candidato || null)
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold uppercase bg-slate-800 hover:bg-slate-900 text-white transition rounded-sm shadow-sm cursor-pointer"
            title="Emitir comprobante interno (Factura X / Remito / Recibo) no declarado a ARCA"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>+ Emitir Factura X / Remito</span>
          </button>

          <button
            type="button"
            onClick={() => setModalArcaAbierto(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase border border-navy bg-navy text-white hover:bg-navy/90 transition rounded-sm shadow-sm cursor-pointer"
            title="Configuración de conexión y credenciales de ARCA (ex-AFIP)"
          >
            <Building2 size={14} />
            <span>Conexión ARCA</span>
            {arcaConfig.activo && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white border-2 border-graphite p-3 sm:p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-steel-500 mb-1">
              <span className="text-[11px] sm:text-xs font-mono uppercase font-semibold">Total Facturado</span>
              <DollarSign size={16} className="text-navy" />
            </div>
            <div className="text-lg sm:text-2xl font-display font-bold text-navy">
              {formatMoneda(kpis.totalFacturado)}
            </div>
          </div>
          <div className="text-[10px] font-mono text-steel-500 mt-2 pt-2 border-t border-steel-200 flex flex-col gap-0.5">
            <div className="flex justify-between">
              <span>Fiscal ARCA:</span>
              <span className="font-semibold text-navy">{formatMoneda(kpis.facturadoFiscal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interno (X / Remitos):</span>
              <span className="font-semibold text-graphite">{formatMoneda(kpis.facturadoInterno)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-graphite p-3 sm:p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-steel-500 mb-1">
            <span className="text-[11px] sm:text-xs font-mono uppercase font-semibold">Total Cobrado</span>
            <CheckCircle2 size={16} className="text-green" />
          </div>
          <div className="text-lg sm:text-2xl font-display font-bold text-green">
            {formatMoneda(kpis.totalCobrado)}
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-steel-400 mt-1">Fondos ingresados</span>
        </div>

        <div className="bg-white border-2 border-graphite p-3 sm:p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-steel-500 mb-1">
            <span className="text-[11px] sm:text-xs font-mono uppercase font-semibold">Pendiente de Cobro</span>
            <Clock size={16} className="text-brass" />
          </div>
          <div className="text-lg sm:text-2xl font-display font-bold text-brass">
            {formatMoneda(kpis.pendienteCobro)}
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-steel-400 mt-1">Diferencial por cobrar</span>
        </div>

        <div className="bg-white border-2 border-graphite p-3 sm:p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-steel-500 mb-1">
            <span className="text-[11px] sm:text-xs font-mono uppercase font-semibold">En Reclamo</span>
            <AlertTriangle size={16} className="text-red" />
          </div>
          <div className="text-lg sm:text-2xl font-display font-bold text-red">
            {kpis.enReclamoCount}
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-steel-400 mt-1">Aseguradora en disputa</span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white border-2 border-graphite p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
          <input
            type="text"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            placeholder="Buscar por patente, cliente, factura, compañía..."
            className="w-full pl-9 pr-3 py-2 text-sm font-sans border border-steel-300 focus:outline-none focus:border-navy"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="filtro-estado" className="text-xs font-mono uppercase text-steel-500">
              Estado:
            </label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-sm font-sans border border-steel-300 py-1.5 px-2 bg-white focus:outline-none focus:border-navy"
            >
              <option value="todos">Todos los estados</option>
              <option value="firmado">Firmado (Listo para facturar)</option>
              <option value="facturado">Facturado (Pendiente cobro)</option>
              <option value="reclamo a la compañía">En Reclamo Aseguradora</option>
              <option value="cobrado">Cobrado (Cerrado)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filtro-canal" className="text-xs font-mono uppercase text-steel-500">
              Canal:
            </label>
            <select
              id="filtro-canal"
              value={filtroCanal}
              onChange={(e) => setFiltroCanal(e.target.value)}
              className="text-sm font-sans border border-steel-300 py-1.5 px-2 bg-white focus:outline-none focus:border-navy"
            >
              <option value="todos">Todos los canales</option>
              <option value="seguro">Seguro</option>
              <option value="particular">Particular</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filtro-comprobante" className="text-xs font-mono uppercase text-steel-500">
              Comprobante:
            </label>
            <select
              id="filtro-comprobante"
              value={filtroTipoComprobante}
              onChange={(e) => setFiltroTipoComprobante(e.target.value)}
              className="text-sm font-sans border border-steel-300 py-1.5 px-2 bg-white focus:outline-none focus:border-navy"
            >
              <option value="todos">Todos los comprobantes</option>
              <option value="fiscal">Fiscal ARCA (A / B)</option>
              <option value="interno">Factura X / Remito (No Fiscal)</option>
              <option value="sin_factura">Sin emitir</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Casos */}
      <div className="bg-white border-2 border-graphite overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-steel-100 border-b-2 border-graphite text-xs font-mono uppercase text-navy">
              <th className="p-3">Patente / Vehículo</th>
              <th className="p-3">Cliente / Canal</th>
              <th className="p-3">Factura</th>
              <th className="p-3 text-right">Facturado</th>
              <th className="p-3 text-right">Cobrado</th>
              <th className="p-3 text-right">Diferencial</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-200">
            {itemsFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-steel-500 font-mono text-sm">
                  No se encontraron casos de facturación para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              itemsFiltrados.map((item) => {
                const tieneDiferencial = item.diferencial > 0
                const info = getTipoComprobanteInfo(item.numero_factura)
                return (
                  <tr key={item.caso_id} className="hover:bg-steel-50 transition">
                    <td className="p-3">
                      <button
                        onClick={() => setCasoSeleccionado(item.caso_original)}
                        className="font-mono font-bold text-blue hover:underline text-base block text-left cursor-pointer"
                      >
                        {item.patente}
                      </button>
                      <span className="text-xs text-steel-500">{item.vehiculo}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-graphite block">{item.cliente_nombre}</span>
                      <span className="text-xs font-mono uppercase text-steel-500">
                        {item.canal}
                        {item.aseguradora ? ` • ${item.aseguradora.split(' ')[0]}` : ''}
                      </span>
                    </td>
                    <td className="p-3">
                      {item.numero_factura ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 font-mono text-xs">
                            <FileText size={14} className="text-steel-400 shrink-0" />
                            <span className="font-semibold">{item.numero_factura}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${info.badgeClass}`}
                            >
                              {info.etiqueta}
                            </span>
                            {info.esInterno && (
                              <button
                                type="button"
                                onClick={() => abrirModalComprobante(item)}
                                className="text-[10px] font-mono text-navy hover:underline font-bold cursor-pointer"
                              >
                                Ver / Imprimir
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-steel-400 italic">Sin emitir</span>
                      )}
                      {item.fecha_factura && (
                        <span className="text-[11px] text-steel-400 font-mono block mt-0.5">
                          {item.fecha_factura}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-semibold">
                      {formatMoneda(item.monto_facturado)}
                    </td>
                    <td className="p-3 text-right font-mono text-green font-semibold">
                      {formatMoneda(item.monto_cobrado)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      {tieneDiferencial ? (
                        <span className="text-brass">
                          {formatMoneda(item.diferencial)}
                        </span>
                      ) : (
                        <span className="text-steel-400">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 text-xs font-mono font-bold uppercase rounded ${
                        item.estado === 'cobrado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.estado === 'facturado'
                          ? 'bg-blue-100 text-blue-800'
                          : item.estado === 'reclamo a la compañía'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setCasoParaEmitirX(item.caso_original)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-sm cursor-pointer transition shadow-xs ${
                            item.estado === 'firmado'
                              ? 'bg-slate-800 text-white hover:bg-slate-900 font-bold ring-2 ring-amber-400'
                              : 'bg-slate-700 text-white hover:bg-slate-800'
                          }`}
                          title="Emitir Factura X o Remito no fiscal sobre este vehículo"
                        >
                          <Sparkles size={12} className="text-amber-400" />
                          <span>{item.estado === 'firmado' ? 'Emitir FX' : 'Factura X'}</span>
                        </button>
                        <button
                          onClick={() => setCasoSeleccionado(item.caso_original)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono border border-navy text-navy hover:bg-navy hover:text-white transition rounded-sm cursor-pointer"
                        >
                          <span>Ficha</span>
                          <ExternalLink size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Configuración ARCA */}
      <ModalConfiguracionArca
        isOpen={modalArcaAbierto}
        onClose={() => {
          setModalArcaAbierto(false)
          setArcaConfig(getArcaConfig())
        }}
      />

      {/* Modal Visor/Impresión de Comprobante X */}
      {comprobanteModal && (
        <ModalComprobanteX
          isOpen={!!comprobanteModal}
          onClose={() => setComprobanteModal(null)}
          data={comprobanteModal}
        />
      )}

      {/* Modal Emisión Rápida de Factura X / Remito sobre un caso */}
      {casoParaEmitirX && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-md shadow-2xl border-2 border-graphite max-w-xl w-full p-4 sm:p-5 relative animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-steel-200 mb-3">
              <div>
                <h3 className="font-display uppercase text-base sm:text-lg font-bold text-navy">
                  Emitir Comprobante No Fiscal — {casoParaEmitirX.patente}
                </h3>
                <span className="text-xs text-steel-500 font-mono">
                  {casoParaEmitirX.vehiculo_marca_modelo} • {casoParaEmitirX.cliente_nombre}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCasoParaEmitirX(null)}
                className="p-1 rounded text-steel-500 hover:text-graphite cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-[11px] font-mono uppercase text-steel-500 mb-1 font-semibold">
                Vehículo / Caso a Facturar:
              </label>
              <select
                value={casoParaEmitirX.id}
                onChange={(e) => {
                  const encontrado = casos.find(c => c.id === e.target.value)
                  if (encontrado) setCasoParaEmitirX(encontrado)
                }}
                className="w-full px-2.5 py-1.5 text-xs font-sans border border-steel-300 bg-white rounded-xs focus:border-navy"
              >
                {casos.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.orden_numero} — {c.patente} — {c.vehiculo_marca_modelo} ({c.cliente_nombre}) [Etapa: {c.estado}]
                  </option>
                ))}
              </select>
            </div>

            <SeccionComprobanteInternoX
              caso={casoParaEmitirX}
              montoFacturado={(casoParaEmitirX.presupuesto_monto || 100000).toString()}
              tallerNombre="Taller Mecánico & Carrocería"
              onComprobanteEmitido={({ numeroFactura, fechaEmision, comprobanteData }) => {
                actualizarCaso(casoParaEmitirX.id, {
                  estado: 'facturado',
                  numero_factura: numeroFactura,
                  fecha_factura: fechaEmision,
                  facturado_monto: comprobanteData.monto,
                  dias_en_etapa: 0,
                })
                setCasoParaEmitirX(null)
                setComprobanteModal(comprobanteData)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
