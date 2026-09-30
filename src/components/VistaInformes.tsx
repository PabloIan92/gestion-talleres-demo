import React from 'react'
import { useDemoStore } from '../context/DemoStoreContext'

export const VistaInformes: React.FC = () => {
  const { reportes } = useDemoStore()

  const totalFacturado = reportes.reduce((acc, r) => acc + r.montoFacturado, 0)
  const totalCobrado = reportes.reduce((acc, r) => acc + r.montoCobrado, 0)
  const totalCasos = reportes.reduce((acc, r) => acc + r.casosCreados, 0)
  const totalCerrados = reportes.reduce((acc, r) => acc + r.casosCerrados, 0)

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
        <h2 className="font-display uppercase text-xl font-bold text-slate-900">
          Informes de Gestión y Productividad del Taller
        </h2>
        <p className="text-xs font-mono text-slate-500 uppercase mt-0.5">
          Facturación, cobros efectivos y órdenes finalizadas por mes
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">Total Facturado</span>
          <span className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            ${(totalFacturado / 1000000).toFixed(1)}M
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">Último trimestre</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">Total Cobrado</span>
          <span className="text-xl sm:text-2xl font-display font-bold text-emerald-600">
            ${(totalCobrado / 1000000).toFixed(1)}M
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">Ingresado en caja</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">Órdenes Creadas</span>
          <span className="text-2xl font-display font-bold text-blue-700">{totalCasos}</span>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">Vehículos ingresados</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">Efectividad de Cierre</span>
          <span className="text-2xl font-display font-bold text-emerald-700">
            {Math.round((totalCerrados / totalCasos) * 100)}%
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">{totalCerrados} entregados con firma</span>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 bg-slate-50">
          <h3 className="font-mono text-xs font-bold uppercase text-slate-800">
            Evolución Mensual de Taller
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#123a6b] text-white font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-center">Órdenes</th>
                <th className="py-2.5 px-3 text-center">Cerradas</th>
                <th className="py-2.5 px-3 text-right">Facturado ($)</th>
                <th className="py-2.5 px-3 text-right">Cobrado ($)</th>
                <th className="py-2.5 px-3 text-right">Diferencial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {reportes.map(r => (
                <tr key={r.mes} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-blue-900">{r.label}</td>
                  <td className="py-2.5 px-3 text-center">{r.casosCreados}</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">{r.casosCerrados}</td>
                  <td className="py-2.5 px-3 text-right font-bold">${r.montoFacturado.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">${r.montoCobrado.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`font-bold ${r.diferencial > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                      {r.diferencial > 0 ? `$${r.diferencial.toLocaleString()}` : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
