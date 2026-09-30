import React, { useState } from 'react'
import { FileText, Printer, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react'
import {
  formatearNumeroComprobanteInterno,
  type TipoComprobanteInterno,
  type ComprobanteInternoData,
} from './types'
import {
  getProximoNumeroInterno,
  incrementarYGuardarNumeroInterno,
} from './storage'
import { ModalComprobanteX } from './ModalComprobanteX'

export interface CasoMinimoInterno {
  id: string
  patente: string
  marca?: string
  modelo?: string
  color?: string
  vehiculo_marca_modelo?: string
  cliente_nombre: string
  cliente_telefono?: string
}

interface SeccionComprobanteInternoXProps {
  caso: CasoMinimoInterno
  montoFacturado: string
  tallerNombre?: string
  onComprobanteEmitido: (info: {
    numeroFactura: string
    fechaEmision: string
    resumenInterno: string
    comprobanteData: ComprobanteInternoData
  }) => void
}

export function SeccionComprobanteInternoX({
  caso,
  montoFacturado,
  tallerNombre = 'Taller Mecánico & Carrocería',
  onComprobanteEmitido,
}: SeccionComprobanteInternoXProps) {
  const [tipo, setTipo] = useState<TipoComprobanteInterno>('Factura X')
  const [puntoVenta, setPuntoVenta] = useState('0001')
  const [numeroCustom, setNumeroCustom] = useState<string>(() =>
    getProximoNumeroInterno('Factura X').toString()
  )
  const [concepto, setConcepto] = useState<string>(() => {
    const vehiculo = caso.vehiculo_marca_modelo || [caso.marca, caso.modelo].filter(Boolean).join(' ') || 'Vehículo'
    return `Reparación y servicio taller sobre ${vehiculo} patente ${caso.patente}`
  })
  const [modalAbierto, setModalAbierto] = useState(false)
  const [comprobanteEmitido, setComprobanteEmitido] = useState<ComprobanteInternoData | null>(null)
  const [errorEmision, setErrorEmision] = useState<string | null>(null)

  function handleTipoChange(nuevoTipo: TipoComprobanteInterno) {
    setTipo(nuevoTipo)
    setNumeroCustom(getProximoNumeroInterno(nuevoTipo).toString())
  }

  const montoNum = parseFloat(montoFacturado) || 0

  function handleGenerarComprobante() {
    if (montoNum <= 0) {
      setErrorEmision('El monto a facturar debe ser mayor a 0 para generar el comprobante.')
      return
    }

    const num = parseInt(numeroCustom, 10)
    if (isNaN(num) || num <= 0) {
      setErrorEmision('El número de comprobante debe ser un entero positivo.')
      return
    }

    setErrorEmision(null)
    const numeroCompleto = formatearNumeroComprobanteInterno(tipo, puntoVenta, num)
    const fecha = new Date().toISOString().split('T')[0]
    const vehiculo = caso.vehiculo_marca_modelo || [caso.marca, caso.modelo, caso.color].filter(Boolean).join(' ') || 'Vehículo'

    const data: ComprobanteInternoData = {
      tipo,
      puntoVenta,
      numero: num,
      numeroCompleto,
      fechaEmision: fecha,
      concepto: concepto.trim() || `Servicio taller sobre ${vehiculo} patente ${caso.patente}`,
      monto: montoNum,
      casoId: caso.id,
      patente: caso.patente,
      vehiculo,
      clienteNombre: caso.cliente_nombre,
      clienteTelefono: caso.cliente_telefono || undefined,
      tallerNombre,
    }

    // Incrementar y persistir correlativo para la próxima emisión
    incrementarYGuardarNumeroInterno(tipo)
    setComprobanteEmitido(data)

    const resumen = `[COMPROBANTE INTERNO - ${tipo.toUpperCase()}] N°: ${numeroCompleto} | Monto: $ ${montoNum} | Fecha: ${fecha} | Documento no fiscal de control interno.`

    onComprobanteEmitido({
      numeroFactura: numeroCompleto,
      fechaEmision: fecha,
      resumenInterno: resumen,
      comprobanteData: data,
    })
  }

  return (
    <div className="bg-slate-50 border-2 border-steel-300 rounded p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-steel-200">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-slate-700 text-white font-mono font-bold flex items-center justify-center text-xs">
            X
          </span>
          <div>
            <span className="font-mono text-xs font-bold uppercase text-graphite block">
              Comprobante Interno (Factura X / Remito)
            </span>
            <span className="text-[10px] text-steel-500 font-mono">
              Para cobros en efectivo / no declarados a ARCA (No Fiscal)
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 font-semibold">
          Sin CAE / Uso Interno
        </span>
      </div>

      {/* Selectors: Tipo de Comprobante */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {(['Factura X', 'Remito X', 'Recibo X'] as TipoComprobanteInterno[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTipoChange(t)}
            className={`py-2 px-2.5 text-xs font-mono font-bold uppercase rounded border transition cursor-pointer text-center ${
              tipo === t
                ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                : 'bg-white text-steel-700 border-steel-300 hover:bg-steel-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-mono uppercase text-steel-500 mb-1 font-semibold">
            Punto de Emisión
          </label>
          <input
            type="text"
            maxLength={4}
            value={puntoVenta}
            onChange={(e) => setPuntoVenta(e.target.value.replace(/\D/g, ''))}
            className="w-full px-2.5 py-1.5 font-mono border border-steel-300 bg-white rounded-xs focus:border-navy"
            placeholder="0001"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] font-mono uppercase text-steel-500 mb-1 font-semibold">
            Número Correlativo Interno
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={numeroCustom}
              onChange={(e) => setNumeroCustom(e.target.value)}
              className="w-full px-2.5 py-1.5 font-mono border border-steel-300 bg-white rounded-xs focus:border-navy font-bold"
            />
            <span className="font-mono text-xs text-steel-500 whitespace-nowrap">
              → {formatearNumeroComprobanteInterno(tipo, puntoVenta, parseInt(numeroCustom, 10) || 0)}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-steel-500 mb-1 font-semibold">
          Concepto / Detalle de Mano de Obra
        </label>
        <input
          type="text"
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs font-sans border border-steel-300 bg-white rounded-xs focus:border-navy"
          placeholder="Ej: Mano de obra reparación tren delantero y frenos"
        />
      </div>

      {errorEmision && (
        <div className="p-2 bg-red-50 border border-red-300 text-red text-xs rounded-xs font-mono">
          {errorEmision}
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 border-t border-steel-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <span className="text-[11px] font-mono text-steel-600">
          Importe: <strong>$ {new Intl.NumberFormat('es-AR').format(montoNum)}</strong>
        </span>

        <div className="flex items-center gap-2">
          {comprobanteEmitido && (
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="inline-flex items-center gap-1.5 bg-steel-200 hover:bg-steel-300 text-graphite font-mono text-xs font-bold uppercase px-3 py-2 rounded-sm transition cursor-pointer"
            >
              <Printer size={14} />
              <span>Ver / Imprimir Comprobante</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleGenerarComprobante}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-mono text-xs font-bold uppercase px-3.5 py-2 rounded-sm transition shadow-xs cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Emitir {tipo} (No Fiscal)</span>
          </button>
        </div>
      </div>

      {/* Modal imprimible */}
      {comprobanteEmitido && (
        <ModalComprobanteX
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          data={comprobanteEmitido}
        />
      )}
    </div>
  )
}
