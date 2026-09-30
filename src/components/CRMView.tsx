import React, { useState, useMemo } from 'react'
import {
  Users,
  Building2,
  Briefcase,
  Search,
  Phone,
  Mail,
  Car,
  Shield,
  Plus,
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import { useDemoStore } from '../context/DemoStoreContext'

interface ClienteCRM {
  id: string
  nombre: string
  telefono: string
  email: string
  vehiculos: string[]
  ultimo_servicio: string
  total_gastado: number
  tipo: 'Particular' | 'Flota' | 'Asegurado'
}

interface AseguradoraCRM {
  id: string
  nombre: string
  contacto_siniestros: string
  telefono: string
  email: string
  casos_activos: number
  tiempo_pago_promedio: string
}

const CLIENTES_INICIALES: ClienteCRM[] = [
  {
    id: 'cli-1',
    nombre: 'Gonzalo Rossi',
    telefono: '+54 9 11 4567-8901',
    email: 'grossi@email.com',
    vehiculos: ['Ford Focus 2.0 Titanium (AD123XY)'],
    ultimo_servicio: 'Distribución completa',
    total_gastado: 380000,
    tipo: 'Particular'
  },
  {
    id: 'cli-2',
    nombre: 'Agropecuaria del Litoral S.A.',
    telefono: '+54 9 341 555-1234',
    email: 'flota@agrolitoral.com.ar',
    vehiculos: ['Toyota Hilux 4x4 (AF987PZ)', 'Toyota Hilux 4x2 (AG442LK)'],
    ultimo_servicio: 'Reparación granizo y service 50.000 km',
    total_gastado: 1250000,
    tipo: 'Flota'
  },
  {
    id: 'cli-3',
    nombre: 'Valeria Méndez',
    telefono: '+54 9 11 8877-6655',
    email: 'valeriamendez@gmail.com',
    vehiculos: ['Peugeot 208 Feline (AE456CD)'],
    ultimo_servicio: 'Chapa y óptica delantera',
    total_gastado: 540000,
    tipo: 'Asegurado'
  },
  {
    id: 'cli-4',
    nombre: 'Santiago Gómez',
    telefono: '+54 9 11 3322-1100',
    email: 'santigomez@yahoo.com',
    vehiculos: ['Volkswagen Amarok V6 (AG321QR)'],
    ultimo_servicio: 'Tren delantero y alineación',
    total_gastado: 420000,
    tipo: 'Particular'
  },
  {
    id: 'cli-5',
    nombre: 'Distribuidora San Martín SRL',
    telefono: '+54 9 11 6789-0123',
    email: 'logistica@distrisanmartin.com',
    vehiculos: ['Renault Kangoo Maxi (AC789JK)'],
    ultimo_servicio: 'Embrague y frenos traseros',
    total_gastado: 690000,
    tipo: 'Flota'
  }
]

const ASEGURADORAS_INICIALES: AseguradoraCRM[] = [
  {
    id: 'aseg-1',
    nombre: 'La Segunda Seguros',
    contacto_siniestros: 'Lic. Mariano Bellini',
    telefono: '0800-444-0123',
    email: 'siniestros@lasegunda.com.ar',
    casos_activos: 4,
    tiempo_pago_promedio: '18 días'
  },
  {
    id: 'aseg-2',
    nombre: 'San Cristóbal Seguros',
    contacto_siniestros: 'Dr. Lucas Ferraro',
    telefono: '0810-222-8888',
    email: 'peritajes@sancristobal.com.ar',
    casos_activos: 3,
    tiempo_pago_promedio: '22 días'
  },
  {
    id: 'aseg-3',
    nombre: 'Federación Patronal',
    contacto_siniestros: 'Ing. Pablo Albarracín',
    telefono: '0800-222-3652',
    email: 'autorizaciones@fedpat.com.ar',
    casos_activos: 5,
    tiempo_pago_promedio: '15 días'
  },
  {
    id: 'aseg-4',
    nombre: 'Rivadavia Seguros',
    contacto_siniestros: 'Dra. Carolina Paz',
    telefono: '0810-999-3200',
    email: 'liquidaciones@segurosrivadavia.com',
    casos_activos: 2,
    tiempo_pago_promedio: '25 días'
  }
]

export function CRMView() {
  const [tab, setTab] = useState<'clientes' | 'aseguradoras'>('clientes')
  const [busqueda, setBusqueda] = useState('')

  const clientesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return CLIENTES_INICIALES
    return CLIENTES_INICIALES.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.telefono.includes(q) ||
        c.vehiculos.some((v) => v.toLowerCase().includes(q))
    )
  }, [busqueda])

  const aseguradorasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return ASEGURADORAS_INICIALES
    return ASEGURADORAS_INICIALES.filter(
      (a) =>
        a.nombre.toLowerCase().includes(q) ||
        a.contacto_siniestros.toLowerCase().includes(q)
    )
  }, [busqueda])

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-steel-300">
        <div>
          <div className="flex items-center gap-2 text-blue font-mono text-xs font-bold uppercase">
            <Users size={16} />
            <span>Módulo CRM & Contactos</span>
          </div>
          <h2 className="font-display text-2xl font-bold uppercase text-navy">
            Clientes, Flotas y Aseguradoras
          </h2>
          <p className="text-xs text-steel-600 font-sans mt-0.5">
            Historial de vehículos atendidos, contactos directos para WhatsApp y seguimiento comercial.
          </p>
        </div>

        {/* Subtabs Clientes / Aseguradoras */}
        <div className="flex items-center bg-steel-200 p-1 rounded-sm border border-steel-300 self-start sm:self-auto">
          <button
            onClick={() => setTab('clientes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-bold uppercase transition cursor-pointer ${
              tab === 'clientes'
                ? 'bg-navy text-white shadow-xs'
                : 'text-steel-700 hover:text-navy hover:bg-white/50'
            }`}
          >
            <Users size={14} />
            <span>Clientes & Flotas ({CLIENTES_INICIALES.length})</span>
          </button>
          <button
            onClick={() => setTab('aseguradoras')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-bold uppercase transition cursor-pointer ${
              tab === 'aseguradoras'
                ? 'bg-navy text-white shadow-xs'
                : 'text-steel-700 hover:text-navy hover:bg-white/50'
            }`}
          >
            <Shield size={14} />
            <span>Compañías de Seguros ({ASEGURADORAS_INICIALES.length})</span>
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-steel-400" size={16} />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder={tab === 'clientes' ? 'Buscar por cliente, patente o modelo...' : 'Buscar compañía o contacto...'}
          className="w-full pl-9 pr-4 py-2 bg-white border border-steel-300 rounded text-xs font-sans focus:outline-none focus:border-blue shadow-xs"
        />
      </div>

      {/* Vista Clientes */}
      {tab === 'clientes' && (
        <div className="bg-white border border-steel-300 rounded shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-steel-100 border-b border-steel-300 font-mono text-[11px] text-navy uppercase">
              <tr>
                <th className="py-2.5 px-4">Cliente / Razón Social</th>
                <th className="py-2.5 px-4">Contacto</th>
                <th className="py-2.5 px-4">Vehículos Asociados</th>
                <th className="py-2.5 px-4">Último Trabajo</th>
                <th className="py-2.5 px-4 text-right">Facturado Acumulado</th>
                <th className="py-2.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-200">
              {clientesFiltrados.map((cli) => (
                <tr key={cli.id} className="hover:bg-steel-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-graphite">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-blue/10 text-blue font-bold flex items-center justify-center shrink-0">
                        {cli.nombre.charAt(0)}
                      </span>
                      <div>
                        <p className="font-bold text-navy m-0">{cli.nombre}</p>
                        <span className="inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-steel-100 text-steel-600 border border-steel-200">
                          {cli.tipo}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-mono text-steel-700 m-0">{cli.telefono}</p>
                    <p className="text-[11px] text-steel-500 m-0">{cli.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    {cli.vehiculos.map((v, i) => (
                      <div key={i} className="flex items-center gap-1 text-[11px] text-steel-800">
                        <Car size={12} className="text-blue shrink-0" />
                        <span>{v}</span>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-steel-700">
                    {cli.ultimo_servicio}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-navy">
                    ${new Intl.NumberFormat('es-AR').format(cli.total_gastado)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <a
                      href={`https://wa.me/${cli.telefono.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-[11px] font-bold px-2 py-1 rounded transition cursor-pointer"
                      title="Abrir WhatsApp"
                    >
                      <MessageSquare size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Vista Aseguradoras */}
      {tab === 'aseguradoras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aseguradorasFiltradas.map((aseg) => (
            <div
              key={aseg.id}
              className="bg-white p-4 rounded border border-steel-300 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-steel-200 mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="text-blue" size={18} />
                    <h3 className="font-display uppercase text-base font-bold text-navy m-0">
                      {aseg.nombre}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue bg-blue/10 px-2 py-0.5 rounded border border-blue/20">
                    {aseg.casos_activos} casos activos
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-sans text-steel-700">
                  <p><strong>Referente Siniestros:</strong> {aseg.contacto_siniestros}</p>
                  <p className="font-mono"><strong>Teléfono:</strong> {aseg.telefono}</p>
                  <p><strong>Email peritajes:</strong> {aseg.email}</p>
                  <p><strong>Plazo de liquidación habitual:</strong> <span className="font-semibold text-emerald-700">{aseg.tiempo_pago_promedio}</span></p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-steel-200 flex items-center justify-between">
                <span className="text-[11px] text-steel-500 font-mono">Convenio homologado</span>
                <button
                  onClick={() => alert(`Enviando consulta a ${aseg.email}`)}
                  className="inline-flex items-center gap-1.5 bg-steel-100 hover:bg-steel-200 text-navy font-mono text-xs font-bold uppercase px-3 py-1.5 rounded transition border border-steel-300 cursor-pointer"
                >
                  <Mail size={12} />
                  <span>Enviar Presupuesto</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
