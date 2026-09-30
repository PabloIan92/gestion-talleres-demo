import React, { useMemo, useState } from 'react'
import { useDemoStore } from '../context/DemoStoreContext'
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react'
import { ModalConfiguracionArca } from '../features/facturacion/arca/ModalConfiguracionArca'
import { getArcaConfig } from '../features/facturacion/arca/storage'

function formatMoneda(monto: number): string {
  return `$ ${new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: monto % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(monto)}`
}

export function FacturacionView() {
  const { casos, setCasoSeleccionado } = useDemoStore()
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroCanal, setFiltroCanal] = useState<string>('todos')
  const [modalArcaAbierto, setModalArcaAbierto] = useState(false)
  const [arcaConfig, setArcaConfig] = useState(getArcaConfig())

  // Mapear casos a items de facturación
  const items = useMemo(() => {
    return casos.map((c, idx) => {
      const facturado = c.facturado_monto || (['facturado', 'cobrado', 'reclamo a la compañía'].includes(c.estado) ? c.presupuesto_monto : 0)
      const cobrado = c.cobrado_monto || (c.estado === 'cobrado' ? facturado : 0)
      const diferencial = facturado > cobrado ? facturado - cobrado : 0
      const tieneFactura = ['facturado', 'cobrado', 'reclamo a la compañía'].includes(c.estado)

      return {
        caso_id: c.id,
        patente: c.patente,
        vehiculo: c.vehiculo_marca_modelo,
        cliente_nombre: c.cliente_nombre,
        canal: c.canal,
        aseguradora: c.aseguradora,
        estado: c.estado,
        numero_factura: tieneFactura ? `FC-B-${(100 + idx).toString().padStart(6, '0')}` : 'Sin Factura',
        monto_facturado: facturado,
        monto_cobrado: cobrado,
        diferencial: diferencial,
        caso_original: c
      }
    })
  }, [casos])

  // KPIs
  const kpis = useMemo(() => {
    let facturado = 0
    let cobrado = 0
    let pendiente = 0
    let enReclamo = 0

    for (const item of items) {
      facturado += item.monto_facturado
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

      return true
    })
  }, [items, filtroTexto, filtroEstado, filtroCanal])

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-graphite pb-3 sm:pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-navy">
            Facturación y Cobranza
          </h1>
          <p className="text-[11px] sm:text-xs font-mono text-steel-500 uppercase mt-0.5">
            Panel exclusivo de control financiero y seguimiento de cobros
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
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
          <div className="flex items-center justify-between text-steel-500 mb-1">
            <span className="text-[11px] sm:text-xs font-mono uppercase font-semibold">Total Facturado</span>
            <DollarSign size={16} className="text-navy" />
          </div>
          <div className="text-lg sm:text-2xl font-display font-bold text-navy">
            {formatMoneda(kpis.totalFacturado)}
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-steel-400 mt-1">Facturas emitidas</span>
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
                    <td className="p-3 font-mono text-xs">
                      {item.numero_factura}
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
                      <button
                        onClick={() => setCasoSeleccionado(item.caso_original)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono border border-navy text-navy hover:bg-navy hover:text-white transition rounded-sm cursor-pointer"
                      >
                        <span>Ver Ficha</span>
                        <ExternalLink size={12} />
                      </button>
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
    </div>
  )
}
