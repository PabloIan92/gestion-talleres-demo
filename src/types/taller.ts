export type DemoRole = 'dueno' | 'recepcion' | 'taller'

export const ETAPAS_CASO = [
  'borrador',
  'enviado a la aseguradora',
  'aprobado',
  'turno coordinado',
  'ingresado',
  'esperando repuesto',
  'en reparación',
  'listo para firma',
  'firmado',
  'facturado',
  'cobrado',
  'reclamo a la compañía'
] as const

export type EtapaCaso = typeof ETAPAS_CASO[number]

export const TIPOS_SERVICIO = [
  { id: 'mecanica_general', label: 'Mecánica General y Diagnóstico', icon: 'Wrench' },
  { id: 'service_mantenimiento', label: 'Service y Mantenimiento Periódico', icon: 'Clock' },
  { id: 'chapa_sacabollos', label: 'Chapa, Pintura y Sacabollos (PDR)', icon: 'ShieldAlert' },
  { id: 'siniestro_seguro', label: 'Siniestro / Aseguradora', icon: 'FileText' },
] as const

export type TipoServicioId = typeof TIPOS_SERVICIO[number]['id']

export const ZONAS_DANO = [
  'paragolpes delantero',
  'paragolpes trasero',
  'capot',
  'techo',
  'puerta delantera izquierda',
  'puerta trasera izquierda',
  'puerta delantera derecha',
  'puerta trasera derecha',
  'guardabarros delantero izquierdo',
  'guardabarros delantero derecho',
  'guardabarros trasero izquierdo',
  'guardabarros trasero derecho',
  'parante izquierdo',
  'parante derecho',
  'caja',
  'baul',
] as const

export type ZonaDano = typeof ZONAS_DANO[number]

export interface CasoDemo {
  id: string
  orden_numero: string
  patente: string
  vehiculo_marca_modelo: string
  vehiculo_ano: number
  kilometraje?: number
  combustible?: '1/4' | '1/2' | '3/4' | 'Lleno'
  cliente_nombre: string
  cliente_telefono: string
  canal: 'particular' | 'seguro'
  tipo_servicio: TipoServicioId
  falla_reportada: string
  aseguradora?: string
  numero_siniestro?: string
  denuncia?: string
  estado: EtapaCaso
  dias_en_etapa: number
  zonas_dano: ZonaDano[]
  repuesto_faltante?: string
  presupuesto_monto: number
  facturado_monto?: number
  cobrado_monto?: number
  created_at: string
  inspeccion_guardada: boolean
}

export type Caso = CasoDemo

export interface ItemStock {
  id: string
  codigo: string
  nombre: string
  categoria: 'Mecánica' | 'Filtros y Fluidos' | 'Carrocería' | 'Herramientas'
  cantidad_actual: number
  cantidad_minima: number
  estado: 'OK' | 'Bajo' | 'Faltante'
}

export interface ReporteMes {
  mes: string
  label: string
  casosCreados: number
  casosCerrados: number
  montoFacturado: number
  montoCobrado: number
  diferencial: number
}
