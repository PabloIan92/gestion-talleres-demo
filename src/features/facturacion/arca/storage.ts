import type { ConfiguracionArca } from './types'

const ARCA_CONFIG_STORAGE_KEY = 'aguila_blanca_arca_config'

export const DEFAULT_ARCA_CONFIG: ConfiguracionArca = {
  cuit: '30-71234567-8',
  puntoVenta: 1,
  ambiente: 'homologacion',
  tipoFacturaDefault: 'Factura B',
  conceptoDefault: 2, // Servicios
  certificadoCrt: '',
  clavePrivadaKey: '',
  iibb: '901-123456-7',
  fechaInicioActividades: '2020-03-01',
  activo: false,
  ultimoComprobanteEmitido: 0,
}

export function getArcaConfig(): ConfiguracionArca {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_ARCA_CONFIG
  }

  try {
    const raw = window.localStorage.getItem(ARCA_CONFIG_STORAGE_KEY)
    if (!raw) return DEFAULT_ARCA_CONFIG
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_ARCA_CONFIG,
      ...parsed,
    }
  } catch {
    return DEFAULT_ARCA_CONFIG
  }
}

export function saveArcaConfig(config: ConfiguracionArca): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.setItem(ARCA_CONFIG_STORAGE_KEY, JSON.stringify(config))
  } catch (err) {
    console.error('Error guardando configuración de ARCA en localStorage:', err)
  }
}

export function isArcaConfigured(config: ConfiguracionArca): boolean {
  const cleanCuit = (config.cuit || '').replace(/\D/g, '')
  return (
    config.activo &&
    cleanCuit.length === 11 &&
    config.puntoVenta > 0 &&
    (config.ambiente === 'homologacion' || (Boolean(config.certificadoCrt) && Boolean(config.clavePrivadaKey)))
  )
}
