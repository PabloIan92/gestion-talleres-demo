import React, { useState, useEffect } from 'react'
import { DemoStoreProvider, useDemoStore } from './context/DemoStoreContext'
import { Topbar } from './layout/Topbar'
import { Sidebar } from './layout/Sidebar'
import { BottomTabBar } from './layout/BottomTabBar'
import { PlanillaControl } from './components/PlanillaControl'
import { VistaStock } from './components/VistaStock'
import { FacturacionView } from './components/FacturacionView'
import { VistaInformes } from './components/VistaInformes'
import { CRMView } from './components/CRMView'
import { PlantillasView } from './components/PlantillasView'
import { GuiaUsuarioPage } from './features/guia/GuiaUsuarioPage'
import { ModalNuevoCaso } from './components/ModalNuevoCaso'
import { ModalDetalleCaso } from './components/ModalDetalleCaso'

const TABLET_QUERY = '(max-width: 820px)'

function useIsTabletOrBelow() {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(TABLET_QUERY).matches : false
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(TABLET_QUERY)
    const listener = () => setMatches(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', listener)
    return () => mediaQueryList.removeEventListener('change', listener)
  }, [])

  return matches
}

const AppContent: React.FC = () => {
  const { rol, setRol, casoSeleccionado, setCasoSeleccionado, reiniciarDatosDemo } = useDemoStore()
  const [tab, setTab] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '')
      if (['casos', 'turnos', 'stock', 'facturacion', 'informes', 'crm', 'plantillas', 'guia'].includes(hash)) {
        return hash
      }
    }
    return 'casos'
  })
  const [isNuevoCasoOpen, setIsNuevoCasoOpen] = useState(false)
  const isTabletOrBelow = useIsTabletOrBelow()

  // Hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (['casos', 'turnos', 'stock', 'facturacion', 'informes', 'crm', 'plantillas', 'guia'].includes(hash)) {
        setTab(hash)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Guard: if role changes and current tab is restricted, fallback to 'casos'
  useEffect(() => {
    if (rol === 'taller' && ['facturacion', 'informes', 'crm', 'plantillas'].includes(tab)) {
      setTab('casos')
    } else if (rol === 'recepcion' && ['facturacion', 'informes'].includes(tab)) {
      setTab('casos')
    }
  }, [rol, tab])

  const handleSelectTab = (newTab: string) => {
    setTab(newTab)
    window.location.hash = `#${newTab}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-[#f1f5f9] font-sans">
      {/* 1. Exact Production-grade Topbar */}
      <Topbar
        currentRole={rol}
        onRoleChange={setRol}
        onSelectTab={handleSelectTab}
        onOpenNuevoCaso={() => setIsNuevoCasoOpen(true)}
        onResetData={reiniciarDatosDemo}
      />

      {/* 2. Main layout: Left Vertical Sidebar (220px) + Main Content */}
      <div className="flex-1 flex w-full max-w-full min-w-0">
        {!isTabletOrBelow && (
          <Sidebar
            currentTab={tab}
            onSelectTab={handleSelectTab}
            role={rol}
          />
        )}

        <main className="flex-1 w-full max-w-full min-w-0 p-3 sm:p-6 overflow-y-auto">
          {(tab === 'casos' || tab === 'turnos') && (
            <PlanillaControl
              onOpenNuevoCaso={() => setIsNuevoCasoOpen(true)}
              onNavigateTab={handleSelectTab}
            />
          )}

          {tab === 'facturacion' && <FacturacionView />}

          {tab === 'stock' && <VistaStock />}

          {tab === 'informes' && <VistaInformes />}

          {tab === 'crm' && <CRMView />}

          {tab === 'plantillas' && <PlantillasView />}

          {tab === 'guia' && (
            <GuiaUsuarioPage onVolver={() => handleSelectTab('casos')} />
          )}
        </main>
      </div>

      {/* 3. Mobile Navigation Bottom Bar */}
      {isTabletOrBelow && (
        <BottomTabBar
          currentTab={tab}
          onSelectTab={handleSelectTab}
          role={rol}
        />
      )}

      {/* Modals */}
      <ModalNuevoCaso
        isOpen={isNuevoCasoOpen}
        onClose={() => setIsNuevoCasoOpen(false)}
      />

      <ModalDetalleCaso
        caso={casoSeleccionado}
        onClose={() => setCasoSeleccionado(null)}
      />
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
