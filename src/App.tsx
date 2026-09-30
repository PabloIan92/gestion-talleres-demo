import React, { useState } from 'react'
import { DemoStoreProvider, useDemoStore } from './context/DemoStoreContext'
import { RoleSelectorBanner } from './components/RoleSelectorBanner'
import { BrandLogo } from './components/BrandLogo'
import { PlanillaControlTaller } from './components/PlanillaControlTaller'
import { VistaStock } from './components/VistaStock'
import { VistaInformes } from './components/VistaInformes'
import { GuiaOperativa } from './components/GuiaOperativa'
import { ModalNuevoCaso } from './components/ModalNuevoCaso'
import { ModalDetalleCaso } from './components/ModalDetalleCaso'
import { LayoutGrid, TrendingUp, Package, BookOpen } from 'lucide-react'

const AppContent: React.FC = () => {
  const { rol, casoSeleccionado, setCasoSeleccionado } = useDemoStore()
  const [tab, setTab] = useState<'planilla' | 'informes' | 'stock' | 'guia'>('planilla')
  const [isNuevoCasoOpen, setIsNuevoCasoOpen] = useState(false)

  const navItems = [
    { id: 'planilla' as const, label: 'Planilla de Control (9 Etapas)', icon: LayoutGrid },
    { id: 'informes' as const, label: 'Informes y Rentabilidad', icon: TrendingUp, onlyAdmin: true },
    { id: 'stock' as const, label: 'Stock y Repuestos', icon: Package },
    { id: 'guia' as const, label: 'Guía de Puesto', icon: BookOpen }
  ]

  const visibleNav = navItems.filter(item => !item.onlyAdmin || rol === 'dueno')

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      {/* 1. Top interactive role switcher */}
      <RoleSelectorBanner />

      {/* 2. Brand Header */}
      <header className="bg-[#123a6b] text-white border-b-2 border-blue-950 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <BrandLogo size="md" />

          {/* Navigation Bar */}
          <nav className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-blue-900/80">
            {visibleNav.map(item => {
              const Icon = item.icon
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* 3. Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-5 py-5 flex-1 w-full">
        {tab === 'planilla' && (
          <PlanillaControlTaller onOpenNuevoCaso={() => setIsNuevoCasoOpen(true)} />
        )}
        {tab === 'informes' && <VistaInformes />}
        {tab === 'stock' && <VistaStock />}
        {tab === 'guia' && <GuiaOperativa />}
      </main>

      {/* Modals */}
      <ModalNuevoCaso
        isOpen={isNuevoCasoOpen}
        onClose={() => setIsNuevoCasoOpen(false)}
      />

      <ModalDetalleCaso
        caso={casoSeleccionado}
        onClose={() => setCasoSeleccionado(null)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-4 border-t border-slate-800 text-xs font-mono text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sistema de Gestión para Talleres • Versión Demostración Interactiva</span>
          <span className="text-slate-500">Mecánica • Service • Chapa y Carrocería • Siniestros</span>
        </div>
      </footer>
    </div>
  )
}

export function App() {
  return (
    <DemoStoreProvider>
      <AppContent />
    </DemoStoreProvider>
  )
}

export default App
