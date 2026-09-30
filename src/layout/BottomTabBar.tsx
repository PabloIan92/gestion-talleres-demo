import React from 'react'
import {
  ClipboardList,
  Calendar,
  Package,
  Receipt,
  BarChart2,
  Users,
  BookOpen,
} from 'lucide-react'
import type { DemoRole } from '../types/taller'
import { NAV_ITEMS } from './Sidebar'

interface BottomTabBarProps {
  currentTab: string
  onSelectTab: (tab: string) => void
  role: DemoRole
}

export function BottomTabBar({ currentTab, onSelectTab, role }: BottomTabBarProps) {
  // Mobile typically shows top 4-5 items
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role)).slice(0, 5)

  return (
    <nav
      className="md:hidden sticky bottom-0 z-40 bg-navy text-white flex items-center justify-around border-t border-white/15 shadow-[0_-3px_12px_rgba(0,0,0,0.2)]"
      style={{
        minHeight: '58px',
        paddingBottom: 'max(6px, env(safe-area-inset-bottom, 0px))',
      }}
      aria-label="Navegación principal móvil"
    >
      {items.map((item) => {
        const Icon = item.icon
        const targetId = item.id === 'casos_rec' ? 'casos' : item.id
        const isActive = (currentTab === 'casos' && (item.id === 'casos' || item.id === 'casos_rec')) || currentTab === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(targetId)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 flex-1 min-w-0 text-[11px] font-sans font-medium transition-all text-center relative cursor-pointer ${
              isActive
                ? 'text-white font-bold bg-blue/70 border-t-2 border-white'
                : 'text-steel-300 hover:text-white hover:bg-white/5'
            }`}
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.3 : 1.8}
              className={`shrink-0 ${isActive ? 'text-white scale-105' : 'text-steel-300'} transition-transform`}
            />
            <span className="truncate max-w-full tracking-tight mt-0.5 text-[10px]">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
