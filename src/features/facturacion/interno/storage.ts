import {
  TipoComprobanteInterno,
  prefijoPorTipo,
  formatearNumeroComprobanteInterno,
} from './types'

export { formatearNumeroComprobanteInterno }

const STORAGE_KEYS: Record<TipoComprobanteInterno, string> = {
  'Factura X': 'taller_correlativo_factura_x',
  'Remito X': 'taller_correlativo_remito_x',
  'Recibo X': 'taller_correlativo_recibo_x',
  'Presupuesto X': 'taller_correlativo_presupuesto_x',
}

const DEFAULT_NUMEROS: Record<TipoComprobanteInterno, number> = {
  'Factura X': 101,
  'Remito X': 51,
  'Recibo X': 201,
  'Presupuesto X': 301,
}

export function getProximoNumeroInterno(tipo: TipoComprobanteInterno): number {
  if (typeof window === 'undefined') return DEFAULT_NUMEROS[tipo]
  try {
    const key = STORAGE_KEYS[tipo]
    const guardado = localStorage.getItem(key)
    if (guardado) {
      const num = parseInt(guardado, 10)
      if (!isNaN(num) && num > 0) return num
    }
  } catch {
    // fallback
  }
  return DEFAULT_NUMEROS[tipo]
}

export function incrementarYGuardarNumeroInterno(tipo: TipoComprobanteInterno): number {
  const actual = getProximoNumeroInterno(tipo)
  const siguiente = actual + 1
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS[tipo], siguiente.toString())
    } catch {
      // ignore
    }
  }
  return actual
}

export function generarNumeroCompletoSugerido(
  tipo: TipoComprobanteInterno,
  puntoVenta = '0001'
): string {
  const num = getProximoNumeroInterno(tipo)
  return formatearNumeroComprobanteInterno(tipo, puntoVenta, num)
}
