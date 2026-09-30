export type ArcaAmbiente = 'homologacion' | 'produccion'
export type ArcaTipoComprobante = 'Factura A' | 'Factura B' | 'Factura C'
export type ArcaConcepto = 1 | 2 | 3 // 1: Productos, 2: Servicios, 3: Productos y Servicios

export interface ConfiguracionArca {
  cuit: string
  puntoVenta: number
  ambiente: ArcaAmbiente
  tipoFacturaDefault: ArcaTipoComprobante
  conceptoDefault: ArcaConcepto
  certificadoCrt: string
  clavePrivadaKey: string
  iibb?: string
  fechaInicioActividades?: string
  activo: boolean
  ultimoComprobanteEmitido?: number
}

export interface FacturaArcaRequest {
  puntoVenta: number
  tipoComprobante: ArcaTipoComprobante
  concepto: ArcaConcepto
  docTipo: 'CUIT' | 'DNI' | 'Consumidor Final'
  docNro: string
  receptorNombre: string
  montoTotal: number
  fechaComprobante: string
  descripcionServicio?: string
}

export interface FacturaArcaResponse {
  cae: string
  caeVto: string
  numeroComprobante: number
  numeroFactura: string
  resultado: 'Aprobado' | 'Rechazado'
  observaciones: string[]
  fechaEmision: string
  puntoVenta: number
  tipoComprobante: ArcaTipoComprobante
}
