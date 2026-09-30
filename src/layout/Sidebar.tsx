import React from 'react'
import {
  ClipboardList,
  Calendar,
  Package,
  Receipt,
  BarChart2,
  Users,
  Mail,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'
import type { DemoRole } from '../types/taller'

export interface NavItemConfig {
  id: string
  label: string
  icon: LucideIcon
  roles: DemoRole[]
}

export const NAV_ITEMS: NavItemConfig[] = [
  { id: 'casos', label: 'Casos', icon: ClipboardList, roles: ['dueno', 'taller'] },
  { id: 'turnos', label: 'Turnos', icon: Calendar, roles: ['recepcion'] },
  { id: 'casos_rec', label: 'Casos', icon: ClipboardList, roles: ['recepcion'] },
  { id: 'stock', label: 'Stock', icon: Package, roles: ['dueno', 'recepcion', 'taller'] },
  { id: 'facturacion', label: 'Facturación', icon: Receipt, roles: ['dueno'] },
  { id: 'informes', label: 'Informes', icon: BarChart2, roles: ['dueno'] },
  { id: 'crm', label: 'CRM', icon: Users, roles: ['dueno', 'recepcion'] },
  { id: 'plantillas', label: 'Plantillas', icon: Mail, roles: ['dueno', 'recepcion'] },
  { id: 'guia', label: 'Guía de Uso', icon: BookOpen, roles: ['dueno', 'recepcion', 'taller'] },
]

interface SidebarProps {
  currentTab: string
  onSelectTab: (tab: string) => void
  role: DemoRole
}

export function Sidebar({ currentTab, onSelectTab, role }: SidebarProps) {
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <nav
      className="bg-navy text-white flex flex-col p-4 gap-1 select-none shrink-0"
      style={{ width: '220px', minWidth: '220px' }}
      aria-label="Navegación principal"
    >
      <div className="pb-2 mb-1 border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-steel-400 px-3">
        Menú Principal
      </div>

      {items.map((item) => {
        const Icon = item.icon
        const targetId = item.id === 'casos_rec' ? 'casos' : item.id
        const isActive = (currentTab === 'casos' && (item.id === 'casos' || item.id === 'casos_rec')) || currentTab === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(targetId)}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-sans font-semibold rounded-sm transition-colors text-left cursor-pointer w-full ${
              isActive
                ? 'bg-blue text-white shadow-xs font-bold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={18} strokeWidth={isActive ? 2.4 : 2} className="shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        )
      })}

      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="px-3 py-2 bg-white/5 rounded text-[11px] font-mono text-steel-300">
          <p className="font-bold text-white uppercase text-[10px]">Taller Multimarca</p>
          <p className="text-[10px] text-steel-400 mt-0.5">Mecánica y Carrocería</p>
        </div>
      </div>
    </nav>
  )
}
