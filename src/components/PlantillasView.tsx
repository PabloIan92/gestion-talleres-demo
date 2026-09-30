import React, { useState } from 'react'
import { Mail, Copy, Check, MessageSquare, Car, Send } from 'lucide-react'
import { useDemoStore } from '../context/DemoStoreContext'

interface Plantilla {
  id: string
  titulo: string
  descripcion: string
  canal: 'WhatsApp' | 'Email'
  asunto?: string
  cuerpo: (vars: {
    tallerNombre: string
    clienteNombre: string
    patente: string
    vehiculo: string
    monto?: string
    siniestro?: string
  }) => string
}

const PLANTILLAS: Plantilla[] = [
  {
    id: 'turno_confirmado',
    titulo: 'Turno Confirmado / Recordatorio de Ingreso',
    descripcion: 'Para enviar al cliente cuando se le asigna día y horario de recepción.',
    canal: 'WhatsApp',
    cuerpo: (v) =>
      `Hola ${v.clienteNombre}, te confirmamos el turno en ${v.tallerNombre} para el vehículo ${v.vehiculo} (Patente ${v.patente}).\n\nPor favor acercate con cédula verde y asegurate de retirar objetos de valor del habitáculo.\n\n¡Te esperamos!`
  },
  {
    id: 'vehiculo_ingresado',
    titulo: 'Recepción e Inspección de Ingreso Realizada',
    descripcion: 'Para enviar al cliente con el acta de recepción firmada y las fotos iniciales.',
    canal: 'WhatsApp',
    cuerpo: (v) =>
      `Hola ${v.clienteNombre}, tu vehículo ${v.vehiculo} (${v.patente}) ya ingresó a nuestro taller. Realizamos el checklist de 16 zonas con fotografía digital y nivel de combustible verificado. Te mantendremos informado sobre el avance del trabajo.`
  },
  {
    id: 'presupuesto_seguro',
    titulo: 'Presupuesto a Aseguradora / Perito',
    descripcion: 'Email formal con desglose de repuestos y mano de obra para compañía de seguros.',
    canal: 'Email',
    asunto: 'Presupuesto de Reparación - Siniestro [SINIESTRO] - Patente [PATENTE]',
    cuerpo: (v) =>
      `Estimados,\n\nAdjuntamos presupuesto correspondiente a la reparación del vehículo ${v.vehiculo} patente ${v.patente}.\n\nTitular: ${v.clienteNombre}\nSiniestro: ${v.siniestro || 'A confirmar'}\nPresupuesto Estimado: ${v.monto || '$0'}\n\nAguardamos su pronta aprobación para dar inicio a los trabajos.\n\nAtentamente,\n${v.tallerNombre}`
  },
  {
    id: 'trabajo_terminado',
    titulo: 'Vehículo Listo para Retirar',
    descripcion: 'Aviso de finalización de trabajo para que el cliente pase a abonar y retirar.',
    canal: 'WhatsApp',
    cuerpo: (v) =>
      `¡Buenas noticias ${v.clienteNombre}! Tu auto ${v.vehiculo} (${v.patente}) ya se encuentra 100% terminado, revisado en control de calidad y listo para retirar en ${v.tallerNombre}.\n\nPodés pasar de lunes a viernes de 8:30 a 18:30 hs.\n\n¡Gracias por tu confianza!`
  }
]

export function PlantillasView() {
  const { casos } = useDemoStore()
  const casoEjemplo = casos[0] || {
    cliente_nombre: 'Gonzalo Rossi',
    patente: 'AD123XY',
    vehiculo_marca_modelo: 'Ford Focus 2.0 Titanium',
    presupuesto_monto: 380000,
    numero_siniestro: 'SIN-88492'
  }

  const [copiadoId, setCopiadoId] = useState<string | null>(null)

  function copiarTexto(id: string, texto: string) {
    navigator.clipboard.writeText(texto)
    setCopiadoId(id)
    setTimeout(() => setCopiadoId(null), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="pb-4 border-b border-steel-300">
        <div className="flex items-center gap-2 text-blue font-mono text-xs font-bold uppercase">
          <Mail size={16} />
          <span>Comunicaciones Estandarizadas</span>
        </div>
        <h2 className="font-display text-2xl font-bold uppercase text-navy">
          Plantillas de Mensajes y Notificaciones
        </h2>
        <p className="text-xs text-steel-600 font-sans mt-0.5">
          Mensajes listos para copiar y enviar por WhatsApp o Email a clientes y peritos con los datos del caso autocompletados.
        </p>
      </div>

      {/* Grid de Plantillas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLANTILLAS.map((p) => {
          const texto = p.cuerpo({
            tallerNombre: 'Taller Central de Mecánica y Carrocería',
            clienteNombre: casoEjemplo.cliente_nombre,
            patente: casoEjemplo.patente,
            vehiculo: casoEjemplo.vehiculo_marca_modelo,
            monto: `$ ${new Intl.NumberFormat('es-AR').format(casoEjemplo.presupuesto_monto)}`,
            siniestro: casoEjemplo.numero_siniestro
          })

          const isCopied = copiadoId === p.id

          return (
            <div
              key={p.id}
              className="bg-white border border-steel-300 rounded p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-steel-200 mb-3">
                  <div>
                    <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      p.canal === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue/10 text-blue'
                    }`}>
                      {p.canal === 'WhatsApp' ? <MessageSquare size={11} /> : <Mail size={11} />}
                      <span>{p.canal}</span>
                    </span>
                    <h3 className="font-display uppercase text-sm font-bold text-navy mt-1 m-0">
                      {p.titulo}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-steel-600 font-sans mb-3">
                  {p.descripcion}
                </p>

                {p.asunto && (
                  <div className="mb-2 p-2 bg-steel-50 rounded border border-steel-200 text-xs font-mono text-steel-800">
                    <span className="text-steel-500 font-bold">Asunto: </span>
                    {p.asunto
                      .replace('[PATENTE]', casoEjemplo.patente)
                      .replace('[SINIESTRO]', casoEjemplo.numero_siniestro || 'SIN-9912')}
                  </div>
                )}

                <div className="p-3 bg-steel-100/70 border border-steel-200 rounded font-mono text-xs text-graphite whitespace-pre-line leading-relaxed">
                  {texto}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-steel-200 flex items-center justify-between">
                <span className="text-[11px] font-mono text-steel-500">
                  Previsualizado con: {casoEjemplo.patente}
                </span>
                <button
                  type="button"
                  onClick={() => copiarTexto(p.id, texto)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-700 text-white'
                      : 'bg-navy hover:bg-blue text-white shadow-xs'
                  }`}
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? '¡Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
