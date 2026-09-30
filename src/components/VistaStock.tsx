import React from 'react'
import { useDemoStore } from '../context/DemoStoreContext'
import { Package, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react'

export const VistaStock: React.FC = () => {
  const { stock } = useDemoStore()

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-display uppercase text-xl font-bold text-slate-900">
            Control de Stock de Taller y Repuestos
          </h2>
          <p className="text-xs font-mono text-slate-500 uppercase mt-0.5">
            Insumos mecánicos, filtros, fluidos y consumibles de carrocería
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#123a6b] text-white font-mono uppercase text-[11px] border-b border-blue-900">
                <th className="py-2.5 px-3">Código</th>
                <th className="py-2.5 px-3">Artículo / Repuesto</th>
                <th className="py-2.5 px-3">Categoría</th>
                <th className="py-2.5 px-3 text-center">Stock Actual</th>
                <th className="py-2.5 px-3 text-center">Mínimo</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {stock.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-700">{item.codigo}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{item.nombre}</td>
                  <td className="py-2.5 px-3 text-slate-500">{item.categoria}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900">{item.cantidad_actual}</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">{item.cantidad_minima}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.estado === 'OK'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.estado === 'Bajo'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800 animate-pulse'
                    }`}>
                      {item.estado === 'OK' && <CheckCircle size={12} />}
                      {item.estado === 'Bajo' && <AlertTriangle size={12} />}
                      {item.estado === 'Faltante' && <ShieldAlert size={12} />}
                      <span>{item.estado}</span>
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
