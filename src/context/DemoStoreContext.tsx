import React, { createContext, useContext, useState, useEffect } from 'react'
import type { CasoDemo, ItemStock, ReporteMes, DemoRole, TipoServicioId, EtapaCaso } from '../types/taller'
import { CASOS_INICIALES, ITEMS_STOCK_INICIALES, REPORTES_MESES_INICIALES } from '../data/demoInitialData'

interface DemoStoreContextType {
  rol: DemoRole
  setRol: (rol: DemoRole) => void
  casos: CasoDemo[]
  stock: ItemStock[]
  reportes: ReporteMes[]
  casoSeleccionado: CasoDemo | null
  setCasoSeleccionado: (caso: CasoDemo | null) => void
  crearCaso: (nuevoCaso: Omit<CasoDemo, 'id' | 'orden_numero' | 'dias_en_etapa' | 'created_at'>) => void
  actualizarCaso: (id: string, updates: Partial<CasoDemo>) => void
  avanzarEtapa: (id: string, proximaEtapa: EtapaCaso) => void
  marcarEsperandoRepuesto: (id: string, repuestoNombre: string) => void
  reiniciarDatosDemo: () => void
  filtroServicio: string
  setFiltroServicio: (filtro: string) => void
  filtroCanal: string
  setFiltroCanal: (canal: string) => void
}

const DemoStoreContext = createContext<DemoStoreContextType | null>(null)

export const DemoStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rol, setRolState] = useState<DemoRole>(() => {
    return (localStorage.getItem('taller_demo_rol') as DemoRole) || 'dueno'
  })

  const [casos, setCasos] = useState<CasoDemo[]>(() => {
    const saved = localStorage.getItem('taller_demo_casos')
    if (saved) {
      try { return JSON.parse(saved) } catch { /* ignore */ }
    }
    return CASOS_INICIALES
  })

  const [stock] = useState<ItemStock[]>(ITEMS_STOCK_INICIALES)
  const [reportes] = useState<ReporteMes[]>(REPORTES_MESES_INICIALES)
  const [casoSeleccionado, setCasoSeleccionado] = useState<CasoDemo | null>(null)
  const [filtroServicio, setFiltroServicio] = useState<string>('todos')
  const [filtroCanal, setFiltroCanal] = useState<string>('todos')

  useEffect(() => {
    localStorage.setItem('taller_demo_casos', JSON.stringify(casos))
  }, [casos])

  const setRol = (nuevoRol: DemoRole) => {
    setRolState(nuevoRol)
    localStorage.setItem('taller_demo_rol', nuevoRol)
  }

  const crearCaso = (datos: Omit<CasoDemo, 'id' | 'orden_numero' | 'dias_en_etapa' | 'created_at'>) => {
    const proximoNum = 1047 + casos.length
    const nuevo: CasoDemo = {
      ...datos,
      id: `caso-${Date.now()}`,
      orden_numero: `OT-${proximoNum}`,
      dias_en_etapa: 0,
      created_at: new Date().toISOString().split('T')[0],
      inspeccion_guardada: datos.zonas_dano.length > 0
    }
    setCasos(prev => [nuevo, ...prev])
  }

  const actualizarCaso = (id: string, updates: Partial<CasoDemo>) => {
    setCasos(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    if (casoSeleccionado?.id === id) {
      setCasoSeleccionado(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const avanzarEtapa = (id: string, proximaEtapa: EtapaCaso) => {
    actualizarCaso(id, { estado: proximaEtapa, dias_en_etapa: 0 })
  }

  const marcarEsperandoRepuesto = (id: string, repuestoNombre: string) => {
    actualizarCaso(id, {
      estado: 'esperando repuesto',
      repuesto_faltante: repuestoNombre,
      dias_en_etapa: 0
    })
  }

  const reiniciarDatosDemo = () => {
    setCasos(CASOS_INICIALES)
    localStorage.removeItem('taller_demo_casos')
    setCasoSeleccionado(null)
  }

  return (
    <DemoStoreContext.Provider value={{
      rol,
      setRol,
      casos,
      stock,
      reportes,
      casoSeleccionado,
      setCasoSeleccionado,
      crearCaso,
      actualizarCaso,
      avanzarEtapa,
      marcarEsperandoRepuesto,
      reiniciarDatosDemo,
      filtroServicio,
      setFiltroServicio,
      filtroCanal,
      setFiltroCanal
    }}>
      {children}
    </DemoStoreContext.Provider>
  )
}

export const useDemoStore = () => {
  const ctx = useContext(DemoStoreContext)
  if (!ctx) throw new Error('useDemoStore debe ser usado dentro de DemoStoreProvider')
  return ctx
}
