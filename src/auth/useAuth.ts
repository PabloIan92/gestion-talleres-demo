import { useDemoStore } from '../context/DemoStoreContext'

export interface Profile {
  id: string
  full_name: string
  role: 'dueno' | 'recepcion' | 'taller' | 'sin_rol'
}

export function useAuth() {
  const { rol } = useDemoStore()
  return {
    profile: {
      id: 'demo-user',
      full_name: rol === 'dueno' ? 'Gerente / Dueño' : rol === 'recepcion' ? 'Asesor de Recepción' : 'Técnico de Taller',
      role: rol
    },
    loading: false,
    profileError: false,
    retryProfile: () => {},
    signOut: () => {}
  }
}
