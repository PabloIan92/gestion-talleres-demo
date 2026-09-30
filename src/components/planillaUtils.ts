import type { Caso, EtapaCaso } from '../types/taller'

export const STAGES = [
  { id: 'datos', label: '1. Datos y Denuncia', shortLabel: 'Datos', role: 'recepción', desc: 'Registro / Diagnóstico inicial' },
  { id: 'presup', label: '2. Presupuesto + Fotos', shortLabel: 'Presup.', role: 'recepción', desc: 'Presupuesto enviado + fotos' },
  { id: 'orden', label: '3. Orden de Trabajo / OK', shortLabel: 'Orden/OK', role: 'recepción', desc: 'Orden de trabajo / Aceptación' },
  { id: 'turno', label: '4. Turno Coordinado', shortLabel: 'Turno', role: 'recepción', desc: 'Turno coordinado' },
  { id: 'ingreso', label: '5. Ingreso a Taller (Ficha 2)', shortLabel: 'Ingreso', role: 'recepción', desc: 'Ingresado al taller con checklist' },
  { id: 'reparac', label: '6. Reparación / Mecánica / Chapa', shortLabel: 'Reparac.', role: 'taller', desc: 'En reparación / Service / Repuestos' },
  { id: 'firma', label: '7. Firma con Fotos', shortLabel: 'Firma', role: 'taller', desc: 'Firma de conformidad del cliente' },
  { id: 'factura', label: '8. Facturación', shortLabel: 'Factura', role: 'dueño', desc: 'Facturado formalmente / ARCA' },
  { id: 'cobro', label: '9. Cobro / Cierre', shortLabel: 'Cobro', role: 'dueño', desc: 'Cobrado real / Reclamo' },
] as const

export const STAGE_COLORS = [
  { border: 'hsl(0,60%,42%)', bg: 'hsl(0,65%,93%)' },
  { border: 'hsl(16,60%,42%)', bg: 'hsl(16,65%,93%)' },
  { border: 'hsl(31,60%,42%)', bg: 'hsl(31,65%,93%)' },
  { border: 'hsl(47,60%,42%)', bg: 'hsl(47,65%,93%)' },
  { border: 'hsl(63,55%,38%)', bg: 'hsl(63,60%,92%)' },
  { border: 'hsl(78,55%,38%)', bg: 'hsl(78,60%,92%)' },
  { border: 'hsl(94,55%,38%)', bg: 'hsl(94,60%,92%)' },
  { border: 'hsl(109,55%,38%)', bg: 'hsl(109,60%,92%)' },
  { border: 'hsl(125,55%,38%)', bg: 'hsl(125,60%,92%)' },
]

export const STATE_MAPPING: Record<
  EtapaCaso,
  { idx: number; kind: 'waiting' | 'active' | 'parts' | 'blocked' | 'done' | 'cancelled' }
> = {
  'borrador': { idx: 0, kind: 'waiting' },
  'enviado a la aseguradora': { idx: 2, kind: 'waiting' },
  'aprobado': { idx: 3, kind: 'waiting' },
  'turno coordinado': { idx: 4, kind: 'waiting' },
  'ingresado': { idx: 5, kind: 'active' },
  'esperando repuesto': { idx: 5, kind: 'parts' },
  'en reparación': { idx: 5, kind: 'active' },
  'listo para firma': { idx: 6, kind: 'waiting' },
  'firmado': { idx: 7, kind: 'waiting' },
  'facturado': { idx: 8, kind: 'waiting' },
  'reclamo a la compañía': { idx: 8, kind: 'blocked' },
  'cobrado': { idx: 9, kind: 'done' },
  'cancelado': { idx: -1, kind: 'cancelled' },
}

export function getDiasEtapa(caso: Caso): number {
  if (typeof caso.dias_en_etapa === 'number') {
    return caso.dias_en_etapa
  }
  const dateStr = caso.created_at
  const diffMs = Date.now() - new Date(dateStr).getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

export function getStuckLevel(caso: Caso): 'none' | 'warning' | 'critical' {
  if (caso.estado === 'cancelado' || caso.estado === 'cobrado') return 'none'
  const dias = getDiasEtapa(caso)
  if (dias >= 7) return 'critical'
  if (dias >= 5) return 'warning'
  return 'none'
}

export function normalizeText(value: string | null | undefined): string {
  return (value || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function formatMoneda(monto: number): string {
  return (
    '$ ' +
    monto.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}

export const ZONE_COORDS: Record<string, { x: number; y: number }> = {
  'paragolpes delantero': { x: 15, y: 50 },
  'capot': { x: 26, y: 40 },
  'techo': { x: 50, y: 22 },
  'baul': { x: 78, y: 40 },
  'paragolpes trasero': { x: 88, y: 50 },
  'puerta delantera izquierda': { x: 38, y: 43 },
  'puerta trasera izquierda': { x: 62, y: 43 },
  'puerta delantera derecha': { x: 38, y: 43 },
  'puerta trasera derecha': { x: 62, y: 43 },
  'guardabarros': { x: 22, y: 52 },
}
