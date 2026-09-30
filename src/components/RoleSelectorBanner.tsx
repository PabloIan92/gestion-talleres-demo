import React from 'react'
import { useDemoStore } from '../context/DemoStoreContext'
import { ShieldCheck, UserCheck, Wrench, RotateCcw, Sparkles } from 'lucide-react'

export const RoleSelectorBanner: React.FC = () => {
  const { rol, setRol, reiniciarDatosDemo } = useDemoStore()

  const roles = [
    {
      id: 'dueno' as const,
      label: 'Dueño / Gerencia',
      icon: ShieldCheck,
      description: 'Vista total: planilla de control general, facturación, reportes de rentabilidad, stock y CRM.'
    },
    {
      id: 'recepcion' as const,
      label: 'Recepción / Asesor',
      icon: UserCheck,
      description: 'Recepción del auto: alta de casos, kilometraje, inspección de 16 zonas, turnos y entrega final con firma.'
    },
    {
      id: 'taller' as const,
      label: 'Taller / Mecánico',
      icon: Wrench,
      description: 'Operativa de piso: autos en fosa/elevador, tareas a realizar, botón "Esperando repuesto" y fotos finales.'
    }
  ]

  return (
    <div className="bg-[#0f243d] text-white border-b border-blue-900/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Role Switcher Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-amber-400 font-semibold mr-1">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>Modo Demostración:</span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-900/80 p-1 border border-slate-700/60 shadow-inner">
            {roles.map(r => {
              const Icon = r.icon
              const activo = rol === r.id
              return (
                <button
                  key={r.id}
                  onClick={() => setRol(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                    activo
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{r.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Reset Demo Data */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          <button
            onClick={() => {
              if (window.confirm('¿Desea restablecer todos los casos y datos al estado original de la demo?')) {
                reiniciarDatosDemo()
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 rounded border border-slate-700 transition cursor-pointer"
            title="Reiniciar casos de prueba"
          >
            <RotateCcw size={13} />
            <span>Restablecer Demo</span>
          </button>
        </div>
      </div>

      {/* Role explanation subtitle banner */}
      <div className="bg-[#16385f] px-4 py-1.5 text-[11px] sm:text-xs text-blue-100 flex items-center gap-2 border-t border-blue-800/40">
        <span className="font-bold text-amber-300 font-mono uppercase">
          Rol Activo: {roles.find(r => r.id === rol)?.label} —
        </span>
        <span className="text-slate-200">
          {roles.find(r => r.id === rol)?.description}
        </span>
      </div>
    </div>
  )
}
