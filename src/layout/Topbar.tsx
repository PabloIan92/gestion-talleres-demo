import React, { useState } from 'react'
import {
  Plus,
  BookOpen,
  Menu,
  X,
  Bell,
  UserCheck,
  Wrench,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'
import type { DemoRole } from '../types/taller'
import { BotonDescargarApp } from '../features/pwa/BotonDescargarApp'

const ROLE_LABELS: Record<DemoRole, string> = {
  dueno: 'Dueño',
  recepcion: 'Recepción',
  taller: 'Taller',
}

interface TopbarProps {
  currentRole: DemoRole
  onRoleChange: (newRole: DemoRole) => void
  onSelectTab: (tab: string) => void
  onOpenNuevoCaso: () => void
  onResetData?: () => void
}

export function Topbar({
  currentRole,
  onRoleChange,
  onSelectTab,
  onOpenNuevoCaso,
  onResetData,
}: TopbarProps) {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false)

  return (
    <header
      className="bg-navy text-white z-30 relative shadow-md"
      style={{ boxShadow: 'var(--shadow-topbar)' }}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 min-h-[58px] sm:min-h-[72px]">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <button
            type="button"
            onClick={() => onSelectTab('casos')}
            className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer group bg-transparent border-0 p-0"
            aria-label="Ir al inicio"
          >
            <img
              src="./logo-taller.svg"
              alt="Logo Taller"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain rounded-md shadow-md border border-white/25 shrink-0 group-hover:brightness-110 transition-all"
            />
            <div className="flex flex-col justify-center min-w-0">
              <h1
                className="font-display uppercase m-0 tracking-wide text-white text-base sm:text-lg md:text-xl truncate"
                style={{ lineHeight: 1.1 }}
              >
                Gestión de Talleres
              </h1>
              <span className="font-mono text-[10px] sm:text-[11px] text-steel-300 uppercase tracking-wider truncate">
                Mecánica • Chapa • Carrocería • Siniestros
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Controls (hidden on mobile < 768px) */}
        <div className="hidden md:flex items-center justify-end gap-2 sm:gap-2.5">
          {/* Interactive Role Switcher for Demo testing */}
          <div className="flex items-center bg-black/25 rounded p-0.5 border border-white/20 mr-1">
            <span className="text-[10px] font-mono uppercase text-steel-300 px-2 font-semibold">
              Rol Demo:
            </span>
            {(['dueno', 'recepcion', 'taller'] as DemoRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer ${
                  currentRole === r
                    ? 'bg-blue text-white shadow-xs'
                    : 'text-steel-300 hover:text-white hover:bg-white/10'
                }`}
                title={`Cambiar a vista de ${ROLE_LABELS[r]}`}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>

          <BotonDescargarApp />

          <button
            type="button"
            onClick={() => onSelectTab('guia')}
            className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-sm transition-colors flex items-center gap-1.5 border border-white/25 shadow-sm cursor-pointer"
            title="Guía y manual de uso del sistema"
          >
            <BookOpen size={14} />
            <span>Guía</span>
          </button>

          {(currentRole === 'dueno' || currentRole === 'recepcion') && (
            <button
              type="button"
              onClick={onOpenNuevoCaso}
              className="bg-blue hover:bg-blue/90 text-white font-mono text-xs font-bold uppercase px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-sm transition-colors flex items-center gap-1 border border-white/25 shadow-sm cursor-pointer"
              title="Cargar un nuevo caso"
            >
              <Plus size={14} strokeWidth={3} />
              <span>Nuevo caso</span>
            </button>
          )}

          {/* Notificaciones */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificacionesAbiertas(!notificacionesAbiertas)}
              className="p-2 rounded-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors relative cursor-pointer"
              title="Notificaciones activas"
            >
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {notificacionesAbiertas && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-graphite rounded-md shadow-xl border border-steel-200 p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-steel-200">
                  <span className="font-mono text-xs font-bold uppercase text-navy">Notificaciones</span>
                  <span className="text-[10px] text-steel-500 font-mono">2 pendientes</span>
                </div>
                <div className="space-y-2 pt-2 text-xs">
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                    <p className="font-bold text-amber-900">Repuesto ingresado</p>
                    <p className="text-amber-800 text-[11px]">Llegó el kit de distribución para Ford Focus (AD123XY).</p>
                  </div>
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="font-bold text-blue-900">Siniestro Aprobado</p>
                    <p className="text-blue-800 text-[11px]">La Segunda autorizó presupuesto de Toyota Hilux (AF987PZ).</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Badge de Rol */}
          <span className="font-mono text-xs border border-white/35 bg-white/10 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-sm inline-block font-semibold">
            {ROLE_LABELS[currentRole]}
          </span>
        </div>

        {/* Mobile Compact Controls (visible on < 768px) */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          {(currentRole === 'dueno' || currentRole === 'recepcion') && (
            <button
              type="button"
              onClick={onOpenNuevoCaso}
              className="bg-blue hover:bg-blue/90 text-white font-mono text-xs font-bold uppercase px-2 py-1.5 rounded-sm flex items-center gap-1 border border-white/30 shadow-xs cursor-pointer"
              aria-label="Nuevo caso"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[11px]">Caso</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectTab('guia')}
            className="p-1.5 rounded-sm bg-white/10 border border-white/25 text-white hover:bg-white/20 transition-colors"
            title="Guía"
          >
            <BookOpen size={16} />
          </button>

          <button
            type="button"
            onClick={() => setMenuMovilAbierto((prev) => !prev)}
            className="p-1.5 rounded-sm bg-white/10 border border-white/25 text-white hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
            aria-label={menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuMovilAbierto}
          >
            {menuMovilAbierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {menuMovilAbierto && (
        <div className="md:hidden border-t border-white/15 bg-navy/95 backdrop-blur-md px-4 py-3.5 space-y-3 animate-in slide-in-from-top-2 duration-150">
          {/* User Info / Role Selector */}
          <div className="pb-2.5 border-b border-white/15">
            <p className="font-mono text-[10px] text-steel-300 uppercase mb-1">Cambiar Rol de Prueba:</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(['dueno', 'recepcion', 'taller'] as DemoRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r)
                    setMenuMovilAbierto(false)
                  }}
                  className={`py-1.5 px-2 text-xs font-mono font-bold uppercase rounded transition-colors text-center ${
                    currentRole === r
                      ? 'bg-blue text-white'
                      : 'bg-white/10 text-steel-200'
                  }`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onSelectTab('guia')
                setMenuMovilAbierto(false)
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase px-3 py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 border border-white/25"
            >
              <BookOpen size={16} />
              <span>Guía de Uso</span>
            </button>

            <div onClick={() => setMenuMovilAbierto(false)} className="w-full">
              <BotonDescargarApp className="w-full justify-center py-2.5" />
            </div>
          </div>

          {onResetData && (
            <button
              type="button"
              onClick={() => {
                onResetData()
                setMenuMovilAbierto(false)
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono font-bold uppercase text-steel-300 hover:text-white hover:bg-white/10 rounded border border-white/20 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Restablecer Datos Demo</span>
            </button>
          )}
        </div>
      )}
    </header>
  )
}
