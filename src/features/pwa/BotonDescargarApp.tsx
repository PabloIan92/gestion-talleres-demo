import React, { useState } from 'react'
import { Smartphone, Download, Check, X } from 'lucide-react'

interface BotonDescargarAppProps {
  className?: string
  variant?: 'topbar' | 'compact' | 'card'
}

export function BotonDescargarApp({ className = '', variant = 'topbar' }: BotonDescargarAppProps) {
  const [modalAbierto, setModalAbierto] = useState(false)

  if (variant === 'card') {
    return (
      <>
        <div className={`p-4 bg-gradient-to-br from-navy to-navy/90 text-white rounded-md border border-navy/30 shadow-md ${className}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Smartphone className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display uppercase text-sm tracking-wide text-white m-0">
                Descargar en Versión App
              </h4>
              <p className="font-sans text-xs text-steel-200 mt-1 mb-3">
                Instalá el sistema en tu celular, tablet o computadora para abrirlo en 1 toque, sin escribir enlaces y a pantalla completa (PWA progresiva).
              </p>
              <button
                type="button"
                onClick={() => setModalAbierto(true)}
                className="inline-flex items-center gap-2 bg-blue hover:bg-blue/90 text-white font-mono text-xs font-bold uppercase px-3.5 py-2 rounded-sm transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
              >
                <Download size={14} />
                <span>Instalar / Descargar App</span>
              </button>
            </div>
          </div>
        </div>

        {modalAbierto && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-steel-200">
              <div className="flex items-center justify-between pb-3 border-b border-steel-200 mb-4">
                <div className="flex items-center gap-2 text-navy font-bold">
                  <Smartphone size={20} />
                  <span>Instalar Aplicación en tu Dispositivo</span>
                </div>
                <button onClick={() => setModalAbierto(false)} className="text-steel-400 hover:text-steel-700">
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-steel-700 font-sans mb-4">
                La aplicación funciona como PWA instalable sin pasar por Google Play o App Store:
              </p>
              <ul className="text-xs text-steel-700 space-y-2 list-disc pl-5 mb-5 font-sans">
                <li><strong>En Android (Chrome):</strong> Tocá los tres puntos arriba a la derecha y seleccioná <em>"Instalar aplicación"</em> o <em>"Agregar a la pantalla principal"</em>.</li>
                <li><strong>En iPhone / iPad (Safari):</strong> Tocá el botón de Compartir y seleccioná <em>"Agregar al inicio"</em>.</li>
                <li><strong>En PC / Mac:</strong> Tocá el icono de instalación en la barra de direcciones de Chrome o Edge.</li>
              </ul>
              <button
                onClick={() => setModalAbierto(false)}
                className="w-full bg-navy text-white font-mono text-xs font-bold uppercase py-2 rounded"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalAbierto(true)}
        className={`bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-sm transition-colors flex items-center gap-1.5 border border-white/25 shadow-sm cursor-pointer ${className}`}
        title="Instalar versión App en Celular o PC"
      >
        <Download size={14} />
        <span>Descargar APP</span>
      </button>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-steel-200">
            <div className="flex items-center justify-between pb-3 border-b border-steel-200 mb-4">
              <div className="flex items-center gap-2 text-navy font-bold">
                <Smartphone size={20} />
                <span>Instalar Aplicación en tu Dispositivo</span>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-steel-400 hover:text-steel-700">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-steel-700 font-sans mb-4">
              La aplicación se instala como Web App nativa en cualquier dispositivo:
            </p>
            <ul className="text-xs text-steel-700 space-y-2 list-disc pl-5 mb-5 font-sans">
              <li><strong>En Celulares:</strong> Menú Compartir → <em>"Agregar a pantalla de inicio"</em>.</li>
              <li><strong>En PC:</strong> Ícono de instalación en la barra del navegador.</li>
            </ul>
            <button
              onClick={() => setModalAbierto(false)}
              className="w-full bg-navy text-white font-mono text-xs font-bold uppercase py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
