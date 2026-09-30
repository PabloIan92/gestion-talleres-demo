export type TipoComprobanteInterno = 'Factura X' | 'Remito X' | 'Recibo X' | 'Presupuesto X'

export interface ComprobanteInternoData {
  tipo: TipoComprobanteInterno
  puntoVenta: string
  numero: number
  numeroCompleto: string
  fechaEmision: string
  concepto: string
  monto: number
  casoId: string
  patente: string
  vehiculo: string
  clienteNombre: string
  clienteTelefono?: string
  cuitDni?: string
  tallerNombre?: string
}

export function prefijoPorTipo(tipo: TipoComprobanteInterno): string {
  switch (tipo) {
    case 'Factura X':
      return 'FX'
    case 'Remito X':
      return 'REM'
    case 'Recibo X':
      return 'RCX'
    case 'Presupuesto X':
      return 'PRE'
    default:
      return 'X'
  }
}

export function formatearNumeroComprobanteInterno(
  tipo: TipoComprobanteInterno,
  puntoVenta: string,
  numero: number
): string {
  const prefijo = prefijoPorTipo(tipo)
  const pv = (puntoVenta || '1').padStart(4, '0')
  const num = numero.toString().padStart(8, '0')
  return `${prefijo}-${pv}-${num}`
}
