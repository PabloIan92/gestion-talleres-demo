import React from 'react'
import { BookOpen, CheckCircle, Wrench, Shield, Car, PenTool } from 'lucide-react'

export const GuiaOperativa: React.FC = () => {
  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-xs">
        <h2 className="font-display uppercase text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="text-blue-600" size={22} />
          <span>Manual de Operaciones y Flujo de Trabajo</span>
        </h2>
        <p className="text-xs font-mono text-slate-500 uppercase mt-1">
          Guía práctica de uso del sistema para el personal del taller y recepción
        </p>
      </div>

      <div className="space-y-4">
        {/* Paso 1: Recepción */}
        <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-display font-bold uppercase text-base">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono text-xs">1</span>
            <h3>Recepción del Vehículo y Check-in (16 Zonas)</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Al ingresar un auto (sea para mecánica, service o chapa), recepción registra los datos del cliente, kilometraje y combustible. A través del diagrama interactivo de 16 zonas, se dejan marcados los rayones o abolladuras preexistentes para evitar disputas posteriores al entregar el auto.
          </p>
        </div>

        {/* Paso 2: Taller */}
        <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-display font-bold uppercase text-base">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono text-xs">2</span>
            <h3>Piso de Taller: Diagnóstico, Reparación y Repuestos</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Los mecánicos y operarios consultan la orden directamente en tablet o celular. Si al desarmar se detecta una pieza dañada (pastillas de freno, tensores o trabas de paragolpes), tocan el botón rojo <strong className="text-amber-700">"Esperando Repuesto"</strong> para avisar inmediatamente a administración sin interrumpir la línea de trabajo.
          </p>
        </div>

        {/* Paso 3: Retiro */}
        <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-display font-bold uppercase text-base">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono text-xs">3</span>
            <h3>Firma Digital de Conformidad y Facturación</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Al terminar el trabajo, el cliente firma en la pantalla con el dedo o lápiz óptico la constancia de entrega. Esto actualiza la planilla en tiempo real y habilita la facturación y cobranza en el módulo administrativo.
          </p>
        </div>
      </div>
    </div>
  )
}
