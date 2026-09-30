import React from 'react'

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', showSubtitle?: boolean }> = ({
  size = 'md',
  showSubtitle = true
}) => {
  const iconSizes = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-12 h-12' }
  const titleSizes = { sm: 'text-sm', md: 'text-base sm:text-lg', lg: 'text-xl sm:text-2xl' }

  return (
    <div className="flex items-center gap-3">
      <img
        src="./logo-taller.svg"
        alt="Logo Taller"
        className={`${iconSizes[size]} shrink-0 drop-shadow-sm`}
      />
      <div>
        <h1 className={`font-display uppercase font-bold tracking-tight text-white leading-none ${titleSizes[size]}`}>
          Sistema de Gestión para Talleres
        </h1>
        {showSubtitle && (
          <p className="font-mono text-[10px] sm:text-xs text-slate-300 tracking-wide uppercase mt-0.5 leading-none">
            Mecánica • Chapa • Carrocería • Siniestros
          </p>
        )}
      </div>
    </div>
  )
}
