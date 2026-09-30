import React from 'react'
import { Printer, MessageSquare, X, Check, ShieldAlert } from 'lucide-react'
import type { ComprobanteInternoData } from './types'

interface ModalComprobanteXProps {
  isOpen: boolean
  onClose: () => void
  data: ComprobanteInternoData
}

export function ModalComprobanteX({ isOpen, onClose, data }: ModalComprobanteXProps) {
  if (!isOpen) return null

  const tallerNombre = data.tallerNombre || 'Taller Mecánico & Carrocería'

  function handleImprimir() {
    window.print()
  }

  function handleWhatsApp() {
    const texto = `Hola ${data.clienteNombre}, te compartimos el comprobante de taller ${data.numeroCompleto} (${data.tipo}) por los trabajos sobre tu vehículo ${data.vehiculo} (${data.patente}).\n\nMonto total: $ ${new Intl.NumberFormat('es-AR').format(data.monto)}.\nFecha: ${data.fechaEmision}.\n\n¡Gracias por tu confianza!\n${tallerNombre}`
    const tel = (data.clienteTelefono || '').replace(/\D/g, '')
    const url = tel ? `https://wa.me/${tel}?text=${encodeURIComponent(texto)}` : `https://wa.me/?text=${encodeURIComponent(texto)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-md shadow-2xl border-2 border-graphite max-w-2xl w-full flex flex-col my-auto max-h-[92vh] overflow-hidden print:max-h-none print:shadow-none print:border-0 print:w-full">
        {/* Actions Bar (hidden on print) */}
        <div className="bg-navy text-white px-4 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-white/20 font-mono font-bold flex items-center justify-center text-xs">
              X
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wide">
              {data.tipo} — {data.numeroCompleto}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImprimir}
              className="inline-flex items-center gap-1.5 bg-blue hover:bg-blue/90 text-white font-mono text-xs font-bold uppercase px-3 py-1.5 rounded-sm transition cursor-pointer"
            >
              <Printer size={14} />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold uppercase px-3 py-1.5 rounded-sm transition cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Voucher Sheet */}
        <div className="p-6 overflow-y-auto font-sans text-graphite print:p-8 print:overflow-visible">
          {/* Header */}
          <div className="border-2 border-graphite grid grid-cols-12 relative mb-4">
            {/* Left Column: Workshop info */}
            <div className="col-span-5 p-3.5 border-r-2 border-graphite flex flex-col justify-center">
              <h2 className="font-display uppercase text-lg sm:text-xl font-bold text-navy leading-none mb-1">
                {tallerNombre}
              </h2>
              <p className="text-[11px] font-mono text-steel-700 leading-tight">
                Reparación Automotriz • Chapa y Pintura • Mecánica
              </p>
              <p className="text-[10px] text-steel-500 mt-2 font-mono">
                Domicilio Comercial del Taller
              </p>
              <p className="text-[10px] text-steel-500 font-mono">
                IVA Responsable Inscripto / Monotributo
              </p>
            </div>

            {/* Center Box: The Big "X" Badge */}
            <div className="col-span-2 flex flex-col items-center justify-center p-2 bg-steel-100 border-r-2 border-graphite text-center">
              <span className="font-display text-4xl font-bold text-navy leading-none">
                X
              </span>
              <span className="font-mono text-[8px] font-bold uppercase text-steel-600 tracking-tighter mt-1 block">
                CÓD. 099
              </span>
              <span className="text-[7px] text-red-700 font-bold uppercase text-center block mt-0.5 leading-tight">
                DOC. NO VÁLIDO COMO FACTURA
              </span>
            </div>

            {/* Right Column: Voucher metadata */}
            <div className="col-span-5 p-3.5 flex flex-col justify-center">
              <h3 className="font-display uppercase text-base sm:text-lg font-bold text-navy leading-none">
                {data.tipo.toUpperCase()}
              </h3>
              <p className="font-mono font-bold text-xs sm:text-sm text-graphite mt-1.5">
                N°: {data.numeroCompleto}
              </p>
              <p className="font-mono text-[11px] text-steel-600 mt-1">
                Fecha: <strong>{data.fechaEmision}</strong>
              </p>
              <div className="mt-2 pt-1 border-t border-steel-200">
                <span className="text-[9px] font-mono uppercase text-steel-500 block">
                  Uso Exclusivo Interno de Taller
                </span>
              </div>
            </div>
          </div>

          {/* Subheader Warning */}
          <div className="bg-amber-50 border border-amber-300 p-2 text-center text-[10px] font-mono text-amber-900 mb-4 rounded-xs flex items-center justify-center gap-1.5">
            <ShieldAlert size={12} className="shrink-0 text-amber-700" />
            <span>
              DOCUMENTO NO FISCAL — COMPROBANTE DE CONTROL INTERNO Y RECEPCIÓN DE TRABAJO
            </span>
          </div>

          {/* Client & Car Information Grid */}
          <div className="border border-graphite p-3 mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <span className="font-mono text-steel-500 uppercase text-[10px] block font-bold">
                Cliente / Titular
              </span>
              <strong className="text-graphite">{data.clienteNombre}</strong>
            </div>

            <div>
              <span className="font-mono text-steel-500 uppercase text-[10px] block font-bold">
                Vehículo
              </span>
              <strong className="text-graphite">{data.vehiculo}</strong>
            </div>

            <div>
              <span className="font-mono text-steel-500 uppercase text-[10px] block font-bold">
                Teléfono de Contacto
              </span>
              <span className="font-mono text-steel-700">{data.clienteTelefono || 'No informado'}</span>
            </div>

            <div>
              <span className="font-mono text-steel-500 uppercase text-[10px] block font-bold">
                Dominio (Patente)
              </span>
              <span className="font-mono font-bold text-sm bg-steel-100 px-2 py-0.5 rounded border border-steel-300 inline-block text-navy">
                {data.patente}
              </span>
            </div>
          </div>

          {/* Items / Concept Table */}
          <div className="border border-graphite mb-4">
            <table className="w-full text-xs text-left">
              <thead className="bg-steel-100 border-b border-graphite font-mono text-[10px] uppercase text-navy">
                <tr>
                  <th className="py-2 px-3">Cant.</th>
                  <th className="py-2 px-3">Descripción de Tareas / Mano de Obra / Repuestos</th>
                  <th className="py-2 px-3 text-right">Importe Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-200">
                <tr>
                  <td className="py-3 px-3 font-mono text-center align-top">1</td>
                  <td className="py-3 px-3 align-top">
                    <p className="font-semibold text-graphite m-0">
                      {data.concepto || `Servicio y reparación sobre vehículo ${data.vehiculo} patente ${data.patente}`}
                    </p>
                    <p className="text-[11px] text-steel-500 mt-1 font-mono">
                      Mano de obra especializada de taller, desarme, reparación y materiales.
                    </p>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold align-top">
                    $ {new Intl.NumberFormat('es-AR').format(data.monto)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Box */}
          <div className="flex justify-end mb-6">
            <div className="bg-steel-100 border-2 border-graphite p-3 min-w-[220px] text-right">
              <span className="font-mono text-[11px] text-steel-600 uppercase block font-bold">
                Total a Abonar
              </span>
              <span className="font-display text-2xl font-bold text-navy block">
                $ {new Intl.NumberFormat('es-AR').format(data.monto)}
              </span>
              <span className="text-[10px] font-mono text-steel-500">
                Pesos Argentinos
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-dashed border-steel-300 text-center text-xs font-mono">
            <div>
              <div className="border-b border-graphite mb-1.5 h-10"></div>
              <span className="text-steel-600 uppercase text-[10px] font-bold block">
                Firma y Sello del Taller
              </span>
            </div>
            <div>
              <div className="border-b border-graphite mb-1.5 h-10"></div>
              <span className="text-steel-600 uppercase text-[10px] font-bold block">
                Recibí Conforme (Firma del Cliente)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
